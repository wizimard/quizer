# QuestionChangeOrderRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**previousQuestionId** | **string** | ID of the question that should appear immediately before the moved question | [optional] [default to undefined]
**nextQuestionId** | **string** | ID of the question that should appear immediately after the moved question | [optional] [default to undefined]

## Example

```typescript
import { QuestionChangeOrderRequestBody } from './api';

const instance: QuestionChangeOrderRequestBody = {
    previousQuestionId,
    nextQuestionId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
