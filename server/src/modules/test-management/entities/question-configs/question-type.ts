export const QUESTION_TYPES = ['input', 'single_choice', 'multiple_choice', 'order'] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];
