import { QuizResponseStatusEnum } from "@shared/api/generated";

export function isOpenQuiz(status: QuizResponseStatusEnum) {
	return status === QuizResponseStatusEnum.ManualOpen || status === QuizResponseStatusEnum.OpenByScheduler;
}
