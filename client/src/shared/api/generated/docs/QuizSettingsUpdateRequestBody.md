# QuizSettingsUpdateRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**isRequiredEmail** | **boolean** |  | [default to undefined]
**isRequiredFirstName** | **boolean** |  | [default to undefined]
**isRequiredLastName** | **boolean** |  | [default to undefined]
**isShowAnswersAfterCompletion** | **boolean** |  | [default to undefined]
**available_periods** | [**QuizAvailableEditRequestBody**](QuizAvailableEditRequestBody.md) |  | [optional] [default to undefined]

## Example

```typescript
import { QuizSettingsUpdateRequestBody } from './api';

const instance: QuizSettingsUpdateRequestBody = {
    id,
    isRequiredEmail,
    isRequiredFirstName,
    isRequiredLastName,
    isShowAnswersAfterCompletion,
    available_periods,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
