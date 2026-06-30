import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { QE_TYPES } from './quiz-execution.types';
import type { QuestionReadRepository } from './domain/repositories/question-read.repository.port';
import type { QuizExecutionRepository } from './domain/repositories/quiz-execution.repository.port';
import { PrismaQuestionReadRepository } from './infrastructure/persistence/repositories/prisma-question-read.repository';
import { PrismaQuizExecutionRepository } from './infrastructure/persistence/repositories/prisma-quiz-execution.repository';
import { EvaluateAnswerHandler } from './application/handlers/evaluate-answer.handler';
import { StartQuizHandler } from './application/handlers/start-quiz.handler';
import { FinishQuizHandler } from './application/handlers/finish-quiz.handler';
import { GetQuizForExecutionHandler } from './application/handlers/get-quiz-for-execution.handler';
import { GetQuestionForExecutionHandler } from './application/handlers/get-question-for-execution.handler';
import { QuizExecuteController } from './interfaces/http/controllers/quiz-execute.controller';

const quizExecutionModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<QuestionReadRepository>(QE_TYPES.QUESTION_READ_REPOSITORY).to(PrismaQuestionReadRepository).inSingletonScope();
	options.bind<QuizExecutionRepository>(QE_TYPES.QUIZ_EXECUTION_REPOSITORY).to(PrismaQuizExecutionRepository).inSingletonScope();
	options.bind(QE_TYPES.EVALUATE_ANSWER_HANDLER).to(EvaluateAnswerHandler).inSingletonScope();
	options.bind(QE_TYPES.START_QUIZ_HANDLER).to(StartQuizHandler).inSingletonScope();
	options.bind(QE_TYPES.FINISH_QUIZ_HANDLER).to(FinishQuizHandler).inSingletonScope();
	options.bind(QE_TYPES.GET_QUIZ_FOR_EXECUTION_HANDLER).to(GetQuizForExecutionHandler).inSingletonScope();
	options.bind(QE_TYPES.GET_QUESTION_FOR_EXECUTION_HANDLER).to(GetQuestionForExecutionHandler).inSingletonScope();
	options.bind(QE_TYPES.QUIZ_EXECUTE_CONTROLLER).to(QuizExecuteController).inSingletonScope();
});

export { quizExecutionModule, QE_TYPES };
