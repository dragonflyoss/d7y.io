---
id: task
title: Task
slug: /advanced-guides/web-console/resource/task/
---

In this article, you will be shown Task page information.

## Search task

### Search by URL

**URL**: Query the task cache based on the URL.

**Tag**: When the task URL is the same but the tags are different,
they will be distinguished based on the tags, and the queried tasks will also be different.

**Application**: Caller application which is used for statistics and access control.

**Filter Query Params**: Filter the query parameters of the downloaded URL.
If the download URL is the same, it will be scheduled as the same task.

![search-task-by-url](../../../resource/advanced-guides/task/search-task-by-url.png)

### Search by Task ID

**Task ID**: Query the task cache based on the task id.

![search-task-by-task-id](../../../resource/advanced-guides/task/search-task-by-task-id.png)

### Search by Content for Calculating Task ID

**Content for Calculating Task ID**: Query the task cache based on the content for calculating task id.

![search-task-by-content-for-calculating-task-id](../../../resource/advanced-guides/task/search-by-content-for-calculating-task-id.png)

## Delete task

Click `DELETE` and delete task.

![delete-task](../../../resource/advanced-guides/task/delete-task.png)

The deleted task will not return results immediately and you need to wait.

![pending-task](../../../resource/advanced-guides/task/pending-task.png)

## Executions

Displays all deleted task.

![executions](../../../resource/advanced-guides/task/executions.png)

### Delete successfully

If the status is SUCCESS and the Failure list does not exist, it means that the deletion task is successful.

![success-task](../../../resource/advanced-guides/task/success-task.png)

### Delete failed

The Failure list will show the tasks that failed to execute.

![failure-task](../../../resource/advanced-guides/task/failure-task.png)

Click the `Description` icon to view the failure log.

![error-log](../../../resource/advanced-guides/task/error-log.png)
