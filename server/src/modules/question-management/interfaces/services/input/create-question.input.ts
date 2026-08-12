import type { IQuestionConfigBase } from '@modules/test-management/entities/question-configs/question-config.interface';

export interface QuestionImageFile {
	buffer: Buffer;
	originalName: string;
}

export interface CreateQuestionInput {
	testId: string;
	description: string;
	config: IQuestionConfigBase;
	score?: number;
	imageFile?: QuestionImageFile;
}
