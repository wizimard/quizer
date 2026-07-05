import type { QuestionConfigBase } from '@modules/quiz-management/entities/question-configs/question-config.base';
import type { QuizId } from '@modules/quiz-management/entities/value-object/quiz-id';

export interface QuestionReadModel {
	readonly id: string;
	readonly quizId: QuizId;
	readonly order: number;
	readonly description: string;
	readonly config: QuestionConfigBase;
}
