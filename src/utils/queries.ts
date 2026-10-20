import type { QueryClient, QueryKey } from "@tanstack/react-query";

// A change refreshes data twice: from its own request, and from the socket event the API sends
// everyone. Sharing a refresh that's already running stops the second one restarting the fetch
export const refresh = (queryClient: QueryClient, queryKey: QueryKey) =>
    queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false });
