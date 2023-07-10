import { CandidateInterface } from 'interfaces/candidate';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface JobInterface {
  id?: string;
  title: string;
  description?: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  candidate?: CandidateInterface[];
  company?: CompanyInterface;
  _count?: {
    candidate?: number;
  };
}

export interface JobGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  company_id?: string;
}
