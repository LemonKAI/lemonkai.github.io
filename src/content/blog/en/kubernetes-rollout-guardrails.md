---
title: "Kubernetes deployment guardrails: probes, rollout settings, and fast triage"
description: A compact baseline for readiness, liveness, rollout settings, and fast triage before a Kubernetes deployment turns into an outage.
pubDate: 2026-04-28
updatedDate: 2026-04-28
lang: en
kind: note
tags:
  - kubernetes
  - sre
  - deployment
  - operations
draft: false
---

Shipping into Kubernetes is easy. Shipping safely is not.

When a deployment fails in production, the first problem is usually not Kubernetes itself. The failure is often a missing guardrail: probes that say too much or too little, rollout settings that move too fast, or a release process that does not pause long enough to catch regression signals.

## Start with probes that express intent

Readiness should answer one question: can this pod receive production traffic now?

Liveness should answer a different question: is this process so wedged that a restart is the least risky recovery step?

Those checks should not share the same endpoint by default. If they do, you blur two recovery paths into one noisy signal.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      containers:
        - name: api
          image: ghcr.io/example/api:2026.04.28
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /livez
              port: 8080
            initialDelaySeconds: 20
            periodSeconds: 10
```

## Keep rollout math boring

Small `maxUnavailable` and `maxSurge` values are not glamorous, but they buy time for dashboards, alerts, and humans to see the blast radius before the cluster amplifies it.

If the service has a cold cache, slow dependency graph, or expensive startup path, give the application room to stabilize before the deployment controller concludes that it is healthy.

## Triage sequence when a rollout degrades

The fastest path is usually:

```bash
kubectl rollout status deploy/api -n platform
kubectl describe pod <pod-name> -n platform
kubectl logs <pod-name> -n platform --previous
kubectl get events -n platform --sort-by=.lastTimestamp
```

That order matters. Start with controller state, then inspect pod conditions, then collect process logs, then scan cluster events for scheduling and image-pull failures.

## A workable default

My bias is simple:

- Make readiness strict enough to protect traffic.
- Make liveness conservative enough to avoid restart loops.
- Slow the rollout enough to watch one failure before it becomes four.

Kubernetes does not need heroics here. It needs clear signals and a deployment shape that respects uncertainty.
