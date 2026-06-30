export interface IUser {
	id: string;
	email: string;
	password: string;
	setPassword(password: string, hasher: (value: string) => Promise<string>): Promise<this>;
}
