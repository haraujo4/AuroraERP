import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LeadService } from '../../../services/leadService';
import type { Lead } from '../../../types/crm-leads';
import { ArrowLeft, Send, UserCheck, Mail, Building, User } from 'lucide-react';

export function LeadDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState<Lead | null>(null);
    const [replyBody, setReplyBody] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) loadLead();
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [lead?.interactions]);

    const loadLead = async () => {
        try {
            const data = await LeadService.getById(id!);
            setLead(data);
        } catch (error) {
            console.error('Failed to load lead', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendReply = async () => {
        if (!replyBody.trim()) return;
        setSending(true);
        try {
            await LeadService.addInteraction(lead!.id, replyBody, 'OutgoingEmail');
            setReplyBody('');
            await loadLead(); // Reload to see new message
        } catch (error) {
            alert('Falha ao enviar resposta.');
        } finally {
            setSending(false);
        }
    };

    const handleConvertToPartner = async () => {
        if (!confirm('Deseja converter este Lead em Parceiro? Isso alterará o status para Convertido.')) return;
        try {
            await LeadService.updateStatus(lead!.id, 'Converted');
            loadLead();
        } catch (error) {
            alert('Erro ao converter lead.');
        }
    };

    if (loading) return <div className="p-4 text-center">Carregando...</div>;
    if (!lead) return <div className="p-4 text-center">Lead não encontrado.</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main overflow-hidden">
            {/* Header / Toolbar */}
            <div className="bg-white border-b border-border-default p-4 shadow-sm flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/crm/leads')} className="text-gray-500 hover:text-brand-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{lead.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><User size={14} /> {lead.contactName}</span>
                            <span className="flex items-center gap-1"><Mail size={14} /> {lead.email}</span>
                            {lead.companyName && <span className="flex items-center gap-1"><Building size={14} /> {lead.companyName}</span>}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                                ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                    lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'}`}>
                                {lead.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {lead.status !== 'Converted' && (
                        <button
                            onClick={handleConvertToPartner}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            <UserCheck size={16} /> Mark as Partner
                        </button>
                    )}
                </div>
            </div>

            {/* Thread View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {/* Original/Initial Date marker could go here */}
                {lead.interactions && lead.interactions.length > 0 ? (
                    // We need to sort interactions ascending for chat view usually, 
                    // but they differ. Usually newest at bottom. Dto sorts descending? 
                    // Let's reverse for display if Dto is descending.
                    [...lead.interactions].reverse().map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'OutgoingEmail' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-4 shadow-sm ${msg.type === 'OutgoingEmail'
                                ? 'bg-brand-primary text-white rounded-br-none'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                }`}>
                                <div className="text-sm break-words whitespace-pre-wrap">{msg.body}</div>
                                <div className={`text-xs mt-2 ${msg.type === 'OutgoingEmail' ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {new Date(msg.sentAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-10">Nenhuma mensagem nesta conversa.</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Area */}
            <div className="p-4 bg-white border-t border-border-default flex-shrink-0">
                <div className="flex gap-2">
                    <textarea
                        value={replyBody}
                        onChange={e => setReplyBody(e.target.value)}
                        placeholder="Escreva uma resposta..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none h-24 outline-none"
                    />
                    <button
                        onClick={handleSendReply}
                        disabled={sending || !replyBody.trim()}
                        className="bg-brand-primary text-white p-3 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 h-12 self-end"
                        title="Enviar"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
