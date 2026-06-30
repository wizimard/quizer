import { inject, injectable } from 'inversify';
import type { QuizQuestionModel } from '@prisma/client';
import type { QuestionCreateDto } from '@interfaces/http/quiz/dto/question-create.dto';
import type { QuestionConfigBase } from '@domain/quiz/question-configs/question-config.base';
import type { IQuestionConfigFactory } from '@domain/quiz/question-configs/question-config.factory';
import { QuestionEntity } from '@domain/quiz/question.entity';
import type { IQuestionEntity } from '@domain/quiz/question.entity.interface';
import type { TQuestionCreateOrUpdateData } from '@infrastructure/persistence/prisma/question.repository.interface';
import type { IQuestionResponse } from '@interfaces/http/quiz/types/questions-response.interface';
import { HttpError } from '@error';
import { QUIZ_TYPES } from '@composition/quiz.types';

@injectable()
export class QuestionMapper {
	constructor(@inject(QUIZ_TYPES.QUESTION_CONFIG_FACTORY) private readonly configFactory: IQuestionConfigFactory) {}

	public toPersistence(entity: IQuestionEntity): TQuestionCreateOrUpdateData {
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
		const config = structuredClone(question.config.toObject()) as Record<string, unknown>;

		delete config.answer;

		return {
			id: question.id,
			quizId: question.quizId,
			order: question.order,
			description: question.description,
			config,
		};
	}

	public toResponseExecuteFromRepository(questionModel: QuizQuestionModel): IQuestionResponse {
		const config = structuredClone(questionModel.config) as Record<string, unknown>;

		if (!config || typeof config !== 'object' || Array.isArray(config)) {
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
