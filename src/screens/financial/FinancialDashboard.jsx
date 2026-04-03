'use client'

import { useMemo } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MonetaryService } from '@/services/monetaryService';

const CHART_COLORS = [
    '#6366f1', '#f59e0b', '#06b6d4', '#8b5cf6',
    '#f97316', '#ec4899', '#14b8a6', '#84cc16'
];

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
}) {
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
