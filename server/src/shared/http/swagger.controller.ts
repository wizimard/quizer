import { injectable } from 'inversify';
import { BaseController } from './controller.base';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../swagger.json';

@injectable()
export class SwaggerController extends BaseController {
	constructor() {
		super();

		this.router.use('/swagger', swaggerUi.serve);
		this.router.get('/swagger', swaggerUi.setup(swaggerDocument));

		this.router.get('/swagger.json', (req, res, next) => {
			res.status(200);
			res.contentType('json');
			res.send(swaggerDocument);
			res.end();
		});
	}
}
