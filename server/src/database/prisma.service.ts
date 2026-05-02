import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';

@injectable()
export class PrismaService {
	public readonly client: PrismaClient;

	constructor() {
		this.client = new PrismaClient({
			adapter: new PrismaPg({
				database: process.env.DATABASE_URL,
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
