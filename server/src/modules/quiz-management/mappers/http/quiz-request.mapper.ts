import type { QuizCreateDto } from '../../dto/quiz-create.dto';
import type { QuizSettingsUpdateDto } from '../../dto/quiz-settings-update.dto';
import type { QuizAvailableEditDto } from '../../dto/quiz-available-edit.dto';
import type { QuizUpdateDto } from '../../dto/quiz-update.dto';
import type { CreateQuizInput, UpdateQuizAvailablePeriodsInput, UpdateQuizInput, UpdateQuizSettingsInput } from '../../interfaces/input/quiz.input';
import type { QuizStartDto } from '../../dto/quiz-start.dto';
import type { StartQuizInput } from '@modules/quiz-execution/types/start-quiz.input';
import type { QuizEntity } from '../../entities/quiz.entity';
import type { FinishQuizInput } from '@modules/quiz-execution/types/finish-quiz.input';

export class QuizRequestMapper {
	static toCreateInput(dto: QuizCreateDto, authorId: string): CreateQuizInput {
		return {
			title: dto.title,
			authorId,
		};
	}

	static toUpdateInput(quiz: QuizEntity, dto: QuizUpdateDto): UpdateQuizInput {
		const input: UpdateQuizInput = {
			id: quiz.id.value,
			authorId: quiz.authorId.value,
		};

		if (dto.title !== undefined) {
			input.title = dto.title;
		}

		return input;
	}

	static toUpdateSettingsInput(quiz: QuizEntity, dto: QuizSettingsUpdateDto): UpdateQuizSettingsInput {
		return {
			quiz,
			title: dto.title,
			isRequiredEmail: dto.isRequiredEmail,
			isRequiredFirstName: dto.isRequiredFirstName,
			isRequiredLastName: dto.isRequiredLastName,
			isShowAnswersAfterCompletion: dto.isShowAnswersAfterCompletion,
		};
	}

	static toUpdateAvailablePeriodsInput(quiz: QuizEntity, dto: QuizAvailableEditDto): UpdateQuizAvailablePeriodsInput {
		const input: UpdateQuizAvailablePeriodsInput = {
			quiz,
			availablePeriods: {},
		};

		if (dto.add?.length) {
			input.availablePeriods.add = dto.add.map((period) => {
				const item: { available_from: Date; available_to?: Date } = { available_from: new Date(period.available_from) };
				if (period.available_to !== undefined) {
					item.available_to = new Date(period.available_to);
				}
				return item;
			});
		}

		if (dto.update?.length) {
			input.availablePeriods.update = dto.update.map((period) => {
				const item: { id: number; available_from: Date; available_to?: Date } = {
					id: period.id,
					available_from: new Date(period.available_from),
				};
				if (period.available_to !== undefined) {
					item.available_to = new Date(period.available_to);
				}
				return item;
			});
		}

		if (dto.remove?.length) {
			input.availablePeriods.remove = dto.remove;
		}

		return input;
	}

	static toStartCommand(quiz: QuizEntity, dto: QuizStartDto): StartQuizInput {
		const command: StartQuizInput = {
			quiz,
		};

		if (dto.duration) {
			command.finishedAt = new Date(Date.now() + dto.duration * 1000);
		}

		return command;
	}

	static toFinishCommand(quiz: QuizEntity): FinishQuizInput {
		return {
			quiz,
		};
	}
}
