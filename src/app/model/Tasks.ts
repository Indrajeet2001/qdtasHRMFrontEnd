import { User } from './user';

export interface Tasks {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  assignee: number;
  empId: number;
}
