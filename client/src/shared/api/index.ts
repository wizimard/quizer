import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { AuthApi, QuestionApi, TestApi, UserApi } from "./generated";
import { ACCESS_TOKEN_KEY } from "@shared/constant";

const baseURL = import.meta.env.VITE_API_URL as string | undefined;

const apiInstance = axios.create({
	baseURL,
	withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem(ACCESS_TOKEN_KEY);

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshTokenPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
	if (!refreshTokenPromise) {
		refreshTokenPromise = axios
			.post<{ accessToken?: string; token?: string }>(`${baseURL}/auth/refresh`, null, {
				withCredentials: true,
			})
			.then((response) => {
				const nextToken = response.data.accessToken ?? response.data.token;

				if (!nextToken) {
					throw new Error("Refresh token response did not include access token");
				}

				localStorage.setItem(ACCESS_TOKEN_KEY, nextToken);

				return nextToken;
			})
			.finally(() => {
				refreshTokenPromise = null;
			});
	}

	return refreshTokenPromise;
};

apiInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetriableRequestConfig | undefined;
		const status = error.response?.status;

		if (status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const nextToken = await refreshAccessToken();
				originalRequest.headers.Authorization = `Bearer ${nextToken}`;

				return apiInstance(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem(ACCESS_TOKEN_KEY);

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export const authApi = new AuthApi(undefined, baseURL, apiInstance);
export const userApi = new UserApi(undefined, baseURL, apiInstance);
export const testApi = new TestApi(undefined, baseURL, apiInstance);
export const questionApi = new QuestionApi(undefined, baseURL, apiInstance);
