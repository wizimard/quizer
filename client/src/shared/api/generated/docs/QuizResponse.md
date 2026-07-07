# QuizResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**authorId** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**questions** | [**Array&lt;QuestionResponse&gt;**](QuestionResponse.md) |  | [default to undefined]
**settings** | [**QuizSettingsBase**](QuizSettingsBase.md) |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]

## Example

```typescript
import { QuizResponse } from './api';

const instance: QuizResponse = {
    id,
    authorId,
    status,
    title,
    questions,
    settings,
    updatedAt,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
