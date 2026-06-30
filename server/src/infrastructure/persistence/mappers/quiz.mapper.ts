import { inject, injectable } from 'inversify';
import type { QuizCreateDto } from '@interfaces/http/quiz/dto/quiz-create.dto';
import { QuizEntity } from '@domain/quiz/quiz.entity';
import type { IQuizEntity } from '@domain/quiz/quiz.entity.interface';
import type { IQuestionResponse } from '@interfaces/http/quiz/types/questions-response.interface';
import type { IQuizResponse } from '@interfaces/http/quiz/types/quiz-response.interface';
import type { TQuizModelAll, TQuizModelWithQuestions } from '../prisma/prisma-quiz.types';
import type { QuizModel } from '@prisma/client';
import type { IQuestionEntity } from '@domain/quiz/question.entity.interface';
import { QuestionMapper } from './question.mapper';
import type { IQuizExecuteResponse } from '@interfaces/http/quiz/types/quiz-execute-response.interface';
import type { IQuizAvailablePeriod } from '@domain/quiz/quiz-available-period.interface';
import { QuizAvailablePeriod } from '@domain/quiz/quiz-available-period';
import { QuizSettings } from '@domain/quiz/quiz-settings';
import { QUIZ_TYPES } from '@composition/quiz.types';

@injectable()
export class QuizMapper {
	constructor(@inject(QUIZ_TYPES.QUESTION_MAPPER) private readonly questionMapper: QuestionMapper) {}

	public toEntityFromCreateDto(quizDto: QuizCreateDto, authorId: string): IQuizEntity {
		const questions = quizDto.questions.map((questionDto) => this.questionMapper.toEntityFromCreateDto(questionDto, 'new'));

		return new QuizEntity('new', quizDto.title, authorId, questions, null, new Date(), new Date());
	}

	public toDomain(quizModel: TQuizModelAll | QuizModel): IQuizEntity {
		const question: Array<IQuestionEntity> = 'questions' in quizModel ? quizModel.questions.map((q) => this.questionMapper.toEntityFromRepository(q)) : [];

		if (!('quizSettings' in quizModel)) {
			return new QuizEntity(quizModel.id, quizModel.title, quizModel.authorId, question, null, quizModel.updatedAt, quizModel.createdAt);
		}

		const availablePeriods: Array<IQuizAvailablePeriod> = quizModel.quizSettings!.availablePeriods.map(
			(period) => new QuizAvailablePeriod(Number(period.id), period.quizSettingsId, period.available_from, period.available_to),
		);

		const settings: QuizSettings = new QuizSettings(
			quizModel.id,
			availablePeriods,
			quizModel.quizSettings!.isRequiredEmail,
			quizModel.quizSettings!.isRequiredFirstName,
			quizModel.quizSettings!.isRequiredLastName,
			quizModel.quizSettings!.isShowAnswersAfterCompletion,
		);

		return new QuizEntity(quizModel.id, quizModel.title, quizModel.authorId, question, settings, quizModel.updatedAt, quizModel.createdAt);
	}

	public toResponseFromEntity(quiz: IQuizEntity): IQuizResponse {
		const questions: IQuestionResponse[] = quiz.questions.map((question) => ({
			id: question.id,
			quizId: question.quizId,
			description: question.description,
			order: question.order,
			config: question.config.toObject(),
		}));

		return {
			id: quiz.id,
			title: quiz.title,
			authorId: quiz.authorId,
			questions,
			settings: {
				availablePeriods: quiz.settings?.availablePeriods.map((period) => period.toObject()) || [],
				isRequiredEmail: quiz.settings?.isRequiredEmail || false,
				isRequiredFirstName: quiz.settings?.isRequiredFirstName || false,
				isRequiredLastName: quiz.settings?.isRequiredLastName || false,
				isShowAnswersAfterCompletion: quiz.settings?.isShowAnswersAfterCompletion || false,
			},
			updatedAt: quiz.updatedAt,
			createdAt: quiz.createdAt,
		};
	}

	public toResponseFromRepository(quizModel: TQuizModelWithQuestions | QuizModel): IQuizResponse {
		return this.toResponseFromEntity(this.toDomain(quizModel));
	}

	public toResponseExecuteFromEntity(quiz: IQuizEntity): IQuizExecuteResponse {
		return {
			id: quiz.id,
			isOpen: quiz.isOpen(),
			title: quiz.title,
			authorId: quiz.authorId,
		};
	}

	public toResponseExecuteFromRepository(quizModel: TQuizModelWithQuestions | QuizModel): IQuizExecuteResponse {
		return this.toResponseExecuteFromEntity(this.toDomain(quizModel));
	}
}
