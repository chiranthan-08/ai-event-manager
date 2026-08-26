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
  createAddOn: async (data) => {
    const response = await api.post('/add-ons', data);
    return response.data;
  },
  updateAddOn: async (id, data) => {
    const response = await api.put(`/add-ons/${id}`, data);
    return response.data;
  },
  deleteAddOn: async (id) => {
    const response = await api.delete(`/add-ons/${id}`);
    return response.data;
  },
};

export default addOnService;
