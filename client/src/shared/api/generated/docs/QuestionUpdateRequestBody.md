# QuestionUpdateRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **string** |  | [default to undefined]
**config** | [**QuestionRequestConfig**](QuestionRequestConfig.md) |  | [default to undefined]
**score** | **number** | Points awarded for a correct answer. Defaults to 1. | [optional] [default to undefined]

## Example

```typescript
import { QuestionUpdateRequestBody } from './api';

const instance: QuestionUpdateRequestBody = {
    description,
    config,
    score,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
