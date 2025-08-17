import { app } from './config/app';
import axios from 'axios';

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_API = process.env.WEBHOOK_API;
const TELEGRAM_API = process.env.TELEGRAM_API;

const TEL_API = `${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}`;
const WEBHOOK_END = '/webhook/' + TELEGRAM_BOT_TOKEN;
const WEBHOOK = WEBHOOK_API + WEBHOOK_END;

const setWebhookUrk = async () => {
  const res = await axios.get(`${TEL_API}/setWebhook?url=${WEBHOOK}`);
  console.log('RES => ', res.data);
}

app.listen(PORT, () => {
    console.log(`Servidor da API de gastos rodando na porta ${PORT} 🚀`);
    console.log(`Acesse: http://localhost:${PORT}`);
    setWebhookUrk();
});