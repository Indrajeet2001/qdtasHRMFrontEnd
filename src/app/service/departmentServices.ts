import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, catchError, map, throwError } from "rxjs";
import { Department } from "../model/department";
import { BASE_API_URL } from "../constansts";

@Injectable({
    providedIn: 'root'
})

export class DepartmentService {

    constructor(private http: HttpClient, private router: Router) { }
    loginSubject = new Subject<Department>();

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


  getDeptById(deptId: number): Observable<any> {
    return this.http.get<any>(BASE_API_URL + `/dept/get/` + deptId, { headers: this.getHeaders() }).pipe(
      map(res => {
        // Assuming the response has deptId and deptName properties
        return { deptId: res.deptId, deptName: res.deptName };
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError('Something went wrong while fetching department data.');
      })
    );
  }

    addDepartment(dept: any) {
        console.log(dept);
        // let headers = new HttpHeaders().set("Authorization", `Bearer${localStorage.getItem('token')}`);
        return this.http.post<any>(BASE_API_URL + `/dept/add`, dept, { headers: this.getHeaders() })
    }

    deleteDepartment(deptId: number) {
        return this.http.post<String>(BASE_API_URL + `/dept/delete/` + deptId, deptId, { headers: this.getHeaders() });

    }

    updateDepartment(deptId: number, dept: any) {
        return this.http.post<any>(BASE_API_URL + `/dept/update/` + deptId, dept, { headers: this.getHeaders() });
    }

    getAllDepartments(currentPage: number, resultSize: number) {
      return this.http.get<Department[]>(BASE_API_URL + `/dept/getAllDepartments?pgn=` + currentPage + `&sz=` + resultSize, { headers: this.getHeaders() });
    }
}

