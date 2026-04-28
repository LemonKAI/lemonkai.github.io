---
title: KAI K8s之路 01｜Pod 是什麼？為什麼 Kubernetes 不直接管理 container
description: 從 Kubernetes 最核心的抽象開始：Pod 到底在管什麼，為什麼平台不是直接管理單個 container，而是用 Pod 當最小調度單位。
pubDate: 2026-04-28
updatedDate: 2026-04-28
lang: zh
kind: series
series: KAI K8s之路 / KAI's K8s Journey
seriesOrder: 1
translationKey: kai-k8s-road-01
tags:
  - kubernetes
  - basics
  - pod
  - series
draft: false
---

很多人一開始學 Kubernetes，會急著去背 Deployment、Service、Ingress。

但如果你連 **Pod 到底是什麼** 都沒有先想清楚，後面其實很容易變成純背誦。

所以這個系列第一篇，我只想先回答一個問題：

> Kubernetes 為什麼不是直接管理單個 container，而是用 Pod 當最小調度單位？

## 先把 container 跟 Pod 分開

- **Container**：跑程式的單位
- **Pod**：Kubernetes 用來調度、放置、重啟、掛網路、掛 volume 的最小單位

也就是說，container 比較像「程式怎麼跑」，Pod 比較像「Kubernetes 怎麼照顧這組程式」。

如果只記一句話，我會記這句：

> **Container 是執行單位，Pod 是編排單位。**

## 為什麼不直接一個 container 一個資源？

因為現實裡，有些東西天生就應該綁在一起。

例如：

- 主程式和 sidecar 要共享網路命名空間
- log collector 要跟主容器一起被排程
- proxy / init container / volume 初始化，要跟 workload 綁在同一個生命週期

Pod 就是在處理這件事：

它不是只代表一個 container，而是代表一組 **應該一起被放在同一台節點、共用同一份網路與儲存上下文** 的容器。

## Pod 真正在幫你管理什麼

把 Pod 想成 Kubernetes 給 workload 的「外殼」，會比較好理解。

它至少管了這幾件事：

1. **排程位置**：這組容器要被放去哪個 node
2. **網路身份**：這組容器共用同一個 IP
3. **儲存上下文**：volume 怎麼掛、哪些 container 共用
4. **重啟邏輯**：容器掛了之後，怎麼依 policy 被重啟
5. **生命週期邊界**：什麼時候算這個 workload 的一次啟動 / 終止

這也是為什麼你在 debug k8s 時，很少只看 container，本質上更常是在看 **這個 Pod 的狀態到底發生了什麼**。

## 新手常卡住的點

### 1. 把 Pod 當成 VM

Pod 不是 VM，也不是一台小主機。

它比較像一個暫時性的執行包裝。Pod 可以被重建、被替換、被重新排程，所以不要把重要狀態硬塞進 Pod 內部本地檔案系統。

### 2. 以為一個 Pod 只能有一個 container

大部分情況是一個 main container 沒錯，但 sidecar、init container 都很常見。真正該問的不是「能不能多個」，而是：

> 這些 container 是否真的應該共享同一個生命週期？

### 3. 看到 Pod Running 就以為服務好了

`Running` 只代表 Pod 裡的容器起來了，不代表它**能安全接流量**。

這就是為什麼後面我們一定要接著講 readiness / liveness / startup probes。

## 一個很實用的觀察順序

當你剛接手一個不熟的 workload，可以先用這個順序看：

```bash
kubectl get pod -n <ns>
kubectl describe pod <pod-name> -n <ns>
kubectl logs <pod-name> -n <ns>
```

你要先建立的不是「這個 yaml 長怎樣」，而是：

- 這個 Pod 上面跑了哪些 container？
- 它們共享哪些 volume？
- 現在卡在排程、啟動、還是健康檢查？

## 這篇先記住三件事

1. Container 是跑程式，Pod 是 Kubernetes 管理 workload 的最小單位
2. Pod 讓一組應該綁在一起的 container，共享網路、儲存與生命週期
3. 之後很多 k8s 問題，本質上都是 Pod 行為問題，不只是程式問題

下一篇，我會接著往前走：**為什麼有了 Pod，還需要 Deployment？**
