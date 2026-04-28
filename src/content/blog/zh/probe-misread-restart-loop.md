---
title: "Kubernetes 探針誤判：一次把服務打進重啟循環的 liveness probe 事故"
description: 有些事故不是程式壞掉，而是 liveness probe 把本來還能活下來的服務誤判成該重啟。這篇記一個很典型的 production 坑。
pubDate: 2026-04-28
updatedDate: 2026-04-28
lang: zh
kind: incident
tags:
  - kubernetes
  - probes
  - incident
  - operations
draft: false
---

有些生產事故很戲劇化。

有些則比較陰，因為服務本來不一定會死，結果是我們自己用探針把它推下去的。

## 事故長相通常長這樣

- 新版本上線
- 應用啟動比平常慢一點
- liveness probe 太早開始打
- 探針連續失敗
- kubelet 幫你重啟
- 重啟之後 cache 又沒熱、依賴又重新連，於是更慢
- 然後你得到一個漂亮的 restart loop

這類問題最煩的地方，是表面上看起來像「程式一直掛掉」，但其實程式根本還在努力啟動。

## 真正的問題通常不是探針本身

通常是這三件事組合起來：

1. 我們沒有分清楚 readiness 跟 liveness 的責任
2. 啟動時間的假設太樂觀
3. rollout 速度快到來不及觀察異常

如果 `livenessProbe` 太激進，它就會把「只是慢」誤判成「已經死了」。

## 我會先看什麼

```bash
kubectl describe pod <pod-name> -n <ns>
kubectl logs <pod-name> -n <ns> --previous
kubectl get events -n <ns> --sort-by=.lastTimestamp
```

我要確認的是：

- 是 readiness fail 還是 liveness fail？
- 重啟前最後的 log 在做什麼？
- 事件裡有沒有明確寫 probe failed / killing container？

## 比較穩的做法

- readiness 嚴格一點，避免還沒準備好就接流量
- liveness 保守一點，避免太早重啟
- 啟動真的慢的服務，先考慮 `startupProbe`
- rollout 不要衝太快，給自己看圖和看 log 的時間

## 我自己的偏見

健康檢查不是越兇越好。

在 production，**錯把慢服務殺掉**，很多時候比暫時等它恢復更糟。

探針的目的不是展現你多會寫 YAML，而是幫系統在不確定裡做出比較不蠢的判斷。
