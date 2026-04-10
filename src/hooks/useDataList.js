'use client'
import { useState, useEffect, useCallback } from 'react';

export function useDataList({
    repository,
    filters,
    order,
    delay,
    dateRange
}) {

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flag, setFlag] = useState(false);

    const refresh = useCallback(() => {
        setFlag(prev => !prev);
    }, []);

    useEffect(() => {
        if(delay) return;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await repository.findAll(filters, order, dateRange ?? null);
                setList(data);
            } catch(err) {
                setError(err.message ?? 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, delay, dateRange]);

    return {
        list,
        setList,
        loading,
        error,
        refresh
    };
}