import axios from 'axios';
import queryString from 'query-string';
import { KanbanInterface, KanbanGetQueryInterface } from 'interfaces/kanban';
import { GetQueryInterface } from '../../interfaces';

export const getKanbans = async (query?: KanbanGetQueryInterface) => {
  const response = await axios.get(`/api/kanbans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createKanban = async (kanban: KanbanInterface) => {
  const response = await axios.post('/api/kanbans', kanban);
  return response.data;
};

export const updateKanbanById = async (id: string, kanban: KanbanInterface) => {
  const response = await axios.put(`/api/kanbans/${id}`, kanban);
  return response.data;
};

export const getKanbanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/kanbans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteKanbanById = async (id: string) => {
  const response = await axios.delete(`/api/kanbans/${id}`);
  return response.data;
};
