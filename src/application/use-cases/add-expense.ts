import { Expense } from '../../domain/expense';
import { IGoogleSheetsGateway } from '../../domain/i-google-sheets-gateway';

export interface AddExpenseParams {
    description: string;
    category: string;
    cost: number;
    date: string;
    user: string;
    type: string;
}

export class AddExpenseUseCase {
    constructor(private readonly googleSheetsGateway: IGoogleSheetsGateway) {}

    async execute(params: AddExpenseParams): Promise<void> {
        if (!params.description || !params.category || !params.cost || params.cost <= 0 || !params.date) {
            throw new Error('Dados de gasto inválidos: descrição, categoria, valor ou data ausentes/inválidos.');
        }

        const expense: Expense = {
            description: params.description,
            category: params.category,
            cost: params.cost,
            date: params.date,
            user: params.user,
            type: "Saída",
        };

        await this.googleSheetsGateway.sendExpense(expense);
    }
}