import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ButtonTestStart, type TestFull } from "@entities/test";
import { testApi } from "@shared/api";

export interface StartTestProps {
	test: TestFull;
}

export const StartTest = ({ test }: StartTestProps) => {
	const queryClient = useQueryClient();

	const startTestMutation = useMutation({
		mutationFn: async () => {
			return testApi.testTestIdStartPost(test.id);
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
		startTestMutation.mutate();
	};

	return <ButtonTestStart onClick={handleClick} disabled={test.questions.length === 0} />;
};
