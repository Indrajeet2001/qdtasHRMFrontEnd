import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AddUserComponent } from './add-user/add-user.component';
import { LeaveComponent } from './leave/leave.component';
import { TimeComponent } from './time/time.component';
import { MyInfoComponent } from './my-info/my-info.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TempPasswordComponent } from './temp-password/temp-password.component';
import { TimeSheetDataComponent } from './time-sheet-data/time-sheet-data.component';
import { AuthGuard } from './shared/auth.guard';
import { ProjectsComponent } from './projects/projects.component';
import { DepartmentComponent } from './department/department.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { ShowEmpDetailsComponent } from './show-emp-details/show-emp-details.component';
import {PerformanceReportComponent} from "./performance-report/performance-report.component";
import { GeneralInfoComponent } from './general-info/general-info.component';
import { StructureComponent } from './structure/structure.component';
import { JobTitleComponent } from './job-title/job-title.component';
import { AddJobTitleComponent } from './add-job-title/add-job-title.component';
import { EmpStatusComponent } from './emp-status/emp-status.component';
import { AddEmpStatusComponent } from './add-emp-status/add-emp-status.component';
import { JobCategoriesComponent } from './job-categories/job-categories.component';
import { AddJobCategoriesComponent } from './add-job-categories/add-job-categories.component';
import { WorkshiftsComponent } from './workshifts/workshifts.component';
import { AddWorkshiftsComponent } from './add-workshifts/add-workshifts.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    component: LoginComponent,
    path: '',
  },
  {
    component: ProfileComponent,
    path: 'users',
    canActivate: [AuthGuard],
  },
  {
    component: AddUserComponent,
    path: 'adduser',
    canActivate: [AuthGuard],
  },
  {
    component: LeaveComponent,
    path: 'leave',
    canActivate: [AuthGuard],
  },
  {
    component: TimeComponent,
    path: 'time',
    canActivate: [AuthGuard],
  },
  {
    component: MyInfoComponent,
    path: 'myinfo',
    canActivate: [AuthGuard],
  },
  {
    component: EditUserComponent,
    path: 'edit-user',
    canActivate: [AuthGuard],
  },
  {
    component: ResetPasswordComponent,
    path: 'reset',
    canActivate: [AuthGuard],
  },
  {
    component: TempPasswordComponent,
    path: 'changeTempPassword',
    canActivate: [AuthGuard],
  },
  {
    component: TimeSheetDataComponent,
    path: 'timesheet',
    canActivate: [AuthGuard],
  },
  {
    component: ProjectsComponent,
    path: 'project',
    canActivate: [AuthGuard],
  },
  {
    component: DepartmentComponent,
    path: 'department',
    canActivate: [AuthGuard],
  },
  {
    component: EmployeeDetailsComponent,
    path: 'employee-details',
    canActivate: [AuthGuard],
  },
  {
    component: ShowEmpDetailsComponent,
    path: 'show-emp-details',
    canActivate: [AuthGuard],
  },
  {
    component: PerformanceReportComponent,
    path: 'performance-report',
    canActivate: [AuthGuard],
  },
  {
    component: GeneralInfoComponent,
    path: 'general-info',
    canActivate: [AuthGuard],
  },
  {
    component: StructureComponent,
    path: 'structure',
    canActivate: [AuthGuard],
  },
  {
    component: JobTitleComponent,
    path: 'job-title',
    canActivate: [AuthGuard],
  },
  {
    component: AddJobTitleComponent,
    path: 'add-job-title',
    canActivate: [AuthGuard],
  },
  {
    component: EmpStatusComponent,
    path: 'emp-status',
    canActivate: [AuthGuard],
  },
  {
    component: AddEmpStatusComponent,
    path: 'add-emp-status',
    canActivate: [AuthGuard],
  },
  {
    component: JobCategoriesComponent,
    path: 'job-categories',
    canActivate: [AuthGuard],
  },
  {
    component: AddJobCategoriesComponent,
    path: 'add-job-categories',
    canActivate: [AuthGuard],
  },
  {
    component: WorkshiftsComponent,
    path: 'work-shifts',
    canActivate: [AuthGuard],
  },
  {
    component: AddWorkshiftsComponent,
    path: 'add-work-shifts',
    canActivate: [AuthGuard],
  },
  {
    component: LeaveReportComponent,
    path: 'reports',
    canActivate: [AuthGuard],
  },
  {
    component: RecruitmentComponent,
    path: 'recruitment',
    canActivate: [AuthGuard],
  },
  {
    component: DashboardComponent,
    path: 'dashBoard',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
