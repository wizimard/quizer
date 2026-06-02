import { Navigate, Route, Routes } from "react-router-dom";
import { appRoutes, type IAppRoute } from "./routes";
import { Suspense } from "react";
import { useGetUser, useUser } from "@entities/user";

export const AppRouter = () => {
	const isAuthed = !!useUser((state) => state.user);
	const { isLoading } = useGetUser();

	return (
		<Routes>
			{!isLoading && (
				<>
					{isAuthed ? (
						<>
							{appRoutes.private.map((route: IAppRoute, index: number) => (
								<Route
									path={route.path}
									key={index}
									element={
										<Suspense fallback={<div>Loading...</div>}>
											<route.element />
										</Suspense>
									}
								/>
							))}
							{appRoutes.public.map((route: IAppRoute, index: number) => (
								<Route path={route.path} key={index} element={<Navigate to="/" />} />
							))}
						</>
					) : (
						<>
							{appRoutes.public.map((route: IAppRoute, index: number) => (
								<Route
									path={route.path}
									key={index}
									element={
										<Suspense fallback={<div>Loading...</div>}>
											<route.element />
										</Suspense>
									}
								/>
							))}
							{appRoutes.private.map((route: IAppRoute, index: number) => (
								<Route path={route.path} key={index} element={<Navigate to="/login" />} />
							))}
						</>
					)}
					{appRoutes.common.map((route: IAppRoute, index: number) => (
						<Route
							path={route.path}
							key={index}
							element={
								<Suspense fallback={<div>Loading...</div>}>
									<route.element />
								</Suspense>
							}
						/>
					))}
				</>
			)}
		</Routes>
	);
};
