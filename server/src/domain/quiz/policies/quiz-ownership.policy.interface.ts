export interface IQuizOwnershipPolicy {
	assertOwner(quiz: { authorId: string }, userId: string): void;
}
