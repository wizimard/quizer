import type { QuizCreateDto } from '../dto/quiz-create.dto';
import type { QuizSettingsUpdateDto } from '../dto/quiz-settings-update.dto';
import type { QuizUpdateDto } from '../dto/quiz-update.dto';
import type { IQuestionConfigBase } from '../../../domain/value-objects/question-configs/question-config.interface';
import type { CreateQuizCommand } from '../../../application/commands/create-quiz.command';
import type { UpdateQuizCommand } from '../../../application/commands/update-quiz.command';
import type { UpdateQuizSettingsCommand } from '../../../application/commands/update-quiz-settings.command';

export class QuizRequestMapper {
	static toCreateCommand(dto: QuizCreateDto, authorId: string): CreateQuizCommand {
		return {
			title: dto.title,
			authorId,
			questions: dto.questions.map((question) => ({
				id: question.id,
				description: question.description,
				order: question.order,
				config: question.config as IQuestionConfigBase,
			})),
		};
	}

	static toUpdateCommand(dto: QuizUpdateDto, authorId: string): UpdateQuizCommand {
		const command: UpdateQuizCommand = {
			id: dto.id,
			authorId,
		};

		if (dto.title !== undefined) {
			command.title = dto.title;
		}

		if (dto.add !== undefined) {
			command.add = dto.add.map((question) => ({
				id: question.id,
				description: question.description,
				order: question.order,
				config: question.config as IQuestionConfigBase,
			}));
		}

		if (dto.update !== undefined) {
			command.update = dto.update.map((question) => ({
				id: question.id,
				description: question.description,
				order: question.order,
				config: question.config as IQuestionConfigBase,
			}));
		}

		if (dto.delete !== undefined) {
			command.delete = dto.delete;
		}

		return command;
	}

	static toUpdateSettingsCommand(quizId: string, dto: QuizSettingsUpdateDto, authorId: string): UpdateQuizSettingsCommand {
		const command: UpdateQuizSettingsCommand = {
			quizId,
			authorId,
			isRequiredEmail: dto.isRequiredEmail,
			isRequiredFirstName: dto.isRequiredFirstName,
			isRequiredLastName: dto.isRequiredLastName,
			isShowAnswersAfterCompletion: dto.isShowAnswersAfterCompletion,
		};

		if (dto.available_periods) {
			command.availablePeriods = {};

			if (dto.available_periods.add?.length) {
				command.availablePeriods.add = dto.available_periods.add.map((period) => {
					const item: { available_from: Date; available_to?: Date } = { available_from: period.available_from };
					if (period.available_to !== undefined) {
						item.available_to = period.available_to;
					}
					return item;
				});
			}

			if (dto.available_periods.update?.length) {
				command.availablePeriods.update = dto.available_periods.update.map((period) => {
					const item: { id: number; available_from: Date; available_to?: Date } = {
						id: period.id,
						available_from: period.available_from,
					};
					if (period.available_to !== undefined) {
						item.available_to = period.available_to;
					}
					return item;
				});
			}

			if (dto.available_periods.remove?.length) {
				command.availablePeriods.remove = dto.available_periods.remove;
			}
		}

		return command;
	}
}
