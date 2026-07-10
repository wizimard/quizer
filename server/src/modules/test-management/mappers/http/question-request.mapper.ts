import type { QuestionCreateDto } from '../../dto/http/question-create.dto';
import type { IQuestionConfigBase } from '../../entities/question-configs/question-config.interface';
import type { QuestionUpdateDto } from '../../dto/http/question-update.dto';
import type { TestEntity } from '../..';
import type { QuestionChangeOrderDto } from '@modules/test-management/dto/http/question-change-order.dto';
import type { CreateQuestionInput } from '@modules/test-management/interfaces/services/input/create-question.input';
import type { DeleteQuestionInput } from '@modules/test-management/interfaces/services/input/delete-question.input';
import type { ChangeQuestionOrderInput } from '@modules/test-management/interfaces/services/input/update-question-order.input';
import type { UpdateQuestionInput } from '@modules/test-management/interfaces/services/input/update-question.input';

export class QuestionRequestMapper {
	static toCreateInput(dto: QuestionCreateDto, test: TestEntity): CreateQuestionInput {
		return {
			testId: test.id.value,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
			sortKey: (test.questions.length + 1) * 1000,
		};
	}

	static toUpdateInput(dto: QuestionUpdateDto, testId: string, questionId: string): UpdateQuestionInput {
		return {
			id: questionId,
			testId,
			description: dto.description,
			config: dto.config as IQuestionConfigBase,
		};
	}

	static toDeleteInput(id: string, testId: string): DeleteQuestionInput {
		return {
			id,
			testId,
		};
	}

	static toChangeOrderInput(dto: QuestionChangeOrderDto, test: TestEntity, questionId: string): ChangeQuestionOrderInput {
		return {
			test,
			previousQuestionId: dto.previousQuestionId ?? null,
			nextQuestionId: dto.nextQuestionId ?? null,
			questionId,
		};
	}
}
