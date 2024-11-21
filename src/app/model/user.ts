import { Department } from "./department";
import { Project } from "./project";

export class User {
  userId!: number;
  userName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  gender: string | undefined;
  dept: Department | undefined;
  role: string | undefined;
  subRole: string | undefined;
  phoneNumber: string | undefined;
  address: string | undefined;
  designation: string | undefined;
  emailVerified: Boolean | undefined;
  projects: Project[] = [];
  birthDate: Date | undefined;
  joinDate: string | undefined;
  totalLeaves: number | undefined;

  constructor(
    userId: number,
    userName: string | undefined,
    email: string | undefined,
    password: string | undefined,
    firstName: string | undefined,
    middleName: string | undefined,
    lastName: string | undefined,
    gender: string | undefined,
    dept: Department | undefined,
    role: string | undefined,
    subRole: string | undefined,
    phoneNumber: string | undefined,
    address: string | undefined,
    designation: string | undefined,
    emailVerified: boolean | undefined,
    birthDate: Date | undefined,
    joinDate: string | undefined,
    totalLeaves: number | undefined,
    projects?: Project[]
  ) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.gender = gender;
    this.dept = dept;
    this.role = role;
    this.subRole = subRole;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.designation = designation;
    this.emailVerified = emailVerified;
    this.birthDate = birthDate;
    this.joinDate = joinDate;
    this.totalLeaves = totalLeaves;
    if (projects) {
      this.projects = projects;
    }
  }
}



