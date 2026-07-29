import type { QuestionEntity, TestSessionEntity } from '@modules/test-management';
import type { Answer } from '../entities/answer';
import { TestSessionRunMode } from '@prisma/client';
import type { ILogger } from '@shared/logger';

export function getCurrentQuestion(
	session: TestSessionEntity,
	questions: Array<QuestionEntity>,
	answers: Array<Answer>,
	logger: ILogger,
): { question: QuestionEntity | null; questionIndex: number } {
	if (session.runMode === TestSessionRunMode.MANUAL) {
		logger.info(`[getCurrentQuestion] session ${session.id} run mode is manual`);

		if (!session.currentQuestionId) {
			logger.info(`[getCurrentQuestion] no current question for session ${session.id}`);
			return { question: null, questionIndex: 0 };
		}

		const questionIndex = questions.findIndex((question) => question.id === session.currentQuestionId);

		if (questionIndex === -1) {
			logger.error(`[getCurrentQuestion] current question not found ${session.currentQuestionId} for session ${session.id}`);
			return { question: null, questionIndex: 0 };
		}

		if (answers.find((answer) => answer.questionId === questions[questionIndex]!.id)) {
			logger.info(`[getCurrentQuestion] current question already answered ${questions[questionIndex]!.id} for session ${session.id}`);
			return { question: null, questionIndex: questionIndex + 1 };
		}

		logger.info(`[getCurrentQuestion] found current question ${questions[questionIndex]!.id} for session ${session.id}`);

		return { question: questions[questionIndex]!, questionIndex: questionIndex + 1 };
	}

	logger.info(`[getCurrentQuestion] session ${session.id} run mode is free`);

	// TODO: optimize
	for (const question of questions) {
		if (!answers.find((answer) => answer.questionId === question.id)) {
			logger.info(`[getCurrentQuestion] found current question ${question.id} for session ${session.id}`);
			return { question: question, questionIndex: questions.findIndex((item) => item.id === question.id) + 1 };
		}
	}

	logger.info(`[getCurrentQuestion] user answered all questions for session ${session.id}`);

	return { question: null, questionIndex: questions.length };
}
