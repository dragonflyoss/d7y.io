---
id: injector
title: Webhook Injector
slug: /operations/integrations/injector/
---

The Dragonfly webhook injector is a Kubernetes mutating admission webhook that automatically
injects Dragonfly client binaries and the dfdaemon unix socket into application Pods. This
means your container images don't need to bundle Dragonfly tools — the injector handles it
at Pod creation time.

## When to use it

Use the injector when you want Pods to have access to `dfget`, `dfcache`, `dfstore`, `dfctl`,
and `dfdaemon` without modifying the container image. Typical use cases:

- Pull artifacts through Dragonfly's P2P network from inside a running Pod
- Use `dfget` for large file downloads in CI/CD jobs or data pipelines
- Access the dfdaemon unix socket for proxy-based P2P transfers

## Prerequisites

- A running Dragonfly cluster (manager, scheduler, seed client, client)
- [cert-manager](https://cert-manager.io/) for webhook TLS certificates

## Install via Helm (recommended)

If you use the Dragonfly Helm chart, enable the injector in your `values.yaml`:

```yaml
injector:
  enable: true
  replicas: 2
  image:
    registry: docker.io
    repository: dragonflyoss/injector
    tag: latest
  initContainerImage:
    registry: docker.io
    repository: dragonflyoss/client
    tag: latest
  certManager:
    enable: true
    issuer:
      name: ''
      kind: Issuer
      create: true
```

See the [Helm Charts installation guide](../../getting-started/installation/helm-charts.md#using-dragonfly-with-webhook-injection) for the full walkthrough.

## Install via manifests

For standalone deployment without Helm:

```shell
kubectl apply -f https://raw.githubusercontent.com/dragonflyoss/dragonfly-injector/main/dist/install.yaml
```

This creates the injector deployment, webhook configuration, RBAC, and a default ConfigMap
in the `dragonfly-system` namespace.

To customize the injector config after install:

```shell
kubectl -n dragonfly-system edit configmap dragonfly-injector-config
```

## How injection works

The injector watches for Pod create/update requests and mutates the Pod spec when injection
is enabled. It adds:

1. An init container that copies Dragonfly binaries (`dfget`, `dfcache`, `dfstore`, `dfctl`, `dfdaemon`) into a shared volume
2. Volume mounts so each container can access the binaries at `/usr/local/bin/`
3. A hostPath volume mount for the dfdaemon unix socket at `/var/run/dragonfly/dfdaemon.sock`

## Enabling injection

**Per namespace** — label the namespace:

```shell
kubectl label namespace my-namespace dragonfly.io/inject=true
```

**Per pod** — annotate the Pod:

```yaml
metadata:
  annotations:
    dragonfly.io/inject: 'true'
```

If both are set, the Pod annotation takes priority.

## Annotations reference

| Annotation | Description |
| --- | --- |
| `dragonfly.io/inject` | `true` to inject, `false` to skip |
| `dragonfly.io/init-container-image` | Override the init container image for this Pod |
| `dragonfly.io/skip-unix-sock-inject` | `true` to skip the dfdaemon socket mount |

## Troubleshooting

Check the injector logs:

```shell
kubectl -n dragonfly-system logs -l app.kubernetes.io/name=dragonfly-injector
```

If Pods are not getting injected:

- Verify the namespace label or pod annotation is set correctly
- Check that cert-manager issued the webhook certificate
- Check that the `MutatingWebhookConfiguration` exists: `kubectl get mutatingwebhookconfigurations`
