import { renderHook, act, waitFor } from '@testing-library/react';
import { useDataList } from '@/hooks/useDataList';

const mockRepository = {
    findAll: jest.fn(),
};

describe('useDataList', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('inicia com lista vazia e loading true', () => {
        mockRepository.findAll.mockResolvedValue([]);

        const { result } = renderHook(() =>
            useDataList({ repository: mockRepository })
        );

        expect(result.current.list).toEqual([]);
        expect(result.current.loading).toBe(true);
    });

    it('busca e popula a lista após montagem', async () => {
        const mockData = [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }];
        mockRepository.findAll.mockResolvedValue(mockData);

        const { result } = renderHook(() =>
            useDataList({ repository: mockRepository })
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.list).toEqual(mockData);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('passa filtros e ordenação para o repository', async () => {
        mockRepository.findAll.mockResolvedValue([]);
        const filters = { status: 'active' };
        const order = { column: 'name', ascending: true };

        const { result } = renderHook(() =>
            useDataList({ repository: mockRepository, filters, order })
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockRepository.findAll).toHaveBeenCalledWith(filters, order);
    });

    it('refresh dispara nova busca', async () => {
        mockRepository.findAll.mockResolvedValue([]);

        const { result } = renderHook(() =>
            useDataList({ repository: mockRepository })
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => { result.current.refresh(); });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockRepository.findAll).toHaveBeenCalledTimes(2);
    });

    it('não faz fetch quando delay é true', () => {
        const { result } = renderHook(() =>
            useDataList({ repository: mockRepository, delay: true })
        );

        expect(mockRepository.findAll).not.toHaveBeenCalled();
        expect(result.current.loading).toBe(true);
    });

    it('não quebra quando o repository lança erro', async () => {
        mockRepository.findAll.mockRejectedValue(new Error('Falha na rede'));

        const { result } = renderHook(() =>
            useDataList({ repository: mockRepository })
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.list).toEqual([]);
    });

});
