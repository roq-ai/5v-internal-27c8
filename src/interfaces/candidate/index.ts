import { KanbanInterface } from 'interfaces/kanban';
import { ScoreInterface } from 'interfaces/score';
import { JobInterface } from 'interfaces/job';
import { GetQueryInterface } from 'interfaces';

export interface CandidateInterface {
  id?: string;
  name: string;
  email: string;
  job_id?: string;
  created_at?: any;
  updated_at?: any;
  kanban?: KanbanInterface[];
  score?: ScoreInterface[];
  job?: JobInterface;
  _count?: {
    kanban?: number;
    score?: number;
  };
}

export interface CandidateGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  email?: string;
  job_id?: string;
}
