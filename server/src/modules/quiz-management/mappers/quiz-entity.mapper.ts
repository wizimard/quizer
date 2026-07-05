import { UserId } from '@modules/identity-access';
import { QuizEntity } from '../entities/quiz.entity';
import { QuizId } from '../entities/value-object/quiz-id';
import type { CreateQuizInput } from '../interfaces/input/quiz.input';

const NEW_QUIZ_ID = QuizId.of('new');

export function buildQuizFromCreateInput(input: CreateQuizInput): QuizEntity {
	return new QuizEntity(NEW_QUIZ_ID, input.title, UserId.of(input.authorId), [], null, new Date(), new Date());
}
