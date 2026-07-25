import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { AnswerResultCell } from "./AnswerResultCell";
import type { TestExecutionOverview } from "@entities/test";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui/kit/table";
import { Typography } from "@shared/ui/typography";

interface TestExecutionOverviewUsersTableProps {
	testOverview: TestExecutionOverview;
}

export const TestExecutionOverviewUsersTable = ({ testOverview }: TestExecutionOverviewUsersTableProps) => {
	const { t } = useTranslation();
	const { questions, registered_users: users } = testOverview;

	if (users.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
				<Typography variant="subtitle1" className="text-foreground">
					{t("test_manage.table.empty_title")}
				</Typography>
				<Typography variant="body2" className="mt-1.5 max-w-sm text-muted-foreground">
					{t("test_manage.table.empty_description")}
				</Typography>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="sticky left-0 z-10 min-w-[10rem] bg-card px-4">{t("test_manage.table.columns.name")}</TableHead>
						<TableHead className="min-w-[7rem] px-3">{t("test_manage.table.columns.started_at")}</TableHead>
						{questions.map((question, index) => (
							<TableHead key={question.id} className="min-w-[3.25rem] px-2 text-center">
								{t("test_manage.table.columns.question", { number: index + 1 })}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => {
						const answersByQuestionId = new Map(user.answers.map((answer) => [answer.question_id, answer]));

						return (
							<TableRow key={user.id}>
								<TableCell className="sticky left-0 z-10 bg-card px-4 font-medium text-foreground">{[user.first_name, user.last_name].filter(Boolean).join(" ")}</TableCell>
								<TableCell className="px-3 font-mono text-muted-foreground tabular-nums">{format(user.started_from, "HH:mm:ss")}</TableCell>
								{questions.map((question) => {
									const answer = answersByQuestionId.get(question.id) ?? null;

									return (
										<TableCell key={question.id} className="px-2 text-center">
											<div className="flex justify-center">
												<AnswerResultCell answer={answer} />
											</div>
										</TableCell>
									);
								})}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};
