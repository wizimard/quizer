import type { QuizEntity } from '@modules/quiz-management';

export interface StartQuizInput {
	quiz: QuizEntity;
	finishedAt?: Date;
}
