import { inject, injectable } from 'inversify';
import { Server } from 'http';
import express, { type Express } from 'express';
import { APP_TYPES } from './app.types';
import type { ILogger } from '@shared/logger';
import { IA_TYPES } from '@modules/identity-access/identity-access.types';
import type { IController } from '@shared/http/controller.interface';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { IMiddleware } from '@shared/http/middleware.interface';
import type { IConfigService } from '@shared/config';
import type { IExceptionFilter } from '@shared/error';
import cors from 'cors';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import { TE_TYPES } from '@modules/test-execution/test-execution.types';

@injectable()
export class App {
	public readonly app: Express;
	private server: Server | undefined;

	private readonly port: number;

	constructor(
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(APP_TYPES.REQUEST_CONTEXT_MIDDLEWARE) private readonly requestContextMiddleware: IMiddleware,
		@inject(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE) private readonly requestLoggerMiddleware: IMiddleware,
		@inject(IA_TYPES.AUTH_CONTROLLER) private readonly authController: IController,
		@inject(IA_TYPES.AUTH_MIDDLEWARE) private readonly authMiddleware: IMiddleware,
		@inject(IA_TYPES.USER_CONTROLLER) private readonly userController: IController,
		@inject(APP_TYPES.CONFIG) private readonly configService: IConfigService,
		@inject(APP_TYPES.EXCEPTION_FILTER) private readonly exceptionFilter: IExceptionFilter,
		@inject(APP_TYPES.SWAGGER) private readonly swaggerController: IController,
		@inject(TM_TYPES.TEST_CONTROLLER) private readonly testController: IController,
		@inject(TM_TYPES.QUESTION_CONTROLLER) private readonly questionController: IController,
		@inject(TE_TYPES.TEST_EXECUTE_CONTROLLER) private readonly testExecuteController: IController,
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
		this.app.use('/api/test-execute', this.testExecuteController.router);
		this.app.use('/api/test', this.testController.router);
		this.app.use('/api/question', this.questionController.router);
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
