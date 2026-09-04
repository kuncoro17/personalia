// import { useQuery } from "@tanstack/react-query";

// import { apiService } from "../service/api";

// export const DEFAULT_QUERY_OPTIONS = {
//   staleTime: 5 * 60 * 1000,
//   gcTime: 10 * 60 * 1000,
//   refetchOnWindowFocus: false,
// };

// export const useMaster = (api, key, url, option = {}) =>
//   useQuery({
//     queryKey: key,
//     queryFn: () => apiService("get", api, url),
//     ...DEFAULT_QUERY_OPTIONS,
//     ...option,
//   });

import { useQuery } from "@tanstack/react-query";

import { apiService } from "../service/api";

export const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const useMaster = (api, key, url, option = {}) => {
  const { returnEmptyOnError = true, ...queryOptions } = option;

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        const response = await apiService("get", api, url);

        return response || [];
      } catch (error) {
        if (returnEmptyOnError) {
          return [];
        }

        throw error;
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
    retry: false,
    ...queryOptions,
  });
};
