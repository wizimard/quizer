export interface IFileStorageService {
	save(data: Buffer, originalName: string): Promise<string>;
	delete(relativePath: string): Promise<void>;
}
