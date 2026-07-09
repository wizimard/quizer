export const QUESTION_TYPES = ['input', 'single_choise', 'multiple_choise', 'order'] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];
