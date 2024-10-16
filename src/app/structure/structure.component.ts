import { Component } from '@angular/core';
import { UserService } from '../service/userServices';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.css'],
})
export class StructureComponent {
  Structure: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getOrgStructure();
  }
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  getOrgStructure() {
    this.userService.getOrgainzationStructure().subscribe((res: any[]) => {
      this.Structure = res;

      this.Structure.forEach((item) => {});
    });
  }
}
