// Tải tài liệu khóa học lên Supabase Storage (bucket riêng tư "materials")
// và tạo src/content/materials.json để web biết có những file nào.
//   npm run upload            (cần SUPABASE_SERVICE_ROLE_KEY trong .env.local)
//   npm run upload -- --dry   (chỉ tạo danh sách, không tải lên)
// File .docx được chuyển sẵn sang HTML để xem nhanh trên web.
import { createClient } from "@supabase/supabase-js";
import mammoth from "mammoth";
import fs from "node:fs";
import path from "node:path";
import * as tus from "tus-js-client";

const MATERIALS_DIR = process.env.MATERIALS_DIR || path.resolve(process.cwd(), "..");
const BUCKET = "materials";
const OUT = path.resolve("src/content/materials.json");
const DRY = process.argv.includes("--dry");

const KINDS = { ".mp3": "audio", ".m4a": "audio", ".wav": "audio", ".pdf": "pdf", ".docx": "doc", ".jpg": "image", ".jpeg": "image", ".png": "image" };
const MIME = { ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".wav": "audio/wav", ".pdf": "application/pdf", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".html": "text/html; charset=utf-8" };
const SKIP = new Set(["ielts-app", "node_modules", ".git"]);

function detectSkill(p) {
  const s = p.toLowerCase();
  if (/vocab/.test(s)) return "vocab";
  if (/grammar/.test(s)) return "grammar";
  if (/listen|audio|\.mp3$|\.m4a$/.test(s)) return "listening";
  if (/reading/.test(s)) return "reading";
  if (/speaking|shadowing/.test(s) && /writing/.test(s)) return "speaking-writing";
  if (/speaking|shadowing/.test(s)) return "speaking";
  if (/writing/.test(s)) return "writing";
  return null;
}

// Supabase Storage chỉ nhận tên file ASCII: bỏ dấu tiếng Việt và ký tự lạ
const asciiKey = (rel) =>
  rel
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9._/-]+/g, "_");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name) || name.startsWith(".") || name.startsWith("~$")) continue;
    const abs = path.join(dir, name);
    if (fs.statSync(abs).isDirectory()) walk(abs, out);
    else if (KINDS[path.extname(name).toLowerCase()]) out.push(abs);
  }
  return out;
}

const supabase = DRY
  ? null
  : createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", {
      auth: { persistSession: false },
    });
if (!DRY) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const problems = [];
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(url))
    problems.push("NEXT_PUBLIC_SUPABASE_URL phải có dạng https://<mã-project>.supabase.co (không phải link trang dashboard)");
  if (!secret.startsWith("sb_secret_") && !secret.startsWith("eyJ"))
    problems.push("SUPABASE_SERVICE_ROLE_KEY phải là Secret key (bắt đầu bằng sb_secret_), không phải Publishable key");
  if (problems.length) {
    console.error("File .env.local chưa đúng:\n - " + problems.join("\n - "));
    process.exit(1);
  }
}

const MAX_SIZE = 50 * 1024 * 1024; // giới hạn 1 file của gói Supabase Free
const CHUNK = 6 * 1024 * 1024; // file lớn hơn mức này phải tải kiểu chia nhỏ (TUS)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mb = (n) => (n / 1048576).toFixed(1).padStart(5) + " MB";

/** Danh sách file đã có trên Supabase: key -> dung lượng (để bỏ qua file đã tải). */
async function listExisting() {
  const map = new Map();
  const walkRemote = async (prefix) => {
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000, offset });
      if (error) throw error;
      for (const item of data) {
        const full = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.id === null) await walkRemote(full); // thư mục
        else map.set(full, item.metadata?.size ?? -1);
      }
      if (data.length < 1000) break;
    }
  };
  await walkRemote("");
  return map;
}

function uploadResumable(key, body, contentType) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(".supabase.co", ".storage.supabase.co");
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(body, {
      endpoint: `${url}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: { authorization: `Bearer ${secret}`, apikey: secret, "x-upsert": "true" },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: { bucketName: BUCKET, objectName: key, contentType, cacheControl: "3600" },
      chunkSize: CHUNK,
      onError: reject,
      onSuccess: resolve,
    });
    upload.start();
  });
}

async function uploadOne(key, body, contentType) {
  for (let attempt = 1; ; attempt++) {
    try {
      if (body.length > CHUNK) await uploadResumable(key, body, contentType);
      else {
        const { error } = await supabase.storage.from(BUCKET).upload(key, body, { contentType, upsert: true });
        if (error) throw error;
      }
      return;
    } catch (e) {
      if (attempt >= 4) throw e;
      await sleep(2000 * attempt); // mạng chập chờn: đợi rồi thử lại
    }
  }
}

const manifest = [];
const usedKeys = new Set();
const files = walk(MATERIALS_DIR);
const existing = DRY ? new Map() : await listExisting();
const stats = { uploaded: 0, skipped: 0, failed: [], tooBig: [] };

for (const abs of files) {
  const rel = path.relative(MATERIALS_DIR, abs).split(path.sep).join("/");
  const ext = path.extname(abs).toLowerCase();
  const kind = KINDS[ext];
  if (fs.statSync(abs).size > MAX_SIZE) {
    stats.tooBig.push(`${mb(fs.statSync(abs).size)}  ${rel}`);
    continue;
  }
  let key = asciiKey(rel) + (kind === "doc" ? ".html" : "");
  for (let i = 2; usedKeys.has(key); i++) key = key.replace(/(\.\w+)$/, `_${i}$1`);
  usedKeys.add(key);

  const wm = rel.split("/")[0].match(/^Week_(\d+)/i);
  const entry = { key, path: rel, name: path.basename(rel), dir: path.dirname(rel), kind, week: wm ? Number(wm[1]) : null, skill: detectSkill(rel) };

  if (DRY) {
    manifest.push(entry);
    continue;
  }
  let body, contentType;
  if (kind === "doc") {
    body = Buffer.from((await mammoth.convertToHtml({ path: abs })).value, "utf8");
    contentType = MIME[".html"];
  } else {
    body = fs.readFileSync(abs);
    contentType = MIME[ext];
  }
  if (existing.get(key) === body.length) {
    stats.skipped++;
    manifest.push(entry);
    continue;
  }
  try {
    await uploadOne(key, body, contentType);
    stats.uploaded++;
    manifest.push(entry);
    console.log(`✓ ${mb(body.length)}  ${rel}`);
  } catch (e) {
    stats.failed.push(rel);
    console.error(`✗ ${rel}: ${e.message?.split("\n")[0]}`);
  }
}

manifest.sort((a, b) => (a.week ?? 99) - (b.week ?? 99) || a.path.localeCompare(b.path, undefined, { numeric: true }));
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));

console.log(`\n${DRY ? "(dry run)" : `Tải mới ${stats.uploaded} · đã có sẵn ${stats.skipped} · lỗi ${stats.failed.length}`}`);
if (stats.tooBig.length) {
  console.log(`\nBỏ qua ${stats.tooBig.length} file lớn hơn 50MB (giới hạn gói Free). Nén lại rồi chạy upload lần nữa:`);
  for (const f of stats.tooBig) console.log("   " + f);
}
if (stats.failed.length) console.log("\nCòn file lỗi — chạy lại “npm run upload”, file đã tải sẽ được bỏ qua.");
console.log(`Danh sách tài liệu -> ${path.relative(process.cwd(), OUT)}`);
