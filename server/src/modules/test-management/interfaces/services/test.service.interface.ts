import type { CreateTestInput } from './input/create-test.input';
import type { DeleteTestInput } from './input/delete-test.input';
import type { GetAuthorTestsInput } from './input/get-author-tests.input';
import type { UpdateTestInput } from './input/update-test.input';
import type { TestFullResult } from './results/test-full.result';
import type { TestResult } from './results/test.result';
import type { GetTestByIdInput } from './input/get-test-by-id.input';
import type { GetFullTestByIdInput } from './input/get-full-test-by-id.input';
import type { TestEntity } from '../../entities/test.entity';

export interface TestService {
	create(input: CreateTestInput): Promise<TestFullResult>;
	update(input: UpdateTestInput): Promise<TestFullResult>;
	delete(input: DeleteTestInput): Promise<void>;
	getByAuthor(input: GetAuthorTestsInput): Promise<TestResult[]>;
	getById(input: GetTestByIdInput): Promise<TestResult>;
	getFullById(testId: string): Promise<TestEntity | null>;
	getFullByIdAndCheckOwnership(input: GetFullTestByIdInput): Promise<TestFullResult>;
}
