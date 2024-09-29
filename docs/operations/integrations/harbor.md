---
id: harbor
title: Harbor
slug: /operations/integrations/harbor/
---

This document will help you experience how to use dragonfly with harbor.

## Container registry is set to harbor address

Use the harbor address as the container registration, and the container runtime uses[containerd](../integrations/container-runtime/containerd.md#private-registry-using-self-signed-certificates) or [CRI-O](../integrations/container-runtime/cri-o.md#private-registry-using-self-signed-certificates).

## Preheat feature integration {#preheat-feature-integration}

Dragonfly 2.0 is compatible with dragonfly 1.0 integrated harbor preheat interface.

Harbor preheat feature integrates dragonfly, please refer to [harbor-preheat](../../advanced-guides/preheat.md#preheat).
