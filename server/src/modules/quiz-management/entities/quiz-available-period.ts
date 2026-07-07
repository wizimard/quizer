import type { QuizAvailablePeriodStatus } from '@prisma/client';
import type { IQuizAvailablePeriod, IQuizAvailablePeriodBase } from '../interfaces/quiz-available-period.interface';

export class QuizAvailablePeriod implements IQuizAvailablePeriod {
	constructor(
		public readonly id: number,
		public readonly quizSettingsId: string,
		public status: QuizAvailablePeriodStatus,
		public available_from: Date,
		public available_to?: Date | null,
	) {}

	public toObject(): IQuizAvailablePeriodBase {
		return {
			id: this.id,
			quizSettingsId: this.quizSettingsId,
			available_from: this.available_from,
			available_to: this.available_to,
			status: this.status,
		};
	}
}
