import express from 'express';
import cors from 'cors'; 
import axios from 'axios';
import 'dotenv/config'; 

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = process.env.TELEGRAM_API;
const WEBHOOK_API = process.env.WEBHOOK_API;

const WEBHOOK_END = '/webhook/' + TELEGRAM_BOT_TOKEN;

export const setupServer = (routes: express.Router): express.Application => {
    const app = express();

    app.use(cors());

    app.use(express.json());

    app.use('/api', routes); 

    app.get('/', (req, res) => {
        res.status(200).send('API de controle de gastos está online! 🎉');
    });

    app.post(WEBHOOK_END, async (req, res) => {
        const chat_id = req.body.message.chat.id;
        const messageText = req.body.message.text;

        const expenseEntries = messageText.split('|').map((entry: string) => entry.trim());
        const expensesToInsert: any[] = [];

        for (const entry of expenseEntries) {
            let description = '';
            let category = '';
            let cost = 0;
            const date = new Date().toISOString(); 

            entry.split('\n').forEach((line: string) => {
                if (line.startsWith('Descrição:')) {
                    description = line.replace('Descrição:', '').trim();
                } else if (line.startsWith('Categoria:')) {
                    category = line.replace('Categoria:', '').trim();
                } else if (line.startsWith('Valor:')) {
                    const valueStr = line.replace('Valor:', '').trim().replace(',', '.');
                    cost = parseFloat(valueStr);
                }
            });

            if (description && category && cost > 0) {
                expensesToInsert.push({ description, category, cost, date });
            }
        }

        await axios.post(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id,
            text: '⏳ Iniciando a inserção do(s) seu(s) gasto(s)...'
        });

        let successfulInserts = 0;
        let confirmationMessageDetails = ''; 

        for (const expenseData of expensesToInsert) {
            try {
                await axios.post(`${WEBHOOK_API}/api/expenses`, expenseData);
                successfulInserts++;
                confirmationMessageDetails += `- "${expenseData.description}" (R$ ${expenseData.cost.toFixed(2)})\n`;
            } catch (error) {
                console.error(`Erro ao inserir o gasto "${expenseData.description}":`, error);
                confirmationMessageDetails += `- FALHA ao inserir "${expenseData.description}"\n`;
            }
        }

        let finalConfirmationText = '';
        if (successfulInserts === expensesToInsert.length && successfulInserts > 0) {
            finalConfirmationText = `✅ Todos os ${successfulInserts} gastos foram inseridos com sucesso na sua planilha!\n\nDetalhes:\n${confirmationMessageDetails}`;
        } else if (successfulInserts > 0) {
            finalConfirmationText = `⚠️ ${successfulInserts} de ${expensesToInsert.length} gastos foram inseridos. Verifique os que falharam.\n\nDetalhes:\n${confirmationMessageDetails}`;
        } else {
            finalConfirmationText = '❌ Nenhum gasto válido foi encontrado ou inserido. Por favor, verifique o formato da sua mensagem.';
        }

        await axios.post(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id,
            text: finalConfirmationText
        });

        return res.send();
    });

    return app;
};