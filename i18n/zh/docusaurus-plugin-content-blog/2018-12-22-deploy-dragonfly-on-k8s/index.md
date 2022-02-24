---
title: 在Kubernetes上部署Dragonfly
author: shenlanse
tags: [kubernetes, dragonfly]
description: 本文介绍如何在Kubernetes上部署Dragonfly，包括supernode，dfdaemon，dfget。
hide_table_of_contents: false
---

## 在Kubernetes上部署Dragonfly

### 1 说明

- `supernode` 组件至少需要两节点部署，hostnetwork，一般部署在管理节点，比如k8s master上。
- `supernode` 需要使用8001、8002端口。如果跟kube-apiserver部署在一个节点上，需要确保不要有端口冲突。
- `supernode` 所在节点对网络带宽、磁盘空间、磁盘IO要求较高。
- `dfdaemon` 组件使用daemonset部署在所有的node节点上，hostnetwork，占用65001端口
- 需要修改所有node的docker启动参数 `--registry-mirror http://127.0.0.1:65001`。

### 2 部署

其中 `supernode` 部署在管理节点，`dfget` 和`dfdaemon` 部署在所有的node上面。

#### 2.1 supernode

三种部署方式：

- 直接跑docker 容器
- kubelet管理静态pod
- deployment部署

> NOTE： 官方提供的镜像是0.2.0，继委自己打了个0.3.0的镜像，这个镜像是基于master分支的。问了一下已经部署上线蜻蜓的去哪儿网和美团的工程师，
> 他们用的是官方的0.2.0镜像。

##### 2.1.1 docker容器

```bash
docker run -d -p 8001:8001 -p 8002:8002 -v /data/log/supernode/:/home/admin/supernode/logs/ \
  -v /data/supernode/repo/:/home/admin/supernode/repo/ hub.c.163.com/hzlilanqing/supernode:0.3.0
```

##### 2.1.2 静态pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: supernode
  namespace: kube-system
spec:
  containers:
  - image: hub.c.163.com/hzlilanqing/supernode:0.3.0
    name: supernode
    ports:
    - containerPort: 8080
      name: tomcat
    - containerPort: 8001
      name: register
    - containerPort: 8002
      name: download
    resources:
      requests:
        cpu: "2"
        memory: 4Gi
    volumeMounts:
    - mountPath: /etc/localtime
      name: ltime
    - mountPath: /home/admin/supernode/logs/
      name: log
    - mountPath: /home/admin/supernode/repo/
      name: data
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
  restartPolicy: Always
  tolerations:
  - effect: NoExecute
    operator: Exists
  - effect: NoSchedule
    operator: Exists
  nodeSelector:
    node-role.kubernetes.io/master: ""
  volumes:
  - hostPath:
      path: /etc/localtime
    name: ltime
  - hostPath:
      path: /data/log/supernode
    name: log
  - hostPath:
      path: /data/supernode/repo/
    name: data
```

##### 2.1.3 deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: supernode
  name: supernode
  namespace: kube-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app: supernode
  template:
    metadata:
      labels:
        app: supernode
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ""
    spec:
      containers:
      - image: hub.c.163.com/hzlilanqing/supernode:0.3.0
        name: supernode
        ports:
        - containerPort: 8080
          hostPort: 8080
          name: tomcat
          protocol: TCP
        - containerPort: 8001
          hostPort: 8001
          name: register
          protocol: TCP
        - containerPort: 8002
          hostPort: 8002
          name: download
          protocol: TCP
        resources:
          requests:
            cpu: "2"
            memory: 4Gi
        volumeMounts:
        - mountPath: /etc/localtime
          name: ltime
        - mountPath: /home/admin/supernode/logs/
          name: log
        - mountPath: /home/admin/supernode/repo/
          name: data
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      restartPolicy: Always
      tolerations:
      - effect: NoExecute
        operator: Exists
      - effect: NoSchedule
        operator: Exists
      nodeSelector:
        node-role.kubernetes.io/master: ""
      volumes:
      - hostPath:
          path: /etc/localtime
          type: ""
        name: ltime
      - hostPath:
          path: /data/log/supernode
          type: ""
        name: log
      - hostPath:
          path: /data/supernode/repo/
          type: ""
        name: data

---

kind: Service
apiVersion: v1
metadata:
  name: supernode
  namespace: kube-system
spec:
  selector:
    app: supernode
  ports:
  - name: register
    protocol: TCP
    port: 8001
    targetPort: 8001
  - name: download
    protocol: TCP
    port: 8002
    targetPort: 8002

```

##### 2.2 dfget & dfdaemon

- **Dockerfile**

