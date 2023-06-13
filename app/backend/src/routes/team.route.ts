import { Router } from 'express';
import { TeamController } from '../controllers';

const teamRoute = Router();

teamRoute.get('/:id', TeamController.getById)
  .get('/', TeamController.listAll);

export default teamRoute;
