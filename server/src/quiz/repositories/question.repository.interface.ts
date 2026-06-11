import type { QuizQuestionModel } from '@prisma/client';
import type { JsonObject } from '@prisma/client/runtime/client';

export type TQuestionCreateOrUpdateData = Omit<QuizQuestionModel, 'id' | 'quizId'> & { config: JsonObject };

export interface IQuestionRepository {
	getByQuizId(quizId: string): Promise<QuizQuestionModel[] | null>;
	create(quizId: string, data: TQuestionCreateOrUpdateData): Promise<QuizQuestionModel | null>;
	update(id: string, data: TQuestionCreateOrUpdateData): Promise<QuizQuestionModel | null>;
	delete(id: string): Promise<QuizQuestionModel | null>;
}
