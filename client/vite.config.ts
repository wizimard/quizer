import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@shared": path.resolve(__dirname, "./src/shared"),
			"@features": path.resolve(__dirname, "./src/features"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@entities": path.resolve(__dirname, "./src/entities"),
			"@widgets": path.resolve(__dirname, "./src/widgets"),
			"@components": path.resolve(__dirname, "./src/shared/ui/kit"),
			"@utils": path.resolve(__dirname, "./src/shared/lib/utils"),
			"@hooks": path.resolve(__dirname, "./src/shared/hooks"),
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
