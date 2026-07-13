# TestExecuteResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**is_open** | **boolean** |  | [default to undefined]
**open_from_at** | **string** |  | [optional] [default to undefined]
**open_until_at** | **string** |  | [optional] [default to undefined]
**questions** | [**Array&lt;QuestionExecuteResponse&gt;**](QuestionExecuteResponse.md) |  | [default to undefined]
**register_credentials** | **Array&lt;string&gt;** |  | [default to undefined]

## Example

```typescript
import { TestExecuteResponse } from './api';

const instance: TestExecuteResponse = {
    id,
    title,
    is_open,
    open_from_at,
    open_until_at,
    questions,
    register_credentials,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
