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
import { USER_TYPES } from './user';
import type { IConfigService } from './config';
import type { IExceptionFilter } from './error';
import cors from 'cors';

@injectable()
export class App {
	public readonly app: Express;
	private server: Server;

	private readonly port: number;

	constructor(
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE) private readonly requestLoggerMiddleware: IMiddleware,
		@inject(AUTH_TYPES.AUTH_CONTROLLER) private readonly authController: IController,
		@inject(AUTH_TYPES.AUTH_MIDDLEWARE) private readonly authMiddleware: IMiddleware,
		@inject(USER_TYPES.USER_CONTROLLER) private readonly userController: IController,
		@inject(APP_TYPES.CONFIG) private readonly configService: IConfigService,
		@inject(APP_TYPES.EXCEPTION_FILTER) private readonly exceptionFilter: IExceptionFilter,
		@inject(APP_TYPES.SWAGGER) private readonly swaggerController: IController,
	) {
		this.app = express();

		this.port = this.configService.get<number>('PORT');
	}

	public async start(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilter();

		await this.prismaService.connect();

		this.logger.success('[App] database connected');

		this.server = this.app.listen(this.port, () => {
			this.logger.success(`[App] server is running on port ${this.port}`);
		});
	}

	public async stop(): Promise<void> {
		this.server.close();

		this.logger.success('[App] server is stopped');
	}

	private useMiddlewares(): void {
		this.app.use(
			cors({
				origin: true,
				preflightContinue: true,
				credentials: true,
			}),
		);
		this.app.use(bodyParser.json());
		this.app.use(cookieParser());

		this.app.use(this.authMiddleware.execute.bind(this.authMiddleware));

		this.app.use(this.requestLoggerMiddleware.execute.bind(this.requestLoggerMiddleware));
	}

	private useRoutes(): void {
		this.app.use(this.swaggerController.router);

		this.app.use('/api/auth', this.authController.router);
		this.app.use('/api/user', this.userController.router);
	}

	private useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
}
