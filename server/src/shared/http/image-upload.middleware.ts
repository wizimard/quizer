import type { Request, Response, NextFunction } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import { HttpError } from '@shared/error';
import type { IMiddleware } from './middleware.interface';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
	fileFilter: (_req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
		if (file.mimetype.startsWith('image/')) {
			callback(null, true);
			return;
		}

		callback(new HttpError(422, 'invalid_image_type', 'ImageUploadMiddleware'));
	},
});

export class ImageUploadMiddleware implements IMiddleware {
	private readonly middleware = upload.single('image');

	execute(req: Request, res: Response, next: NextFunction): void {
		this.middleware(req, res, (error: unknown) => {
			if (error instanceof multer.MulterError) {
				if (error.code === 'LIMIT_FILE_SIZE') {
					next(new HttpError(422, 'image_too_large', 'ImageUploadMiddleware'));
					return;
				}

				next(new HttpError(422, error.code, 'ImageUploadMiddleware'));
				return;
			}

			if (error) {
				next(error);
				return;
			}

			next();
		});
	}
}
