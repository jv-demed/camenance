'use client'
import { useState, useEffect, useCallback } from 'react';

export function useDataList({
    repository,
    filters,
    order,
    delay
}) {

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false);

    const refresh = useCallback(() => {
        setFlag(prev => !prev);
    }, []);

    useEffect(() => {
        if(delay) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await repository.findAll(filters, order);
                setList(data);
            } catch(err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [flag, delay]);

    return {
        list,
        setList,
        loading,
        refresh
    };
}