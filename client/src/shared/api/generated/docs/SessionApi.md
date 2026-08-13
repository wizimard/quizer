# SessionApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**sessionTestIdFinishPost**](#sessiontestidfinishpost) | **POST** /session/{testId}/finish | Finish test|
|[**sessionTestIdNextQuestionPost**](#sessiontestidnextquestionpost) | **POST** /session/{testId}/next-question | Move to next question|
|[**sessionTestIdOverviewGet**](#sessiontestidoverviewget) | **GET** /session/{testId}/overview | Get test execution overview|
|[**sessionTestIdStartPost**](#sessiontestidstartpost) | **POST** /session/{testId}/start | Start test|

# **sessionTestIdFinishPost**
> TestFinishResponse sessionTestIdFinishPost()

Close an active test session and return the finished session id.

### Example

```typescript
import {
    SessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SessionApi(configuration);

let testId: string; // (default to undefined)

const { status, data } = await apiInstance.sessionTestIdFinishPost(
    testId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestFinishResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test finished |  -  |
|**400** | Test is closed or has no active session |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sessionTestIdNextQuestionPost**
> TestExecutionOverviewResponse sessionTestIdNextQuestionPost(testNextQuestionRequestBody)

Set the current question for a MANUAL run mode session and return the updated execution overview.

### Example

```typescript
import {
    SessionApi,
    Configuration,
    TestNextQuestionRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new SessionApi(configuration);

let testId: string; // (default to undefined)
let testNextQuestionRequestBody: TestNextQuestionRequestBody; //

const { status, data } = await apiInstance.sessionTestIdNextQuestionPost(
    testId,
    testNextQuestionRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testNextQuestionRequestBody** | **TestNextQuestionRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestExecutionOverviewResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Updated test execution overview |  -  |
|**400** | Test is closed or has no active session |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sessionTestIdOverviewGet**
> TestExecutionOverviewResponse sessionTestIdOverviewGet()

Get execution overview for a test owned by the current user, including questions and registered users with their answers. MANUAL run mode also includes current question progress fields.

### Example

```typescript
import {
    SessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SessionApi(configuration);

let testId: string; // (default to undefined)

const { status, data } = await apiInstance.sessionTestIdOverviewGet(
    testId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestExecutionOverviewResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test execution overview |  -  |
|**400** | Test is closed or has no active session |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sessionTestIdStartPost**
> MessageResponse sessionTestIdStartPost()

Open test for execution.

### Example

```typescript
import {
    SessionApi,
    Configuration,
    TestStartRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new SessionApi(configuration);

let testId: string; // (default to undefined)
let testStartRequestBody: TestStartRequestBody; // (optional)

const { status, data } = await apiInstance.sessionTestIdStartPost(
    testId,
    testStartRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testStartRequestBody** | **TestStartRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**MessageResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test started |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

