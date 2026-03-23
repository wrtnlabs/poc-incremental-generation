# MicroAgentica Live Runner

This project now has a live runtime path that uses `MicroAgentica` with a real OpenAI-compatible API key.

## Environment

Copy `.env.example` to `.env` and fill in at least:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Optional:

```env
OPENAI_BASE_URL=
MAX_ATTEMPTS=5
```

## Run

```bash
pnpm install
pnpm runner:micro
```

## Behavior

- `MicroAgentica` is asked to call a single `submit` tool.
- The tool accepts `DeepPartial<ImaginaryModuleAst>` patches.
- Each submitted patch is serialized to the existing `{"ast": ...}` format.
- The existing merge and strict completion logic remains the source of truth.

## Important Caveat

This is still a PoC.

The live runner proves that a real LLM can participate in the loop, but the authoritative completion decision still comes from the local strict validation path.
