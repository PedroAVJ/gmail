import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname;

test("Gmail hygiene retains a bounded stateless source window", async () => {
  const skill = await readFile(join(root, "skills", "review-inbox-hygiene", "SKILL.md"), "utf8");
  assert.match(skill, /native scheduler is only its clock/i);
  assert.match(skill, /previous 24 hours/i);
  assert.match(skill, /stateless/i);
  assert.match(skill, /Never unsubscribe, block, report, send/);
});

test("Gmail hygiene remains client-neutral and source-read-only", async () => {
  for (const contents of await Promise.all([
    readFile(join(root, "skills", "review-inbox-hygiene", "SKILL.md"), "utf8"),
    readFile(join(root, "references", "attention-policy.md"), "utf8"),
  ])) {
    assert.doesNotMatch(contents, /\bIntake\b|Codex-only|shared sweep|event CLI|event envelope/i);
    assert.match(contents, /never/i);
  }
});
