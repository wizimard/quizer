import { APP_TYPES } from '@app/app.types';
import type { QuestionEntity } from '@modules/quiz-management/entities/question.entity';
import type { QuestionRepository } from '@modules/quiz-management/interfaces/repository/question.repository.interface';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { ILogger } from '@shared/logger/logger.interface';
import type { IPrismaService } from '@shared/persistence/prisma.service.interface';
import { inject, injectable } from 'inversify';
import { QuestionMapper } from '../mappers/question.mapper';
import { QuestionPersistenceMapper } from '../mappers/repositories/question-persistence.mapper';
import type { QuestionId } from '@modules/quiz-management/entities/value-object/question-id';
import { QuizId } from '@modules/quiz-management/entities/value-object/quiz-id';

@injectable()
export class PrismaQuestionRepository implements QuestionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(data: QuestionEntity): Promise<QuestionEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizQuestionModel.create({
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
				this.prismaService.client.quizQuestionModel.update({
					where: { id: data.id.value, quizId: data.quizId.value },
					data: QuestionPersistenceMapper.toUpdateData(data),
				}),
			'PrismaQuestionRepository.update',
			this.logger,
		);

		return QuestionMapper.toDomain(row);
	}

	async delete(id: QuestionId, quizId: QuizId): Promise<boolean> {
		const rows = await repositoryCall(
			() => this.prismaService.client.quizQuestionModel.deleteMany(QuestionPersistenceMapper.toDeleteData(id, quizId)),
			'PrismaQuestionRepository.delete',
			this.logger,
		);

		return rows.count > 0;
	}

	async findById(id: QuestionId): Promise<QuestionEntity | null> {
		const row = await repositoryCall(() => this.prismaService.client.quizQuestionModel.findUnique({ where: { id: id.value } }), 'PrismaQuestionRepository.findById', this.logger);
		return row ? QuestionMapper.toDomain(row) : null;
	}

	async findByQuizId(quizId: QuizId): Promise<QuestionEntity[]> {
		const rows = await repositoryCall(() => this.prismaService.client.quizQuestionModel.findMany({ where: { quizId: quizId.value } }), 'PrismaQuestionRepository.findByQuizId', this.logger);
		return rows.map((row) => QuestionMapper.toDomain(row));
	}

	async updateQuestionsOrders(questions: QuestionEntity[]): Promise<boolean> {
		const rows = await repositoryCall(
			() => {
				const updateQuestions = questions.map((question) => this.prismaService.client.quizQuestionModel.update(QuestionPersistenceMapper.toUpdateOrderData(question)));

				return this.prismaService.client.$transaction(updateQuestions);
			},
			'PrismaQuestionRepository.updateQuestionsOrders',
			this.logger,
		);

		return rows.length === questions.length;
	}
}
