import { Expense } from '../../domain/expense';
import { IGoogleSheetsGateway } from '../../domain/i-google-sheets-gateway';
import fetch from 'node-fetch'; 

export class GoogleSheetsGateway implements IGoogleSheetsGateway {
    private readonly appScriptUrl: string;

    constructor(appScriptUrl: string) {
        if (!appScriptUrl) {
            throw new Error('URL do Google Apps Script não fornecida.');
        }
        this.appScriptUrl = appScriptUrl;
    }

    async sendExpense(expense: Expense): Promise<void> {
        try {
            console.log('Enviando gasto para Google Sheets:', expense);
            const response = await fetch(this.appScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expense) 
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao enviar dados para Google Sheets: ${response.status} - ${errorText}`);
            }

            console.log('Gasto enviado para Google Sheets com sucesso!');
        } catch (error) {
            console.error('Falha ao enviar gasto para Google Sheets:', error);
            throw error; 
        }
    }
}