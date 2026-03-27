'use client'

import { useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DATE_FILTER } from '@/enums/DateFilters';
import { MonetaryService } from '@/services/monetaryService';

const CHART_COLORS = [
    '#6366f1', '#f59e0b', '#06b6d4', '#8b5cf6',
    '#f97316', '#ec4899', '#14b8a6', '#84cc16'
];

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function parseSqlDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function getPeriodKey(dateStr, dateFilter) {
    const d = parseSqlDate(dateStr);
    switch (dateFilter) {
        case DATE_FILTER.WEEKLY:
        case DATE_FILTER.MONTHLY:
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        case DATE_FILTER.QUARTERLY:
        case DATE_FILTER.BIANNUAL:
        case DATE_FILTER.ANNUAL:
        case DATE_FILTER.TOTAL:
        default:
            return `${MONTHS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    }
}

function getPeriodSortKey(dateStr, dateFilter) {
    const d = parseSqlDate(dateStr);
    switch (dateFilter) {
        case DATE_FILTER.QUARTERLY:
        case DATE_FILTER.BIANNUAL:
        case DATE_FILTER.ANNUAL:
        case DATE_FILTER.TOTAL:
            return d.getFullYear() * 100 + d.getMonth();
        default:
            return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    }
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-border rounded-xl px-3 py-2 shadow-md text-xs">
            <p className="font-semibold mb-1">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color }}>
                    {entry.name}: {MonetaryService.floatToBr(entry.value)}
                </p>
            ))}
        </div>
    );
}

function PieTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-border rounded-xl px-3 py-2 shadow-md text-xs">
            <p className="font-semibold">{payload[0].name}</p>
            <p style={{ color: payload[0].payload.color }}>
                {MonetaryService.floatToBr(payload[0].value)}
            </p>
        </div>
    );
}

export function FinancialDashboard({
    expenses,
    incomes,
    categories,
    payees,
    sources,
    dateFilter
}) {
    const timeSeriesData = useMemo(() => {
        const groups = {};
        expenses.forEach(e => {
            const key = getPeriodKey(e.date, dateFilter);
            const sortKey = getPeriodSortKey(e.date, dateFilter);
            if (!groups[key]) groups[key] = { period: key, sortKey, Entradas: 0, Saídas: 0 };
            groups[key]['Saídas'] += e.amount;
        });
        incomes.forEach(i => {
            const key = getPeriodKey(i.date, dateFilter);
            const sortKey = getPeriodSortKey(i.date, dateFilter);
            if (!groups[key]) groups[key] = { period: key, sortKey, Entradas: 0, Saídas: 0 };
            groups[key]['Entradas'] += i.amount;
        });
        return Object.values(groups).sort((a, b) => a.sortKey - b.sortKey);
    }, [expenses, incomes, dateFilter]);

    const expensesByCategory = useMemo(() => {
        const groups = {};
        expenses.forEach(e => {
            const key = e.categoryId ?? '__none';
            groups[key] = (groups[key] ?? 0) + e.amount;
        });
        return Object.entries(groups)
            .map(([id, value]) => {
                const cat = categories.list.find(c => c.id === id);
                return { name: cat?.title ?? 'Sem categoria', value, color: cat?.color ?? '#94a3b8' };
            })
            .sort((a, b) => b.value - a.value);
    }, [expenses, categories.list]);

    const incomesBySource = useMemo(() => {
        const groups = {};
        incomes.forEach(i => {
            const key = i.sourceId ?? '__none';
            groups[key] = (groups[key] ?? 0) + i.amount;
        });
        return Object.entries(groups)
            .map(([id, value], idx) => {
                const src = sources.list.find(s => s.id === id);
                return { name: src?.name ?? 'Sem fonte', value, color: CHART_COLORS[idx % CHART_COLORS.length] };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [incomes, sources.list]);

    const topPayees = useMemo(() => {
        const groups = {};
        expenses.forEach(e => {
            const key = e.payeeId ?? '__none';
            groups[key] = (groups[key] ?? 0) + e.amount;
        });
        return Object.entries(groups)
            .map(([id, value], idx) => {
                const p = payees.list.find(p => p.id === id);
                return { name: p?.name ?? 'Sem pagador', value, fill: CHART_COLORS[idx % CHART_COLORS.length] };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [expenses, payees.list]);

    if (expenses.length === 0 && incomes.length === 0) {
        return (
            <div className="flex items-center justify-center flex-1 text-gray-400 text-sm">
                Nenhuma transação no período selecionado
            </div>
        );
    }

    const tickFormatter = v => MonetaryService.floatToBr(v);

    return (
        <div className={`
            flex flex-col gap-4 flex-1
            overflow-y-auto pr-2 pb-4
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:rounded-md
            [&::-webkit-scrollbar-thumb]:bg-gray-400/50
            [&::-webkit-scrollbar-thumb]:rounded-md
            [&::-webkit-scrollbar-thumb:hover]:bg-gray-400/80
        `}>
            {timeSeriesData.length > 1 && (
                <div className="border border-border rounded-2xl p-4">
                    <h3 className="text-sm font-semibold mb-3 text-gray-500">Evolução no Período</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={timeSeriesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradEntradas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradSaidas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={tickFormatter} tick={{ fontSize: 10 }} width={90} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                            <Area type="monotone" dataKey="Entradas" stroke="#22c55e" fill="url(#gradEntradas)" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="Saídas" stroke="#f43f5e" fill="url(#gradSaidas)" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="flex gap-4">
                {expensesByCategory.length > 0 && (
                    <div className="border border-border rounded-2xl p-4 flex-1 min-w-0">
                        <h3 className="text-sm font-semibold mb-3 text-gray-500">Gastos por Categoria</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={expensesByCategory}
                                    cx="50%" cy="50%"
                                    innerRadius={50} outerRadius={75}
                                    paddingAngle={3} dataKey="value"
                                >
                                    {expensesByCategory.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {incomesBySource.length > 0 && (
                    <div className="border border-border rounded-2xl p-4 flex-1 min-w-0">
                        <h3 className="text-sm font-semibold mb-3 text-gray-500">Entradas por Fonte</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={incomesBySource}
                                    cx="50%" cy="50%"
                                    innerRadius={50} outerRadius={75}
                                    paddingAngle={3} dataKey="value"
                                >
                                    {incomesBySource.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {topPayees.length > 0 && (
                <div className="border border-border rounded-2xl p-4">
                    <h3 className="text-sm font-semibold mb-3 text-gray-500">Maiores Gastos por Pagador</h3>
                    <ResponsiveContainer width="100%" height={topPayees.length * 36 + 20}>
                        <BarChart data={topPayees} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                            <XAxis type="number" tickFormatter={tickFormatter} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="Valor" radius={[0, 4, 4, 0]}>
                                {topPayees.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
