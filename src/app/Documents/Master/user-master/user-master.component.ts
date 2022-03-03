import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {
  username: any;
  userdata: any;
  canShowMenu: boolean;
  formUser:any = [];
  roleId: any;
  roleIdOptions: SelectItem[];
  godownCode: any;
  godownOptions: SelectItem[];
  regionCode: any;
  regionOptions: SelectItem[];
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('role', { static: false }) rolePanel: Dropdown;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  //   this.user_data = new FormGroup({
  //  });

  }

  onSelect(type, id) {
    switch (id) {
      case 'gd':
        if(type === 'tab') {
        this.godownPanel.overlayVisible = true;
        }
        break;
      case 'reg':
          if(type === 'tab') {
            this.regionPanel.overlayVisible = true;
          }
        break;
      case 'role':
          if(type === 'tab') {
            this.rolePanel.overlayVisible = true;
          }
        break;
    }
  }

  onSubmit(form) {
    console.log('form values ', form);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form));
  }
}
