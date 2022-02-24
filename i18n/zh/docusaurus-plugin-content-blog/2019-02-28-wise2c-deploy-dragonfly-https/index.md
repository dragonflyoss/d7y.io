---
title: 睿云智合基于 Dragonfly 支持docker proxy https
author: 吴鹏
tags: [dragonfly, wise2c]
description: 本文档介绍了dragonfly 使用docker proxy 实现 https
hide_table_of_contents: false
---

![611.jpg | center | 827x347](https://camo.githubusercontent.com/3890ebff894a525c0747e1945f991b10b42284b4/68747470733a2f2f6d6d62697a2e717069632e636e2f6d6d62697a5f706e672f4a533266664d4958736962304d564d7a504556414b58763233545070304341463559696253696133313839364e7737654b4f546837777948574c47736e6c4e665a496f366669626961444d6d7176615333716d5657554d323959412f3634303f77785f666d743d706e672674703d7765627026777866726f6d3d352677785f6c617a793d312677785f636f3d31)

## 睿云智合基于 Dragonfly 支持docker proxy https

### 1、部署https harbor

<https://github.com/goharbor/harbor/blob/master/docs/configure_https.md>

## 2、部署docker_proxy

### pull images

#### pull_images.sh

```bash
#!/bin/sh
docker_registry_proxy="dockerhubwp/docker_proxy_nginx:latest"
supernode="registry.cn-hangzhou.aliyuncs.com/alidragonfly/supernode:0.2.0"
dfclient="dockerhubwp/dfclient:latest"

images="${docker_registry_proxy} ${supernode} ${dfclient}"

function pullImage(){
    for image in ${images}; do
        echo -e "pull image ======>${image}"
        docker pull ${image}
    done
}

pullImage
```

#### docker_proxy.sh

```bash
#! /bin/sh

# Separate deployment docker_proxy
# dfdaemon and docker registry map
# example  x.x.x
registry="harbor域名"
containername=docker_registry_proxy

# 你需要配置的dns 服务器 (如：dnsmasq)
DNS_SERVER="dns-server"
docker_registry_proxy="dockerhubwp/docker_proxy_nginx:latest"

# get localhost ip
ipaddr=$(ip addr | awk '/^[0-9]+: / {}; /inet.*global/ {print gensub(/(.*)\/(.*)/, "\\1", "g", $2)}')
localhostIp=$(echo ${ipaddr} | cut -d " " -f 1)

function changeDockerProxy() {
    mkdir -p /etc/systemd/system/docker.service.d
    cat <<EOD >/etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:3128/"
Environment="HTTPS_PROXY=http://127.0.0.1:3128/"
EOD
}

function dockerDockerProxyRun() {
    if [[ 0 != $(docker ps -a | grep ${containername} | wc -l) ]]; then
        docker rm -f ${containername}
    fi
    docker run --restart=always --privileged=true --name ${containername} -d -p 0.0.0.0:3128:3128 \
      -v /etc/docker_proxy_nginx/docker_mirror_certs:/ca -v /var/log/docker_proxy_nginx:/var/log/nginx/ \
      -e DRAGONFLY_REGISTRIES="${registry},http://${localhostIp}:65001" -e REGISTRIES="${registry}" \
      -e DNS_SERVER=${DNS_SERVER} ${docker_registry_proxy}
}

changeDockerProxy

systemctl daemon-reload
systemctl restart docker

dockerDockerProxyRun
```

### 3、部署dragonfly

#### 部署Supernode

##### supernode.sh

```bash
#!/bin/sh

# Separate deployment supernode

supernode="registry.cn-hangzhou.aliyuncs.com/alidragonfly/supernode:0.2.0"
containername=supernode

function superNode() {
    if [[ 0 != $(docker ps -a | grep ${containername} | wc -l) ]]; then
        docker rm -f ${containername}
    fi
    docker run --name ${containername} --restart=always -d -p 8001:8001 -p 8002:8002 ${supernode}
}
superNode
```

#### 部署dfclient

##### dfclient.sh

```bash
#!/bin/sh

# Separate deployment docker_proxy

dfclient="dockerhubwp/dfclient:latest"

#harbor 地址
dfdaemon_registry="https://x.x.x"
containername=dfclient

# supernode ips  example (10.0.0.160,10.0.0.162)
supernodes="supernodeip"


ipaddr=$(ip addr | awk '/^[0-9]+: / {}; /inet.*global/ {print gensub(/(.*)\/(.*)/, "\\1", "g", $2)}')
localhostIp=$(echo ${ipaddr} | cut -d " " -f 1)

cat <<EOD >/etc/dragonfly.conf
[node]
address=${supernodes}
EOD

function startDfClient() {
    if [[ 0 != $(docker ps -a | grep ${containername} | wc -l) ]]; then
        docker rm -f ${containername}
    fi
    docker run --name ${containername} --restart=always -d  -p 65001:65001 \
    -v /root/.small-dragonfly:/root/.small-dragonfly -v /etc/dragonfly.conf:/etc/dragonfly.conf  \
    -e dfdaemon_registry=${dfdaemon_registry} -e localhostIp=${localhostIp} ${dfclient}
}

startDfClient
```

#### 最后

##### trust.sh

```bash
#!/bin/sh

# trust ca
curl http://127.0.0.1:3128/ca.crt >/etc/pki/ca-trust/source/anchors/docker_proxy_nginx.crt

update-ca-trust
```

#### 测试: 拉取镜像

```bash
docker pull x.x.x/library/nginx:latest
```

原文链接：<https://mp.weixin.qq.com/s/95mX8cDox5bmgQ2xGHLPqQ>

参考：

- <https://d7y.io/zh-cn/>
- <https://github.com/goharbor/harbor/>
- <https://github.com/rpardini/docker-registry-proxy>
- <https://github.com/chobits/ngx_http_proxy_connect_module>
