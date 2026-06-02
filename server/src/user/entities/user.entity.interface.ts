export interface IUser {
	email: string;
	password: string;
	setPassword(password: string): Promise<this>;
}
