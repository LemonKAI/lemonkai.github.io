---
title: GitOps review checklist before Argo CD syncs production
description: A compact pre-sync checklist for GitOps changes so an innocent YAML edit does not become surprising production behavior in Kubernetes.
pubDate: 2026-04-28
updatedDate: 2026-04-28
lang: en
kind: note
tags:
  - kubernetes
  - gitops
  - platform
  - operations
draft: false
---

GitOps is great at making clusters converge. It is less great at telling you whether convergence is a good idea.

That is why I like a small review checklist before Argo CD, Flux, or any similar controller gets a chance to rewrite production for me.

## Read the diff by intent, not by line count

I care less about how many YAML lines changed and more about what kind of change it is.

- **Image change**: what code is actually shipping?
- **Replica or resource change**: what will this do to capacity and cost?
- **Probe change**: are we changing health semantics or just timeout values?
- **Ingress, policy, or secret wiring change**: are we expanding blast radius?

If the review only says “looks fine,” it probably is not deep enough.

## Check ownership boundaries

The easiest GitOps mistakes happen when two systems believe they own the same field.

Typical examples:

- An HPA manages replica count while a human changes `spec.replicas`
- A cert controller writes annotations that another tool keeps reverting
- A runtime patch in the cluster gets wiped by the next sync

Before sync, I want to know which controller owns which part of the object. Drift is not always bad. Unexplained drift is.

## Review rollout behavior, not just desired state

The manifest might look safe while the rollout path is not.

Questions I ask:

- Will this create a restart storm?
- Do the probes still match startup reality?
- Does the PodDisruptionBudget still make sense for this replica count?
- Is `maxUnavailable` too aggressive for the current dependency graph?

GitOps tools apply intent. They do not protect you from bad rollout math.

## Be suspicious of configuration changes with delayed failure

The most annoying incidents are the ones that pass sync and fail ten minutes later.

That usually means:

- a secret rotated but not everywhere
- an environment variable changed semantics
- a dependency endpoint moved
- a feature flag exposed code paths nobody exercised in staging

For config-heavy changes, I want one extra question in review: **what is the delayed failure mode if this is wrong?**

## My tiny pre-sync checklist

Before I let the controller touch production, I want answers to these:

1. What category of change is this?
2. Which controller owns the important fields?
3. What does rollout behavior look like under failure?
4. Is there a delayed config risk hiding behind a clean diff?
5. If this goes bad, what is the fastest rollback path?

If those five answers are clear, GitOps feels boring in the best possible way.

That is the goal. Not flashy automation. Predictable automation.
