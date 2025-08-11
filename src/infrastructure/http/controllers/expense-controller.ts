import { Request, Response } from 'express';
import { AddExpenseUseCase } from '../../../application/use-cases/add-expense';

export class ExpenseController {
    constructor(private readonly addExpenseUseCase: AddExpenseUseCase) {}

    async add(req: Request, res: Response): Promise<Response> {
        try {
            const { description, category, value, date } = req.body;

            if (!description || !category || typeof value !== 'number' || value <= 0 || !date) {
                return res.status(400).json({ error: 'Dados de gasto inválidos: descrição, categoria, valor ou data ausentes/inválidos.' });
            }

            await this.addExpenseUseCase.execute({ description, category, value, date });

            return res.status(201).json({ message: 'Gasto registrado com sucesso.' });
        } catch (error: any) {
            console.error('Erro no ExpenseController:', error.message);
            return res.status(500).json({ error: 'Erro interno do servidor ao processar o gasto.' });
        }
    }
}