import axios from 'axios';

export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export const cepService = {
    getAddressByCep: async (cep: string): Promise<ViaCepResponse | null> => {
        // Remove non-numeric characters
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            return null;
        }

        try {
            const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`);

            if (response.data.erro) {
                return null;
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching address by CEP:', error);
            throw error;
        }
    }
};
