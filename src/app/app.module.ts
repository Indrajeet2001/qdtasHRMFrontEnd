 import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { AddUserComponent } from './add-user/add-user.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LeaveComponent } from './leave/leave.component';
import { TimeComponent } from './time/time.component';
import { MyInfoComponent } from './my-info/my-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TempPasswordComponent } from './temp-password/temp-password.component';
import { DialogboxComponent } from './dialogbox/dialogbox.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterPipe } from 'src/app/add-user/filter.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { TimeSheetDataComponent } from './time-sheet-data/time-sheet-data.component';
import { MatTableModule } from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { ProjectsComponent } from './projects/projects.component';
import {FormControl,  ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DepartmentComponent } from './department/department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';
import {MatCardModule} from "@angular/material/card";
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
import { EditJobtitleComponent } from './edit-jobtitle/edit-jobtitle.component';
import { EditJobcategoriesComponent } from './edit-jobcategories/edit-jobcategories.component';
import { EditEmpstatusComponent } from './edit-empstatus/edit-empstatus.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { EditWorkshiftsComponent } from './edit-workshifts/edit-workshifts.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditRecruitmentComponent } from './edit-recruitment/edit-recruitment.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TasksComponent } from './tasks/tasks.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ManagerandteamdetailsComponent } from './managerandteamdetails/managerandteamdetails.component';
import { TeamsFormComponentComponent } from './teams-form-component/teams-form-component.component';
import { ManagersFormComponentComponent } from './managers-form-component/managers-form-component.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    HeaderComponent,
    AddUserComponent,
    SidenavComponent,
    LeaveComponent,
    TimeComponent,
    MyInfoComponent,
    EditUserComponent,
    ResetPasswordComponent,
    TempPasswordComponent,
    DialogboxComponent,
    FilterPipe,
    TimeSheetDataComponent,
    ProjectsComponent,
    DepartmentComponent,
    EditDepartmentComponent,
    GeneralInfoComponent,
    StructureComponent,
    JobTitleComponent,
    AddJobTitleComponent,
    EmpStatusComponent,
    AddEmpStatusComponent,
    JobCategoriesComponent,
    AddJobCategoriesComponent,
    WorkshiftsComponent,
    AddWorkshiftsComponent,
    EditJobtitleComponent,
    EditJobcategoriesComponent,
    EditEmpstatusComponent,
    DropdownComponent,
    EditWorkshiftsComponent,
    LeaveReportComponent,
    RecruitmentComponent,
    DashboardComponent,
    EditRecruitmentComponent,
    TasksComponent,
    UserDetailsComponent,
    ManagerandteamdetailsComponent,
    TeamsFormComponentComponent,
    ManagersFormComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatCardModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
