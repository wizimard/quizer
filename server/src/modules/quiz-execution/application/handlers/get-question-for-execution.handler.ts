import { inject, injectable } from 'inversify';
import { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import { QuestionNotFoundError } from '../../domain/errors/question-not-found.error';
import type { QuestionReadRepository } from '../../domain/repositories/question-read.repository.port';
import { QE_TYPES } from '../../quiz-execution.types';
import type { GetQuestionForExecutionQuery } from '../queries/get-question-for-execution.query';
import type { QuestionExecuteDto } from '../dto/question-execute.dto';
import { toQuestionExecuteDto } from '../mappers/to-question-execute.dto';

@injectable()
export class GetQuestionForExecutionHandler {
	constructor(@inject(QE_TYPES.QUESTION_READ_REPOSITORY) private readonly questionRepository: QuestionReadRepository) {}

	async execute(query: GetQuestionForExecutionQuery): Promise<QuestionExecuteDto> {
		const question = await this.questionRepository.findById(QuizId.of(query.quizId), query.questionId);

		if (!question) {
			throw new QuestionNotFoundError();
		}

		return toQuestionExecuteDto(question);
	}
}
