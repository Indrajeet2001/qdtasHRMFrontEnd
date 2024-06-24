import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_API_URL } from '../constansts';
import { Observable, Subject , forkJoin , throwError} from 'rxjs';
import { User } from '../model/user';
import { Leave } from '../model/leave';
import { map, catchError } from 'rxjs/operators';
import { Time } from '../model/time';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  loginSubject = new Subject<User>();


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getHeadersWithoutToken() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return headers;
  }

  storeAuthUserInCache(authUser: User): void {
    if (authUser != null) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    }
    this.loginSubject.next(authUser);
  }

  getAuthUserFromCache(): User {
    let user = localStorage.getItem("authUser") as string;
    var myObject: User = JSON.parse(user) as User;
    return myObject;
  }

  getAuthUserId(): number {
    return this.getAuthUserFromCache().userId;
  }

  // <----  Authemtication Services

  login(data: any) {
    return this.http.post(BASE_API_URL + `/user/login`, data, { headers: this.getHeadersWithoutToken() });
  }

  clearc() {
    localStorage.clear();
  }

  isLoggedIn() {
    const token = localStorage.getItem("token");
    if (token == null || token.length <= 0) {
      return false;
    } else {
      return true;
    }
  }

  //  Authemtication Services ---->

  resetPassword(email: string) {
    return this.http.post<any>(BASE_API_URL + `/user/resetPassword?email=` + email, { headers: this.getHeadersWithoutToken() });
  }

  changeTempPass(cp: any) {
    return this.http.post<any>(BASE_API_URL + `/user/changeTempPassword`, cp, { headers: this.getHeadersWithoutToken() });
  }

  updateUser(uId: number, user: any) {
    return this.http.post<any>(BASE_API_URL + `/user/updateUser/` + uId, user, { headers: this.getHeaders() });
  }

  profile() {
    const user = localStorage.getItem('user');
  }

  addUser(user: any) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/user/add`, user, { headers: this.getHeaders() });
  }

  getAllUsers(currentPage: number, resultSize: number) {
    return this.http.get<User[]>(BASE_API_URL + `/user/getAll?pgn=` + currentPage + `&sz=` + resultSize, { headers: this.getHeaders() });
  }

  seachUser(currentPage: number, resultSize: number , key :string) {
    return this.http.get<User[]>(BASE_API_URL + `/user/seachUser?pgn=` + currentPage + `&sz=` + resultSize + `&key=` + key, { headers: this.getHeaders() });
  }


  // getUserById(uId: number) {
  //   return this.http.get<any>(BASE_API_URL + `/user/` + uId, { headers: this.getHeaders() });
  // }

  getUserById(uId: number): Observable<User> {
    return this.http.get<any>(BASE_API_URL + `/user/` + uId, { headers: this.getHeaders() }).pipe(
      map(res => {
        // Map response data to User class
        return new User(
          res.userId,res.userName,res.email,res.password,res.firstName,res.middleName,res.lastName,res.gender,res.dept,res.role,res.phoneNumber,
          res.address,res.designation,res.emailVerified,res.birthDate,res.joinDate,res.projects
        );
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError('Something went wrong while fetching user data.');
      })
    );
  }

  

  // getUserByUsername(username: string): Observable<User> {
  //   return this.http.get<any>(BASE_API_URL + `/user/byUsername/${username}`, { headers: this.getHeaders() }).pipe(
  //     map(res => {
  //       // Map response data to User class
  //       return new User(
  //         res.userId,res.userName,res.email,res.password,res.firstName,res.middleName,res.lastName,res.gender,res.dept,res.role,res.phoneNumber,
  //         res.address,res.designation,res.emailVerified,res.birthDate,res.joinDate,res.projects
  //       );
  //     }),
  //     catchError(error => {
  //       console.error('Error occurred:', error);
  //       return throwError('Something went wrong while fetching user data.');
  //     })
  //   );
  // }

  // getUsersByUsername(username: string): Observable<User[]> {
  //   return this.http.get<any[]>(BASE_API_URL + `/user/userInfo?usn=` +username, { headers: this.getHeaders() }).pipe(
  //     map(res => {
  //       // Map response data to an array of User instances
  //       return res.map(user => new User(
  //         user.userId, user.userName, user.email, user.password, user.firstName, user.middleName, user.lastName, user.gender, user.dept, user.role, user.phoneNumber,
  //         user.address, user.designation, user.emailVerified, user.birthDate, user.joinDate, user.projects
  //       ));
  //     }),
  //     catchError(error => {
  //       console.error('Error occurred:', error);
  //       return throwError('Something went wrong while fetching user data.');
  //     })
  //   );
  // }

  getUsersByUsername(username: string): Observable<User[]> {
    console.log(BASE_API_URL + `/user/userInfo/`+username);
    
    return this.http.get<User[]>(BASE_API_URL + `/user/userInfo/`+username, { headers: this.getHeaders() });
  }
  

  // getUserInfo(userId: number): Observable<User> {
  //   return this.http.get<any>(BASE_API_URL+ `/user/getUserInfo/ ` + userId, { headers: this.getHeaders() });
  // }


  deleteUser(userId: number) {
    return this.http.post<String>(BASE_API_URL + `/user/deleteUser?uId=` + userId, userId, { headers: this.getHeaders() });

  }

  // leave methods

  getAllLeaves(currentPage: number, resultSize: number) {
    return this.http.get<Leave[]>(BASE_API_URL + `/leave/getAllLeaves?pgn=` + currentPage + `&sz=` + resultSize, { headers: this.getHeaders() });
  }



  applyLeave(leaveData: any, empId: number) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/leave/create/` + empId, leaveData, { headers: this.getHeaders() });
  }




  deleteLeave(leaveId: number) {
    return this.http.post<String>(BASE_API_URL + `/leave/delete/` + leaveId, leaveId, { headers: this.getHeaders() });
  }

  changeLeaveStatus(leaveId: number) {
    return this.http.post<String>(BASE_API_URL + `/leave/reject/` + leaveId, leaveId, { headers: this.getHeaders() });
  }

  changeLeaveStatusApprove(leaveId: number) {
    return this.http.post<String>(BASE_API_URL + `/leave/approve/` + leaveId, leaveId, { headers: this.getHeaders() });
  }


  // Leave Methods


  //TimeSheet

  addTimeSheet(timeSheetData: any) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/ts/add` , timeSheetData,  {headers:this.getHeaders() });
  }

  getTimeSheetByEmpId(currentPage: Number, resultSize: Number, eId: Number) {
      let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(BASE_API_URL + `/ts/getByEmpId/` + eId +  `?pgn=` + currentPage + `&sz=` + resultSize , { headers: this.getHeaders() });
  }


  //project Modules



  addProject(projectData: any) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/project/add` , projectData,  {headers:this.getHeaders() });
  }

  getAllProjects(currentPage: Number, resultSize: Number): Observable<any> {
    const headers = this.getHeaders();

    // Using HttpParams for query parameters
    const params = new HttpParams()
      .set('pgn', currentPage.toString())
      .set('sz', resultSize.toString());

    return this.http.get<any>(`${BASE_API_URL}/project/getAllProjects`, { headers, params });
  }


}



