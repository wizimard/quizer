import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { QUIZ_TYPES } from './quiz.types';
import { QuestionRepository } from './repositories/question.repository';
import { QuizRepository } from './repositories/quiz.repository';
import { QuizService } from './services/quiz.service';
import { QuizController } from './controllers/quiz.controller';
import type { IQuizRepository } from './repositories/quiz.repository.interface';
import type { IQuestionRepository } from './repositories/question.repository.interface';
import type { IQuizService } from './services/quiz.service.interface';
import type { IController } from '@common/controller.interface';

const quizContainer: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<IQuestionRepository>(QUIZ_TYPES.QUESTION_REPOSITORY).to(QuestionRepository).inSingletonScope();
	options.bind<IQuizRepository>(QUIZ_TYPES.QUIZ_REPOSITORY).to(QuizRepository).inSingletonScope();
	options.bind<IQuizService>(QUIZ_TYPES.QUIZ_SERVICE).to(QuizService).inSingletonScope();
	options.bind<IController>(QUIZ_TYPES.QUIZ_CONTROLLER).to(QuizController).inSingletonScope();
});

export { quizContainer, QUIZ_TYPES, type IQuestionRepository, type IQuizRepository, type IQuizService };
