import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import { employeeService, type Department, type JobTitle } from '../../../services/employeeService';
import { cepService } from '../../../services/cepService';
import { toast } from 'react-hot-toast';
import { useTitle } from '../../../hooks/useTitle';
import { DepartmentModal } from './components/DepartmentModal';
import { JobTitleModal } from './components/JobTitleModal';

export function EmployeeForm() {
    const { id } = useParams();
    const isEditing = !!id;
    useTitle(isEditing ? 'Editar Colaborador' : 'Novo Colaborador');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);

    // Modals
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        hireDate: '',
        salary: 0,
        jobTitleId: '',
        departmentId: '',
        address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            country: 'Brasil',
            zipCode: ''
        }
    });

    useEffect(() => {
        loadMasterData();
        if (isEditing) {
            loadEmployee();
        }
    }, [id]);

    async function loadMasterData() {
        try {
            const [deptData, jobData] = await Promise.all([
                employeeService.getDepartments(),
                employeeService.getJobTitles()
            ]);
            setDepartments(deptData);
            setJobTitles(jobData);
        } catch (error) {
            console.error('Error loading master data', error);
            toast.error('Erro ao carregar dados auxiliares');
        }
    }

    const handleDeptSuccess = (deptId: string) => {
        loadMasterData();
        setFormData(prev => ({ ...prev, departmentId: deptId, jobTitleId: '' }));
    };

    const handleJobSuccess = (jobId: string) => {
        loadMasterData();
        setFormData(prev => ({ ...prev, jobTitleId: jobId }));
    };

    async function loadEmployee() {
        if (!id) return;
        try {
            setLoading(true);
            const data = await employeeService.getById(id);
            // Format dates for input type="date"
            setFormData({
                ...data,
                birthDate: data.birthDate.split('T')[0],
                hireDate: data.hireDate.split('T')[0],
                // Ensure address is initialized
                address: {
                    street: data.address?.street || '',
                    number: data.address?.number || '',
                    complement: data.address?.complement || '',
                    neighborhood: data.address?.neighborhood || '',
                    city: data.address?.city || '',
                    state: data.address?.state || '',
                    country: data.address?.country || 'Brasil',
                    zipCode: data.address?.zipCode || ''
                }
            });
        } catch (error) {
            console.error('Error loading employee', error);
            toast.error('Erro ao carregar colaborador');
            navigate('/hr/employees');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEditing && id) {
                await employeeService.update(id, formData);
                toast.success('Colaborador atualizado com sucesso!');
            } else {
                await employeeService.create(formData);
                toast.success('Colaborador admitido com sucesso!');
            }
            navigate('/hr/employees');
        } catch (error) {
            console.error('Error saving employee', error);
            toast.error('Erro ao salvar colaborador.');
        } finally {
            setLoading(false);
        }
    }

    const handleCepBlur = async () => {
        const cep = formData.address.zipCode;
        if (cep && cep.replace(/\D/g, '').length === 8) {
            try {
                const address = await cepService.getAddressByCep(cep);
                if (address) {
                    setFormData(prev => ({
                        ...prev,
                        address: {
                            ...prev.address,
                            street: address.logradouro,
                            neighborhood: address.bairro,
                            city: address.localidade,
                            state: address.uf,
                            complement: address.complemento || '',
                        }
                    }));
                    toast.success('Endereço encontrado!');
                } else {
                    toast.error('CEP não encontrado.');
                }
            } catch (error) {
                toast.error('Erro ao buscar CEP.');
            }
        }
    };

    const filteredJobTitles = jobTitles.filter(j =>
        !formData.departmentId || j.departmentId === formData.departmentId
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <DepartmentModal
                isOpen={isDeptModalOpen}
                onClose={() => setIsDeptModalOpen(false)}
                onSuccess={handleDeptSuccess}
            />
            <JobTitleModal
                isOpen={isJobModalOpen}
                onClose={() => setIsJobModalOpen(false)}
                onSuccess={handleJobSuccess}
                preSelectedDepartmentId={formData.departmentId}
            />

            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/hr/employees')}
                        className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {isEditing ? 'Editar Colaborador (PA30)' : 'Admissão de Colaborador (PA40)'}
                    </h1>
                </div>
                <button
                    form="employee-form"
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>Salvar</span>
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                <form id="employee-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded border border-border-default shadow-sm p-6 space-y-8">

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-text-primary border-b border-border-default pb-2">Dados Pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Nome Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Telefone</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Data de Nascimento</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contract Info */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-text-primary border-b border-border-default pb-2">Dados Contratuais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Departamento</label>
                                <div className="flex gap-2">
                                    <select
                                        required
                                        value={formData.departmentId}
                                        onChange={e => setFormData({ ...formData, departmentId: e.target.value, jobTitleId: '' })}
                                        className="flex-1 p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none bg-white"
                                    >
                                        <option value="">Selecione...</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsDeptModalOpen(true)}
                                        className="p-2 border border-border-default rounded hover:bg-bg-subtle text-brand-primary transition-colors"
                                        title="Novo Departamento"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Cargo</label>
                                <div className="flex gap-2">
                                    <select
                                        required
                                        value={formData.jobTitleId}
                                        onChange={e => setFormData({ ...formData, jobTitleId: e.target.value })}
                                        disabled={!formData.departmentId}
                                        className="flex-1 p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none disabled:bg-bg-subtle bg-white"
                                    >
                                        <option value="">Selecione...</option>
                                        {filteredJobTitles.map(j => (
                                            <option key={j.id} value={j.id}>{j.title}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsJobModalOpen(true)}
                                        disabled={!formData.departmentId}
                                        className="p-2 border border-border-default rounded hover:bg-bg-subtle text-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Novo Cargo"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Data de Admissão</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.hireDate}
                                    onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Salário Base (R$)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.salary}
                                    onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-text-primary border-b border-border-default pb-2">Endereço</h2>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">CEP</label>
                                <input
                                    type="text"
                                    value={formData.address.zipCode}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                                    onBlur={handleCepBlur}
                                    maxLength={9}
                                    placeholder="00000-000"
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Rua</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.address.street}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Número</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.address.number}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, number: e.target.value } })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Complemento</label>
                                <input
                                    type="text"
                                    value={formData.address.complement}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, complement: e.target.value } })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Bairro</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.address.neighborhood}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, neighborhood: e.target.value } })}
                                    className="w-full p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Cidade/UF</label>
                                <div className="flex gap-2">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Cidade"
                                        value={formData.address.city}
                                        onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                        className="flex-1 p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                    />
                                    <input
                                        required
                                        type="text"
                                        placeholder="UF"
                                        maxLength={2}
                                        value={formData.address.state}
                                        onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                        className="w-16 p-2 border border-border-default rounded text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
