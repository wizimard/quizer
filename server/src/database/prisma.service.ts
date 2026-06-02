import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../app.types';
import type { IConfigService } from '../config/config.service.interface';
import type { IPrismaService } from './prisma.service.interface';

@injectable()
export class PrismaService implements IPrismaService {
	public readonly client: PrismaClient;

	constructor(@inject(APP_TYPES.CONFIG) private configService: IConfigService) {
		this.client = new PrismaClient({
			adapter: new PrismaPg({
				connectionString: configService.get<string>('DATABASE_URL'),
			}),
		});
	}

	public async connect(): Promise<void> {
		await this.client.$connect();
	}

	public async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
