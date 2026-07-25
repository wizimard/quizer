# TestSessionOverviewResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**run_mode** | **string** |  | [default to undefined]
**questions** | [**Array&lt;TestExecutionOverviewQuestionResponse&gt;**](TestExecutionOverviewQuestionResponse.md) |  | [default to undefined]
**registered_users** | [**Array&lt;TestExecutionOverviewRegisteredUserResponse&gt;**](TestExecutionOverviewRegisteredUserResponse.md) |  | [default to undefined]
**started_at** | **string** |  | [default to undefined]
**finished_at** | **string** |  | [default to undefined]

## Example

```typescript
import { TestSessionOverviewResponse } from './api';

const instance: TestSessionOverviewResponse = {
    id,
    title,
    run_mode,
    questions,
    registered_users,
    started_at,
    finished_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
