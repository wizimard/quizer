import { useEffect } from "react";
import { normalizeExecutionQuestion } from "@entities/question";
import { useTestExecutionStore } from "@entities/test";
import { useWebSocket } from "@shared/websocket";

export const useTestExecutionSocket = (refetch: () => void) => {
	const { setCurrentQuestion, setCurrentQuestionIndex, setTotalQuestionsCount, setTestId, setStatus } = useTestExecutionStore();
	const { lastMessage } = useWebSocket();

	useEffect(() => {
		if (!lastMessage) {
			return;
		}

		switch (lastMessage.type) {
			case "test_finished":
			case "test_started": {
				refetch();
				break;
			}
			case "test_question_changed": {
				setCurrentQuestion(lastMessage.data.current_question ? normalizeExecutionQuestion(lastMessage.data.current_question) : null);
				setCurrentQuestionIndex(lastMessage.data.current_question_index);
				setTotalQuestionsCount(lastMessage.data.total_questions_count);
				setTestId(lastMessage.data.test_id);
				setStatus("open");
				break;
			}
		}
	}, [lastMessage, refetch, setCurrentQuestion, setCurrentQuestionIndex, setTotalQuestionsCount, setTestId, setStatus]);
};
