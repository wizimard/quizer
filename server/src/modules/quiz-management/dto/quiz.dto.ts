import type { QuizSettingsDto } from './quiz-settings.dto';

export interface QuestionDto {
	id: string;
	quizId: string;
	description: string;
	order: number;
	config: object;
}

export interface QuizDto {
	id: string;
	authorId: string;
	title: string;
	questions: QuestionDto[];
	settings: QuizSettingsDto;
	updatedAt: Date;
	createdAt: Date;
}
