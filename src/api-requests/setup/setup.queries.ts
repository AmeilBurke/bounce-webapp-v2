import { queryOptions } from '@tanstack/react-query';
import axiosInstance from '../axiosInstance';

export const setupStatusQueryOptions = queryOptions({
    queryKey: ['setup-status'] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<boolean>(
            '/staff/is-setup-complete'
        );
        return data;
    },
    staleTime: Infinity,
});