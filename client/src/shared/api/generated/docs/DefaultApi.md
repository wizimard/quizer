# DefaultApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authLoginPost**](#authloginpost) | **POST** /auth/login | Login user|
|[**authLogoutPost**](#authlogoutpost) | **POST** /auth/logout | Logout|
|[**authRefreshPost**](#authrefreshpost) | **POST** /auth/refresh | Refresh token|
|[**authRegisterPost**](#authregisterpost) | **POST** /auth/register | Register user|
|[**quizGet**](#quizget) | **GET** /quiz | Get user\&#39;s quizes|
|[**quizIdDelete**](#quiziddelete) | **DELETE** /quiz/{id} | Delete quiz by id|
|[**quizIdGet**](#quizidget) | **GET** /quiz/{id} | Get quiz by id|
|[**quizIdSettingsPatch**](#quizidsettingspatch) | **PATCH** /quiz/{id}/settings | Update quiz settings|
|[**quizPatch**](#quizpatch) | **PATCH** /quiz | Update quiz|
|[**quizPost**](#quizpost) | **POST** /quiz | Create quiz|
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

Refresh JWT token

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

[BearerAuth](../README.md#BearerAuth)

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
|**200** | Register success response |  -  |
|**422** | Register validation failed |  -  |
|**500** | Register failed |  -  |

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

# **quizIdDelete**
> quizIdDelete()

Delete quiz by id

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.quizIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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

# **quizIdGet**
> QuizResponse quizIdGet()

Get quiz by id

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.quizIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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

# **quizIdSettingsPatch**
> QuizResponse quizIdSettingsPatch(quizSettingsUpdateRequestBody)

Update quiz settings

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuizSettingsUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let quizSettingsUpdateRequestBody: QuizSettingsUpdateRequestBody; //Updating quiz settings request body

const { status, data } = await apiInstance.quizIdSettingsPatch(
    id,
    quizSettingsUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizSettingsUpdateRequestBody** | **QuizSettingsUpdateRequestBody**| Updating quiz settings request body | |
| **id** | [**string**] |  | defaults to undefined|


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

# **quizPatch**
> QuizResponse quizPatch(quizUpdateRequestBody)

Update quiz

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    QuizUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let quizUpdateRequestBody: QuizUpdateRequestBody; //Updating quiz request body

const { status, data } = await apiInstance.quizPatch(
    quizUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizUpdateRequestBody** | **QuizUpdateRequestBody**| Updating quiz request body | |


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
|**422** | Validation failed |  -  |
|**500** | Creating failed |  -  |

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
|**200** | Quiz created success |  -  |
|**401** | Unauthorized |  -  |
|**422** | Validation failed |  -  |
|**500** | Creating failed |  -  |

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

