// ── Block parser: 将 markdown 源码按语义拆分为独立块 ──

let nextId = 1;
function uid() {
  return `b${nextId++}`;
}

const THEMATIC_BREAK_RE = /^(-{3,}|\*{3,}|_{3,})\s*$/;
const HEADING_RE = /^#{1,6}\s/;
const LIST_RE = /^(\s*)([-*+]|\d+[.)])\s/;
const TABLE_RE = /^\|.+\|/;
const CALLOUT_RE = /^> \[!\w+\]/;
const BLOCKQUOTE_RE = /^>\s/;

export default function parseBlocks(text) {
  nextId = 1;
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;

  // ── YAML Frontmatter ──
  if (lines[0]?.trim() === "---") {
    const end = lines.indexOf("---", 1);
    if (end !== -1) {
      blocks.push({
        id: uid(),
        type: "frontmatter",
        content: lines.slice(0, end + 1).join("\n"),
      });
      i = end + 1;
    }
  }

  function flush(buf) {
    if (!buf.length) return;
    const content = buf.join("\n");
    const first = buf[0];
    const type = classify(first);
    blocks.push({ id: uid(), type, content });
    buf.length = 0;
  }

  function classify(firstLine) {
    if (THEMATIC_BREAK_RE.test(firstLine)) return "thematic-break";
    if (HEADING_RE.test(firstLine)) return "heading";
    if (firstLine.trim().startsWith("```")) return "fenced-code";
    if (TABLE_RE.test(firstLine)) return "table";
    if (CALLOUT_RE.test(firstLine)) return "callout";
    if (BLOCKQUOTE_RE.test(firstLine)) return "blockquote";
    if (LIST_RE.test(firstLine)) return "list";
    return "paragraph";
  }

  // ── 逐行扫描 ──
  let buf = [];
  let inFence = false;

  for (; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code — 跨空行
    if (line.trim().startsWith("```")) {
      if (!inFence) {
        flush(buf);
        inFence = true;
        buf = [line];
      } else {
        buf.push(line);
        flush(buf);
        inFence = false;
        buf = [];
      }
      continue;
    }

    if (inFence) {
      buf.push(line);
      continue;
    }

    // 空行 → 分隔 block
    if (line.trim() === "") {
      flush(buf);
      continue;
    }

    // Table — 连续 | 行
    if (TABLE_RE.test(line)) {
      if (buf.length && classify(buf[0]) !== "table") flush(buf);
      buf.push(line);
      continue;
    }

    // Callout — 连续 > [! 行 或跟随的 > 行
    if (CALLOUT_RE.test(line)) {
      flush(buf);
      buf = [line];
      // 吞并后续 > 行
      while (i + 1 < lines.length && lines[i + 1].startsWith("> ")) {
        i++;
        buf.push(lines[i]);
      }
      flush(buf);
      buf = [];
      continue;
    }

    // Blockquote — 连续 > 行
    if (BLOCKQUOTE_RE.test(line)) {
      if (buf.length && classify(buf[0]) !== "blockquote") flush(buf);
      buf.push(line);
      continue;
    }

    // List — 连续列表项
    if (LIST_RE.test(line)) {
      if (buf.length && classify(buf[0]) !== "list") flush(buf);
      buf.push(line);
      continue;
    }

    // Thematic break / Heading — 单行块
    if (THEMATIC_BREAK_RE.test(line) || HEADING_RE.test(line)) {
      flush(buf);
      blocks.push({ id: uid(), type: classify(line), content: line });
      continue;
    }

    // 其余归入 paragraph
    if (buf.length && classify(buf[0]) !== "paragraph") flush(buf);
    buf.push(line);
  }

  flush(buf);
  return blocks.length ? blocks : [{ id: uid(), type: "paragraph", content: "" }];
}
