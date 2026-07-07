import type { IQuestionConfigBase } from '../../entities/question-configs/question-config.interface';
import type { QuestionEntity } from '../../entities/question.entity';
import type { QuizEntity } from '../../entities/quiz.entity';

export interface CreateQuestionInput {
	quizId: string;
	description: string;
	config: IQuestionConfigBase;
	sortKey: number;
}

export interface UpdateQuestionInput extends Omit<CreateQuestionInput, 'sortKey'> {
	id: string;
}

export interface DeleteQuestionInput {
	id: string;
	quizId: string;
}

export interface ChangeQuestionOrderInput {
	quiz: QuizEntity;
	questionId: string;
	previousQuestionId: string | null;
	nextQuestionId: string | null;
}
