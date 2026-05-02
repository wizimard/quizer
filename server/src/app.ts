import { inject, injectable } from 'inversify';
import { Server } from 'http';
import express, { type Express } from 'express';
import { APP_TYPES } from './app.types';
import type { ILogger } from './logger/logger.interface';
import type { IPrismaService } from './database/prisma.service.interface';

@injectable()
export class App {
	private express: Express;
	private server: Server;

	constructor(
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
	) {
		this.express = express();
	}

	public async start(): Promise<void> {
		await this.prismaService.connect();

		this.logger.success('[PrismaService] Database connected');

		this.server = this.express.listen(8031, () => {
			this.logger.success('Server is running on port 8031');
		});
	}

	public async stop(): Promise<void> {
		this.server.close();

		console.log('Server is stopped');
	}
}
