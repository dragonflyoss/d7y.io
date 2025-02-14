---
id: security
title: Security
slug: /operations/best-practices/security/
---

This document provides an overview of Dragonfly security considerations.
Dragonfly security features provide strong identity, powerful policy,
transparent TLS encryption, and authentication
authorization to protect your services and data.

## Peer's HTTP proxy

Peer's HTTP proxy has several security options that you need to configure according to the following documentation.

- connections over TLS (SSL/HTTPS)
- username+password basic-auth credentials

### HTTPS support

If you need to use `HTTPS` proxy, you must configure the certificate,
`certificate authentication` can be used simultaneously with `Basic Authentication`
in order to provide a two levels authentication.
Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [dfdaemon](../../reference/configuration/client/dfdaemon.md) config.

> Notice: It is recommended to use `HTTPS`.

<!-- markdownlint-disable -->

```yaml
proxy:
  # caCert is the root CA cert path with PEM format for the proxy server to generate the server cert.
  # If ca_cert is empty, proxy will generate a smaple CA cert by rcgen::generate_simple_self_signed.
  # When client requests via the proxy, the client should not verify the server cert and set
  # insecure to true. If ca_cert is not empty, proxy will sign the server cert with the CA cert. If openssl is installed,
  # you can use openssl to generate the root CA cert and make the system trust the root CA cert.
  # Then set the ca_cert and ca_key to the root CA cert and key path. Dfdaemon generates the server cert
  # and key, and signs the server cert with the root CA cert. When client requests via the proxy,
  # the proxy can intercept the request by the server cert.
  caCert: 'ca.crt'

  # caKey is the root CA key path with PEM format for the proxy server to generate the server cert.
  # If ca_key is empty, proxy will generate a smaple CA key by rcgen::generate_simple_self_signed.
  # When client requests via the proxy, the client should not verify the server cert and set
  # insecure to true. If ca_key is not empty, proxy will sign the server cert with the CA cert. If openssl is installed,
  # you can use openssl to generate the root CA cert and make the system trust the root CA cert.
  # Then set the ca_cert and ca_key to the root CA cert and key path. Dfdaemon generates the server cert
  # and key, and signs the server cert with the root CA cert. When client requests via the proxy,
  # the proxy can intercept the request by the server cert.
  caKey: 'ca.key'
```

<!-- markdownlint-restore -->

### Basic Auth

Using Basic Auth validation in Peer's HTTP Proxy.
Please note that Basic Auth is not the most secure access control technique.
Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [dfdaemon](../../reference/configuration/client/dfdaemon.md) config.

<!-- markdownlint-disable -->

```yaml
proxy:
  # basic_auth is the basic auth configuration for HTTP proxy in dfdaemon. If basic_auth is not
  # empty, the proxy will use the basic auth to authenticate the client by Authorization
  # header. The value of the Authorization header is "Basic base64(username:password)", refer
  # to https://en.wikipedia.org/wiki/Basic_access_authentication.
  basicAuth:
    # username is the username for basic auth.
    username: 'admin'
    # password is the password for basic auth.
    password: 'dragonfly'
```

<!-- markdownlint-restore -->
