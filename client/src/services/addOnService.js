import api from './api';

const addOnService = {
  getAddOns: async (params = {}) => {
    const response = await api.get('/add-ons', { params });
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/add-ons/categories');
    return response.data;
  },
};

export default addOnService;
