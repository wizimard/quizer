import type { QuizModel } from '@prisma/client';
import type { QuizModelGetPayload } from '@prisma/models';
import type { IQuizEntity } from '../entities/quiz.entity.interface';
import type { BatchPayload } from '@prisma/internal/prismaNamespace';
import type { IQuestionEntity } from '../entities/question.entity.interface';

export type TQuizModelWithQuestions = QuizModel & QuizModelGetPayload<{ select: { questions: true } }>;

export interface IQuizRepository {
	create(data: IQuizEntity): Promise<TQuizModelWithQuestions | null>;
	update(data: IQuizEntity, addQuestions: IQuestionEntity[], updateQuestions: IQuestionEntity[], deleteQuestionsIds: string[]): Promise<TQuizModelWithQuestions | null>;
	delete(id: string): Promise<[BatchPayload, TQuizModelWithQuestions] | null>;
	getById(id: string): Promise<TQuizModelWithQuestions | null>;
	getByAuthor(id: string): Promise<QuizModel[] | null>;
}
