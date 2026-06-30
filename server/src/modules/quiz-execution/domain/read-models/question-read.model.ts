import type { QuestionConfigBase } from '@modules/quiz-management/domain/value-objects/question-configs/question-config.base';
import type { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';

export interface QuestionReadModel {
	readonly id: string;
	readonly quizId: QuizId;
	readonly order: number;
	readonly description: string;
	readonly config: QuestionConfigBase;
}
