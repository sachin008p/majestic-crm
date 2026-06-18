import api from './api';

export const leadService = {
  getAllLeads: async () => {
    const response = await api.get('/api/leads');
    return response.data;
  },

  getLead: async (id) => {
    const response = await api.get(`/api/leads/${id}`);
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },

  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  },

  deleteLead: async (id) => {
    await api.delete(`/api/leads/${id}`);
  },
};