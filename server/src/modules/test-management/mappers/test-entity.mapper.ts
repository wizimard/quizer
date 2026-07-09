import { UserId } from '@modules/identity-access';
import { TestEntity } from '../entities/test.entity';
import { TestId } from '../entities/value-object/test-id';
import type { CreateTestInput } from '../interfaces/input/test.input';

const NEW_TEST_ID = TestId.of('new');

export function buildTestFromCreateInput(input: CreateTestInput): TestEntity {
	return new TestEntity(NEW_TEST_ID, input.title, UserId.of(input.authorId), [], null, [], new Date(), new Date());
}
