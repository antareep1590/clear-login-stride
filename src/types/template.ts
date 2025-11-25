export interface Template {
  id: string;
  title: string;
  subject: string;
  body: string;
  category: 'User' | 'Applicant' | 'Candidate';
  status: boolean;
  createdOn: string;
  updatedAt: string;
  usedHistory: number;
}
