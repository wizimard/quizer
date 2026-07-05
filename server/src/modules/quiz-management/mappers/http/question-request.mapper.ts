import type { CreateQuestionInput, DeleteQuestionInput, UpdateQuestionInput } from '../../interfaces/input/question.input';
import type { QuestionCreateDto } from '../../dto/question-create.dto';
import type { IQuestionConfigBase } from '../../entities/question-configs/question-config.interface';
import type { QuestionUpdateDto } from '../../dto/question-update.dto';
import type { QuizEntity } from '../..';

export class QuestionRequestMapper {
	static toCreateInput(dto: QuestionCreateDto, quiz: QuizEntity): CreateQuestionInput {
		return {
			quizId: quiz.id.value,
			description: dto.description,
			order: quiz.questions.length + 1,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toUpdateInput(dto: QuestionUpdateDto, quizId: string, questionId: string): UpdateQuestionInput {
		return {
			id: questionId,
			quizId,
			description: dto.description,
			order: dto.order,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toDeleteInput(id: string, quizId: string): DeleteQuestionInput {
		return {
			id,
			quizId,
		};
	}
}
