import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I reverted the fix because the bug had better uptime than the fix. The bug is now a senior engineer.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  console.error(`entry is ${LINE.length} characters, must be 1-200`);
  process.exit(1);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  console.error("entry must be a single non-blank line");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

// Read back and verify the written file is byte-identical to the line:
// a truncated or re-encoded write must fail loudly instead of shipping.
const written = readFileSync(target, "utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the entry line byte for byte");
  process.exit(1);
}
if (Buffer.byteLength(written, "utf8") !== 100) {
  console.error(`entry.txt is ${Buffer.byteLength(written, "utf8")} bytes, expected 100`);
  process.exit(1);
}
