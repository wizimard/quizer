import { Container } from 'inversify';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { App } from '@app/app';
import { appModules } from '@app/app.module';
import { Bootstrap } from '@app/bootstrap';

export async function bootstrap(): Promise<{ app: App; container: Container }> {
	const container: Container = new Container();

	for (const module of appModules) {
		container.load(module);
	}

	const app: App = await Bootstrap.start(container);

	return { app, container };
}

let bootPromise: Promise<{ app: App; container: Container }> | undefined;

export function getBoot(): Promise<{ app: App; container: Container }> {
	bootPromise ??= bootstrap();

	return bootPromise;
}

export function resetBoot(): void {
	bootPromise = undefined;
}

async function main(): Promise<void> {
	const { app, container } = await bootstrap();

	Bootstrap.registerGracefulShutdown(app, container);
}

const isMainModule = process.argv[1] !== undefined && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);

if (isMainModule) {
	main().catch((error: unknown) => {
		console.error(error);
		process.exit(1);
	});
}
