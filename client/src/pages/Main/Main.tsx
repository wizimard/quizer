import { useTranslation } from "react-i18next";
import { QuizesList } from "./ui/QuizesList";
import { useGetQuizes } from "@entities/quiz";
import { Text } from "@shared/ui/text";
import { LoadingLayout } from "@shared/ui/layout";
import { QuizCreateWidget } from "@widgets/QuizCreateWidget";

export const Main = () => {
	const { t } = useTranslation();

	const { isLoading, error } = useGetQuizes();

	return (
		<>
			<LoadingLayout isLoading={isLoading} error={error}>
				<div className="flex h-full w-full flex-col gap-5 px-5 py-2.5">
					<div className="flex w-full items-center justify-between">
						<Text variant="h4">{t("quiz_list.title")}</Text>
						<QuizCreateWidget />
					</div>
					<QuizesList />
				</div>
			</LoadingLayout>
		</>
	);
};
