# TestExecutionApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**testExecuteTestIdGet**](#testexecutetestidget) | **GET** /test-execute/{testId} | Get test for execution|

# **testExecuteTestIdGet**
> TestExecuteResponse testExecuteTestIdGet()

Get test metadata by id for test takers.

### Example

```typescript
import {
    TestExecutionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestExecutionApi(configuration);

let testId: string; // (default to undefined)

const { status, data } = await apiInstance.testExecuteTestIdGet(
    testId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestExecuteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test found |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

