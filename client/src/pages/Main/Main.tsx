import { useGetQuizes } from "@entities/quiz";
import { Text } from "@shared/ui/text";
import { QuizesList } from "./ui/QuizesList";
import { ButtonWithIcon } from "@shared/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingLayout } from "@shared/ui/layout";
import { useTranslation } from "react-i18next";

export const Main = () => {
	const { t } = useTranslation();

	const { isLoading, error } = useGetQuizes();

	const navigate = useNavigate();

	const handleClickNewQuiz = () => {
		navigate("/quiz-edit/new");
	};

	return (
		<>
			<LoadingLayout isLoading={isLoading} error={error}>
				<div className="flex h-full w-full flex-col gap-5 px-5 py-2.5">
					<div className="flex w-full items-center justify-between">
						<Text variant="h4">{t("quiz_list.title")}</Text>
						<ButtonWithIcon text={t("quiz_list.add_button")} Icon={Plus} onClick={handleClickNewQuiz} variant="outline" />
					</div>
					<QuizesList />
				</div>
			</LoadingLayout>
		</>
	);
};
