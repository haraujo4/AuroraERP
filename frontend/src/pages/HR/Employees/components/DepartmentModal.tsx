import { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../../../components/Modal';
import { employeeService } from '../../../../services/employeeService';

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (deptId: string) => void;
}

export function DepartmentModal({ isOpen, onClose, onSuccess }: DepartmentModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const result = await employeeService.createDepartment({ name, description });
            toast.success('Departamento criado com sucesso!');
            onSuccess(result.id);
            setName('');
            setDescription('');
            onClose();
        } catch (error) {
            console.error('Error creating department:', error);
            toast.error('Houve um erro ao criar o departamento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Novo Departamento">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Departamento *
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                        placeholder="Ex: Recursos Humanos"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                        placeholder="Breve descrição das responsabilidades..."
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-text-secondary hover:bg-bg-subtle rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Criando...' : 'Criar Departamento'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
