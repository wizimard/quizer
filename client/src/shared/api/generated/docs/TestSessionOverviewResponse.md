# TestSessionOverviewResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**run_mode** | **string** |  | [default to undefined]
**questions** | [**Array&lt;TestExecutionOverviewQuestionResponse&gt;**](TestExecutionOverviewQuestionResponse.md) |  | [default to undefined]
**registered_users** | [**Array&lt;TestSessionOverviewRegisteredUserResponse&gt;**](TestSessionOverviewRegisteredUserResponse.md) |  | [default to undefined]
**max_score** | **number** | Maximum points available from all questions | [default to undefined]
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
    max_score,
    started_at,
    finished_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
