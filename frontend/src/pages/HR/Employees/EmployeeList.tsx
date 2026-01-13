import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { employeeService, type Employee } from '../../../services/employeeService';
import { useTitle } from '../../../hooks/useTitle';

export function EmployeeList() {
    useTitle('Colaboradores');
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployees();
    }, []);

    async function loadEmployees() {
        try {
            const data = await employeeService.getAll();
            setEmployees(data);
        } catch (error) {
            console.error('Error loading employees', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredEmployees = employees.filter(e =>
        e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.departmentName && e.departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Colaboradores (PA30)</h1>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/hr/employees/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Colaborador
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Nome</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Cargo</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Departamento</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">
                                    Carregando...
                                </td>
                            </tr>
                        ) : filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">
                                    Nenhum colaborador encontrado
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3">
                                        <div>
                                            <div className="font-medium text-text-primary">{employee.fullName}</div>
                                            <div className="text-xs text-text-secondary">{employee.email}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-text-secondary">{employee.jobTitleName}</td>
                                    <td className="p-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {employee.departmentName}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${employee.isActive
                                            ? 'bg-green-50 text-green-700 border border-green-100'
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                            }`}>
                                            {employee.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/hr/employees/${employee.id}`)}
                                                className="p-1 text-text-secondary hover:text-brand-primary transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="p-1 text-text-secondary hover:text-red-600 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-2 text-xs text-text-secondary text-right">
                Registros: {filteredEmployees.length}
            </div>
        </div>
    );
}
