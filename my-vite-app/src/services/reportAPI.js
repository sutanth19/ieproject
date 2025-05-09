import api from './api';

export const reportAPI = {
  getIedbData: () => {
    return api.get('/api/report/IedbData');
  },
  

};