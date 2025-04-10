import api from '../../api/api';
import { HankeData } from '../../types/hanke';
import { useQuery } from 'react-query';
import axios from 'axios';

const getHankkeet = async () => {
  const { data } = await api.get<HankeData[]>(`/hankkeet`, {
    params: {
      geometry: false,
    },
  });
  return data;
};

export default function useHankkeet() {
  return useQuery<HankeData[] | null>(
    ['hankkeet'],
    async () => {
      try {
        return await getHankkeet();
      } catch (error: unknown) {
        if (
          (axios.isAxiosError(error) && error.response?.status === 401) ||
          (error instanceof Error && error.message === 'No token')
        ) {
          return null;
        }
        throw error;
      }
    },
    {
      enabled: true,
    },
  );
}
