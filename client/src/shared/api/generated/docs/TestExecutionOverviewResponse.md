# TestExecutionOverviewResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**run_mode** | **string** |  | [default to undefined]
**questions** | [**Array&lt;TestExecutionOverviewQuestionResponse&gt;**](TestExecutionOverviewQuestionResponse.md) |  | [default to undefined]
**registered_users** | [**Array&lt;TestExecutionOverviewRegisteredUserResponse&gt;**](TestExecutionOverviewRegisteredUserResponse.md) |  | [default to undefined]
**started_from** | **string** |  | [default to undefined]
**finished_at** | **string** |  | [optional] [default to undefined]
**current_question** | [**QuestionResponse**](QuestionResponse.md) | Present for MANUAL run mode | [optional] [default to undefined]
**current_question_index** | **number** | Present for MANUAL run mode | [optional] [default to undefined]
**total_questions_count** | **number** | Present for MANUAL run mode | [optional] [default to undefined]

## Example

```typescript
import { TestExecutionOverviewResponse } from './api';

const instance: TestExecutionOverviewResponse = {
    id,
    title,
    run_mode,
    questions,
    registered_users,
    started_from,
    finished_at,
    current_question,
    current_question_index,
    total_questions_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
