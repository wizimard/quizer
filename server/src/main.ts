import { Container } from 'inversify';
import { App } from './app';

async function bootstrap(): Promise<{ app: App; container: Container }> {
	const container = new Container();

	container.bind(App).toSelf().inSingletonScope();

	const app = container.get(App);

	await app.start();

	return { app, container };
}

bootstrap();
