import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import { UserId } from '@modules/identity-access';
import type { QuizEntity } from '../entities/quiz.entity';
import type { IQuizUpdateAvailablePeriodsData, IQuizUpdateSettingsData, QuizRepository, TQuizModelAll, TQuizModelWithSessions } from '../interfaces/repository/quiz.repository.interface';
import type { QuizId } from '../entities/value-object/quiz-id';
import { QuizMapper } from '../mappers/quiz.mapper';
import { QuizPersistenceMapper } from '../mappers/repositories/quiz-persistence.mapper';

const FULL_QUIZ_INCLUDE = {
	questions: {
		orderBy: { sort_key: 'asc' },
	},
	quizSettings: {
		include: {
			availablePeriods: true,
		},
	},
	quizSessions: {
		where: {
			status: 'ACTIVE',
		},
	},
} as const;

const SHORT_QUIZ_INCLUDE = {
	quizSessions: {
		where: {
			status: 'ACTIVE',
		},
	},
} as const;

@injectable()
export class PrismaQuizRepository implements QuizRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(entity: QuizEntity): Promise<QuizEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.create({
					data: QuizPersistenceMapper.toCreateData(entity),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.create',
			this.logger,
		);

		return QuizMapper.toDomain(row);
	}

	async update(entity: QuizEntity): Promise<QuizEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: entity.id.value },
					data: QuizPersistenceMapper.toUpdateData(entity),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.update',
			this.logger,
		);

		return QuizMapper.toDomain(row);
	}

	async delete(id: QuizId): Promise<boolean> {
		const rows = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.deleteMany({
					where: { id: id.value },
				}),
			'PrismaQuizRepository.delete',
			this.logger,
		);

		return rows.count > 0;
	}

	async findById(id: QuizId): Promise<QuizEntity | null> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.findUnique({
					where: { id: id.value },
				}),
			'PrismaQuizRepository.findById',
			this.logger,
		);

		return row ? QuizMapper.toDomain(row) : null;
	}

	async findFullById(id: QuizId): Promise<QuizEntity | null> {
		const row: TQuizModelAll | null = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.findUnique({
					where: { id: id.value },
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.findFullById',
			this.logger,
		);

		return row ? QuizMapper.toDomain(row) : null;
	}

	async findByAuthor(authorId: UserId): Promise<QuizEntity[]> {
		const rows: TQuizModelWithSessions[] = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.findMany({
					where: { authorId: authorId.value },
					include: SHORT_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.findByAuthor',
			this.logger,
		);

		return rows.map((row: TQuizModelWithSessions) => QuizMapper.toDomain(row));
	}

	async updateSettings(quizId: QuizId, updateSettingsData: IQuizUpdateSettingsData): Promise<QuizEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: quizId.value },
					data: QuizPersistenceMapper.toSettingsUpdateInput(updateSettingsData),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.updateSettings',
			this.logger,
		);

		return QuizMapper.toDomain(row);
	}

	async updateAvailablePeriods(quizId: QuizId, updateData: IQuizUpdateAvailablePeriodsData): Promise<QuizEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: quizId.value },
					data: QuizPersistenceMapper.toAvailablePeriodsUpdateInput(updateData),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.updateAvailablePeriods',
			this.logger,
		);

		return QuizMapper.toDomain(row);
	}

	async closeAvailablePeriod(quizId: QuizId, periodId: number): Promise<QuizEntity> {
		console.log('closeAvailablePeriod', quizId.value, periodId);
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: quizId.value },
					data: QuizPersistenceMapper.toAvailablePeriodsCloseInput({ periodId }),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.closeAvailablePeriod',
		);

		return QuizMapper.toDomain(row);
	}
}
