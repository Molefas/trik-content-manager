# TrikHub MCP Gaps & Notes

Gaps and missing documentation discovered during the trik design process.

---

## Gap 1: analyze_trik_requirements - Generic Tool Suggestions
**Date:** 2026-02-28
**Tool:** `analyze_trik_requirements`
**Issue:** The suggested tools are very generic (e.g., `searchArticles`, `createPosts`) and don't reflect the actual complexity described in the input. The tool names and descriptions seem pattern-matched from keywords rather than architecturally reasoned.
**Impact:** Low - these are suggestions only, easy to ignore.
**Suggestion:** Consider returning more specific tool suggestions based on the described workflows, or at minimum return more than 2 tool suggestions for complex triks.

## Gap 2: analyze_trik_requirements - handoffDescription Truncation
**Date:** 2026-02-28
**Tool:** `analyze_trik_requirements`
**Issue:** The `suggestedHandoffDescription` is truncated at ~500 chars and ends with "...". This suggests a hardcoded limit, but it cuts off mid-sentence making it unusable as-is.
**Impact:** Medium - the user would need to manually write a good handoff description.
**Suggestion:** Either summarize intelligently within the limit, or clearly document the max length so users know to provide a concise description.

## Gap 3: No Documentation on Conversational Trik Runtime
**Date:** 2026-02-28
**Context:** Design phase
**Issue:** The MCP tools help design and scaffold triks, but there's no tool or documentation about what capabilities the conversational agent runtime provides. Specifically:
- Does the agent have built-in web fetch capability?
- What storage API is available in handler code?
- How does the session work?
- What's the agent's context window / model?
**Impact:** High - makes it hard to design tools correctly without knowing what the agent can do natively.
**Suggestion:** Add a `describe_runtime` or `get_runtime_docs` tool that explains the conversational agent's capabilities, available APIs, and constraints.

## Gap 4: design_tool - No Input Schema Design
**Date:** 2026-02-28
**Tool:** `design_tool`
**Issue:** The `design_tool` only generates log schemas and log templates. There's no way to design the tool's input schema (parameters the tool accepts). The tool only deals with output/logging, not the input contract.
**Impact:** Medium - input schemas must be manually designed.
**Suggestion:** Extend `design_tool` to also generate input parameter schemas, or add a `design_tool_input` companion tool.

## Gap 5: scaffold_trik - Unclear outputTemplate vs Conversational
**Date:** 2026-02-28
**Tool:** `scaffold_trik`
**Issue:** The `outputTemplate` field on tools is documented as "Required for tool-mode" but it's unclear whether conversational mode triks should also have output templates, and if so, what they're used for.
**Impact:** Low - can test both ways.
**Suggestion:** Document whether outputTemplate is ignored in conversational mode or serves a different purpose.

## Gap 6: No validate_manifest for Pre-Scaffold Validation
**Date:** 2026-02-28
**Tool:** `validate_manifest`
**Issue:** The validate tool requires a complete manifest string. There's no way to validate individual sections (tools, config, capabilities) during the design phase before generating the full manifest.
**Impact:** Low - validation happens at the end anyway.
**Suggestion:** Consider adding incremental validation or a "check tool definition" helper.

## Gap 7: scaffold_trik - Tools Can't Access Storage
**Date:** 2026-02-28
**Tool:** `scaffold_trik`
**Issue:** The generated scaffold creates tools as static module imports (`import { addSource } from './tools/addSource.js'`). However, tools need access to `storage` from `TrikContext`, which is only available inside the `wrapAgent` callback. The generated tool stubs have no way to access storage.
**Impact:** High - developers must refactor the pattern immediately. Tools need to be created as factory functions that receive storage, or the SDK needs to provide an alternative mechanism (e.g., dependency injection, global context).
**Suggestion:** Either:
1. Generate tools as factory functions: `export const createAddSource = (storage) => tool(...)` and call them inside wrapAgent
2. Or document how tools are supposed to access storage (if there's an SDK mechanism not shown in scaffold)

## Gap 8: scaffold_trik - System Prompt Path Bug
**Date:** 2026-02-28
**Tool:** `scaffold_trik`
**Issue:** In the generated `agent.ts`, the system prompt is loaded with:
```typescript
const systemPrompt = readFileSync(join(__dirname, '../src/prompts/system.md'), 'utf-8');
```
Since `__dirname` resolves to the `src/` directory (where agent.ts lives), `../src/prompts/system.md` would resolve to `../src/prompts/system.md` which goes up one level and back into src. The correct path should be `join(__dirname, 'prompts/system.md')` or `join(__dirname, '../src/prompts/system.md')` should be `join(__dirname, './prompts/system.md')`.
**Impact:** Medium - the agent would fail to start due to file not found.
**Suggestion:** Fix the path resolution in the scaffold template.
