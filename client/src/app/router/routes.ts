import { lazy, type JSX } from "react";

export interface IAppRoute {
	path: string;
	element: React.LazyExoticComponent<() => JSX.Element>;
}

export interface IAppRoutes {
	public: IAppRoute[];
	private: IAppRoute[];
	common: IAppRoute[];
}

const LoginPage = lazy(() => import("@pages/Login"));
const RegisterPage = lazy(() => import("@pages/Register"));
const NotFoundPage = lazy(() => import("@pages/NotFound"));
const MainPage = lazy(() => import("@pages/Main"));

export const appRoutes: IAppRoutes = {
	public: [
		{
			path: "login",
			element: LoginPage,
		},
		{
			path: "register",
			element: RegisterPage,
		},
	],
	private: [
		{
			path: "/",
			element: MainPage,
		},
	],
	common: [
		{
			path: "*",
			element: NotFoundPage,
		},
	],
};
