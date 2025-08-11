import { setupServer } from '../../infrastructure/http/server';
import { setupRoutes } from './routes';

require('dotenv').config();

export const app = setupServer(setupRoutes());