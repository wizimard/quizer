import { register } from 'tsx/esm/api';

register();

const { main } = await import('./src/main.ts');

try {
	await main();
} catch (error) {
	console.error(error);
	process.exit(1);
}
