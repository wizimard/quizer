import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.scss";
import { AppRouter } from "./router/Router";
import { TooltipProvider } from "@shared/ui/kit/tooltip";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<AppRouter></AppRouter>
			</TooltipProvider>
		</QueryClientProvider>
	);
}

export default App;
