---
title: Agent runtime observability needs spans, tool events, and failure memory
description: Basic logging is not enough for agent systems; you need traces, tool-level outcomes, and a short path from failure back to prompt or policy.
pubDate: 2026-04-24
updatedDate: 2026-04-28
lang: en
kind: note
tags:
  - ai
  - agents
  - observability
  - infrastructure
draft: false
---

The hardest part of running agents in production is not model quality in isolation. It is recovering a clear execution story after the agent does something expensive, slow, or wrong.

If you only emit a final answer and a few logs, you lose the real debugging surface: intermediate tool calls, retries, partial outputs, and policy decisions.

## The minimum useful event model

An agent runtime should record:

- Request-level span metadata
- Model invocations with prompt and token budgets
- Tool execution start and end events
- Guardrail decisions and denials
- Durable references to artifacts produced along the way

That structure gives you a timeline instead of a mystery.

```ts
type ToolEvent = {
  traceId: string;
  runId: string;
  toolName: string;
  status: "started" | "succeeded" | "failed";
  startedAt: string;
  finishedAt?: string;
  inputSummary: string;
  outputSummary?: string;
  errorCode?: string;
};
```

## Failure memory matters

Do not stop at the immediate error. Capture enough context to answer these questions later:

1. What was the agent trying to do?
2. Which tool or policy edge blocked it?
3. Was the failure deterministic, environmental, or model-driven?

When you cannot answer those three questions quickly, the runtime is under-instrumented.

## A practical default for tool wrappers

Wrap every tool call once, not differently in five places.

```ts
export async function runTool<T>(
  traceId: string,
  toolName: string,
  execute: () => Promise<T>
) {
  const startedAt = new Date().toISOString();
  emitToolEvent({ traceId, toolName, status: "started", startedAt });

  try {
    const result = await execute();
    emitToolEvent({
      traceId,
      toolName,
      status: "succeeded",
      startedAt,
      finishedAt: new Date().toISOString()
    });
    return result;
  } catch (error) {
    emitToolEvent({
      traceId,
      toolName,
      status: "failed",
      startedAt,
      finishedAt: new Date().toISOString(),
      errorCode: error instanceof Error ? error.name : "UnknownError"
    });
    throw error;
  }
}
```

The exact shape is not the point. The point is consistency. If every tool reports differently, the trace is impossible to reason about at speed.

## The operational payoff

Good observability shortens three loops at once:

- Incident response
- Prompt and policy refinement
- Capacity planning for expensive workflows

Agents are only useful when the runtime is inspectable. Otherwise you are operating an opaque workflow engine with a language model attached.
