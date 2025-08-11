import { Expense } from "./expense";

export interface IGoogleSheetsGateway {
    sendExpense(expense: Expense): Promise<void>;
}
