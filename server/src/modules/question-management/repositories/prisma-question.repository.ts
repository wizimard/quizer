import { APP_TYPES } from '@app/app.types';
import type { QuestionEntity } from '@modules/test-management/entities/question.entity';
import type { QuestionRepository } from '../interfaces/repository/question.repository.interface';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { ILogger } from '@shared/logger/logger.interface';
import type { IPrismaService } from '@shared/persistence/prisma.service.interface';
import { inject, injectable } from 'inversify';
import { QuestionPersistenceMapper } from '../mappers/repositories/question-persistence.mapper';
import type { TestQuestionModel } from '@prisma/client';
import type { BatchPayload } from '@prisma/internal/prismaNamespace';

@injectable()
export class PrismaQuestionRepository implements QuestionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(data: QuestionEntity): Promise<QuestionEntity | null> {
		const row: TestQuestionModel | null = await repositoryCall(
			() =>
				this.prismaService.client.testQuestionModel.create({
					data: QuestionPersistenceMapper.toCreateData(data),
				}),
			'PrismaQuestionRepository create',
			this.logger,
		);

		return row ? QuestionPersistenceMapper.toDomain(row) : null;
	}

	async update(data: QuestionEntity): Promise<QuestionEntity | null> {
		const row: TestQuestionModel | null = await repositoryCall(
			() =>
				this.prismaService.client.testQuestionModel.update({
					where: { id: data.id, test_id: data.testId },
					data: QuestionPersistenceMapper.toUpdateData(data),
				}),
			'PrismaQuestionRepository update',
			this.logger,
		);

		return row ? QuestionPersistenceMapper.toDomain(row) : null;
	}

	async delete(id: string, testId: string): Promise<boolean> {
		const rows: BatchPayload | null = await repositoryCall(
			() =>
				this.prismaService.client.testQuestionModel.deleteMany({
					where: { id, test_id: testId },
				}),
			'PrismaQuestionRepository delete',
			this.logger,
		);

		return rows ? rows.count > 0 : false;
	}

	async findById(id: string): Promise<QuestionEntity | null> {
		const row: TestQuestionModel | null = await repositoryCall(() => this.prismaService.client.testQuestionModel.findUnique({ where: { id } }), 'PrismaQuestionRepository.findById', this.logger);
		return row ? QuestionPersistenceMapper.toDomain(row) : null;
	}

	async findByTestId(testId: string): Promise<QuestionEntity[]> {
		const rows: TestQuestionModel[] | null = await repositoryCall(
			() => this.prismaService.client.testQuestionModel.findMany({ where: { test_id: testId } }),
			'PrismaQuestionRepository.findByTestId',
			this.logger,
		);
		return rows ? rows.map((row) => QuestionPersistenceMapper.toDomain(row)) : [];
	}

	async updateQuestionsOrders(questions: QuestionEntity[]): Promise<boolean> {
		const rows: TestQuestionModel[] | null = await repositoryCall(
			() => {
				const updateQuestions = questions.map((question) => this.prismaService.client.testQuestionModel.update(QuestionPersistenceMapper.toUpdateOrderData(question)));

				return this.prismaService.client.$transaction(updateQuestions);
			},
			'PrismaQuestionRepository updateQuestionsOrders',
			this.logger,
		);

		return rows ? rows.length === questions.length : false;
	}
}
