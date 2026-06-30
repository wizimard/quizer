import type { IQuizEntity } from '@domain/quiz/quiz.entity.interface';

export interface IQuizQueryService {
	getById(id: string): Promise<IQuizEntity>;
	getFullById(id: string): Promise<IQuizEntity>;
}
