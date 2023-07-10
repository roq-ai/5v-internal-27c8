import axios from 'axios';
import queryString from 'query-string';
import { CandidateInterface, CandidateGetQueryInterface } from 'interfaces/candidate';
import { GetQueryInterface } from '../../interfaces';

export const getCandidates = async (query?: CandidateGetQueryInterface) => {
  const response = await axios.get(`/api/candidates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCandidate = async (candidate: CandidateInterface) => {
  const response = await axios.post('/api/candidates', candidate);
  return response.data;
};

export const updateCandidateById = async (id: string, candidate: CandidateInterface) => {
  const response = await axios.put(`/api/candidates/${id}`, candidate);
  return response.data;
};

export const getCandidateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/candidates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCandidateById = async (id: string) => {
  const response = await axios.delete(`/api/candidates/${id}`);
  return response.data;
};
