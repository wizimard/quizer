import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TestResponseStatusEnum } from "@shared/api/generated";
import { ButtonTestStop, type Test } from "@entities/test";
import { testApi } from "@shared/api";

export interface TestStopProps {
	test: Test;
}

function stopTest(test: Test) {
	if (test.status === TestResponseStatusEnum.Closed) {
		throw new Error("Test is not open");
	}

	return testApi.testTestIdFinishPost(test.id);
}

export const StopTest = ({ test }: TestStopProps) => {
	const queryClient = useQueryClient();

	const stopTestMutation = useMutation({
		mutationFn: async () => {
			return stopTest(test);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["test", test.id] });
		},
		onError: (error) => {
			// TODO: handle error
			console.error(error);
		},
	});

	const handleClick = () => {
		stopTestMutation.mutate();
	};

	return <ButtonTestStop onClick={handleClick} />;
};
