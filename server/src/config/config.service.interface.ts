export interface IConfigService {
	get<T extends string | number | boolean>(key: string): T;
}
