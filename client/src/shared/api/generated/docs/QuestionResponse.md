# QuestionResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**test_id** | **string** |  | [default to undefined]
**sort_key** | **number** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**score** | **number** | Points awarded for a correct answer | [default to undefined]
**image** | **string** | Relative URL to the question image, or null | [default to undefined]
**config** | [**QuestionRequestConfig**](QuestionRequestConfig.md) |  | [default to undefined]

## Example

```typescript
import { QuestionResponse } from './api';

const instance: QuestionResponse = {
    id,
    test_id,
    sort_key,
    description,
    score,
    image,
    config,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
