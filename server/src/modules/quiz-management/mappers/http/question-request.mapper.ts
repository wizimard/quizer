import type { ChangeQuestionOrderInput, CreateQuestionInput, DeleteQuestionInput, UpdateQuestionInput } from '../../interfaces/input/question.input';
import type { QuestionCreateDto } from '../../dto/http/question-create.dto';
import type { IQuestionConfigBase } from '../../entities/question-configs/question-config.interface';
import type { QuestionUpdateDto } from '../../dto/http/question-update.dto';
import type { QuizEntity } from '../..';
import type { QuestionChangeOrderDto } from '@modules/quiz-management/dto/http/question-change-order.dto';

export class QuestionRequestMapper {
	static toCreateInput(dto: QuestionCreateDto, quiz: QuizEntity): CreateQuestionInput {
		return {
			quizId: quiz.id.value,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
			sortKey: (quiz.questions.length + 1) * 1000,
		};
	}

	static toUpdateInput(dto: QuestionUpdateDto, quizId: string, questionId: string): UpdateQuestionInput {
		return {
			id: questionId,
			quizId,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toDeleteInput(id: string, quizId: string): DeleteQuestionInput {
		return {
			id,
			quizId,
		};
	}

	static toChangeOrderInput(dto: QuestionChangeOrderDto, quiz: QuizEntity, questionId: string): ChangeQuestionOrderInput {
		return {
			quiz,
			previousQuestionId: dto.previousQuestionId ?? null,
			nextQuestionId: dto.nextQuestionId ?? null,
			questionId,
		};
	}
}
