import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { TE_TYPES } from './test-execution.types';
import { TestExecuteController } from './controllers/test-execute.controller';
import { TestExecuteService } from './services/test-execute.service';

const testExecutionModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind(TE_TYPES.TEST_EXECUTE_CONTROLLER).to(TestExecuteController).inSingletonScope();
	options.bind(TE_TYPES.TEST_EXECUTION_SERVICE).to(TestExecuteService).inSingletonScope();
});

export { testExecutionModule, TE_TYPES };
