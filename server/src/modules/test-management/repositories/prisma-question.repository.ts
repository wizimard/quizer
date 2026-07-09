import { APP_TYPES } from '@app/app.types';
import type { QuestionEntity } from '@modules/test-management/entities/question.entity';
import type { QuestionRepository } from '@modules/test-management/interfaces/repository/question.repository.interface';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { ILogger } from '@shared/logger/logger.interface';
import type { IPrismaService } from '@shared/persistence/prisma.service.interface';
import { inject, injectable } from 'inversify';
import { QuestionMapper } from '../mappers/question.mapper';
import { QuestionPersistenceMapper } from '../mappers/repositories/question-persistence.mapper';
import type { QuestionId } from '@modules/test-management/entities/value-object/question-id';
import { TestId } from '@modules/test-management/entities/value-object/test-id';

@injectable()
export class PrismaQuestionRepository implements QuestionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(data: QuestionEntity): Promise<QuestionEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testQuestionModel.create({
					data: QuestionPersistenceMapper.toCreateData(data),
				}),
			'PrismaQuestionRepository.create',
			this.logger,
		);

		return QuestionMapper.toDomain(row);
	}

	async update(data: QuestionEntity): Promise<QuestionEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testQuestionModel.update({
					where: { id: data.id.value, test_id: data.testId.value },
					data: QuestionPersistenceMapper.toUpdateData(data),
				}),
			'PrismaQuestionRepository.update',
			this.logger,
		);

		return QuestionMapper.toDomain(row);
	}

	async delete(id: QuestionId, testId: TestId): Promise<boolean> {
		const rows = await repositoryCall(
			() =>
				this.prismaService.client.testQuestionModel.deleteMany({
					where: { id: id.value, test_id: testId.value },
				}),
			'PrismaQuestionRepository.delete',
			this.logger,
		);

		return rows.count > 0;
	}

	async findById(id: QuestionId): Promise<QuestionEntity | null> {
		const row = await repositoryCall(() => this.prismaService.client.testQuestionModel.findUnique({ where: { id: id.value } }), 'PrismaQuestionRepository.findById', this.logger);
		return row ? QuestionMapper.toDomain(row) : null;
	}

	async findByTestId(testId: TestId): Promise<QuestionEntity[]> {
		const rows = await repositoryCall(() => this.prismaService.client.testQuestionModel.findMany({ where: { test_id: testId.value } }), 'PrismaQuestionRepository.findByTestId', this.logger);
		return rows.map((row) => QuestionMapper.toDomain(row));
	}

	async updateQuestionsOrders(questions: QuestionEntity[]): Promise<boolean> {
		const rows = await repositoryCall(
			() => {
				const updateQuestions = questions.map((question) => this.prismaService.client.testQuestionModel.update(QuestionPersistenceMapper.toUpdateOrderData(question)));

				return this.prismaService.client.$transaction(updateQuestions);
			},
			'PrismaQuestionRepository.updateQuestionsOrders',
			this.logger,
		);

		return rows.length === questions.length;
	}
}
