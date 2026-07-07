import type { QuizSettingsDto } from './quiz-settings.entity.dto';
import type { TQuizStatus } from '../../interfaces/http/quiz-response.interface';

export interface QuestionDto {
	id: string;
	quizId: string;
	sortKey: number;
	description: string;
	config: object;
}

export interface QuizDto {
	id: string;
	authorId: string;
	title: string;
	status: TQuizStatus;
	questions: QuestionDto[];
	settings: QuizSettingsDto;
	updatedAt: Date;
	createdAt: Date;
}
