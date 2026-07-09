import type { ExecutableTest } from '@modules/test-management/entities/executable-test';
import type { TestEntity } from '@modules/test-management/entities/test.entity';
import type { ExecutableTestDto } from '../dto/executable-test.dto';

export function toExecutableTestDto(test: TestEntity): ExecutableTestDto {
	return {
		id: test.id.value,
		authorId: test.authorId.value,
		title: test.title,
		isOpen: test.isOpen,
	};
}

export function toExecutableTestDtoFromReadModel(test: ExecutableTest): ExecutableTestDto {
	return {
		id: test.id,
		authorId: test.authorId,
		title: test.title,
		isOpen: test.isOpen,
	};
}
