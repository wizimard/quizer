# DefaultApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authLoginPost**](#authloginpost) | **POST** /auth/login | Login user|
|[**authLogoutPost**](#authlogoutpost) | **POST** /auth/logout | Logout|
|[**authRefreshPost**](#authrefreshpost) | **POST** /auth/refresh | Refresh token|
|[**authRegisterPost**](#authregisterpost) | **POST** /auth/register | Register user|
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

