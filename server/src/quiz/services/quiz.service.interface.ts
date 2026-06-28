import type { QuizCreateDto } from '../dto/quiz-create.dto';
import type { IQuizExecuteResponse } from '../types/quiz-execute-response.interface';
import type { IQuizResponse } from '../types/quiz-response.interface';
import type { QuizUpdateDto } from '../dto/quiz-update.dto';
import type { QuizSettingsUpdateDto } from '../dto/quiz-settings-update.dto';

export interface IQuizService {
	getById(quizId: string, userId: string): Promise<IQuizResponse>;
	getByAuthor(userId: string): Promise<IQuizResponse[]>;
	create(quizCreateDto: QuizCreateDto, userId: string): Promise<IQuizResponse>;
	update(quizUpdateDto: QuizUpdateDto, userId: string): Promise<IQuizResponse>;
	delete(quizId: string, userId: string): Promise<void>;

	getByIdForExecute(quizId: string): Promise<IQuizExecuteResponse>;

	updateSettings(quizId: string, settingsDto: QuizSettingsUpdateDto, userId: string): Promise<IQuizResponse>;
}
