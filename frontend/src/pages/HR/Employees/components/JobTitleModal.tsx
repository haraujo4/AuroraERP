import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../../../components/Modal';
import { employeeService, type Department } from '../../../../services/employeeService';

interface JobTitleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (jobTitleId: string) => void;
    preSelectedDepartmentId?: string;
}

export function JobTitleModal({ isOpen, onClose, onSuccess, preSelectedDepartmentId }: JobTitleModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [baseSalary, setBaseSalary] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadDepartments();
            if (preSelectedDepartmentId) {
                setDepartmentId(preSelectedDepartmentId);
            }
        }
    }, [isOpen, preSelectedDepartmentId]);

    async function loadDepartments() {
        try {
            const data = await employeeService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments', error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !departmentId) return;

        setLoading(true);
        try {
            const result = await employeeService.createJobTitle({
                title,
                description,
                baseSalary: parseFloat(baseSalary) || 0,
                departmentId
            });
            toast.success('Cargo criado com sucesso!');
            onSuccess(result.id);
            // Reset
            setTitle('');
            setDescription('');
            setBaseSalary('');
            onClose();
        } catch (error) {
            console.error('Error creating job title:', error);
            toast.error('Houve um erro ao criar o cargo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Novo Cargo">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título do Cargo *
                    </label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                        placeholder="Ex: Desenvolvedor Senior"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento *
                    </label>
                    <select
                        required
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none bg-white"
                    >
                        <option value="">Selecione um departamento...</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salário Base
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={baseSalary}
                        onChange={(e) => setBaseSalary(e.target.value)}
                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                        placeholder="0.00"
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
                        placeholder="Descrição das funções..."
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
                        {loading ? 'Criando...' : 'Criar Cargo'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
