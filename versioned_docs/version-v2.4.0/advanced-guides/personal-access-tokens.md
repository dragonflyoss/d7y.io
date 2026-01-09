---
id: personal-access-tokens
title: Personal Access Tokens
slug: /advanced-guides/personal-access-tokens/
---

You can use a personal access token to call open API.

In this article, you will learn how to create, use, modify and delete personal access token.

## About personal access tokens

Only users with `root` role can list all personal access tokens.

![tokens](../resource/advanced-guides/personal-access-tokens/tokens.png)

## Create personal access token

Click the `ADD PERSONAL ACCESS TOKENS` button to create personal access token.

**Name**: Set your token a descriptive name.

**Description**: Set a description.

**Expiration**: Set your token an expiration.

**Scopes**: Select the access permissions for the token.

![create-token](../resource/advanced-guides/personal-access-tokens/create-token.png)

Click `SAVE` and copy the token and store it. For your security, it doesn't display again.

![copy-token](../resource/advanced-guides/personal-access-tokens/copy-token.png)

## Update personal access token

Click `personal access token name` and update your personal access token.

![update-token](../resource/advanced-guides/personal-access-tokens/update-token.png)

## Delete personal access token

Click `DELETE` and delete your personal access token.

![delete-token](../resource/advanced-guides/personal-access-tokens/delete-token.png)

## Use personal access token

### Add personal access token to Authorization header

**Step 1:** Open Postman, and import [postman_collection.json](https://github.com/gaius-qi/dragonfly-docs/blob/main/manager/postman/Dragonfly.postman_collection.json).

**Step 2:** Click **Open API** in the sidebar.

**Step 3:** Click **Authorization** and select **Bearer Token**, paste `personal access token` in `Token`.

![add-token-to-open-api](../resource/advanced-guides/personal-access-tokens/add-token-to-open-api.png)

**Step 4:** Click **Headers**, check whether `Authorization` is added to Headers.

![verify-headers](../resource/advanced-guides/personal-access-tokens/verify-headers.png)

**Step 5:** Click **Send** button to initiate a request.

**Step 6:** If successful, it means that the call to the open API is completed through the personal access token.

![verify-request](../resource/advanced-guides/personal-access-tokens/verify-request.png)

### Add personal access token to URL query parameter

**Step 1:** Open Postman, and import [postman_collection.json](https://github.com/gaius-qi/dragonfly-docs/blob/main/manager/postman/Dragonfly.postman_collection.json).

**Step 2:** Click **Open API** in the sidebar.

**Step 3:** Add `access_token=your_personal_access_token` to URL query parameter.

![add-token-to-open-api-query-parameter](../resource/advanced-guides/personal-access-tokens/add-token-to-open-api-query-parameter.jpg)

**Step 4:** Click **Send** button to initiate a request.

**Step 5:** If successful, it means that the call to the open API is completed through the personal access token.

![verify-request-query-parameter](../resource/advanced-guides/personal-access-tokens/verify-request-query-parameter.jpg)
