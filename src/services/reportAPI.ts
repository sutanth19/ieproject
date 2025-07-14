import api from './api';
import { AxiosResponse } from 'axios';

// Define the item type returned by the API
export interface IedbDataItem {
  title: string;
  number: string | number;
  percentageChanged?: string;
  dateUpdated?: string;
}

export const reportAPI = {
  getIedbData: (): Promise<AxiosResponse<IedbDataItem[]>> => {
    return api.get('/api/report/IedbData');
  },
};
