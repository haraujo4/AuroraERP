import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '../../../services/api';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UserFormModal({ isOpen, onClose, onSuccess }: UserFormModalProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/users', {
                username,
                email,
                password,
                roles: isAdmin ? ['Admin', 'User'] : ['User']
            });
            onSuccess();
            onClose();
            // Reset form
            setUsername('');
            setEmail('');
            setPassword('');
            setIsAdmin(false);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erro ao criar usuário');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Novo Usuário</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={isAdmin}
                            onChange={e => setIsAdmin(e.target.checked)}
                            className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                        />
                        <label htmlFor="isAdmin" className="text-sm text-gray-700 select-none">
                            Conceder acesso de Administrador
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-70"
                        >
                            <Save size={16} />
                            {isSaving ? 'Salvando...' : 'Criar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
