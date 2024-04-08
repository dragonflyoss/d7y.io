---
id: singularity-proxy
title: HTTP Proxy
slug: /operations/integrations/container-runtime/singularity/proxy/
---

Documentation for setting up Dragonfly's container runtime as an HTTP Proxy for Singularity/Apptainer.

## Generate CA certificate  {#step-1-generate-ca-certificate}

Generate an RSA private key.

```bash
openssl genrsa -out ca.key 2048
```

Create openssl config file `openssl.conf`.
Note set `basicConstraints` to true, that you can modify the values.

```text
[ req ]
#default_bits = 2048
#default_md = sha256
#default_keyfile = privkey.pem
distinguished_name = req_distinguished_name
attributes = req_attributes
extensions               = v3_ca
req_extensions           = v3_ca

[ req_distinguished_name ]
countryName = Country Name (2 letter code)
countryName_min = 2
countryName_max = 2
stateOrProvinceName = State or Province Name (full name)
localityName = Locality Name (eg, city)
0.organizationName = Organization Name (eg, company)
organizationalUnitName = Organizational Unit Name (eg, section)
commonName = Common Name (eg, fully qualified host name)
commonName_max = 64
emailAddress = Email Address
emailAddress_max = 64

[ req_attributes ]
challengePassword = A challenge password
challengePassword_min = 4
challengePassword_max = 20

[ v3_ca ]
basicConstraints         = CA:TRUE
```

Generate the CA certificate.

```bash
openssl req -new -key ca.key -nodes -out ca.csr -config openssl.conf
openssl x509 -req -days 36500 -extfile openssl.conf \
    -extensions v3_ca -in ca.csr -signkey ca.key -out ca.crt
```

## Configure dfget daemon {#step-2-configure-dfget-daemon}

To use dfget daemon as proxy, first you need to append a proxy rule in
`/etc/dragonfly/dfget.yaml`, This will proxy
`your.private.registry's` requests for image layers:

```yaml
registryMirror:
  # When enable, using header "X-Dragonfly-Registry" for remote instead of url.
  dynamic: true
  # URL for the registry mirror.
  url: <your.private.registry>
  # Whether to ignore https certificate errors.
  insecure: false
  # Optional certificates if the remote server uses self-signed certificates.
  certs: []
  # Whether to request the remote registry directly.
  direct: false
  # Whether to use proxies to decide if dragonfly should be used.
  useProxies: false
proxy:
  proxies:
    # proxy all http image layer download requests with dfget
    - regx: blobs/sha256.*
    - regx: manifests/sha256.*
hijackHTTPS:
  # Key pair used to hijack https requests.
  cert: ca.crt
  key: ca.key
  hosts:
    - regx: <your.private.registry>
```

## Pull images with proxy {#step-4-pull-images-with-proxy}

And you can pull the image through proxy as below:

```bash
no_proxy='' NO_PROXY='' HTTPS_PROXY=127.0.0.1:65001 singularity pull  oras://hostname/path/image:tag
```

### Verify {#verify}

You can execute the following command to
check if the image is distributed via Dragonfly.

```shell
grep "peer task done" /var/log/dragonfly/daemon/core.log
```

The expected output is as follows:

```shell
{
   "level":"info",
   "ts":"2022-09-07 12:04:26.485",
   "caller":"peer/peertask_conductor.go:1500",
   "msg":"peer task done, cost: 1ms",
   "peer":"00.000.0.000-5184-1eab1abcs-bead-4b9f-b055-6c1120a30a33",
   "task":"b423e11ddb7ab19a3c2c4c98e5ab3b1699a597e974c737bb4004edeeabcdefgh",
   "component":"PeerTask"
}
```
