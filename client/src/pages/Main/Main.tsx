import { useTranslation } from "react-i18next";
import { TestsList } from "./ui/TestsList";
import { Typography } from "@shared/ui/typography";
import { LoadingLayout } from "@shared/ui/layout";
import { useGetTestes } from "@entities/test";
import { CreateTestWidget } from "@widgets/CreateTest";

export const Main = () => {
	const { t } = useTranslation();

	const { isLoading, error } = useGetTestes();

	return (
		<>
			<LoadingLayout isLoading={isLoading} error={error}>
				<div className="flex h-full w-full flex-col gap-5 px-5 py-2.5">
					<div className="flex w-full items-center justify-between">
						<Typography variant="h4">{t("test_list.title")}</Typography>
						<CreateTestWidget />
					</div>
					<TestsList />
				</div>
			</LoadingLayout>
		</>
	);
};
