import { inject, injectable } from 'inversify';
import { Server } from 'http';
import express, { type Express } from 'express';
import { APP_TYPES } from './app.types';
import type { ILogger } from './logger';
import { AUTH_TYPES } from '@composition/auth.types';
import type { IController } from '@common/controller.interface';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { IMiddleware } from '@common/middleware.interface';
import { USER_TYPES } from '@composition/user.types';
import type { IConfigService } from './config';
import type { IExceptionFilter } from './error';
import cors from 'cors';
import { QUIZ_TYPES } from '@composition/quiz.types';

@injectable()
export class App {
	public readonly app: Express;
	private server: Server | undefined;

	private readonly port: number;

	constructor(
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(APP_TYPES.REQUEST_CONTEXT_MIDDLEWARE) private readonly requestContextMiddleware: IMiddleware,
		@inject(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE) private readonly requestLoggerMiddleware: IMiddleware,
		@inject(AUTH_TYPES.AUTH_CONTROLLER) private readonly authController: IController,
		@inject(AUTH_TYPES.AUTH_MIDDLEWARE) private readonly authMiddleware: IMiddleware,
		@inject(USER_TYPES.USER_CONTROLLER) private readonly userController: IController,
		@inject(APP_TYPES.CONFIG) private readonly configService: IConfigService,
		@inject(APP_TYPES.EXCEPTION_FILTER) private readonly exceptionFilter: IExceptionFilter,
		@inject(APP_TYPES.SWAGGER) private readonly swaggerController: IController,
		@inject(QUIZ_TYPES.QUIZ_CONTROLLER) private readonly quizController: IController,
		@inject(QUIZ_TYPES.QUIZ_EXECUTE_CONTROLLER) private readonly quizExecuteController: IController,
	) {
		this.app = express();

		this.port = this.configService.get<number>('PORT');
	}

	public async start(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilter();

		await new Promise<void>((resolve) => {
			this.server = this.app.listen(this.port, () => {
				this.logger.success(`[App] server is running on port ${this.port}`);
				resolve();
			});
		});
	}

	public async stop(): Promise<void> {
		if (!this.server) {
			return;
		}

		await new Promise<void>((resolve, reject) => {
			this.server!.close((error) => {
				if (error) {
					reject(error);
					return;
				}

				this.logger.success('[App] server is stopped');
				resolve();
			});
		});
	}

	private useMiddlewares(): void {
		this.app.use(
			cors({
				origin: this.getCorsOrigins(),
				credentials: true,
			}),
		);
		this.app.use(bodyParser.json());
		this.app.use(cookieParser());

		this.app.use(this.authMiddleware.execute.bind(this.authMiddleware));
		this.app.use(this.requestContextMiddleware.execute.bind(this.requestContextMiddleware));
		this.app.use(this.requestLoggerMiddleware.execute.bind(this.requestLoggerMiddleware));
	}

	private useRoutes(): void {
		this.app.use(this.swaggerController.router);

		this.app.use('/api/auth', this.authController.router);
		this.app.use('/api/user', this.userController.router);
		this.app.use('/api/quiz', this.quizController.router);
		this.app.use('/api', this.quizExecuteController.router);
	}

	private useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	private getCorsOrigins(): string | string[] {
		const configuredOrigins = this.configService.getOptional<string>('CORS_ORIGINS');

		if (!configuredOrigins) {
			return ['http://localhost:3000', 'http://localhost:5173'];
		}

		const origins = configuredOrigins
			.split(',')
			.map((origin) => origin.trim())
			.filter(Boolean);

		return origins.length === 1 ? origins[0]! : origins;
	}
}
