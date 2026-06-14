import type { QuizCreateDto } from '../dto/quiz-create.dto';
import type { IQuizResponse } from '../dto/quiz-response.dto';
import type { QuizUpdateDto } from '../dto/quiz-update.dto';

export interface IQuizService {
	getById(quizId: string, userId: string): Promise<IQuizResponse>;
	getByAuthor(userId: string): Promise<IQuizResponse[]>;
	create(quizCreateDto: QuizCreateDto, userId: string): Promise<IQuizResponse>;
	update(quizUpdateDto: QuizUpdateDto, userId: string): Promise<IQuizResponse>;
	delete(quizId: string, userId: string): Promise<void>;
}
