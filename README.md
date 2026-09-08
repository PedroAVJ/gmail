# Gmail plugin downstream

This repository tracks the Gmail component of OpenAI's official
[`openai/plugins`](https://github.com/openai/plugins) repository and layers
PedroAVJ's operational workflows on top.

Public releases use an audited source snapshot. Upstream OpenAI attribution
and licensing remain documented in this repository; private conversion history
and operator data are excluded from public release history.

## What is included

- OpenAI's canonical connected Gmail app registration.
- OpenAI's `gmail` workflow for search, thread summaries, drafting, forwarding,
  labels, self-delivery, and pasted-link handling.
- OpenAI's `gmail-inbox-triage` workflow for actionable inbox buckets.
- A `gmail-cli` fallback for raw Gmail API metadata, MIME source, attachments,
  and operations not exposed by connector-shaped tools.
- Stateless, source-time-bounded `review-attention` and read-only
  `review-inbox-hygiene` workflows.

Use the connected app for ordinary search, reading, threads, drafting, sending,
and organization. Use `gmail:gmail-cli` when the connector is not sufficiently
raw, `gmail:review-attention` for consequential inbound mail in a bounded
window, and `gmail:review-inbox-hygiene` for read-only unwanted-message review.

## Host behavior

- ChatGPT and Codex use `.app.json` for OpenAI's canonical Gmail connector.
  Connect Gmail in ChatGPT when the host requests it.
- The raw fallback uses `gws`; it requires the CLI to be installed and
  authenticated and the Gmail API enabled for its OAuth project.
- Claude Code receives all five skills and uses the `gws` path because it does
  not consume ChatGPT app registrations.

## Raw fallback

```bash
gws auth status
gws gmail users getProfile --params '{"userId":"me"}'
```

The bounded scanner uses Gmail's received time. An omitted start means the
previous 24 hours ending at invocation time, while callers may provide a
duration or explicit timestamps:

```bash
gmail-attention scan
gmail-attention scan --since 48h
gmail-attention scan --since 2026-08-10T12:00:00Z --until 2026-08-12T12:00:00Z
```

The scanner is stateless: the same explicit window returns the same source
messages. It never defaults to all mailbox history, marks mail read, or mutates
Gmail.

See [`DOWNSTREAM.md`](DOWNSTREAM.md) for exact provenance and upstream update
instructions, and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for
licensing.
