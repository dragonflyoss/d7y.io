---
id: Roadmap
title: Roadmap
---

## v2.0

Manager:

- Console
  - Refactor project.
  - Optimize permissions management.
  - Optimize console UI, page visual revision.
  - Add actions such as lint and test.
  - Add development documentation.
  - Add dynamic configurations.
  - Add P2P data visualization.
- Provides initial installation page.
- Optimized calculations to match scheduler cluster rules.
- Common configurations are managed dynamically through the manager.
- Application-level speed limit and other configurations.
- Added open api interface authentication.

Scheduler:

- Improve scheduling stability and collect metrics during scheduling.
- Scheduler integrates machine learning algorithms to improve scheduling capabilities.
- Allocate download peers based on peer bandwidth traffic.

Client:

- Support seed peer feature.
- Improve task download efficiency and stability.
- Refactoring to use GRPC bidirectional stream for piece information passing between peers.
- Support piece download priority.

Document:

- Refactored d7y.io website and added dragonfly 2.0 documentation.

Others:

- Provide performance testing solutions in perf-tests repo.
- Upgrade golang 1.18, refactor the project using the generic feature.

## v2.1

Manager:

- Console [v1.0.0](https://github.com/dragonflyoss/console/tree/release-1.0.0) is released and it provides
  a new console for users to operate Dragonfly.
- Provides the ability to control the features of the scheduler in the manager. If the scheduler preheat feature is
  not in feature flags, then it will stop providing the preheating in the scheduler.
- Add personal access tokens feature in the manager and personal access token
  contains your security credentials for the restful open api.
- Add TLS config to manager rest server.
- Add cluster in the manager and the cluster contains a scheduler cluster and a seed peer cluster.
- Use unscoped delete when destroying the manager's resources.
- Add uk_scheduler index and uk_seed_peer index in the table of the database.
- Remove security domain feature and security feature in the manager.
- Add advertise port config.

Scheduler:

- Add network topology feature and it can probe the network latency between peers, providing better scheduling capabilities.
- Scheduler adds database field in config and moves the redis config to database field.
- Fix filtering and evaluation in scheduling. Since the final length of the filter is
  the candidateParentLimit used, the parents after the filter is wrong.
- Fix storage can not write records to file when bufferSize is zero.
- Add advertise port config.
- Fix fsm changes state failed when register task.

Client:

- Dfstore adds GetObjectMetadatas and CopyObject to supports using Dragonfly as the JuiceFS backend.
- Fix dfdaemon fails to start when there is no available scheduler address.
- Fix object downloads failed by dfstore when dfdaemon enabled concurrent.
- Replace net.Dial with grpc health check in dfdaemon.

Others:

- A third party security audit was performed by Trail of Bits, you can see the full report [here](https://github.com/dragonflyoss/dragonfly/blob/main/docs/security/dragonfly-comprehensive-report-2023.pdf).
- Hiding sensitive information in logs, such as the token in the header.

## v2.2

Manager:

- Peer features are configurable. For example, you can make the peer can not be uploaded and can only be downloaded.
- Configure the weight of the scheduling.
- Add clearing P2P task cache.
- Display P2P traffic distribution.
- Peer information display, including CPU, Memory, etc.

Scheduler:

- Provide metadata storage to support file writing and seeding.
- Optimize scheduling algorithm and improve bandwidth utilization in the P2P network.

Client:

- Client written in Rust, reduce CPU usage and Memory usage.
- Supports RDMA for faster network transmission in the P2P network.
  It can better support the loading of AI inference models into memory.
- Supports file writing and seeding, it can be accessed in the P2P cluster without uploading to other storage.
  Helps AI models and AI datasets to be read and written faster in the P2P network.

Others:

- Defines the V2 of the P2P transfer protocol.

Document:

- Restructure the document to make it easier for users to use.
- Enhance the landing page UI.

AI Infrastructure:

- Supports Triton Inference Server to accelerate model distribution, refer to [dragonfly-repository-agent](https://github.com/dragonflyoss/dragonfly-repository-agent).
- Supports TorchServer to accelerate model distribution, refer to [document](../operations/integrations/torchserve.md).
- Supports HuggingFace to accelerate model distribution and dataset distribution, refer to [document](../operations/integrations/hugging-face.md).
- Supports Git LFS to accelerate file distribution, refer to [document](../operations/integrations/git-lfs.md).
- Supports JuiceFS to accelerate file downloads from object storage, JuiceFS read requests via
  peer proxy and write requests via the default client of object storage.
- Supports Fluid to accelerate model distribution.
- Support AI infrastructure to efficiently distribute models and datasets, and integrated with the AI ecosystem.
