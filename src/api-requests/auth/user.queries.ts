import { queryOptions } from '@tanstack/react-query';
import getProfileDetails from './getProfileDetails';

export const userDetailsQueryOptions = queryOptions({
    queryKey: ['user-details'],
    queryFn: getProfileDetails,
    staleTime: Infinity
});