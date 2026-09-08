import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));
const expected = {
  "name": "gmail",
  "version": "0.7.1",
  "url": "https://github.com/PedroAVJ/gmail",
  "dependencies": [
    "toolchain@package-manager"
  ]
};

async function json(...parts) {
  return JSON.parse(await readFile(join(root, ...parts), "utf8"));
}

test("standalone plugin metadata is synchronized", async () => {
  const codex = await json(".codex-plugin", "plugin.json");
  assert.equal(codex.name, expected.name);
  assert.equal(codex.version, expected.version);
  assert.equal(codex.homepage, expected.url);
  assert.equal(codex.repository, expected.url);
  assert.equal(codex.apps, "./.app.json");
  assert.equal(codex.skills, "./skills/");
  const apps = await json(".app.json");
  assert.deepEqual(apps, {
    apps: {
      gmail: {
        id: "connector_2128aebfecb84f64a069897515042a44",
      },
    },
  });
  await access(join(root, "README.md"));
  await access(join(root, "AGENTS.md"));
  await access(join(root, "DOWNSTREAM.md"));
  await access(join(root, "THIRD_PARTY_NOTICES.md"));
  await access(join(root, "licenses", "openai-gmail-MIT.txt"));
  await access(join(root, "assets", "gmail-small.svg"));
  await access(join(root, "assets", "logo.png"));
  await access(join(root, "skills", "gmail", "SKILL.md"));
  await access(join(root, "skills", "gmail-inbox-triage", "SKILL.md"));
  await access(join(root, "skills", "gmail-cli", "SKILL.md"));
  await access(join(root, "skills", "review-attention", "SKILL.md"));
  await access(join(root, "skills", "review-inbox-hygiene", "SKILL.md"));

  if (expected.codexOnly) {
    await assert.rejects(access(join(root, ".claude-plugin", "plugin.json")));
  } else {
    const claude = await json(".claude-plugin", "plugin.json");
    assert.equal(claude.name, codex.name);
    assert.equal(claude.version, codex.version);
    assert.equal(claude.homepage, expected.url);
    assert.equal(claude.repository, expected.url);
    for (const dependency of expected.dependencies) {
      assert.ok((claude.dependencies ?? []).includes(dependency));
    }
  }

  const pkg = await json("package.json");
  assert.equal(pkg.version, expected.version);
  assert.equal(pkg.homepage, expected.url + "#readme");
  assert.equal(pkg.repository.url, "git+" + expected.url + ".git");
});
