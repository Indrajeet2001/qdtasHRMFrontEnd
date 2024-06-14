import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/userServices';
import { Subscription } from 'rxjs';
import { Project } from '../model/project';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {



isSidebarExpanded: boolean = true;
users: User[] = [];
u! : User;
resultSizeForUser = 1000;
resultSize = 10;
resultPage: number = 1;
hasMoreResult: boolean = true;
fetchingResult: boolean = false;
noResultMessage : string = '';
empId: number = this.UserService.getAuthUserId();
eId: Number = 0;
selectedTeams = [];
selectedManagers = [];
private subscriptions: Subscription[] = [];
fullName: any[] = [];
successMessage: string | null = null;
errorMessage: string | null = null;
projects: Project[] = [];
isLoading: boolean = false; 
isLoggedIn! : User ;
displayedColumns: string[] = ['projectName', 'client', 'teams', 'managers','status'];
dataSource: MatTableDataSource<Project>;

constructor(private UserService:UserService,){
    this.dataSource = new MatTableDataSource();

}



  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  ngOnInit() {
    const currentPage = 1; 
    this.loadUsers(currentPage);


  this.isLoggedIn = this.UserService.getAuthUserFromCache();
  this.eId = this.UserService.getAuthUserId();
  console.log(this.eId);
  this.loadProjects(this.resultPage, this.resultSize );
 
  this.UserService.profile();
  

  }

    dropdownSettings = {
    singleSelection: false,
    idField: 'id',  
    textField: 'firstName' ,  
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };


  dropdownSettingsForManagers = {
    singleSelection: false,
    idField: 'id',  
    textField: 'firstName', 
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

 loadUsers(selectedPage: number): void {
    this.loadUsernames(selectedPage);
  }

  loadUsernames(selectedPage: number): void {
    this.subscriptions.push(
      this.UserService.getAllUsers(selectedPage, this.resultSizeForUser).subscribe(
        (users: User[]) => {
          this.users = users;
          this.fullName = this.users
          .map(user => user.firstName + ' ' + user.lastName) 
          .filter(name => !!name); 
        },
        (error) => {
          console.log(error.error.message);
        }
      )
    );
  }


addProjectData(projectData: any) {
    this.UserService.addProject(projectData).subscribe(
      (response: any) => {
        this.successMessage = 'Project added Successfully'; 
	 setTimeout(() => {
        this.successMessage = null;
        window.location.reload();
      }, 3000);
        
      },
      (error: any) => {
        if (error.status == 400) {
          this.errorMessage = 'An error occurred while adding the project'; 
	 setTimeout(() => {
        this.successMessage = null;
      }, 3000);

        } else {
          console.log('added');
          this.errorMessage = 'An error occurred while adding the project'; 
	 setTimeout(() => {
        this.successMessage = null;
      }, 3000);

        }
      }
    );
  }


 dismissSuccessMessage() {
this.successMessage = null;
}

dismissErrorMessage() {
   this.errorMessage = null;
}



  loadProjects(currentPage: Number , resultSize: Number) {
      this.isLoading = true;
      this.subscriptions.push(
      this.UserService.getAllProjects(currentPage ,resultSize ).subscribe(
        (p: Project[]) => {
          this.projects.push(...p);
          this.dataSource.data =this.projects;         
          this.isLoading = false;
          if (this.projects.length <= 0 && this.resultPage === 1) {
            this.hasMoreResult = false;
            this.noResultMessage = "No result found."
          }
          this.fetchingResult = false;
          this.resultPage++;
        }, (error) => {
          console.log(error);
        }
      )
    );
  }

  loadMoreProjects(): void {
    this.isLoading = true;
    this.loadProjects(this.resultPage, this.resultSize );
    setTimeout(() => {
       this.isLoading = false;
    }, 1000);
  }


}




