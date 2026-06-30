import type { ExecutableQuiz } from '../../domain/read-models/executable-quiz.read-model';
import type { QuizEntity } from '@modules/quiz-management/domain/entities/quiz.entity';
import type { ExecutableQuizDto } from '../dto/executable-quiz.dto';

export function toExecutableQuizDto(quiz: QuizEntity): ExecutableQuizDto {
	return {
		id: quiz.id.value,
		authorId: quiz.authorId.value,
		title: quiz.title,
		isOpen: quiz.isOpen(),
	};
}

export function toExecutableQuizDtoFromReadModel(quiz: ExecutableQuiz): ExecutableQuizDto {
	return {
		id: quiz.id,
		authorId: quiz.authorId,
		title: quiz.title,
		isOpen: quiz.isOpen,
	};
}
