import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { basename, extname, join, resolve, sep } from 'node:path';
import { injectable } from 'inversify';
import { Helper } from '@shared/utils/helper';
import type { IFileStorageService } from './file-storage.service.interface';

@injectable()
export class FileStorageService implements IFileStorageService {
	private readonly uploadsRoot = resolve(process.cwd(), 'uploads');

	public async save(data: Buffer, originalName: string): Promise<string> {
		const dateFolder = new Date().toISOString().slice(0, 10);
		const extension = extname(basename(originalName));
		const fileName = `${Helper.generateId()}${extension}`;
		const relativePath = join(dateFolder, fileName).split(sep).join('/');
		const absoluteDir = join(this.uploadsRoot, dateFolder);

		await mkdir(absoluteDir, { recursive: true });
		await writeFile(join(absoluteDir, fileName), data);

		return relativePath;
	}

	public async delete(relativePath: string): Promise<void> {
		await unlink(this.resolveSafePath(relativePath));
	}

	private resolveSafePath(relativePath: string): string {
		const normalized = relativePath.replaceAll('\\', '/').replace(/^\/+/, '');
		const absolutePath = resolve(this.uploadsRoot, normalized);

		if (!absolutePath.startsWith(this.uploadsRoot + sep) && absolutePath !== this.uploadsRoot) {
			throw new Error('Invalid file path');
		}

		return absolutePath;
	}
}
