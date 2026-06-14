import { inject, injectable } from 'inversify';
import type { IQuestionRepository, TQuestionCreateOrUpdateData } from './question.repository.interface';
import { APP_TYPES } from '@app_types';
import type { IPrismaService } from '@database';
import type { QuizQuestionModel } from '@prisma/client';

@injectable()
export class QuestionRepository implements IQuestionRepository {
	constructor(@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService) {}

	async getByQuizId(quizId: string): Promise<QuizQuestionModel[] | null> {
		try {
			return await this.prismaService.client.quizQuestionModel.findMany({
				where: {
					quizId,
				},
			});
		} catch {
			return null;
		}
	}

	async create(quizId: string, data: TQuestionCreateOrUpdateData): Promise<QuizQuestionModel | null> {
		try {
			return await this.prismaService.client.quizQuestionModel.create({
				data: {
					...data,
					quizId,
				},
			});
		} catch {
			return null;
		}
	}

	async update(id: string, data: TQuestionCreateOrUpdateData): Promise<QuizQuestionModel | null> {
		try {
			return await this.prismaService.client.quizQuestionModel.update({
				where: { id },
				data,
			});
		} catch {
			return null;
		}
	}

	async delete(id: string): Promise<QuizQuestionModel | null> {
		try {
			return await this.prismaService.client.quizQuestionModel.delete({ where: { id } });
		} catch {
			return null;
		}
	}
}
