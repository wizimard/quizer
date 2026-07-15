import type { QuestionCreateRequestDto } from '../../dto/http/request/question-create.request-dto';
import type { IQuestionConfigBase } from '../../entities/question-configs/question-config.interface';
import type { QuestionUpdateRequestDto } from '../../dto/http/request/question-update.request-dto';
import { type QuestionEntity, type TestEntity } from '../..';
import type { QuestionChangeOrderRequestDto } from '@modules/test-management/dto/http/request/question-change-order.request-dto';
import type { CreateQuestionInput } from '@modules/test-management/interfaces/services/input/create-question.input';
import type { DeleteQuestionInput } from '@modules/test-management/interfaces/services/input/delete-question.input';
import type { ChangeQuestionOrderInput } from '@modules/test-management/interfaces/services/input/update-question-order.input';
import type { UpdateQuestionInput } from '@modules/test-management/interfaces/services/input/update-question.input';

export class QuestionInputMapper {
	static toCreateInput(dto: QuestionCreateRequestDto, test: TestEntity): CreateQuestionInput {
		return {
			testId: test.id,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toUpdateInput(dto: QuestionUpdateRequestDto, question: QuestionEntity): UpdateQuestionInput {
		return {
			id: question.id,
			testId: question.testId,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toDeleteInput(question: QuestionEntity): DeleteQuestionInput {
		return {
			id: question.id,
			testId: question.testId,
		};
	}

	static toChangeOrderInput(dto: QuestionChangeOrderRequestDto, question: QuestionEntity): ChangeQuestionOrderInput {
		return {
			testId: question.testId,
			previousQuestionId: dto.previous_question_id ?? null,
			nextQuestionId: dto.next_question_id ?? null,
			questionId: question.id,
		};
	}
}
