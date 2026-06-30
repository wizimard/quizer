import type { QuizModel, QuizSettingsModel } from '@prisma/client';
import type { QuizModelGetPayload, QuizSettingsModelGetPayload } from '@prisma/models';

export type TQuizSettingsModelAll = QuizSettingsModel &
	QuizSettingsModelGetPayload<{ select: { availablePeriods: true; isShowAnswersAfterCompletion: true; isRequiredEmail: true; isRequiredFirstName: true; isRequiredLastName: true } }>;

export type TQuizModelWithQuestions = QuizModel & QuizModelGetPayload<{ select: { questions: true } }>;

export type TQuizModelAll = QuizModel &
	QuizModelGetPayload<{
		select: {
			questions: true;
			quizSettings: { select: { availablePeriods: true; isShowAnswersAfterCompletion: true; isRequiredEmail: true; isRequiredFirstName: true; isRequiredLastName: true } };
		};
	}>;
