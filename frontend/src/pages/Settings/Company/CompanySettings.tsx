import { useState, useEffect } from 'react';
import { Save, Building2 } from 'lucide-react';
import { api } from '../../../services/api';

interface Company {
    id: string;
    grupoEmpresarialId: string;
    codigo: string;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    enderecoFiscal: {
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
}

export function CompanySettings() {
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadCompany();
    }, []);

    const loadCompany = async () => {
        try {
            // Assuming we edit the first company found or by specific ID. For now getting all and taking first.
            const response = await api.get('/organization/companies');
            if (response.data && response.data.length > 0) {
                setCompany(response.data[0]);
            }
        } catch (error) {
            console.error('Failed to load company', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;

        setIsSaving(true);
        try {
            await api.put(`/organization/companies/${company.id}`, {
                razaoSocial: company.razaoSocial,
                nomeFantasia: company.nomeFantasia,
                cnpj: company.cnpj,
                enderecoFiscal: company.enderecoFiscal
            });
            alert('Dados da empresa atualizados com sucesso!');
        } catch (error) {
            console.error('Failed to update company', error);
            alert('Erro ao atualizar dados da empresa.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Carregando dados da empresa...</div>;
    if (!company) return <div className="p-8 text-center text-gray-500">Nenhuma empresa encontrada para editar.</div>;

    return (
        <div className="max-w-4xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-brand-primary" />
                Dados da Empresa (Matriz)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border-secondary space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                            <input
                                type="text"
                                value={company.codigo}
                                disabled
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                            <input
                                type="text"
                                value={company.cnpj}
                                onChange={e => setCompany({ ...company, cnpj: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                            <input
                                type="text"
                                value={company.razaoSocial}
                                onChange={e => setCompany({ ...company, razaoSocial: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                            <input
                                type="text"
                                value={company.nomeFantasia}
                                onChange={e => setCompany({ ...company, nomeFantasia: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-border-secondary space-y-6">
                    <h3 className="text-md font-medium text-gray-900 border-b pb-2">Endereço Fiscal</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                            <input
                                type="text"
                                value={company.enderecoFiscal.street}
                                onChange={e => setCompany({ ...company, enderecoFiscal: { ...company.enderecoFiscal, street: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                            <input
                                type="text"
                                value={company.enderecoFiscal.number}
                                onChange={e => setCompany({ ...company, enderecoFiscal: { ...company.enderecoFiscal, number: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                            <input
                                type="text"
                                value={company.enderecoFiscal.zipCode}
                                onChange={e => setCompany({ ...company, enderecoFiscal: { ...company.enderecoFiscal, zipCode: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                            <input
                                type="text"
                                value={company.enderecoFiscal.neighborhood}
                                onChange={e => setCompany({ ...company, enderecoFiscal: { ...company.enderecoFiscal, neighborhood: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                            <input
                                type="text"
                                value={company.enderecoFiscal.city}
                                onChange={e => setCompany({ ...company, enderecoFiscal: { ...company.enderecoFiscal, city: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <input
                                type="text"
                                value={company.enderecoFiscal.state}
                                onChange={e => setCompany({ ...company, enderecoFiscal: { ...company.enderecoFiscal, state: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                            <input
                                type="text"
                                value={company.enderecoFiscal.country}
                                onChange={e => setCompany({ ...company, enderecoFiscal: { ...company.enderecoFiscal, country: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Save size={18} />
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
