import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { AnswerResultCell } from "./AnswerResultCell";
import { type UsersTableEmptyVariant, UsersTableEmpty } from "./UsersTableEmpty";
import type { TestExecutionOverview, TestExecutionOverviewRegisteredUser } from "@entities/test";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui/kit/table";

export type TestExecutionOverviewUsersTableData = Pick<TestExecutionOverview, "questions"> & {
	registered_users: Array<TestExecutionOverviewRegisteredUser & { score?: number }>;
	max_score?: number;
};

interface TestExecutionOverviewUsersTableProps {
	testOverview: TestExecutionOverviewUsersTableData;
	emptyVariant?: UsersTableEmptyVariant;
}

export const TestExecutionOverviewUsersTable = ({ testOverview, emptyVariant = "execution" }: TestExecutionOverviewUsersTableProps) => {
	const { t } = useTranslation();
	const { questions, registered_users: users, max_score } = testOverview;

	if (users.length === 0) {
		return <UsersTableEmpty variant={emptyVariant} />;
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
						{max_score !== undefined && <TableHead className="min-w-[6rem] px-3 text-right">{t("test_manage.table.columns.score")}</TableHead>}
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
								{max_score !== undefined && (
									<TableCell className="px-3 text-right font-mono tabular-nums text-foreground">
										{user.score ?? 0} / {max_score}
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};
