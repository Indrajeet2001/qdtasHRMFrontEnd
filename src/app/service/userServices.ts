import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_API_URL } from '../constansts';
import { Observable, Subject, forkJoin, throwError } from 'rxjs';
import { User } from '../model/user';
import { Leave } from '../model/leave';
import { map, catchError } from 'rxjs/operators';
import { Time } from '../model/time';
import { JobTitle } from '../model/jobTitle';
import { EmpStatus } from '../model/empStatus';
import { JobCategory } from '../model/jobCategory';
import { GeneralInfo } from '../model/genInfo';
import { WorkShift } from '../model/workshift';
import { Recruitment } from '../model/recruitment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}
  loginSubject = new Subject<User>();

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getHeadersWithoutToken() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return headers;
  }

  storeAuthUserInCache(authUser: User): void {
    if (authUser != null) {
      localStorage.setItem('authUser', JSON.stringify(authUser));
    }
    this.loginSubject.next(authUser);
  }

  getAuthUserFromCache(): User {
    let user = localStorage.getItem('authUser') as string;
    var myObject: User = JSON.parse(user) as User;
    return myObject;
  }

  updateAuthUserInCache(updatedUser: User): void {
    localStorage.setItem('authUser', JSON.stringify(updatedUser)); 
    this.loginSubject.next(updatedUser);
  }

  getAuthUserId(): number {
    return this.getAuthUserFromCache().userId;
  }

  // <----  Authemtication Services

  login(data: any) {
    return this.http.post(BASE_API_URL + `/user/login`, data, {
      headers: this.getHeadersWithoutToken(),
    });
  }

  clearc() {
    localStorage.clear();
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    if (token == null || token.length <= 0) {
      return false;
    } else {
      return true;
    }
  }

  //  Authemtication Services ---->

  resetPassword(email: string) {
    return this.http.post<any>(
      BASE_API_URL + `/user/resetPassword?email=` + email,
      { headers: this.getHeadersWithoutToken() }
    );
  }

  changeTempPass(cp: any) {
    return this.http.post<any>(BASE_API_URL + `/user/changeTempPassword`, cp, {
      headers: this.getHeadersWithoutToken(),
    });
  }

  updateUser(uId: number, user: any) {
    return this.http.post<any>(BASE_API_URL + `/user/updateUser/` + uId, user, {
      headers: this.getHeaders(),
    });
  }

  profile() {
    const user = localStorage.getItem('authUser');
  }

  addUser(user: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(BASE_API_URL + `/user/add`, user, {
      headers: this.getHeaders(),
    });
  }

  getAllUsers(currentPage: number, resultSize: number) {
    return this.http.get<User[]>(
      BASE_API_URL + `/user/getAll?pgn=` + currentPage + `&sz=` + resultSize,
      { headers: this.getHeaders() }
    );
  }

  seachUser(currentPage: number, resultSize: number, key: string) {
    return this.http.get<User[]>(
      BASE_API_URL +
        `/user/seachUser?pgn=` +
        currentPage +
        `&sz=` +
        resultSize +
        `&key=` +
        key,
      { headers: this.getHeaders() }
    );
  }

  // getUserById(uId: number) {
  //   return this.http.get<any>(BASE_API_URL + `/user/` + uId, { headers: this.getHeaders() });
  // }

  getUserById(uId: number): Observable<User> {
    return this.http
      .get<any>(BASE_API_URL + `/user/` + uId, { headers: this.getHeaders() })
      .pipe(
        map((res) => {
          // Map response data to User class
          return new User(
            res.userId,
            res.userName,
            res.email,
            res.password,
            res.firstName,
            res.middleName,
            res.lastName,
            res.gender,
            res.dept,
            res.role,
            res.subRole,
            res.phoneNumber,
            res.address,
            res.designation,
            res.emailVerified,
            res.birthDate,
            res.joinDate,
            res.projects
          );
        }),
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError('Something went wrong while fetching user data.');
        })
      );
  }

  getUsersById(userId: number) {
    return this.http.get<any>(
      BASE_API_URL + `/user/` + userId,

      { headers: this.getHeaders() }
    );
  }

  getUsersByUsername(username: string): Observable<User[]> {
    console.log(BASE_API_URL + `/user/userInfo/` + username);

    return this.http.get<User[]>(BASE_API_URL + `/user/userInfo/` + username, {
      headers: this.getHeaders(),
    });
  }

  deleteUser(userId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/user/deleteUser?uId=` + userId,
      userId,
      { headers: this.getHeaders() }
    );
  }

  enableUser(userId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/user/enableUser/` + userId,
      userId,
      { headers: this.getHeaders() }
    );
  }

  // leave methods

  getAllLeaves(currentPage: number, resultSize: number) {
    return this.http.get<Leave[]>(
      BASE_API_URL +
        `/leave/getAllLeaves?pgn=` +
        currentPage +
        `&sz=` +
        resultSize,
      { headers: this.getHeaders() }
    );
  }

  applyLeave(userData: any, empId: string): Observable<any> {
    const url = `${BASE_API_URL}/leave/create/${empId}`;
    return this.http.post(url, userData, { headers: this.getHeaders() });
  }

  deleteLeave(leaveId: number) {
    return this.http.delete<String>(BASE_API_URL + `/leave/delete/` + leaveId, {
      headers: this.getHeaders(),
    });
  }

  changeLeaveStatus(leaveId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/leave/reject/` + leaveId,
      leaveId,
      { headers: this.getHeaders() }
    );
  }

  changeLeaveStatusApprove(leaveId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/leave/approve/` + leaveId,
      leaveId,
      { headers: this.getHeaders() }
    );
  }

  getLeavesById(eId: Number) {
    return this.http.get<any>(BASE_API_URL + `/leave/getAll/` + eId, {
      headers: this.getHeaders(),
    });
  }
  // Leave Methods

  //TimeSheet

  addTimeSheet(timeSheetData: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(BASE_API_URL + `/ts/add`, timeSheetData, {
      headers: this.getHeaders(),
    });
  }

  getTimeSheetByEmpId(currentPage: Number, resultSize: Number, eId: Number) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.get<any>(
      BASE_API_URL +
        `/ts/getByEmpId/` +
        eId +
        `?pgn=` +
        currentPage +
        `&sz=` +
        resultSize,
      { headers: this.getHeaders() }
    );
  }

  //project Modules

  addProject(projectData: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(BASE_API_URL + `/project/add`, projectData, {
      headers: this.getHeaders(),
    });
  }

  getAllProjects(currentPage: Number, resultSize: Number): Observable<any> {
    const headers = this.getHeaders();

    // Using HttpParams for query parameters
    const params = new HttpParams()
      .set('pgn', currentPage.toString())
      .set('sz', resultSize.toString());

    return this.http.get<any>(`${BASE_API_URL}/project/getAllProjects`, {
      headers,
      params,
    });
  }

  getUserPerformance(
    userId: number,
    startDate: string,
    endDate: string
  ): Observable<number> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<number>(BASE_API_URL + `/user/calculate-performance`, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred while fetching performance:', error);
          return throwError(
            'Something went wrong while fetching performance data.'
          );
        })
      );
  }

  // job title services

  addJobTitle(job: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(BASE_API_URL + `/job/add`, job, {
      headers: this.getHeaders(),
    });
  }

  getAllJobs(currentPage: number, resultSize: number) {
    return this.http.get<JobTitle[]>(
      BASE_API_URL + `/job/getAllJobs?pgn=` + currentPage + `&sz=` + resultSize,
      { headers: this.getHeaders() }
    );
  }

  deleteJob(userId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/job/deleteById/` + userId,
      userId,
      { headers: this.getHeaders() }
    );
  }

  updateJob(uId: number, jobData: any) {
    return this.http.post<any>(
      BASE_API_URL + `/job/updateById/` + uId,
      jobData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getJobById(uId: number) {
    return this.http.get<any>(BASE_API_URL + `/job/getById/` + uId, {
      headers: this.getHeaders(),
    });
  }

  // job category services

  addJobCategory(jobCategory: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(
      BASE_API_URL + `/jobcategory/addJobCategory`,
      jobCategory,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getAllJobCategory(currentPage: number, resultSize: number) {
    return this.http.get<JobCategory[]>(
      BASE_API_URL +
        `/jobcategory/getAll?pgn=` +
        currentPage +
        `&sz=` +
        resultSize,
      { headers: this.getHeaders() }
    );
  }

  deleteJobCategory(userId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/jobcategory/deleteJobById/` + userId,
      userId,
      { headers: this.getHeaders() }
    );
  }

  updateJobCategory(uId: number, jobData: any) {
    return this.http.post<any>(
      BASE_API_URL + `/jobcategory/updateJobById/` + uId,
      jobData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getJobCategoryById(uId: number) {
    return this.http.get<any>(BASE_API_URL + `/jobcategory/getJobById/` + uId, {
      headers: this.getHeaders(),
    });
  }

  // Employment status services

  addEmpStatus(empStatus: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(BASE_API_URL + `/employment/add`, empStatus, {
      headers: this.getHeaders(),
    });
  }

  getAllEmpStatus(currentPage: number, resultSize: number) {
    return this.http.get<EmpStatus[]>(
      BASE_API_URL +
        `/employment/getAllJobs?pgn=` +
        currentPage +
        `&sz=` +
        resultSize,
      { headers: this.getHeaders() }
    );
  }

  deleteEmpStatus(userId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/employment/deleteById/` + userId,
      userId,
      { headers: this.getHeaders() }
    );
  }

  updateEmpStatus(uId: number, jobData: any) {
    return this.http.post<any>(
      BASE_API_URL + `/employment/updateById/` + uId,
      jobData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getEmpStatusById(uId: number) {
    return this.http.get<any>(BASE_API_URL + `/employment/getById/` + uId, {
      headers: this.getHeaders(),
    });
  }

  //General Information

  generalInfo() {
    return this.http.get<GeneralInfo[]>(
      BASE_API_URL + `/generalinfo/getAllInfo`,
      { headers: this.getHeaders() }
    );
  }

  //Workshifts

  addWorkshift(data: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(BASE_API_URL + `/workshift/add`, data, {
      headers: this.getHeaders(),
    });
  }

  getAllWorkshift(currentPage: number, resultSize: number) {
    return this.http.get<WorkShift[]>(
      BASE_API_URL +
        `/workshift/getAll?pgn=` +
        currentPage +
        `&sz=` +
        resultSize,
      { headers: this.getHeaders() }
    );
  }

  deleteWorkshift(workId: number) {
    return this.http.post<String>(
      BASE_API_URL + `/workshift/deleteById/` + workId,
      workId,
      { headers: this.getHeaders() }
    );
  }

  updateWorkshift(workId: number, shiftData: any) {
    return this.http.post<any>(
      BASE_API_URL + `/workshift/updateById/` + workId,
      shiftData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getWorkshiftById(uId: number) {
    return this.http.get<any>(BASE_API_URL + `/workshift/getById/` + uId, {
      headers: this.getHeaders(),
    });
  }

  //Orgainzation Structure

  getOrgainzationStructure() {
    return this.http.get<any>(BASE_API_URL + `/organization/getAllOrg`, {
      headers: this.getHeaders(),
    });
  }

  //methods fot dropdown

  //job Category
  getAllJobCat() {
    return this.http.get<any>(
      BASE_API_URL + `/jobcategory/getAll?pgn=&sz=2000`,
      { headers: this.getHeaders() }
    );
  }

  //users

  getAllUsersList() {
    return this.http.get<any[]>(BASE_API_URL + `/user/getAll?pgn=&sz=2000`, {
      headers: this.getHeaders(),
    });
  }

  //timesheet

  getTimeSheetById(eId: Number) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.get<any>(
      BASE_API_URL + `/ts/getByEmpId/` + eId + `?pgn=&sz=2000`,
      { headers: this.getHeaders() }
    );
  }

  //workshift
  // getAllWS(currentPage: number, resultSize: number) {
  //   return this.http.get<WorkShift[]>(
  //     BASE_API_URL +
  //       `/workshift/getAll?pgn=` +
  //       currentPage +
  //       `&sz=` +
  //       resultSize,
  //     { headers: this.getHeaders() }
  //   );
  // }

  //employment status

  getAllEmpS() {
    return this.http.get<any>(
      BASE_API_URL + `/employment/getAllJobs?pgn=&sz=2000`,
      { headers: this.getHeaders() }
    );
  }

  //job title
  getAllJobTitle() {
    return this.http.get<any>(BASE_API_URL + `/job/getAllJobs?pgn=&sz=2000`, {
      headers: this.getHeaders(),
    });
  }

  //timesheet
  getProjects() {
    return this.http.get<any>(
      BASE_API_URL + `/project/getAllProjects?pgn=1&sz=2000`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  //recruitment

  addRecruitment(data: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<any>(BASE_API_URL + `/recruitment/add`, data, {
      headers: this.getHeaders(),
    });
  }

  getAllRecruitment(currentPage: number, resultSize: number) {
    return this.http.get<Recruitment[]>(
      BASE_API_URL +
        `/recruitment/all?pgn=` +
        currentPage +
        `&sz=` +
        resultSize,
      { headers: this.getHeaders() }
    );
  }

  updateRecruitment(uId: number, jobData: any) {
    return this.http.post<any>(
      BASE_API_URL + `/recruitment/update/` + uId,
      jobData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getRecruitmentById(uId: number) {
    return this.http.get<any>(BASE_API_URL + `/recruitment/getById/` + uId, {
      headers: this.getHeaders(),
    });
  }

  deleteRecruitment(uId: number) {
    return this.http.delete<any>(BASE_API_URL + `/recruitment/delete/` + uId, {
      headers: this.getHeaders(),
    });
  }

  //count functions

  userCount() {
    return this.http.get<any>(BASE_API_URL + `/user/totalUserCount`, {
      headers: this.getHeaders(),
    });
  }

  jobCount() {
    return this.http.get<any>(BASE_API_URL + `/job/getTotalCount`, {
      headers: this.getHeaders(),
    });
  }

  jobCategoryCount() {
    return this.http.get<any>(BASE_API_URL + `/jobcategory/getTotalCount`, {
      headers: this.getHeaders(),
    });
  }

  empStatusCount() {
    return this.http.get<any>(BASE_API_URL + `/employment/getTotalCount`, {
      headers: this.getHeaders(),
    });
  }

  workCount() {
    return this.http.get<any>(BASE_API_URL + `/workshift/getTotalCount`, {
      headers: this.getHeaders(),
    });
  }

  recrutimentCount() {
    return this.http.get<any>(BASE_API_URL + `/recruitment/getTotalCount`, {
      headers: this.getHeaders(),
    });
  }

  deptCount() {
    return this.http.get<any>(BASE_API_URL + `/dept/getTotalCount`, {
      headers: this.getHeaders(),
    });
  }

  timesheetCount(id: number) {
    return this.http.get<any>(BASE_API_URL + `/ts/getTotalCount/` + id, {
      headers: this.getHeaders(),
    });
  }

  //Tasks Module API

  addTasks(data: any) {
    return this.http.post<any>(BASE_API_URL + `/task/assign`, data, {
      headers: this.getHeaders(),
    });
  }

  getTasksById(userId: number, pageNumber: number, pageSize: number) {
    return this.http.get<any>(
      BASE_API_URL +
        `/task/getTaskByEmpId/${userId}?pgn=${pageNumber}&sz=${pageSize}`,
      { headers: this.getHeaders() }
    );
  }
}
