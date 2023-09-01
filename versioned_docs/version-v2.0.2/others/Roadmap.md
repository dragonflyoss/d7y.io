---
id: Roadmap
title: Roadmap
---

## 2022 Roadmap {#2022-roadmap}

### Manager {#manager}

- Console
  - Refactor project.
  - Optimize permissions management.
  - Optimize console UI, page visual revision.
  - Add actions such as lint and test.
  - Add development documentation.
  - Add dynamic configurations.
  - Added P2P data visualization.
- Provides initial installation page.
- Optimized calculations to match scheduler cluster rules.
- Common configurations are managed dynamically through the manager.
- Application-level speed limit and other configurations.
- Added open api interface authentication.

### Scheduler {#scheduler}

- Improve scheduling stability and collect metrics during scheduling.
- Scheduler integrates machine learning algorithms to improve scheduling capabilities.
- Allocate download peers based on peer bandwidth traffic.

### Dfdaemon {#wip-dfdaemon}

- Improve task download efficiency and stability.
- Refactoring to use GRPC bidirectional stream for piece information passing between peers.
- Support piece download priority.

### CDN {#cdn}

- Improve file data download efficiency
- Improve cache utilization of stored data files
- Provides piece information using GRPC bidirectional streaming
- Support custom file transfer protocol

### Document {#document}

- Refactored d7y.io website and added dragonfly 2.0 documentation.

### Others {#others}

- Provide performance testing solutions in perf-tests repo.
- Upgrade golang 1.18, refactor the project using the generic feature.
