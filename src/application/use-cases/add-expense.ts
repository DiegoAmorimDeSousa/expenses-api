import { Expense } from '../../domain/expense';
import { IGoogleSheetsGateway } from '../../domain/i-google-sheets-gateway';

export interface AddExpenseParams {
    description: string;
    category: string;
    value: number;
    date: string;
}

export class AddExpenseUseCase {
    constructor(private readonly googleSheetsGateway: IGoogleSheetsGateway) {}

    async execute(params: AddExpenseParams): Promise<void> {
        if (!params.description || !params.category || !params.value || params.value <= 0 || !params.date) {
            throw new Error('Dados de gasto inválidos: descrição, categoria, valor ou data ausentes/inválidos.');
        }

        const expense: Expense = {
            description: params.description,
            category: params.category,
            value: params.value,
            date: params.date
        };

        await this.googleSheetsGateway.sendExpense(expense);
    }
}