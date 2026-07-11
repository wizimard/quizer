# TestExecuteApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**testExecuteTestIdGet**](#testexecutetestidget) | **GET** /test-execute/{testId} | Get test for execution|
|[**testExecuteTestIdQuestionIdGet**](#testexecutetestidquestionidget) | **GET** /test-execute/{testId}/{questionId} | Get question for execution|
|[**testExecuteTestIdQuestionIdPost**](#testexecutetestidquestionidpost) | **POST** /test-execute/{testId}/{questionId} | Submit answer|

# **testExecuteTestIdGet**
> TestExecuteResponse testExecuteTestIdGet()

Public test metadata for execution (no authentication required).

### Example

```typescript
import {
    TestExecuteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestExecuteApi(configuration);

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
|**404** | Test not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testExecuteTestIdQuestionIdGet**
> QuestionExecuteResponse testExecuteTestIdQuestionIdGet()

Get a test question without the correct answer (no authentication required).

### Example

```typescript
import {
    TestExecuteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestExecuteApi(configuration);

let testId: string; // (default to undefined)
let questionId: string; // (default to undefined)

const { status, data } = await apiInstance.testExecuteTestIdQuestionIdGet(
    testId,
    questionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|
| **questionId** | [**string**] |  | defaults to undefined|


### Return type

**QuestionExecuteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Question found |  -  |
|**404** | Test or question not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testExecuteTestIdQuestionIdPost**
> AnswerEvaluationResponse testExecuteTestIdQuestionIdPost(questionAnswerSubmitRequestBody)

Evaluate a submitted answer for a test question (no authentication required).

### Example

```typescript
import {
    TestExecuteApi,
    Configuration,
    QuestionAnswerSubmitRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestExecuteApi(configuration);

let testId: string; // (default to undefined)
let questionId: string; // (default to undefined)
let questionAnswerSubmitRequestBody: QuestionAnswerSubmitRequestBody; //

const { status, data } = await apiInstance.testExecuteTestIdQuestionIdPost(
    testId,
    questionId,
    questionAnswerSubmitRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionAnswerSubmitRequestBody** | **QuestionAnswerSubmitRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|
| **questionId** | [**string**] |  | defaults to undefined|


### Return type

**AnswerEvaluationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Answer evaluated |  -  |
|**404** | Test or question not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

