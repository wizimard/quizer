# DefaultApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authLoginPost**](#authloginpost) | **POST** /auth/login | Login user|
|[**authLogoutPost**](#authlogoutpost) | **POST** /auth/logout | Logout|
|[**authRefreshPost**](#authrefreshpost) | **POST** /auth/refresh | Refresh token|
|[**authRegisterPost**](#authregisterpost) | **POST** /auth/register | Register user|
|[**questionQuizIdQuestionsPost**](#questionquizidquestionspost) | **POST** /question/{quizId}/questions | Create question|
|[**questionQuizIdQuestionsQuestionIdDelete**](#questionquizidquestionsquestioniddelete) | **DELETE** /question/{quizId}/questions/{questionId} | Delete question|
|[**questionQuizIdQuestionsQuestionIdPatch**](#questionquizidquestionsquestionidpatch) | **PATCH** /question/{quizId}/questions/{questionId} | Update question|
|[**quizExecuteQuizIdGet**](#quizexecutequizidget) | **GET** /quiz-execute/{quizId} | Get quiz for execution|
|[**quizExecuteQuizIdQuestionIdGet**](#quizexecutequizidquestionidget) | **GET** /quiz-execute/{quizId}/{questionId} | Get question for execution|
|[**quizExecuteQuizIdQuestionIdPost**](#quizexecutequizidquestionidpost) | **POST** /quiz-execute/{quizId}/{questionId} | Submit answer|
|[**quizGet**](#quizget) | **GET** /quiz | Get user\&#39;s quizes|
|[**quizPost**](#quizpost) | **POST** /quiz | Create quiz|
|[**quizQuizIdDelete**](#quizquiziddelete) | **DELETE** /quiz/{quizId} | Delete quiz by id|
|[**quizQuizIdFinishPost**](#quizquizidfinishpost) | **POST** /quiz/{quizId}/finish | Finish quiz|
|[**quizQuizIdGet**](#quizquizidget) | **GET** /quiz/{quizId} | Get quiz by id|
|[**quizQuizIdPatch**](#quizquizidpatch) | **PATCH** /quiz/{quizId} | Update quiz|
|[**quizQuizIdSettingsAvailablePeriodsPatch**](#quizquizidsettingsavailableperiodspatch) | **PATCH** /quiz/{quizId}/settings/available-periods | Update quiz available periods|
|[**quizQuizIdSettingsPatch**](#quizquizidsettingspatch) | **PATCH** /quiz/{quizId}/settings | Update quiz settings|
|[**quizQuizIdStartPost**](#quizquizidstartpost) | **POST** /quiz/{quizId}/start | Start quiz|
|[**userMeGet**](#usermeget) | **GET** /user/me | Get authorized user|

# **authLoginPost**
> UserAuthResponse authLoginPost(userLoginRequestBody)

Login user

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserLoginRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userLoginRequestBody: UserLoginRequestBody; //Login request body

const { status, data } = await apiInstance.authLoginPost(
    userLoginRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userLoginRequestBody** | **UserLoginRequestBody**| Login request body | |


### Return type

**UserAuthResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login success response |  -  |
|**422** | Login validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authLogoutPost**
> authLogoutPost()

Logout

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.authLogoutPost();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | Logout success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authRefreshPost**
> RefreshTokenResponse authRefreshPost()

Refresh JWT access token using the refreshToken HTTP-only cookie set by login or register

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.authRefreshPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RefreshTokenResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | JWT token refreshed |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authRegisterPost**
> UserAuthResponse authRegisterPost(userLoginRequestBody)

Register user

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserLoginRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userLoginRequestBody: UserLoginRequestBody; //Register request body

const { status, data } = await apiInstance.authRegisterPost(
    userLoginRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userLoginRequestBody** | **UserLoginRequestBody**| Register request body | |


### Return type

**UserAuthResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Register success response |  -  |
|**422** | Register validation failed |  -  |
|**500** | Register failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **questionQuizIdQuestionsPost**
> QuestionResponse questionQuizIdQuestionsPost(questionCreateRequestBody)

Add a question to a quiz

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuestionCreateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let questionCreateRequestBody: QuestionCreateRequestBody; //Create question request body

const { status, data } = await apiInstance.questionQuizIdQuestionsPost(
    quizId,
    questionCreateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionCreateRequestBody** | **QuestionCreateRequestBody**| Create question request body | |
| **quizId** | [**string**] |  | defaults to undefined|


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
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **questionQuizIdQuestionsQuestionIdDelete**
> questionQuizIdQuestionsQuestionIdDelete()

Delete a question from a quiz

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let questionId: string; // (default to undefined)

const { status, data } = await apiInstance.questionQuizIdQuestionsQuestionIdDelete(
    quizId,
    questionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | defaults to undefined|
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
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **questionQuizIdQuestionsQuestionIdPatch**
> QuestionResponse questionQuizIdQuestionsQuestionIdPatch(questionUpdateRequestBody)

Update an existing quiz question

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuestionUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let questionId: string; // (default to undefined)
let questionUpdateRequestBody: QuestionUpdateRequestBody; //Update question request body

const { status, data } = await apiInstance.questionQuizIdQuestionsQuestionIdPatch(
    quizId,
    questionId,
    questionUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionUpdateRequestBody** | **QuestionUpdateRequestBody**| Update question request body | |
| **quizId** | [**string**] |  | defaults to undefined|
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
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizExecuteQuizIdGet**
> QuizExecuteResponse quizExecuteQuizIdGet()

Get quiz metadata for public execution (no authentication required)

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)

const { status, data } = await apiInstance.quizExecuteQuizIdGet(
    quizId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuizExecuteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Quiz found |  -  |
|**404** | Quiz not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizExecuteQuizIdQuestionIdGet**
> QuestionExecuteResponse quizExecuteQuizIdQuestionIdGet()

Get a quiz question without the correct answer (no authentication required)

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let questionId: string; // (default to undefined)

const { status, data } = await apiInstance.quizExecuteQuizIdQuestionIdGet(
    quizId,
    questionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | defaults to undefined|
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
|**404** | Quiz or question not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizExecuteQuizIdQuestionIdPost**
> AnswerEvaluationResponse quizExecuteQuizIdQuestionIdPost(questionAnswerSubmitRequestBody)

Evaluate a submitted answer for a quiz question (no authentication required)

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuestionAnswerSubmitRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let questionId: string; // (default to undefined)
let questionAnswerSubmitRequestBody: QuestionAnswerSubmitRequestBody; //Submitted answer (format depends on question type)

const { status, data } = await apiInstance.quizExecuteQuizIdQuestionIdPost(
    quizId,
    questionId,
    questionAnswerSubmitRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionAnswerSubmitRequestBody** | **QuestionAnswerSubmitRequestBody**| Submitted answer (format depends on question type) | |
| **quizId** | [**string**] |  | defaults to undefined|
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
|**404** | Quiz or question not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizGet**
> Array<QuizResponse> quizGet()

Get user\'s quizes

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.quizGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<QuizResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizPost**
> QuizResponse quizPost(quizCreateRequestBody)

Create quiz

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuizCreateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizCreateRequestBody: QuizCreateRequestBody; //Create quiz request body

const { status, data } = await apiInstance.quizPost(
    quizCreateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizCreateRequestBody** | **QuizCreateRequestBody**| Create quiz request body | |


### Return type

**QuizResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Quiz created success |  -  |
|**401** | Unauthorized |  -  |
|**422** | Validation failed |  -  |
|**500** | Creating failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizQuizIdDelete**
> quizQuizIdDelete()

Delete quiz by id

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)

const { status, data } = await apiInstance.quizQuizIdDelete(
    quizId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | defaults to undefined|


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
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizQuizIdFinishPost**
> QuizExecuteResponse quizQuizIdFinishPost()

Close quiz for execution

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)

const { status, data } = await apiInstance.quizQuizIdFinishPost(
    quizId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuizExecuteResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Quiz finished |  -  |
|**401** | Unauthorized |  -  |
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizQuizIdGet**
> QuizResponse quizQuizIdGet()

Get quiz by id

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)

const { status, data } = await apiInstance.quizQuizIdGet(
    quizId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuizResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Quiz found |  -  |
|**401** | Unauthorized |  -  |
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizQuizIdPatch**
> QuizResponse quizQuizIdPatch(quizUpdateRequestBody)

Update quiz title

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuizUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let quizUpdateRequestBody: QuizUpdateRequestBody; //Updating quiz request body

const { status, data } = await apiInstance.quizQuizIdPatch(
    quizId,
    quizUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizUpdateRequestBody** | **QuizUpdateRequestBody**| Updating quiz request body | |
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuizResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Quiz updated success |  -  |
|**401** | Unauthorized |  -  |
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |
|**422** | Validation failed |  -  |
|**500** | Updating failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizQuizIdSettingsAvailablePeriodsPatch**
> QuizResponse quizQuizIdSettingsAvailablePeriodsPatch(quizAvailableEditRequestBody)

Add, update or remove quiz availability periods

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuizAvailableEditRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let quizAvailableEditRequestBody: QuizAvailableEditRequestBody; //Updating quiz available periods request body

const { status, data } = await apiInstance.quizQuizIdSettingsAvailablePeriodsPatch(
    quizId,
    quizAvailableEditRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizAvailableEditRequestBody** | **QuizAvailableEditRequestBody**| Updating quiz available periods request body | |
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuizResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Quiz available periods updated success |  -  |
|**401** | Unauthorized |  -  |
|**403** | Don\&#39;t have rights |  -  |
|**422** | Validation failed |  -  |
|**500** | Updating available periods failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizQuizIdSettingsPatch**
> QuizResponse quizQuizIdSettingsPatch(quizSettingsUpdateRequestBody)

Update quiz title and boolean settings (required fields and answer visibility). Availability periods are managed via PATCH /quiz/{quizId}/settings/available-periods.

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuizSettingsUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let quizSettingsUpdateRequestBody: QuizSettingsUpdateRequestBody; //Updating quiz settings request body

const { status, data } = await apiInstance.quizQuizIdSettingsPatch(
    quizId,
    quizSettingsUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizSettingsUpdateRequestBody** | **QuizSettingsUpdateRequestBody**| Updating quiz settings request body | |
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuizResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Quiz settings updated success |  -  |
|**401** | Unauthorized |  -  |
|**403** | Don\&#39;t have rights |  -  |
|**422** | Validation failed |  -  |
|**500** | Updating settings failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quizQuizIdStartPost**
> QuizExecuteResponse quizQuizIdStartPost()

Open quiz for execution

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuizStartRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizId: string; // (default to undefined)
let quizStartRequestBody: QuizStartRequestBody; //Optional quiz duration in seconds (optional)

const { status, data } = await apiInstance.quizQuizIdStartPost(
    quizId,
    quizStartRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizStartRequestBody** | **QuizStartRequestBody**| Optional quiz duration in seconds | |
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuizExecuteResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Quiz started |  -  |
|**401** | Unauthorized |  -  |
|**403** | Don\&#39;t have rights |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userMeGet**
> GetUserResponse userMeGet()

Get authorized user

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.userMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUserResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

