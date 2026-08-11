import type { QuestionCreateRequestDto } from '../../dto/http/request/question-create.request-dto';
import type { IQuestionConfigBase } from '@modules/test-management/entities/question-configs/question-config.interface';
import type { QuestionUpdateRequestDto } from '../../dto/http/request/question-update.request-dto';
import type { TestEntity } from '@modules/test-management/entities/test.entity';
import type { QuestionChangeOrderRequestDto } from '../../dto/http/request/question-change-order.request-dto';
import type { CreateQuestionInput } from '../../interfaces/services/input/create-question.input';
import type { DeleteQuestionInput } from '../../interfaces/services/input/delete-question.input';
import type { ChangeQuestionOrderInput } from '../../interfaces/services/input/update-question-order.input';
import type { UpdateQuestionInput } from '../../interfaces/services/input/update-question.input';

export class QuestionInputMapper {
	static toCreateInput(dto: QuestionCreateRequestDto, test: TestEntity): CreateQuestionInput {
		return {
			testId: test.id,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toUpdateInput(dto: QuestionUpdateRequestDto, questionId: string, testId: string): UpdateQuestionInput {
		return {
			id: questionId,
			testId,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toDeleteInput(questionId: string, testId: string): DeleteQuestionInput {
		return {
			id: questionId,
			testId,
		};
	}

	static toChangeOrderInput(dto: QuestionChangeOrderRequestDto, questionId: string, testId: string): ChangeQuestionOrderInput {
		return {
			testId,
			previousQuestionId: dto.previous_question_id ?? null,
			nextQuestionId: dto.next_question_id ?? null,
			questionId,
		};
	}
}
