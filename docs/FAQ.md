---
id: faq
title: FAQ
slug: /faq/
---

## Change log level {#change-log-level}

Send `SIGUSR1` signal to dragonfly process to change log level

```shell
kill -s SIGUSR1 <pid of dfdaemon, scheduler or manager>
```

stdout:

```text
change log level to debug
change log level to fatal
change log level to panic
change log level to dpanic
change log level to error
change log level to warn
change log level to info
```

> The change log level event will print in stdout and `core.log` file, but if the level is greater than `info`, stdout only.

## 500 Internal Server Error {#500-internal-server-error}

**1.** Check error logs in /var/log/dragonfly/dfdaemon/

**2.** Check source connectivity(dns error or certificate error)

Example:

```shell
curl https://example.harbor.local/
```

When curl says error, please check the details in output.
