import express from 'express';
import cors from 'cors'; 

export const setupServer = (routes: express.Router): express.Application => {
    const app = express();

    app.use(cors());

    app.use(express.json());

    app.use('/api', routes); 

    app.get('/', (req, res) => {
        res.status(200).send('API de controle de gastos está online! 🎉');
    });

    return app;
};