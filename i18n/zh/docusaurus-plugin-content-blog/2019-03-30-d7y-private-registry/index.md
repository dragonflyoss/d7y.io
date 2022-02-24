---
title: 阿里Dragonfly体验之私有registry下载(基于0.3.0)
author: anjia0532
author_title: 攻城狮
author_url: https://github.com/anjia0532
author_image_url: https://avatars.githubusercontent.com/u/15098916?s=400&u=23a4b699baa0ed924cf1db40b9edb614d0263621&v=4
tags: [docker, dragonfly]
description: 本文介绍如何在docker上部署Dragonfly，包括supernode，dfdaemon，dfget。
image: https://avatars.githubusercontent.com/u/15098916?s=400&u=23a4b699baa0ed924cf1db40b9edb614d0263621&v=4
hide_table_of_contents: false
---

## 阿里Dragonfly体验之私有registry下载(基于0.3.0)

书接上篇[012-P2P加速Docker镜像分发(阿里Dragonfly)](https://juejin.im/post/5c98a8e9f265da60e346fe04) ,讲解了如何快速搭建
Dragonfly,但是访问的是公开镜像，本文主要讲解如何下载私有镜像。

### 实验环境

#### 主机

| 类型 | 主机名 | 系统 | ip | docker version |
| --- | --- | --- | --- | --- |
| supernode | d7y-1 | Ubuntu Server 16.04.6 LTS X64 | 192.168.0.75 | 17.06.2ubuntu |
| clinet1 | d7y-2 | Ubuntu Server 16.04.6 LTS X64 | 192.168.0.76 | 17.06.2ubuntu |
| clinet2 | d7y-3 | Ubuntu Server 16.04.6 LTS X64 | 192.168.0.77 | 17.06.2ubuntu |

#### 私有registry

本次以[阿里云私有镜像库](https://cr.console.aliyun.com/cn-qingdao/instances/repositories)为例，可以自行开通。

#### 文档之坑

官方文档比较简单,甚至带有误导性，下意识的以为应该在dfdaemon节点上配置auth信息，并且配的是真实的私有registry，如果真这么搞了，肯定被坑。
（但是也能解释通，比较绕，dfdaemon本身就是一个伪装成registry，用来加速私有registry，那么登陆信息就应该换成dfdaemon ip，只是示例不太恰当而
已，对初学者相当不友好倒是真的）

![image.png](docs.png)

### supernode步骤

#### 安装supernode

<!-- markdownlint-disable -->
```bash
root@d7y-1:~# docker run --name dragonfly-supernode --restart=always \
              -d -p 8001:8001 -p 8002:8002 -v /data/dragonfly/supernode:/home/admin/supernode \
              registry.cn-hangzhou.aliyuncs.com/dragonflyoss/supernode:0.3.0 \
              -Dsupernode.advertiseIp=192.168.0.75

root@d7y-1:~# docker ps
CONTAINER ID        IMAGE                                                            COMMAND                  CREATED              STATUS              PORTS                              NAMES
be7fb931db0b        registry.cn-hangzhou.aliyuncs.com/dragonflyoss/supernode:0.3.0   "/bin/sh -c '/root..."   About a minute ago   Up About a minute   0.0.0.0:8001-8002->8001-8002/tcp   dragonfly-supernode

root@d7y-1:/data/dragonfly/supernode/logs# cat app.log
2019-03-30 01:04:40.065 INFO  [      main] c.d.d.s.SuperNodeStarter       - Starting SuperNodeStarter on be7fb931db0b with PID 9 (/supernode.jar started by root in /)
2019-03-30 01:04:40.069 INFO  [      main] c.d.d.s.SuperNodeStarter       - No active profile set, falling back to default profiles: default
2019-03-30 01:04:42.151 INFO  [      main] c.d.d.s.c.SupernodeProperties  - init local ip of supernode, use ip:192.168.0.75
2019-03-30 01:04:42.253 INFO  [      main] c.d.d.s.c.SupernodeProperties  - cluster members: [{"downloadPort":8001,"ip":"localhost","registerPort":8002}]
2019-03-30 01:04:42.263 INFO  [      main] c.d.d.s.c.util.MonitorService  - available processors count is 4
2019-03-30 01:04:42.272 ERROR [  Thread-2] c.d.d.s.c.util.MonitorService  - process fields:null error
java.io.IOException: Cannot run program "tsar": error=2, No such file or directory
	at java.lang.ProcessBuilder.start(ProcessBuilder.java:1048)
	at java.lang.Runtime.exec(Runtime.java:620)
	at java.lang.Runtime.exec(Runtime.java:450)
	at java.lang.Runtime.exec(Runtime.java:347)
	at com.dragonflyoss.dragonfly.supernode.common.util.MonitorService$1.run(MonitorService.java:56)
	at java.lang.Thread.run(Thread.java:748)
Caused by: java.io.IOException: error=2, No such file or directory
	at java.lang.UNIXProcess.forkAndExec(Native Method)
	at java.lang.UNIXProcess.<init>(UNIXProcess.java:247)
	at java.lang.ProcessImpl.start(ProcessImpl.java:134)
	at java.lang.ProcessBuilder.start(ProcessBuilder.java:1029)
	... 5 common frames omitted
2019-03-30 01:04:43.507 INFO  [      main] c.d.d.s.SuperNodeStarter       - Started SuperNodeStarter in 3.906 seconds (JVM running for 4.59)
2019-03-30 01:04:49.472 INFO  [  spring-1] c.d.d.s.s.p.PreheatServiceImpl - deleteExpiresPreheatTask, count:0
```
<!-- markdownlint-restore -->

从 `2019-03-30 01:04:42.151 INFO  [      main] c.d.d.s.c.SupernodeProperties  - init local ip of supernode, use ip:192.168.0.75`
看，启动ip设置成功.

注意，官方的镜像没改时区，默认是UTC时间，比北京东八区早8小时。

#### 登陆私有registry并推送镜像

```bash
root@d7y-1:~# docker login https://registry.cn-qingdao.aliyuncs.com
Username: //你阿里云账号
Password: //你阿里云密码
Login Succeeded
root@d7y-1:~# docker pull nginx:alpine
root@d7y-1:~# docker tag nginx:alpine registry.cn-qingdao.aliyuncs.com/d7y-test/nginx:alpine
root@d7y-1:~# docker push registry.cn-qingdao.aliyuncs.com/d7y-test/nginx:alpine
alpine: digest: sha256:857e6f195df0e9b497be0c7fad0f013126407aaeb71edcef66a24e8b990d94b3 size: 1153
```

### dfdaemon 步骤

#### 安装dfdaemon

在两台client节点分别执行如下命令

<!-- markdownlint-disable -->
```bash
root@d7y-2:~# cat <<EOD >/etc/dragonfly.conf
[node]
address=192.168.0.75
EOD
root@d7y-2:~# docker run --name dragonfly-dfclient --restart=always \
						-d -p 65001:65001 -v /root/.small-dragonfly:/root/.small-dragonfly \
            -v /etc/dragonfly.conf:/etc/dragonfly.conf dragonflyoss/dfclient:v0.3.0 \
            --registry=https://registry.cn-qingdao.aliyuncs.com  --ratelimit 100M
Unable to find image 'dragonflyoss/dfclient:v0.3.0' locally
v0.3.0: Pulling from dragonflyoss/dfclient
169185f82c45: Pull complete
f58f64214283: Pull complete
bd8f062dc2d2: Pull complete
Digest: sha256:5bcabd5b34f4da0c2d489c8f99a23a401fb9ec57e54d4fa90457a93c5a85371f
Status: Downloaded newer image for dragonflyoss/dfclient:v0.3.0
b491e90489a584119b82ca934cf2ae087abc136f7f9de3542e14fb12bc1c7512

root@d7y-2:~# cat <<EOD >/etc/docker/daemon.json
{
"registry-mirrors": ["http://127.0.0.1:65001"]
}
EOD
root@d7y-2:~# systemctl restart docker

root@d7y-2:~# docker ps
CONTAINER ID        IMAGE                          COMMAND                  CREATED             STATUS              PORTS                      NAMES
b491e90489a5        dragonflyoss/dfclient:v0.3.0   "/dfclient/dfdaemo..."   28 seconds ago      Up 4 seconds        0.0.0.0:65001->65001/tcp   dragonfly-dfclient

root@d7y-2:~/.small-dragonfly/logs# cat dfdaemon.log
2019-03-30 01:18:21.331 INFO sign:1 : init...
2019-03-30 01:18:21.331 INFO sign:1 : rotate log routine start...
2019-03-30 01:18:21.338 INFO sign:1 : dfget version:
2019-03-30 01:18:21.338 ERRO sign:1 : init properties failed:open /etc/dragonfly/dfdaemon.yml: no such file or directory
2019-03-30 01:18:21.338 INFO sign:1 : init properties:{"Registries":[{"Schema":"https","Host":"registry.cn-qingdao.aliyuncs.com","Certs":null,"Regx":"(^localhost$)|(^127.0.0.1$)|(^127.0.0.1$)"}]}
2019-03-30 01:18:21.338 INFO sign:1 : init finish
2019-03-30 01:18:21.338 INFO sign:1 : start dfdaemon param: &{DfPath:/dfclient/dfget DFRepo:/root/.small-dragonfly/dfdaemon/data/ RateLimit:100M CallSystem:com_ops_dragonfly URLFilter:Signature&Expires&OSSAccessKeyId Notbs:true MaxProcs:4 Version:false Verbose:false HostIP:127.0.0.1 Port:65001 Registry:https://registry.cn-qingdao.aliyuncs.com DownRule: CertFile: KeyFile: TrustHosts:[] ConfigPath:/etc/dragonfly/dfdaemon.yml}
2019-03-30 01:18:21.338 INFO sign:1 : launch dfdaemon http server on 127.0.0.1:65001
```
<!-- markdownlint-restore -->

#### 登陆dfdaemon

```bash
root@d7y-2:~# docker login http://127.0.0.1:65001
Username: //你阿里云账号
Password: //你阿里云密码
Login Succeeded
root@d7y-2:~# cat ~/.docker/config.json
{
	"auths": {
		"127.0.0.1:65001": {
			"auth": "zzxxxxxx="
		}
	}
}

```

#### pull 私有镜像

```bash
root@d7y-2:~# docker pull 127.0.0.1:65001/d7y-test/nginx:alpine
alpine: Pulling from d7y-test/nginx
8e402f1a9c57: Pull complete
56b0d9b69cc9: Pull complete
b66c8bb200cc: Pull complete
4ec77fc9c55f: Pull complete
Digest: sha256:857e6f195df0e9b497be0c7fad0f013126407aaeb71edcef66a24e8b990d94b3
Status: Downloaded newer image for 127.0.0.1:65001/d7y-test/nginx:alpine
```

可以通过iftop 等命令，观察流量。

### 其他

#### 排错

如果有遇到其他问题，可以通过查看日志来获取更多信息。

```bash
dfdaemon log : /root/.small-dragonfly/logs/{dfclient.log,dfdaemon.log,dfserver.log}
supernode log: /home/admin/supernode/{app.log,data-gc.log,downloader.log,piece-hit.log,space-gc.log}
```

#### 公开和私有registry混用

如果大量都是私有registry的话，可以在/etc/docker/daemon.json 中配置dfdaemon和加速器，如果是一半一半的话，那就干脆起两个dfdaemon就行了，
一个--registry写私有的，一个--registry写公有的，然后也是配置 /etc/docker/daemon.json

```bash
cat /etc/docker/daemon.json
{
  "registry-mirrors": ["http://127.0.0.1:65001","https://xxx.mirror.aliyuncs.com"],
  "dns": ["223.5.5.5"]
}
```

#### 吐槽

再次吐槽一下d7y的产品很好，解决了很大问题。但是这文档，真心不是给新手看的。从未见过如此坑多且深的文档。没见过哪家quick start 写的这么复杂。

#### 鸣谢

非常感谢钉钉群内的 d7y 的 contributor [太云-lowzj](https://github.com/lowzj) 耐心解答，从开始研究d7y开始，
遇到的很多坑都是在 [太云-lowzj](https://github.com/lowzj) 帮助下蹚过去的。但是还是觉得，如果文档足够友好，肯定会减少群内被打扰的次数，
进而节省自己时间的。

![image.png](dingtalk_group_chat.png)

### 招聘小广告

山东济南的小伙伴欢迎投简历啊 [加入我们](https://www.zhipin.com/gongsi/e78fa84f96fef4e733J60tq8EA~~.html) , 一起搞事情。

长期招聘，Java程序员，大数据工程师，运维工程师，前端工程师。
