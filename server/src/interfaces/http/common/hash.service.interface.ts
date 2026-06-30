export interface IHashService {
	hash(data: string): Promise<string>;
	verifyHash(data: string, hashed: string): Promise<boolean>;
}
