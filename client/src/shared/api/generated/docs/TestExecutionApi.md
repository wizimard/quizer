# TestExecutionApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**testExecuteTestIdGet**](#testexecutetestidget) | **GET** /test-execute/{testId} | Get test for execution|
|[**testExecuteTestIdQuestionIdAnswerPost**](#testexecutetestidquestionidanswerpost) | **POST** /test-execute/{testId}/{questionId}/answer | Answer question|
|[**testExecuteTestIdRegisterPost**](#testexecutetestidregisterpost) | **POST** /test-execute/{testId}/register | Register user for test|

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

# **testExecuteTestIdQuestionIdAnswerPost**
> TestRegisteredUserResponse testExecuteTestIdQuestionIdAnswerPost(questionAnswerRequestBody)

Submit an answer for a question in an open test session.

### Example

```typescript
import {
    TestExecutionApi,
    Configuration,
    QuestionAnswerRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestExecutionApi(configuration);

let testId: string; // (default to undefined)
let questionId: string; // (default to undefined)
let questionAnswerRequestBody: QuestionAnswerRequestBody; //

const { status, data } = await apiInstance.testExecuteTestIdQuestionIdAnswerPost(
    testId,
    questionId,
    questionAnswerRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionAnswerRequestBody** | **QuestionAnswerRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|
| **questionId** | [**string**] |  | defaults to undefined|


### Return type

**TestRegisteredUserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Answer submitted |  -  |
|**400** | Test is closed |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testExecuteTestIdRegisterPost**
> TestRegisteredUserResponse testExecuteTestIdRegisterPost(testRegisterRequestBody)

Register a test taker for an open test session. Idempotent for the same first and last name within a session.

### Example

```typescript
import {
    TestExecutionApi,
    Configuration,
    TestRegisterRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestExecutionApi(configuration);

let testId: string; // (default to undefined)
let testRegisterRequestBody: TestRegisterRequestBody; //

const { status, data } = await apiInstance.testExecuteTestIdRegisterPost(
    testId,
    testRegisterRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testRegisterRequestBody** | **TestRegisterRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestRegisteredUserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User registered |  -  |
|**400** | Test is closed |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

