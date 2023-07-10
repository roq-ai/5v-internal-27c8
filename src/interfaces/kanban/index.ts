import { CandidateInterface } from 'interfaces/candidate';
import { GetQueryInterface } from 'interfaces';

export interface KanbanInterface {
  id?: string;
  stage: string;
  candidate_id?: string;
  created_at?: any;
  updated_at?: any;

  candidate?: CandidateInterface;
  _count?: {};
}

export interface KanbanGetQueryInterface extends GetQueryInterface {
  id?: string;
  stage?: string;
  candidate_id?: string;
}