```dockerfile
FROM debian:7

MAINTAINER "hzlilanqing@corp.netease.com"

RUN apt-get update && apt-get install -y python wget && \
    wget http://dragonfly-os.oss-cn-beijing.aliyuncs.com/df-client_0.2.0_linux_amd64.tar.gz  && \
    tar -zxf df-client_0.2.0_linux_amd64.tar.gz && \
    cp -R df-client/- /usr/local/bin/ && \
    rm -rf df-client_0.2.0_linux_amd64.tar.gz df-client

COPY ./dragonfly.conf /etc/

EXPOSE 65001

CMD ["/bin/sh","-c","/usr/local/bin/dfdaemon --registry https://hub.c.163.com"]
```

- **dragonfly.conf**

```ini
    [node]
    address=<supernode_address>
```

- **构建镜像**

```bash
docker build -t dfdaemon:0.2.0 .
```

使用daemonset部署，需要使用hostnetwork，占用端口65001，并且需要准备一个configmap将dragonflg.conf挂载到容器的/etc/目录下面：

```ini
## 这个配置需要是`supernode` 的域名
## cat dragonfly.conf
[node]
address=<supernode_address>

## kubectl -n kube-system create configmap dragonfly-conf --from-file=dragonfly.conf
```

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: dfdaemon
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: dfdaemon
  template:
    metadata:
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ""
      labels:
        app: dfdaemon
    spec:
      containers:
      - image: hub.c.163.com/hzlilanqing/dfdaemon:0.2.0
        name: dfdaemon
        imagePullPolicy: IfNotPresent
        resources:
          requests:
            cpu: 250m
        volumeMounts:
        - mountPath: /etc/dragonfly.conf
          subPath: dragonfly.conf
          name: dragonconf
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      restartPolicy: Always
      tolerations:
      - effect: NoExecute
        operator: Exists
      - effect: NoSchedule
        operator: Exists
      volumes:
      - name: dragonconf
        configMap:
          name: dragonfly-conf
          items:
          - key: dragonfly.conf
            path: dragonfly.conf
```

##### 2.3 docker启动参数设置

设置启动参数 `registry-mirror`，其中`65001`是`dfdaemon`的服务端口:

- 方法1: 修改`/etc/systemd/system/multi-user.target.wants/docker.service`

    ```bash
    ExecStart=/usr/bin/dockerd -H fd:// --registry-mirror http://127.0.0.1:65001
    ```

- 方法2: 修改`/etc/docker/daemon.json`

    ```json
    {
      "registry-mirrors": ["http://127.0.0.1:65001"]
    }
    ```

### 附录

完整的部署yaml：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: supernode
  name: supernode
  namespace: kube-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app: supernode
  template:
    metadata:
      labels:
        app: supernode
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ""
    spec:
      containers:
      - image: hub.c.163.com/hzlilanqing/supernode:0.3.0
        name: supernode
        ports:
        - containerPort: 8080
          hostPort: 8080
          name: tomcat
          protocol: TCP
        - containerPort: 8001
          hostPort: 8001
          name: register
          protocol: TCP
        - containerPort: 8002
          hostPort: 8002
          name: download
          protocol: TCP
        resources:
          requests:
            cpu: "2"
            memory: 4Gi
        volumeMounts:
        - mountPath: /etc/localtime
          name: ltime
        - mountPath: /home/admin/supernode/logs/
          name: log
        - mountPath: /home/admin/supernode/repo/
          name: data
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      restartPolicy: Always
      tolerations:
      - effect: NoExecute
        operator: Exists
      - effect: NoSchedule
        operator: Exists
      nodeSelector:
        node-role.kubernetes.io/master: ""
      volumes:
      - hostPath:
          path: /etc/localtime
          type: ""
        name: ltime
      - hostPath:
          path: /data/log/supernode
          type: ""
        name: log
      - hostPath:
          path: /data/supernode/repo/
          type: ""
        name: data

---

kind: Service
apiVersion: v1
metadata:
  name: supernode
  namespace: kube-system
spec:
  selector:
    app: supernode
  ports:
  - name: register
    protocol: TCP
    port: 8001
    targetPort: 8001
  - name: download
    protocol: TCP
    port: 8002
    targetPort: 8002

---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: dfdaemon
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: dfdaemon
  template:
    metadata:
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ""
      labels:
        app: dfdaemon
    spec:
      containers:
      - image: hub.c.163.com/hzlilanqing/dfdaemon:0.2.0
        name: dfdaemon
        imagePullPolicy: IfNotPresent
        resources:
          requests:
            cpu: 250m
        volumeMounts:
        - mountPath: /etc/dragonfly.conf
          subPath: dragonfly.conf
          name: dragonconf
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      restartPolicy: Always
      tolerations:
      - effect: NoExecute
        operator: Exists
      - effect: NoSchedule
        operator: Exists
      volumes:
      - name: dragonconf
        configMap:
          name: dragonfly-conf
          items:
          - key: dragonfly.conf
            path: dragonfly.conf

---
apiVersion: v1
data:
  dragonfly.conf: |
    [node]
    address=supernode
kind: ConfigMap
metadata:
  name: dragonfly-conf
  namespace: kube-system
```

### 参考文档

> 1. <https://d7y.io/>
