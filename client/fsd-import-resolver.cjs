const path = require("path");
const { createTypeScriptImportResolver } = require("eslint-import-resolver-typescript");

const srcPath = path.resolve(__dirname, "./src");

const resolver = createTypeScriptImportResolver({
	project: "./tsconfig.app.json",
	alwaysTryTypes: true,
	alias: {
		"@shared/*": [path.join(srcPath, "shared/*")],
		"@features/*": [path.join(srcPath, "features/*")],
		"@pages/*": [path.join(srcPath, "pages/*")],
		"@entities/*": [path.join(srcPath, "entities/*")],
		"@widgets/*": [path.join(srcPath, "widgets/*")],
		"@/*": [path.join(srcPath, "*")],
	},
});

module.exports = resolver;
module.exports.forBoundaries = {
	interfaceVersion: 2,
	resolve: resolver.resolve,
};
