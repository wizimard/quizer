# QuestionApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**questionTestIdQuestionsPost**](#questiontestidquestionspost) | **POST** /question/{testId}/questions | Create question|
|[**questionTestIdQuestionsQuestionIdDelete**](#questiontestidquestionsquestioniddelete) | **DELETE** /question/{testId}/questions/{questionId} | Delete question|
|[**questionTestIdQuestionsQuestionIdOrderPatch**](#questiontestidquestionsquestionidorderpatch) | **PATCH** /question/{testId}/questions/{questionId}/order | Change question order|
|[**questionTestIdQuestionsQuestionIdPatch**](#questiontestidquestionsquestionidpatch) | **PATCH** /question/{testId}/questions/{questionId} | Update question|

# **questionTestIdQuestionsPost**
> QuestionResponse questionTestIdQuestionsPost(questionCreateRequestBody)


### Example

```typescript
import {
    QuestionApi,
    Configuration,
    QuestionCreateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionApi(configuration);

let testId: string; // (default to undefined)
let questionCreateRequestBody: QuestionCreateRequestBody; //

const { status, data } = await apiInstance.questionTestIdQuestionsPost(
    testId,
    questionCreateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionCreateRequestBody** | **QuestionCreateRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**QuestionResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Question created |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **questionTestIdQuestionsQuestionIdDelete**
> questionTestIdQuestionsQuestionIdDelete()


### Example

```typescript
import {
    QuestionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionApi(configuration);

let testId: string; // (default to undefined)
let questionId: string; // (default to undefined)

const { status, data } = await apiInstance.questionTestIdQuestionsQuestionIdDelete(
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

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No content |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **questionTestIdQuestionsQuestionIdOrderPatch**
> Array<QuestionResponse> questionTestIdQuestionsQuestionIdOrderPatch()


### Example

```typescript
import {
    QuestionApi,
    Configuration,
    QuestionChangeOrderRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionApi(configuration);

let testId: string; // (default to undefined)
let questionId: string; // (default to undefined)
let questionChangeOrderRequestBody: QuestionChangeOrderRequestBody; // (optional)

const { status, data } = await apiInstance.questionTestIdQuestionsQuestionIdOrderPatch(
    testId,
    questionId,
    questionChangeOrderRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionChangeOrderRequestBody** | **QuestionChangeOrderRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|
| **questionId** | [**string**] |  | defaults to undefined|


### Return type

**Array<QuestionResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Question order changed |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **questionTestIdQuestionsQuestionIdPatch**
> QuestionResponse questionTestIdQuestionsQuestionIdPatch(questionUpdateRequestBody)


### Example

```typescript
import {
    QuestionApi,
    Configuration,
    QuestionUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionApi(configuration);

let testId: string; // (default to undefined)
let questionId: string; // (default to undefined)
let questionUpdateRequestBody: QuestionUpdateRequestBody; //

const { status, data } = await apiInstance.questionTestIdQuestionsQuestionIdPatch(
    testId,
    questionId,
    questionUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionUpdateRequestBody** | **QuestionUpdateRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|
| **questionId** | [**string**] |  | defaults to undefined|


### Return type

**QuestionResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Question updated |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

