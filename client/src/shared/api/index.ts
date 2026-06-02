import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { DefaultApi } from "./generated";
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

apiInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetriableRequestConfig | undefined;
		const status = error.response?.status;

		if (status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			const refreshResponse = await axios.post(baseURL + "/auth/refresh", null, { withCredentials: true });
			const tokenData = refreshResponse.data as { accessToken?: string; token?: string };
			const nextToken = tokenData.accessToken ?? tokenData.token;

			if (nextToken) {
				localStorage.setItem(ACCESS_TOKEN_KEY, nextToken);
				originalRequest.headers.Authorization = `Bearer ${nextToken}`;
			}

			return apiInstance(originalRequest);
		}

		return Promise.reject(error);
	},
);

export const api = new DefaultApi(undefined, baseURL, apiInstance);
