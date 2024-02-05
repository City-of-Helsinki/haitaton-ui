import { useQuery } from 'react-query';
import authService from './authService';

export default function useUser() {
  return useQuery('user', authService.getUser, { staleTime: Infinity });
}
