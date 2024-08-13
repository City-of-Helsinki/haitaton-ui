import api from '../domain/api/api';

export enum BannerType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

interface LocalizedText {
  fi: string;
  sv: string;
  en: string;
}

interface BannerResponse {
  label: LocalizedText;
  text: LocalizedText;
}

export type BannersResponse = {
  [key in BannerType]?: BannerResponse;
};

export const fetchBanners = async (): Promise<BannersResponse> => {
  const response = await api.get<BannersResponse>('/banners');
  return response.data;
};
