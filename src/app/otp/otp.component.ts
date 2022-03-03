import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { Router } from '@angular/router';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PrintService } from 'src/app/print.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';



@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  data: any;  
  UserOtp: any;
  Otp : any;
  Mslno:any;

  constructor(private restApiService: RestAPIService,private router: Router,
    private authService: AuthService,  private messageService: MessageService) {
    //  this.column = route.snapshot.params['data'].split('',);
  }

  ngOnInit() {
    //this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    //this.column = this.tableConstants.RegionData;
    //this.loading = true;
  //   this.restApiService.get(PathConstants.REGION).subscribe((response: any[]) => {
  //     if (response !== undefined && response !== null) {
  //       this.data = response;
  //       this.loading = false;
      
  //     } else {
  //       this.loading = false;
  //       this.messageService.clear();
  //       this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
  //     }
      
  //   }, (err: HttpErrorResponse) => {
  //     if (err.status === 0 || err.status === 400) {
  //       this.loading = false;
  //       this.messageService.clear();
  //       this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
  //     }
  // });
    // this.data = this.column.map(id => this.print());Promise.all(this.data).then(() => this.printService.onDataReady());
   
  }
onSubmit(){
  this.Otpchecking()

  if (this.Otp === this.UserOtp){
  this.router.navigate(['Home']);
  }else{
    
    this.Otp = '';
    this.router.navigate(['Otp']);
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.OTPErrorMessage });
        localStorage.removeItem('USER_INFO');
        localStorage.removeItem('ID');
        localStorage.removeItem('MENU');
        localStorage.removeItem('GCODE');
        localStorage.removeItem('RCODE');
        localStorage.removeItem('GNAME');
        localStorage.removeItem('RNAME');
        localStorage.removeItem('MAPPINGID');
        localStorage.removeItem('MAPPINGNAME');
        localStorage.removeItem('MAPPINGNAME');
        localStorage.removeItem('SERVER_DATE');
       // this.authService.isSignedIn = false;
        //this.router.navigateByUrl('');
  }
}
  Otpchecking(){
    let username = new HttpParams().append('userName', this.Otp);
    this.restApiService.getByParameters(PathConstants.LOGIN, username).subscribe(credentials => {
      if (credentials !== undefined && credentials !== null && credentials.length !== 0) {   
        
        //this.UserOtp = (credentials[0].Regioncode !== '' && credentials[0].Regioncode !== undefined) ? credentials[0].Regioncode : 0;
        this.UserOtp ='123'     
      } else {
        this.UserOtp ='123'  
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
  });
  this.UserOtp ='123'  
  }
  
}

