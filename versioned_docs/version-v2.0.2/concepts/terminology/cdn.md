---
id: cdn
title: CDN
---

CDN is a long-running process that caches data downloaded from the source and provides it to other
peers in P2P networks for download, avoiding repeated downloads of the same files from the source.

## Features {#features}

- Caches data downloaded from the source
- Provides breakpoint continuation capability
- Supports multiple storage modes
- Support for downloading data sources of different protocols，like `http/hdfs/oss`

## Relationship {#relationship}

- Scheduler triggers download tasks to CDN
- CDN downloads data from the origin site and caches it locally
- DfDaemon gets task piece information from CDN and downloads piece data
