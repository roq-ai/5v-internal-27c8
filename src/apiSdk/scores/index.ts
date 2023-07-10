import axios from 'axios';
import queryString from 'query-string';
import { ScoreInterface, ScoreGetQueryInterface } from 'interfaces/score';
import { GetQueryInterface } from '../../interfaces';

export const getScores = async (query?: ScoreGetQueryInterface) => {
  const response = await axios.get(`/api/scores${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createScore = async (score: ScoreInterface) => {
  const response = await axios.post('/api/scores', score);
  return response.data;
};

export const updateScoreById = async (id: string, score: ScoreInterface) => {
  const response = await axios.put(`/api/scores/${id}`, score);
  return response.data;
};

export const getScoreById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/scores/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteScoreById = async (id: string) => {
  const response = await axios.delete(`/api/scores/${id}`);
  return response.data;
};
