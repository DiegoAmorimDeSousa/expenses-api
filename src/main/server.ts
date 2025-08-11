import { app } from './config/app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor da API de gastos rodando na porta ${PORT} 🚀`);
    console.log(`Acesse: http://localhost:${PORT}`);
});