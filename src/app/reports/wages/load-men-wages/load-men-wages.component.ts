import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-load-men-wages',
  templateUrl: './load-men-wages.component.html',
  styleUrls: ['./load-men-wages.component.css']
})
export class LoadMenWagesComponent implements OnInit {
  canShowMenu: any;
  loggedInRCode: string;
  loadMenWagesData: any[] = [];
  loadMenWagesCols: any;
  regions: any;
  maxDate: Date;
  data: any;
  roleId: any;
  username: any;
  RCode: any;
  regionOptions: any[];
  godownOptions: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  loading: boolean;
  GCode: any;
  totalRecords : any;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.loadMenWagesCols = this.tableConstants.LoadMenWagesLoadingReportColumns;
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item) {
    let godownSelection = [];
    let regionSelection = [];
    switch (item) {
      case 'reg':
          this.regions = this.roleBasedService.regionsData;
          if (this.roleId === 1) {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
            }
          } else {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                if(x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                }
              });
              this.regionOptions = regionSelection;
            }
          }
        break;
      case 'godown':
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        }
        break;
    }
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    const params = {
      'RCode': this.RCode,
      'GCode': this.GCode,
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'Type': 1
    }
    this.loading = true;
    this.restAPIService.post(PathConstants.WAGES_LOADING_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.loading = false;
        let sno = 1;
              res.forEach(x => {
                x.SlNo = sno;
                sno += 1;
                x.Date = this.datePipe.transform(x.Date, 'dd/MM/yyyy');
                x.Total = (x.Loading * 1) + (x.Handling);
              });
              this.loadMenWagesData = res;
             } else {
              this.loading = false;
              this.messageService.clear();
              this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
            }
          }, (err: HttpErrorResponse) => {
            if (err.status === 0 || err.status === 400) {
              this.loading = false;
              this.messageService.clear();
              this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
            }
          })
  }
  onDateSelect()
  {
    
  }
  onResetTable(item) {
    if(item === 'reg') {
      this.GCode = null;
    }
    this.loadMenWagesData = [];

  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life:5000
        ,summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onClose() {
    this.messageService.clear('t-err');
  }

  onPrint() { }

}
