# TestSchedulerPeriodsEditRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**add** | [**Array&lt;TestSchedulerPeriodAddDto&gt;**](TestSchedulerPeriodAddDto.md) | Periods to create | [optional] [default to undefined]
**update** | [**Array&lt;TestSchedulerPeriodEditDto&gt;**](TestSchedulerPeriodEditDto.md) | Existing periods to update | [optional] [default to undefined]
**remove** | **Array&lt;number&gt;** | IDs of periods to delete | [optional] [default to undefined]

## Example

```typescript
import { TestSchedulerPeriodsEditRequestBody } from './api';

const instance: TestSchedulerPeriodsEditRequestBody = {
    add,
    update,
    remove,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
