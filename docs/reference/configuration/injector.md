---
id: injector
title: Injector
slug: /reference/configuration/injector/
---

Injector is a Kubernetes mutating admission webhook that injects Dragonfly client
binaries, the dfdaemon unix socket volume, and volume mounts into Pods, so any
container can use Dragonfly without rebuilding its image.

This page documents the injector configuration file. For deploying the injector with
Helm, refer to [Helm Charts](../../getting-started/installation/helm-charts.md).

## Configure Injector YAML File {#configure-injector-yaml-file}

The default path for the injector yaml configuration file is `/etc/dragonfly/injector.yaml`,
mounted from the `dragonfly-injector-config` ConfigMap in the `dragonfly-system` namespace.

```yaml
# Init container image configuration for the injected Dragonfly binaries.
initContainerImage:
  # Registry of the image that provides the Dragonfly client binaries
  # (dfget, dfcache, dfstore, dfctl and dfdaemon).
  registry: docker.io
  # Repository of the image.
  repository: dragonflyoss/client
  # Tag of the image, keep it aligned with the client and seed client version.
  tag: v1.3.0
  # Digest of the image. When set, it takes precedence over the tag and the
  # image reference becomes registry/repository@digest.
  digest: ''
  # Pull policy of the init container image.
  pullPolicy: IfNotPresent
  # Pull secrets of the init container image, a list of references to
  # Secrets in the same namespace as the injected Pods.
  pullSecrets: []
  # - my-registry-secret
```

## Reload Configuration {#reload-configuration}

The injector watches the configuration file and reloads it automatically. The reload
interval is 30s. If the configuration file fails to load at startup, the injector
falls back to the default configuration.

The configuration is merged with the defaults field by field, so a partially
specified file only overrides the fields it contains and the remaining fields keep
their default values.

## Injection Triggers {#injection-triggers}

Injection is enabled per Pod or per namespace:

- Add the annotation `dragonfly.io/inject: "true"` to a Pod.
- Or add the label `dragonfly.io/inject: "true"` to a namespace, which enables
  injection for all Pods in that namespace.

Additional Pod annotations control the injection behavior:

| Annotation | Description |
| ---------- | ----------- |
| `dragonfly.io/init-container-image` | Overwrites the init container image, e.g. `dragonflyoss/client:latest`. |
| `dragonfly.io/skip-unix-sock-inject` | When set to `true`, skips injecting the dfdaemon unix socket volume and mounts. |

## Metrics {#metrics}

Unlike the other Dragonfly components, which serve plain HTTP metrics endpoints,
the injector serves its metrics endpoint securely with TLS and
[SubjectAccessReview](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)
authentication and authorization. When enabling metrics scraping for the injector
with Prometheus Operator, configure the scrape with `insecureSkipVerify` (the serving
certificate is self-signed by default) and a bearer token from a ServiceAccount
that is permitted to access the `metrics` resource of `dragonfly.io`.

For Helm values that control the injector metrics Service and ServiceMonitor,
refer to [Helm Charts](../../getting-started/installation/helm-charts.md#using-dragonfly-with-webhook-injection).
