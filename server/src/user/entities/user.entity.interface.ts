export interface IUser {
	id: string;
	email: string;
	password: string;
	setPassword(password: string): Promise<this>;
}
