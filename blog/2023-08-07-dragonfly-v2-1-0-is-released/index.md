---
title:  Dragonfly v2.1.0 is released!
tags: [dragonfly, container image, OCI, nydus, nydus-snapshotter, containerd]
hide_table_of_contents: false
---

<!-- Posted on August 7, 2023 -->

[CNCF projects highlighted in this post](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/), and migrated by [mingcheng](https://github.com/mingcheng).

 <!-- [![Dragonfly logo](https://landscape.cncf.io/logos/60b07adb6812ca92688c7a1c33b13001022b0dd73cd3b8e64a415e4f003cde16.svg)](https://www.cncf.io/projects/dragonfly "Go to Dragonfly")[![Volcano logo](https://landscape.cncf.io/logos/45984434efdb609308838359d65422b44b2c60579df44a3f56c642b4161660d1.svg)](https://www.cncf.io/projects/volcano "Go to Volcano") -->

<!-- _Project post from the Dragonfly maintainers_ -->

Dragonfly v2.1.0 is released! 🎉🎉🎉 Thanks to the Xinxin Zhao[\[1\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn1) for helping to refactor the console[\[2\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn2) and the manager provides a new console for users to operate Dragonfly. Welcome to visit d7y.io[\[3\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn3) website.

![Announcement screenshot from Github mentioning "Dragonfly v2.1.0 is released!"](https://www.cncf.io/wp-content/uploads/2023/08/image-14.png)

## [#features](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#features) Features

- Console v1.0.0[\[4\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn4) is released and it provides a new console for users to operate Dragonfly.
- Add network topology feature and it can probe the network latency between peers, providing better scheduling capabilities.
- Provides the ability to control the features of the scheduler in the manager. If the scheduler preheat feature is not in feature flags, then it will stop providing the preheating in the scheduler.
- dfstore adds GetObjectMetadatas and CopyObject to supports using Dragonfly as the JuiceFS backend.
- Add personal access tokens feature in the manager and personal access token contains your security credentials for the restful open api.
- Add TLS config to manager rest server.
- Fix dfdaemon fails to start when there is no available scheduler address.
- Add cluster in the manager and the cluster contains a scheduler cluster and a seed peer cluster.
- Fix object downloads failed by dfstore when dfdaemon enabled concurrent.
- Scheduler adds database field in config and moves the redis config to database field.
- Replace net.Dial with grpc health check in dfdaemon.
- Fix filtering and evaluation in scheduling. Since the final length of the filter is the candidateParentLimit used, the parents after the filter is wrong.
- Fix storage can not write records to file when bufferSize is zero.
- Hiding sensitive information in logs, such as the token in the header.
- Use unscoped delete when destroying the manager’s resources.
- Add uk\_scheduler index and uk\_seed\_peer index in the table of the database.
- Remove security domain feature and security feature in the manager.
- Add advertise port config to manager and scheduler.
- Fix fsm changes state failed when register task.

## [#break-change](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#break-change) Break Change

- The M:N relationship model between the scheduler cluster and the seed peer cluster is no longer supported. In the future, a P2P cluster will be a cluster in the manager, and a cluster will only include a scheduler cluster and a seed peer cluster.

## [#console](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#console) Console

![Screenshot showing Dragonfly Console welcome back page](https://www.cncf.io/wp-content/uploads/2023/08/image-13.png)

You can see Manager Console[\[5\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn5) for more details.

## [#ai-infrastructure](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#ai-infrastructure) AI Infrastructure

- Triton Inference Server[\[6\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn6) uses Dragonfly to distribute model files, refer to #2185[\[7\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn7). If there are developers who are interested in the drgaonfly repository agent[\[8\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn8) project, please contact [gaius.qi@gmail.com](mailto:gaius.qi@gmail.com).
- TorchServer[\[9\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn9) uses Dragonfly to distribute model files. Developers have already participated in the dragonfly endpoint[\[10\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn10) project, and the feature will be released in v2.1.1.
- Fluid[\[11\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn11) downloads data through Dragonfly when running based on JuiceFS[\[12\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn12), the feature will be released in v2.1.1.
- Dragonfly helps Volcano Engine AIGC inference to accelerate image through p2p technology[\[13\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn13).
- There have been many cases in the community, using Dragonfly to distribute data in AI scenarios based on P2P technology. In the inference stage, the concurrent download model of the inference service can effectively relieve the bandwidth pressure of the model registry through Dragonfly, and improving the download speed. Community will share topic 《Dragonfly: Intro, Updates and AI Model Distribution in the Practice of Kuaishou – Wenbo Qi, Ant Group & Zekun Liu, Kuaishou Technology》[\[14\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn14) with Kuaishou[\[15\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn15) in KubeCon + CloudNativeCon + Open Source Summit China 2023[\[16\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn16), please follow if interested.

## [#maintainers](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#maintainers) Maintainers

The community has added four new Maintainers, hoping to help more contributors participate in community.

- Yiyang Huang[\[17\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn17): He works for Volcano Engine and will focus on the engineering work for Dragonfly.
- Manxiang Wen[\[18\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn18): He works for Baidu and will focus on the engineering work for Dragonfly.
- Mohammed Farooq[\[19\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn19) He works for Intel and will focus on the engineering work for Dragonfly.
- Zhou Xu[\[20\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn20): He is a PhD student at Dalian University of Technology and will focus on the intelligent scheduling algorithms.

## [#others](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#others) Others

You can see CHANGELOG[\[21\]](https://www.cncf.io/blog/2023/08/07/dragonfly-v2-1-0-is-released/#fn21) for more details.
