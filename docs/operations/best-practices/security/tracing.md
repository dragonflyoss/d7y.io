---
id: tracing
title: Tracing
slug: /operations/best-practices/security/tracing/
---

This documents will give a explaination about the process of encrypting data and
introducing how to find the possible issue by creating a tracing system.

## Encryption Process

```mermaid
sequenceDiagram
    participant cert-manager
    participant dfdaemon
    participant manager
    participant scheduler
    participant K8s Secret

    loop Certificate Auto Renewal (Every 2/3 validity period)
        cert-manager->>K8s Secret: Update certificates before expiration
        Note right of cert-manager: Renew client/server certificates<br/>and CA certificates
    end

    rect rgb(240, 240, 240)
        Note over dfdaemon,K8s Secret: Certificate Mounting Phase
        dfdaemon->>K8s Secret: Mount client certificate (tls.crt/tls.key)
        manager->>K8s Secret: Mount server certificate + CA certificate (ca.crt)
        scheduler->>K8s Secret: Mount server certificate + CA certificate (ca.crt)
    end

    rect rgb(245, 245, 255)
        Note over dfdaemon,manager: Manager Communication Phase
        dfdaemon->>manager: Initiate TLS handshake
        manager->>dfdaemon: Validate client certificate
        dfdaemon->>manager: Validate server certificate
        alt Validation successful
            manager-->>dfdaemon: Establish encrypted channel
            dfdaemon->>manager: Request dynamic config
            manager-->>dfdaemon: Return dynamic config
        else Validation failed
            manager-->>dfdaemon: Reject connection
        end
    end

    rect rgb(245, 255, 245)
        Note over dfdaemon,scheduler: Scheduler Communication Phase
        dfdaemon->>scheduler: Initiate TLS handshake (carrying client certificate)
        scheduler->>dfdaemon: Validate client certificate (using CA certificate chain)
        dfdaemon->>scheduler: Validate server certificate (using CA certificate chain)
        alt Mutual validation successful
            scheduler-->>dfdaemon: Establish encrypted communication channel
            loop Data Transmission
                dfdaemon->>scheduler: Encrypted request (e.g., P2P scheduling)
                scheduler-->>dfdaemon: Encrypted response
            end
        else Validation failed
            scheduler-->>dfdaemon: Reject connection
        end
    end
```

1. Cert-manager will generate a self-signed CA certificate and a server certificate signed by the CA certificate.
2. Cert-manager will automatically renew the CA certificate and server certificate every 2/3 of their validity period.
3. Dfdaemon/manager/scheduler will mount the CA certificate and server certificate from the K8s Secret.
4. Before dfdaemon connects to manager or scheduler, the two side will initiate a TLS handshake with mutual validation.
5. After TLS handshake, the two side will establish encrypted channel.

## Tracing

### Setup OpenTelemetry Component

Let's take the jaeger deployment as an example. More info about jaeger: [https://www.jaegertracing.io/docs/2.3/getting-started/)

```base
docker run --rm --name jaeger \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 5778:5778 \
  -p 9411:9411 \
  jaegertracing/jaeger:2.3.0
```

### Configure the endpoint in d7y

#### 1. Add tracing configuration as follows(in manager, scheduler and dfdaemon)

```yaml
tracing:
#   # addr is the address to report tracing log. 6831 is default udp port.
  addr: {endpoint}:6831
```

#### 2. Make a download request and check the tracing UI

![dfdaemon_trace](../../../resource/operations/best-practices/security/dfdaemon_trace.png)

> Every request details will be recorded in the tracing UI,
> including the validation for the checksum of the request and response.
