import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const generatedDir = join(import.meta.dirname, "../src/shared/api/generated");
const marker = "// @ts-nocheck";

for (const file of await readdir(generatedDir)) {
	if (!file.endsWith(".ts")) {
		continue;
	}

	const filePath = join(generatedDir, file);
	const content = await readFile(filePath, "utf8");

	if (content.startsWith(marker)) {
		continue;
	}

	await writeFile(filePath, `${marker}\n${content}`);
}
