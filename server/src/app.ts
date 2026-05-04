import { inject, injectable } from 'inversify';
import { Server } from 'http';
import express, { type Express } from 'express';
import { APP_TYPES } from './app.types';
import type { ILogger } from './logger';
import type { IPrismaService } from './database';
import { AUTH_TYPES } from './auth';
import type { IController } from '@common/controller.interface';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { IMiddleware } from '@common/middleware.interface';
import { USER_TYPES } from './user/user.types';

@injectable()
export class App {
	private express: Express;
	private server: Server;

	constructor(
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE) private readonly requestLoggerMiddleware: IMiddleware,
		@inject(AUTH_TYPES.AUTH_CONTROLLER) private readonly authController: IController,
		@inject(AUTH_TYPES.AUTH_MIDDLEWARE) private readonly authMiddleware: IMiddleware,
		@inject(USER_TYPES.USER_CONTROLLER) private readonly userController: IController,
	) {
		this.express = express();
	}

	public async start(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();

		await this.prismaService.connect();

		this.logger.success('[App] Database connected');

		this.server = this.express.listen(8031, () => {
			this.logger.success('[App] Server is running on port 8031');
		});
	}

	public async stop(): Promise<void> {
		this.server.close();

		console.log('Server is stopped');
	}

	private useMiddlewares(): void {
		this.express.use(bodyParser.json());
		this.express.use(cookieParser());

		this.express.use(this.authMiddleware.execute.bind(this.authMiddleware));

		this.express.use(this.requestLoggerMiddleware.execute.bind(this.requestLoggerMiddleware));
	}

	private useRoutes(): void {
		this.express.use('/api/auth', this.authController.router);
		this.express.use('/api/user', this.userController.router);
	}
}
