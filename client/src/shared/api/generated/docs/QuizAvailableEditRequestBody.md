# QuizAvailableEditRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**add** | [**Array&lt;QuizAvailablePeriodEdit&gt;**](QuizAvailablePeriodEdit.md) | Periods to create | [optional] [default to undefined]
**update** | [**Array&lt;QuizAvailablePeriodEdit&gt;**](QuizAvailablePeriodEdit.md) | Existing periods to update | [optional] [default to undefined]
**remove** | **Array&lt;number&gt;** | IDs of periods to delete | [optional] [default to undefined]

## Example

```typescript
import { QuizAvailableEditRequestBody } from './api';

const instance: QuizAvailableEditRequestBody = {
    add,
    update,
    remove,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
