# HistoryApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**historyGet**](#historyget) | **GET** /history | Get tests history|
|[**historyTestIdGet**](#historytestidget) | **GET** /history/{testId} | Get test history|
|[**historyTestIdSessionIdGet**](#historytestidsessionidget) | **GET** /history/{testId}/{sessionId} | Get test session overview|

# **historyGet**
> Array<TestLaunchResponse> historyGet()

Get finished launches across all tests owned by the current user, ordered by started_at descending.

### Example

```typescript
import {
    HistoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HistoryApi(configuration);

const { status, data } = await apiInstance.historyGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TestLaunchResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tests history |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **historyTestIdGet**
> Array<TestLaunchResponse> historyTestIdGet()

Get finished launches for a test owned by the current user, ordered by started_at descending.

### Example

```typescript
import {
    HistoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HistoryApi(configuration);

let testId: string; // (default to undefined)

const { status, data } = await apiInstance.historyTestIdGet(
    testId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**Array<TestLaunchResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test history |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **historyTestIdSessionIdGet**
> TestSessionOverviewResponse historyTestIdSessionIdGet()

Get overview for a finished test session owned by the current user, including questions and registered users with their answers.

### Example

```typescript
import {
    HistoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HistoryApi(configuration);

let testId: string; // (default to undefined)
let sessionId: string; // (default to undefined)

const { status, data } = await apiInstance.historyTestIdSessionIdGet(
    testId,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|
| **sessionId** | [**string**] |  | defaults to undefined|


### Return type

**TestSessionOverviewResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test session overview |  -  |
|**400** | Invalid or missing session id |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

