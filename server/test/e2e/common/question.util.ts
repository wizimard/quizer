import { existsSync } from 'node:fs';
import { join } from 'node:path';
import request, { type Response } from 'supertest';
import type { getBoot } from '../../../src/main';
import type { AuthUtils } from './auth.util';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

export type QuestionPayload = {
	description: string;
	config: object;
	score?: number;
};

export type QuestionResponseBody = {
	id: string;
	test_id: string;
	sort_key: number;
	description: string;
	score: number;
	image: string | null;
	config: object;
};

export const TEST_PNG_BUFFER = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

export const questionPayload = (
	description: string,
	overrides: Partial<{
		config: object;
		score: number;
	}> = {},
): QuestionPayload => ({
	description,
	config: {
		type: 'input',
		answer: '4',
		ignore_case: true,
	},
	...overrides,
});

export const getImageRelativePath = (imageUrl: string): string => {
	return imageUrl.replace(/^\/uploads\//, '');
};

export const imageExistsOnDisk = (imageUrl: string | null): boolean => {
	if (!imageUrl) {
		return false;
	}

	return existsSync(join(process.cwd(), 'uploads', getImageRelativePath(imageUrl)));
};

export class QuestionUtils {
	constructor(
		private readonly application: BootResult['app'],
		private readonly authUtils: AuthUtils,
	) {}

	async createQuestion(testId: string, description: string, options: { image?: Buffer; accessToken?: string } = {}): Promise<Response> {
		const accessToken = options.accessToken ?? (await this.authUtils.login()).accessToken;
		const req = request(this.application.app).post(`/api/question/${testId}/questions`).set('Authorization', `Bearer ${accessToken}`);

		if (options.image) {
			return req
				.field('description', description)
				.field('config', JSON.stringify(questionPayload(description).config))
				.attach('image', options.image, 'question.png');
		}

		return req.send(questionPayload(description));
	}

	async updateQuestion(testId: string, questionId: string, payload: QuestionPayload, options: { image?: Buffer; accessToken?: string } = {}): Promise<Response> {
		const accessToken = options.accessToken ?? (await this.authUtils.login()).accessToken;
		const req = request(this.application.app).patch(`/api/question/${testId}/questions/${questionId}`).set('Authorization', `Bearer ${accessToken}`);

		if (options.image) {
			return req.field('description', payload.description).field('config', JSON.stringify(payload.config)).attach('image', options.image, 'question.png');
		}

		return req.send(payload);
	}

	async deleteQuestion(testId: string, questionId: string, accessToken?: string): Promise<Response> {
		const token = accessToken ?? (await this.authUtils.login()).accessToken;

		return request(this.application.app).delete(`/api/question/${testId}/questions/${questionId}`).set('Authorization', `Bearer ${token}`);
	}
}
