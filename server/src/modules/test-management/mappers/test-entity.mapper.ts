import { UserId } from '@modules/identity-access';
import { TestEntity } from '../entities/test.entity';
import { TestId } from '../entities/value-object/test-id';
import type { CreateTestInput } from '../interfaces/services/input/create-test.input';

export function buildTestFromCreateInput(input: CreateTestInput): TestEntity {
	return new TestEntity(TestId.generate(), UserId.of(input.authorId), input.title, [], null, [], [], new Date(), new Date());
}
