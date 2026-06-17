import type { QuizCreateDto } from '../dto/quiz-create.dto';
import { QuizEntity } from '../entities/quiz.entity';
import type { IQuizEntity } from '../entities/quiz.entity.interface';
import type { IQuestionResponse } from '../dto/questions-response.interface';
import type { IQuizResponse } from '../dto/quiz-response.dto';
import type { TQuizModelWithQuestions } from '../repositories/quiz.repository.interface';
import type { QuizModel } from '@prisma/client';
import type { IQuestionEntity } from '../entities/question.entity.interface';
import { QuestionMapper } from './question.mapper';
import type { IQuizExecuteResponse } from '../dto/quiz-execute-response.dto';

export class QuizMapper {
	private readonly questionMapper: QuestionMapper = new QuestionMapper();

	public toEntityFromCreateDto(quizDto: QuizCreateDto, authorId: string): IQuizEntity {
		const questions = quizDto.questions.map((questionDto) => this.questionMapper.toEntityFromCreateDto(questionDto, 'new'));

		return new QuizEntity('new', quizDto.title, authorId, questions, new Date(), new Date());
	}

	public toEntityFromRepositry(quizModel: TQuizModelWithQuestions | QuizModel): IQuizEntity {
		const question: IQuestionEntity[] = 'questions' in quizModel ? quizModel.questions.map((question) => this.questionMapper.toEntityFromRepository(question)) : [];

		return new QuizEntity(quizModel.id, quizModel.title, quizModel.authorId, question, quizModel.updatedAt, quizModel.createdAt);
	}

	public toResponseFromEntity(quiz: IQuizEntity): IQuizResponse {
		const questions: IQuestionResponse[] = quiz.questions.map((question) => ({
			id: question.id,
			quizId: question.quizId,
			description: question.description,
			order: question.order,
			config: question.config.toObject(),
		}));

		return {
			id: quiz.id,
			title: quiz.title,
			authorId: quiz.authorId,
			questions,
			updatedAt: quiz.updatedAt,
			createdAt: quiz.createdAt,
		};
	}

	public toResponseFromRepository(quizModel: TQuizModelWithQuestions | QuizModel): IQuizResponse {
		const quiz: IQuizEntity = this.toEntityFromRepositry(quizModel);

		return this.toResponseFromEntity(quiz);
	}

	public toResponseExecuteFromRepository(quizModel: TQuizModelWithQuestions | QuizModel): IQuizExecuteResponse {
		const quiz: IQuizEntity = this.toEntityFromRepositry(quizModel);

		return {
			id: quiz.id,
			title: quiz.title,
			authorId: quiz.authorId,
		};
	}
}
