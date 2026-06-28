import { Route, Routes } from "react-router-dom";
import { appRoutes, type IAppRoute } from "./routes";
import { Suspense } from "react";
import { AuthLoadingGuard, PrivateRouteGuard, PublicRouteGuard } from "./guards";

const routeFallback = <div>Loading...</div>;

export const AppRouter = () => {
	return (
		<AuthLoadingGuard>
			<Routes>
				{appRoutes.private.map((route: IAppRoute, index: number) => (
					<Route
						path={route.path}
						key={index}
						element={
							<Suspense fallback={routeFallback}>
								<PrivateRouteGuard>
									<route.element />
								</PrivateRouteGuard>
							</Suspense>
						}
					/>
				))}
				{appRoutes.public.map((route: IAppRoute, index: number) => (
					<Route
						path={route.path}
						key={index}
						element={
							<Suspense fallback={routeFallback}>
								<PublicRouteGuard>
									<route.element />
								</PublicRouteGuard>
							</Suspense>
						}
					/>
				))}
				{appRoutes.common.map((route: IAppRoute, index: number) => (
					<Route
						path={route.path}
						key={index}
						element={
							<Suspense fallback={routeFallback}>
								<route.element />
							</Suspense>
						}
					/>
				))}
			</Routes>
		</AuthLoadingGuard>
	);
};
