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

export const useMaster = (api, key, url, option = {}) =>
  useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        const response = await apiService("get", api, url);

        // Kembalikan data meskipun kosong atau null
        return response || [];
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);

        // Kembalikan array kosong jika error, bukan throw error
        return [];
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
    // Tambahkan retry: false agar tidak retry terus menerus
    retry: false,
    ...option,
  });
