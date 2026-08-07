import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TestExecutionOverview, TestExecutionOverviewRegisteredUser } from "../model/test-execution-overview.interface";
import { useWebSocket } from "@shared/websocket";
import { QUERY_KEYS } from "@shared/constant";

export const useTestExecutionOverviewSocket = (testId: string) => {
	const queryClient = useQueryClient();
	const { lastMessage } = useWebSocket();

	useEffect(() => {
		if (!lastMessage) {
			return;
		}

		if (lastMessage.type === "test_registration") {
			queryClient.setQueryData([QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, testId], (oldData: TestExecutionOverview) => {
				const newRegistedUser: TestExecutionOverviewRegisteredUser = {
					id: lastMessage.data.id,
					first_name: lastMessage.data.first_name,
					last_name: lastMessage.data.last_name,
					answers: [],
					started_from: new Date(lastMessage.data.started_from),
				};

				return {
					...oldData,
					registered_users: [...oldData.registered_users, newRegistedUser],
				};
			});
		}

		if (lastMessage.type === "test_answer") {
			queryClient.setQueryData([QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, testId], (oldData: TestExecutionOverview) => {
				const registeredUsers = oldData.registered_users.map((registeredUser) => {
					if (registeredUser.id === lastMessage.data.user_id) {
						return {
							...registeredUser,
							answers: [
								...registeredUser.answers,
								{
									question_id: lastMessage.data.question_id,
									is_correct: lastMessage.data.is_correct,
									skipped: lastMessage.data.skipped,
								},
							],
						};
					}
					return registeredUser;
				});

				return { ...oldData, registered_users: registeredUsers };
			});
		}
	}, [lastMessage, queryClient, testId]);
};
