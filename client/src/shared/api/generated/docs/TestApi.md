# TestApi

All URIs are relative to *http://localhost:8031/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**testGet**](#testget) | **GET** /test | Get author\&#39;s tests|
|[**testPost**](#testpost) | **POST** /test | Create test|
|[**testTestIdDelete**](#testtestiddelete) | **DELETE** /test/{testId} | Delete test|
|[**testTestIdFinishPost**](#testtestidfinishpost) | **POST** /test/{testId}/finish | Finish test|
|[**testTestIdGet**](#testtestidget) | **GET** /test/{testId} | Get test by id|
|[**testTestIdPatch**](#testtestidpatch) | **PATCH** /test/{testId} | Update test|
|[**testTestIdSchedulerPeriodsPatch**](#testtestidschedulerperiodspatch) | **PATCH** /test/{testId}/scheduler/periods | Update test scheduler periods|
|[**testTestIdSettingsPatch**](#testtestidsettingspatch) | **PATCH** /test/{testId}/settings | Update test settings|
|[**testTestIdStartPost**](#testtestidstartpost) | **POST** /test/{testId}/start | Start test|

# **testGet**
> Array<TestResponse> testGet()


### Example

```typescript
import {
    TestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

const { status, data } = await apiInstance.testGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TestResponse>**

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

# **testPost**
> TestFullResponse testPost(testCreateRequestBody)


### Example

```typescript
import {
    TestApi,
    Configuration,
    TestCreateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testCreateRequestBody: TestCreateRequestBody; //

const { status, data } = await apiInstance.testPost(
    testCreateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testCreateRequestBody** | **TestCreateRequestBody**|  | |


### Return type

**TestFullResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Test created |  -  |
|**401** | Unauthorized |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testTestIdDelete**
> testTestIdDelete()


### Example

```typescript
import {
    TestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testId: string; // (default to undefined)

const { status, data } = await apiInstance.testTestIdDelete(
    testId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|


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

# **testTestIdFinishPost**
> MessageResponse testTestIdFinishPost()

Close test for execution.

### Example

```typescript
import {
    TestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testId: string; // (default to undefined)

const { status, data } = await apiInstance.testTestIdFinishPost(
    testId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**MessageResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test finished |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testTestIdGet**
> TestFullResponse testTestIdGet()


### Example

```typescript
import {
    TestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testId: string; // (default to undefined)

const { status, data } = await apiInstance.testTestIdGet(
    testId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestFullResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test found |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testTestIdPatch**
> TestFullResponse testTestIdPatch(testUpdateRequestBody)


### Example

```typescript
import {
    TestApi,
    Configuration,
    TestUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testId: string; // (default to undefined)
let testUpdateRequestBody: TestUpdateRequestBody; //

const { status, data } = await apiInstance.testTestIdPatch(
    testId,
    testUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testUpdateRequestBody** | **TestUpdateRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestFullResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test updated |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not found |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testTestIdSchedulerPeriodsPatch**
> TestSchedulerResponse testTestIdSchedulerPeriodsPatch(testSchedulerPeriodsEditRequestBody)

Add, update or remove test availability periods.

### Example

```typescript
import {
    TestApi,
    Configuration,
    TestSchedulerPeriodsEditRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testId: string; // (default to undefined)
let testSchedulerPeriodsEditRequestBody: TestSchedulerPeriodsEditRequestBody; //

const { status, data } = await apiInstance.testTestIdSchedulerPeriodsPatch(
    testId,
    testSchedulerPeriodsEditRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testSchedulerPeriodsEditRequestBody** | **TestSchedulerPeriodsEditRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestSchedulerResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Scheduler periods updated |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testTestIdSettingsPatch**
> TestFullResponse testTestIdSettingsPatch(testSettingsUpdateRequestBody)

Update test title and boolean settings. Availability periods are managed via PATCH /test/{testId}/scheduler/periods.

### Example

```typescript
import {
    TestApi,
    Configuration,
    TestSettingsUpdateRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testId: string; // (default to undefined)
let testSettingsUpdateRequestBody: TestSettingsUpdateRequestBody; //

const { status, data } = await apiInstance.testTestIdSettingsPatch(
    testId,
    testSettingsUpdateRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **testSettingsUpdateRequestBody** | **TestSettingsUpdateRequestBody**|  | |
| **testId** | [**string**] |  | defaults to undefined|


### Return type

**TestFullResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Test settings updated |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**422** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testTestIdStartPost**
> MessageResponse testTestIdStartPost()

Open test for execution.

### Example

```typescript
import {
    TestApi,
    Configuration,
    TestStartRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let testId: string; // (default to undefined)
let testStartRequestBody: TestStartRequestBody; // (optional)

const { status, data } = await apiInstance.testTestIdStartPost(
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

