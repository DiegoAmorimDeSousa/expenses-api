import { Router } from 'express';
import { ExpenseController } from '../../infrastructure/http/controllers/expense-controller';
import { AddExpenseUseCase } from '../../application/use-cases/add-expense';
import { GoogleSheetsGateway } from '../../infrastructure/gateways/google-sheets-gateway';

export const setupRoutes = (): Router => {
    const router = Router();

    const googleSheetsAppScriptUrl = process.env.GOOGLE_SHEETS_APP_SCRIPT_URL;

    if (!googleSheetsAppScriptUrl) {
        console.error('Erro: A URL do Google Apps Script não foi encontrada. Certifique-se de que a variável de ambiente GOOGLE_SHEETS_APP_SCRIPT_URL está configurada.');
        process.exit(1); // Encerra a aplicação se a URL não estiver configurada.
    }

    const googleSheetsGateway = new GoogleSheetsGateway(googleSheetsAppScriptUrl);

    const addExpenseUseCase = new AddExpenseUseCase(googleSheetsGateway);

    const expenseController = new ExpenseController(addExpenseUseCase);

    router.post('/expenses', (req, res) => expenseController.add(req, res));

    return router;
};