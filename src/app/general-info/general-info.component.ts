import { Component } from '@angular/core';
import { UserService } from '../service/userServices';
import { GeneralInfo } from '../model/genInfo';


@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css'],
})
export class GeneralInfoComponent {
  info: GeneralInfo[] = [];
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getInfo();
  }
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  getInfo() {
    this.userService.generalInfo().subscribe((res: GeneralInfo[]) => {
      this.info = res;
      this.info.forEach((item) => {

      });
    });
  }
}
