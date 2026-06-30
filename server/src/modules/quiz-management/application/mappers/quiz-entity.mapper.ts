import { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { QuizEntity } from '../../domain/entities/quiz.entity';
import { QuestionConfigFactory } from '../../domain/value-objects/question-configs/question-config.factory';
import { QuizId } from '../../domain/value-objects/quiz-id.vo';
import type { CreateQuestionInput } from '../commands/create-quiz.command';
import type { CreateQuizCommand } from '../commands/create-quiz.command';

const configFactory = new QuestionConfigFactory();

const NEW_QUIZ_ID = QuizId.of('new');

function toQuestionEntity(input: CreateQuestionInput, quizId: QuizId): QuestionEntity {
	return new QuestionEntity(input.id, quizId, input.description, input.order, configFactory.getConfig(input.config));
}

export function buildQuizFromCreateCommand(command: CreateQuizCommand): QuizEntity {
	const questions = command.questions.map((question) => toQuestionEntity(question, NEW_QUIZ_ID));

	return new QuizEntity(NEW_QUIZ_ID, command.title, UserId.of(command.authorId), questions, null, new Date(), new Date());
}

export function buildQuestionsFromInputs(inputs: CreateQuestionInput[], quizId: QuizId): QuestionEntity[] {
	return inputs.map((input) => toQuestionEntity(input, quizId));
}
