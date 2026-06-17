import type { QuizQuestionModel } from '@prisma/client';
import type { QuestionCreateDto } from '../dto/question-create.dto';
import type { QuestionConfigBase } from '../entities/question-configs/question-config.base';
import { type IQuestionConfigFactory, QuestionConfigFactory } from '../entities/question-configs/question-config.factory';
import { QuestionEntity } from '../entities/question.entity';
import type { IQuestionEntity } from '../entities/question.entity.interface';
import type { TQuestionCreateOrUpdateData } from '../repositories/question.repository.interface';
import type { IQuestionResponse } from '../dto/questions-response.interface';
import { HttpError } from '../../error/http.error';

export class QuestionMapper {
	private readonly configFactory: IQuestionConfigFactory = new QuestionConfigFactory();

	public toRepositoryCreateFromEntity(entity: IQuestionEntity): TQuestionCreateOrUpdateData {
		return {
			description: entity.description,
			order: entity.order,
			config: entity.config.toObject(),
		};
	}

	public toRepositoryUpdateFromEntity(entity: IQuestionEntity): TQuestionCreateOrUpdateData {
		return {
			description: entity.description,
			order: entity.order,
			config: entity.config.toObject(),
		};
	}

	public toEntityFromRepository(questionModel: QuizQuestionModel): IQuestionEntity {
		const config: QuestionConfigBase = this.configFactory.getConfig(questionModel.config as any);

		return new QuestionEntity(questionModel.id, questionModel.quizId, questionModel.description, questionModel.order, config);
	}

	public toEntityFromCreateDto(dto: QuestionCreateDto, quizId: string): IQuestionEntity {
		const config: QuestionConfigBase = this.configFactory.getConfig(dto.config as any);

		return new QuestionEntity(dto.id, quizId, dto.description, dto.order, config);
	}

	public toResponseExecuteFromEntity(question: IQuestionEntity): IQuestionResponse {
		const config: object = question.config.toObject();

		if ('answer' in config) {
			delete config.answer;
		}

		return {
			id: question.id,
			quizId: question.quizId,
			order: question.order,
			description: question.description,
			config,
		};
	}

	public toResponseExecuteFromRepository(questionModel: QuizQuestionModel): IQuestionResponse {
		const config = questionModel.config;

		if (!config || typeof config !== 'object' || Array.isArray(config) || 'answer' in config) {
			throw new HttpError(500, 'question config has invalid structure');
		}

		delete config.answer;

		return {
			id: questionModel.id,
			quizId: questionModel.quizId,
			order: questionModel.order,
			description: questionModel.description,
			config,
		};
	}
}
