// Đọc các file Vocab List (.docx) và từ vựng chú thích trong bài Reading của khóa L5.5
// rồi xuất ra src/content/vocab.json để làm flashcard.
// Chạy lại khi thêm tài liệu mới:  npm run import
import mammoth from "mammoth";
import fs from "node:fs";
import path from "node:path";

const MATERIALS_DIR = process.env.MATERIALS_DIR || path.resolve(process.cwd(), "..");
const OUT = path.resolve("src/content/vocab.json");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "ielts-app" || name.startsWith(".")) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (p.toLowerCase().endsWith(".docx") && !path.basename(p).startsWith("~$")) out.push(p);
  }
  return out;
}

const clean = (s) =>
  s.replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function weekOf(file) {
  const m = file.match(/W(?:eek_?)?\s?(\d+)/i);
  return m ? Number(m[1]) : null;
}

const cards = new Map();
function add(card) {
  const id = slug(card.word);
  if (!id || cards.has(id)) return;
  cards.set(id, { id, ...card });
}

async function fromVocabList(file) {
  const { value: html } = await mammoth.convertToHtml({ path: file });
  const titleMatch = path.basename(file).match(/Vocab List\s*[-_ ]*(?:W\d+\s*-\s*)?(.+?)\.docx$/i);
  const topic = titleMatch ? titleMatch[1].replace(/^[-_ ]+/, "").trim() : "Khác";
  let n = 0;
  for (const row of html.match(/<tr>[\s\S]*?<\/tr>/g) || []) {
    const cells = (row.match(/<t[dh][\s\S]*?<\/t[dh]>/g) || []).map(clean);
    const ipaIdx = cells.findIndex((c) => /^\/.+\/$/.test(c));
    if (ipaIdx < 1) continue;
    const word = cells[ipaIdx - 1];
    const meaning = cells[ipaIdx + 1] || "";
    if (!word || !meaning) continue;
    add({ word, ipa: cells[ipaIdx], meaning, example: cells[ipaIdx + 2] || "", topic, week: weekOf(file), source: "vocab-list" });
    n++;
  }
  return n;
}

// Dạng chú thích trong bài đọc: "- container (n): vật đựng (hộp, lọ…)"
async function fromReading(file) {
  const { value: text } = await mammoth.extractRawText({ path: file });
  let n = 0;
  for (const line of text.split("\n")) {
    const m = line.trim().match(/^[-•]\s*(.+?)\s*\(([a-z.\s/-]{1,12})\)\s*:\s*(.+)$/i);
    if (!m) continue;
    add({ word: clean(m[1]), pos: m[2].trim(), ipa: "", meaning: clean(m[3]), example: "", topic: "Từ trong bài Reading", week: weekOf(file), source: "reading" });
    n++;
  }
  return n;
}

const files = walk(MATERIALS_DIR);
for (const f of files) {
  const rel = path.relative(MATERIALS_DIR, f);
  if (/vocab list/i.test(f)) console.log(`${await fromVocabList(f)} từ  <- ${rel}`);
  else if (/reading/i.test(f)) {
    const n = await fromReading(f);
    if (n) console.log(`${n} từ  <- ${rel}`);
  }
}
const list = [...cards.values()].sort((a, b) => (a.week ?? 99) - (b.week ?? 99));
fs.writeFileSync(OUT, JSON.stringify(list, null, 2));
console.log(`\nTổng cộng ${list.length} thẻ -> ${path.relative(process.cwd(), OUT)}`);
