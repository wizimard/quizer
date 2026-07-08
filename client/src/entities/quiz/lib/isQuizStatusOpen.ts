import { QuizResponseStatusEnum } from "@shared/api/generated";

export function isQuizStatusOpen(status: QuizResponseStatusEnum) {
	return status === QuizResponseStatusEnum.ManualOpen || status === QuizResponseStatusEnum.OpenByScheduler;
}
