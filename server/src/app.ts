import { injectable } from 'inversify';
import { Server } from 'http';
import express, { type Express } from 'express';

@injectable()
export class App {
	private express: Express;
	private server: Server;

	constructor() {
		console.log('App constructor');

		this.express = express();
	}

	public async start(): Promise<void> {
		this.server = this.express.listen(8031, () => {
			console.log('Server is running on port 8031');
		});
	}

	public async stop(): Promise<void> {
		this.server.close();

		console.log('Server is stopped');
	}
}
