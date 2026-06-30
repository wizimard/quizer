import { inject, injectable } from 'inversify';
import { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import { QuestionNotFoundError } from '../../domain/errors/question-not-found.error';
import { evaluateAnswer } from '../../domain/services/answer-evaluator.registry';
import type { QuestionReadRepository } from '../../domain/repositories/question-read.repository.port';
import { SubmittedAnswer } from '../../domain/value-objects/submitted-answer.vo';
import { QE_TYPES } from '../../quiz-execution.types';
import type { EvaluateAnswerCommand } from '../commands/evaluate-answer.command';
import type { EvaluationResultDto } from '../dto/evaluation-result.dto';

@injectable()
export class EvaluateAnswerHandler {
	constructor(@inject(QE_TYPES.QUESTION_READ_REPOSITORY) private readonly questionRepository: QuestionReadRepository) {}

	async execute(command: EvaluateAnswerCommand): Promise<EvaluationResultDto> {
		const question = await this.questionRepository.findById(QuizId.of(command.quizId), command.questionId);

		if (!question) {
			throw new QuestionNotFoundError();
		}

		const isCorrect = evaluateAnswer(question.config, SubmittedAnswer.of(command.answer).value);

		return { correct: isCorrect };
	}
}
