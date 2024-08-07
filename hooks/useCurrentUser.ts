import useSWR from 'swr';

import fetcher from '@/lib/fetcher';
import { EXPORT_DETAIL } from 'next/dist/shared/lib/constants';

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;