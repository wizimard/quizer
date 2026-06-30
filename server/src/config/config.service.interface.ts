export interface IConfigService {
	get<T extends string | number | boolean>(key: string): T;
	getOptional<T extends string | number | boolean>(key: string): T | undefined;
}
