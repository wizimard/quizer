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
