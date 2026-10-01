// Bài luyện nghe số, ngày tháng, giờ, đánh vần tên: dạng câu hay mất điểm ở Listening Section 1.

export type DrillKind = "phone" | "price" | "date" | "time" | "spelling" | "postcode";

export type Drill = { kind: DrillKind; speech: string; answer: string; hint: string };

export const DRILL_LABEL: Record<DrillKind, string> = {
  phone: "Số điện thoại",
  price: "Giá tiền",
  date: "Ngày tháng",
  time: "Giờ",
  spelling: "Đánh vần tên",
  postcode: "Mã bưu điện",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const NAMES = [
  "Thompson", "Fitzgerald", "Harrison", "Wheeler", "McAllister", "Robinson", "Gallagher", "Whitfield", "Jefferson", "Kowalski",
  "Bennett", "Hutchinson", "Pearce", "Matthews", "Lloyd", "Crawford", "Sullivan", "Goodman", "Phillips", "Yates",
];
const DIGIT_WORDS = ["oh", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const LETTERS = "ABCDEFGHJKLMNPRSTUWXY".split("");

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(a: readonly T[]): T => a[rnd(a.length)];
const ordinal = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");

/** Đọc từng ký tự, gộp ký tự lặp thành "double" như người Anh hay nói. */
function spellOut(chars: string[], toWord: (c: string) => string) {
  const parts: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === chars[i + 1]) {
      parts.push(`double ${toWord(chars[i])}`);
      i++;
    } else parts.push(toWord(chars[i]));
  }
  return parts.join(", ");
}

export function makeDrill(kind: DrillKind): Drill {
  switch (kind) {
    case "phone": {
      const digits = ("0" + String(rnd(9) + 1) + Array.from({ length: 8 }, () => rnd(10)).join("")).split("");
      const groups = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7)];
      return {
        kind,
        speech: "The number is " + groups.map((g) => spellOut(g, (d) => DIGIT_WORDS[Number(d)])).join(". ") + ".",
        answer: digits.join(""),
        hint: "Gõ liền các chữ số, ví dụ 0912345678. Người Anh đọc số 0 là “oh”.",
      };
    }
    case "price": {
      const pounds = pick([rnd(20) + 1, rnd(90) + 10, rnd(400) + 100]);
      const pence = pick([0, 50, 25, 75, 99, 45, 15]);
      const speech = pence ? `It costs ${pounds} pounds ${pence}.` : `It costs ${pounds} pounds.`;
      return { kind, speech, answer: pence ? `${pounds}.${String(pence).padStart(2, "0")}` : String(pounds), hint: "Gõ số, ví dụ 12.50 hoặc £12.50" };
    }
    case "date": {
      const d = rnd(28) + 1;
      const m = rnd(12);
      return {
        kind,
        speech: pick([`The course starts on the ${ordinal(d)} of ${MONTHS[m]}.`, `The deadline is ${MONTHS[m]} the ${ordinal(d)}.`]),
        answer: `${d} ${MONTHS[m]}`,
        hint: "Gõ ngày + tên tháng, ví dụ 21 March hoặc 21 Mar",
      };
    }
    case "time": {
      const h = rnd(12) + 1;
      const min = pick([0, 15, 30, 45, 10, 20, 40, 50, 5, 25]);
      const next = (h % 12) + 1;
      const forms: Record<number, string> = {
        0: `${h} o'clock`,
        15: `a quarter past ${h}`,
        30: `half past ${h}`,
        45: `a quarter to ${next}`,
      };
      const phrase = forms[min] ?? (min < 30 ? `${min} past ${h}` : `${60 - min} to ${next}`);
      return {
        kind,
        speech: `The meeting is at ${phrase}.`,
        answer: `${h}:${String(min).padStart(2, "0")}`,
        hint: "Gõ dạng giờ:phút, ví dụ 7:45. “a quarter to eight” = 7:45",
      };
    }
    case "spelling": {
      const name = pick(NAMES);
      return {
        kind,
        speech: `My surname is ${name}. That's ${spellOut(name.toUpperCase().split(""), (c) => c)}.`,
        answer: name,
        hint: "Gõ họ được đánh vần. “double L” = LL",
      };
    }
    case "postcode": {
      const code = `${pick(LETTERS)}${pick(LETTERS)}${rnd(9) + 1} ${rnd(9) + 1}${pick(LETTERS)}${pick(LETTERS)}`;
      return {
        kind,
        speech: `The postcode is ${spellOut(code.replace(" ", "").split(""), (c) => (/\d/.test(c) ? DIGIT_WORDS[Number(c)] : c))}.`,
        answer: code,
        hint: "Gõ mã bưu điện kiểu Anh, ví dụ BS8 4PQ",
      };
    }
  }
}

export function checkDrill(d: Drill, input: string): boolean {
  const s = input.trim();
  switch (d.kind) {
    case "phone":
      return s.replace(/\D/g, "") === d.answer;
    case "price":
      return Number(s.replace(/[£$,\s]/g, "")) === Number(d.answer);
    case "date": {
      const [day, month] = d.answer.split(" ");
      const num = s.match(/\d+/)?.[0];
      const word = s.toLowerCase().match(/[a-z]{3,}/g)?.find((w) => !["st", "nd", "rd", "th", "the", "of"].includes(w));
      return num === day && !!word && month.toLowerCase().startsWith(word.slice(0, 3));
    }
    case "time": {
      const m = s.match(/(\d{1,2})[:.h ]?(\d{2})?/);
      if (!m) return false;
      const [h, min] = d.answer.split(":").map(Number);
      return Number(m[1]) % 12 === h % 12 && Number(m[2] || 0) === min;
    }
    case "spelling":
    case "postcode":
      return s.toUpperCase().replace(/\s/g, "") === d.answer.toUpperCase().replace(/\s/g, "");
  }
}
