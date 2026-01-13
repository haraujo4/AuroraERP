import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import type { DashboardData } from '../../services/analyticsService';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Receipt,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await AnalyticsService.getFinancialOverview();
                setData(result);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Visão Geral Financeira</h1>
                    <p className="text-gray-500">Acompanhe o desempenho do seu ERP em tempo real</p>
                </div>
                <div className="flex space-x-2">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Vendas Mensais"
                    value={formatCurrency(data?.monthlySales || 0)}
                    icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                    trend="+12% vs anterior"
                    trendColor="text-green-600"
                />
                <MetricCard
                    title="Despesas Mensais"
                    value={formatCurrency(data?.monthlyExpenses || 0)}
                    icon={<TrendingDown className="w-6 h-6 text-red-600" />}
                    trend="+5% vs anterior"
                    trendColor="text-gray-500"
                />
                <MetricCard
                    title="Lucro Mensal"
                    value={formatCurrency(data?.monthlyGrossProfit || 0)}
                    icon={<DollarSign className="w-6 h-6 text-teal-600" />}
                    trend={`${(data?.grossMarginPercentage || 0).toFixed(1)}% Margem`}
                    trendColor="text-teal-600"
                />
                <MetricCard
                    title="Contas a Receber"
                    value={formatCurrency(data?.totalReceivable || 0)}
                    icon={<ArrowUpRight className="w-6 h-6 text-indigo-600" />}
                    trend="Pendente"
                    trendColor="text-indigo-600"
                />
                <MetricCard
                    title="Contas a Pagar"
                    value={formatCurrency(data?.totalPayable || 0)}
                    icon={<ArrowDownLeft className="w-6 h-6 text-orange-600" />}
                    trend="Pendente"
                    trendColor="text-orange-600"
                />
                <MetricCard
                    title="Margem Bruta"
                    value={`${(data?.grossMarginPercentage || 0).toFixed(1)}%`}
                    icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
                    trend="Saudável"
                    trendColor="text-blue-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend Chart (CSS based) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
                        Tendência de Vendas (6 meses)
                    </h3>
                    <div className="h-64 flex items-end justify-between space-x-4">
                        {data?.salesTrend.map((item, idx) => {
                            const maxVal = Math.max(...data.salesTrend.map(t => t.value), 1);
                            const height = (item.value / maxVal) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div
                                        className="w-full bg-indigo-100 group-hover:bg-indigo-500 transition-all rounded-t-md relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                            {formatCurrency(item.value)}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2 rotate-45 lg:rotate-0">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center">
                        <Receipt className="w-5 h-5 mr-2 text-indigo-500" />
                        Atividades Recentes
                    </h3>
                    <div className="space-y-4">
                        {data?.recentActivities.map((activity, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-transparent hover:border-indigo-300">
                                <div className={`p-2 rounded-full ${activity.type === 'Venda' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {activity.type === 'Venda' ? <DollarSign className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                    <p className="text-xs text-gray-500">{format(new Date(activity.date), 'dd/MM HH:mm')}</p>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(activity.value)}
                                </div>
                            </div>
                        ))}
                        {(!data?.recentActivities || data.recentActivities.length === 0) && (
                            <p className="text-center text-gray-500 py-10">Nenhuma atividade recente encontrada.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    trendColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, trendColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-50 ${trendColor}`}>{trend}</span>
        </div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
);

export default Dashboard;
