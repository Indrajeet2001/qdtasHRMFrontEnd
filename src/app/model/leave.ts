import { User } from "./user";

export class Leave {
  leaveId!: number;

  employee!: User;

  startDate!: Date;
  
  totalLeaves!: number;

  endDate!: Date;

  type!: string;

  reason!: string;

  status!: string;
}


