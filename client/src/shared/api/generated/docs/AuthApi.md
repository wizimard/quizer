# AuthApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authLoginPost**](#authloginpost) | **POST** /auth/login | Login user|
|[**authLogoutPost**](#authlogoutpost) | **POST** /auth/logout | Logout|
|[**authRefreshPost**](#authrefreshpost) | **POST** /auth/refresh | Refresh token|
|[**authRegisterPost**](#authregisterpost) | **POST** /auth/register | Register user|

# **authLoginPost**
> UserAuthResponse authLoginPost(userLoginRequestBody)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    UserLoginRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let userLoginRequestBody: UserLoginRequestBody; //

const { status, data } = await apiInstance.authLoginPost(
    userLoginRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userLoginRequestBody** | **UserLoginRequestBody**|  | |


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
|**200** | Login success |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authLogoutPost**
> authLogoutPost()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

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

Refresh JWT access token using the refreshToken HTTP-only cookie set by login or register.

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

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
> UserAuthResponse authRegisterPost(userRegisterRequestBody)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    UserRegisterRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let userRegisterRequestBody: UserRegisterRequestBody; //

const { status, data } = await apiInstance.authRegisterPost(
    userRegisterRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userRegisterRequestBody** | **UserRegisterRequestBody**|  | |


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
|**201** | Register success |  -  |
|**422** | Validation failed |  -  |
|**500** | Register failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

