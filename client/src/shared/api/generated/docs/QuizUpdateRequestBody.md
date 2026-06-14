# QuizUpdateRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**add** | [**Array&lt;QuestionRequest&gt;**](QuestionRequest.md) |  | [optional] [default to undefined]
**update** | [**Array&lt;QuestionRequest&gt;**](QuestionRequest.md) |  | [optional] [default to undefined]
**_delete** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { QuizUpdateRequestBody } from './api';

const instance: QuizUpdateRequestBody = {
    id,
    title,
    add,
    update,
    _delete,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
