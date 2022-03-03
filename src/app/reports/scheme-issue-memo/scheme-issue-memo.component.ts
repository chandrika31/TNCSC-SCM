import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import * as _ from 'lodash';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-scheme-issue-memo',
  templateUrl: './scheme-issue-memo.component.html',
  styleUrls: ['./scheme-issue-memo.component.css']
})
export class SchemeIssueMemoComponent implements OnInit {
  schemeIssueMemoCols: any;
  schemeIssueMemoData: any = [];
  username: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  godown_data: any;
  scheme_data: any;
  region_data: any;
  GCode: any;
  schemeOptions: SelectItem[];
  regionOptions: SelectItem[];
  selectedValues: any;
  Scheme: any;
  RCode: any;
  roleId: any;
  godownOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loggedInRCode: any;
  SchemeIssueAbstractData: any;
  loading: boolean = false;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('scheme', { static: false }) schemePanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.schemeIssueMemoCols = this.tableConstants.SchemeIssueMemoReport;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.godown_data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.region_data = this.roleBasedService.getRegions();
    this.username = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let schemeSelection = [];
    switch (item) {
      case 'reg':
        this.region_data = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.region_data !== undefined) {
            this.region_data.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.region_data !== undefined) {
            this.region_data.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.godown_data !== undefined) {
          this.godown_data.forEach(x => {
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
      case 'scheme':
        if (type === 'enter') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
        }
        break;
    }
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'RCode': this.RCode,
      'GCode': this.GCode,
      'TRCode': this.Scheme,
      'UserName': this.username.user,
    };
    this.restAPIService.post(PathConstants.SCHEME_ISSUE_MEMO_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.schemeIssueMemoData = res;
        this.SchemeIssueAbstractData = res;
        this.loading = false;
        let sno = 0;
        let totalQty = 0;
        this.schemeIssueMemoData.forEach(data => {
          data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
          data.Quantity = (data.Quantity * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
          totalQty += (data.Quantity * 1);
        })
        this.schemeIssueMemoData.push({
          Godownname: 'Total',
          Quantity: totalQty.toFixed(3)
        })

        ///Abstract
        var hash = Object.create(null),
          abstract = [];
        this.SchemeIssueAbstractData.forEach(function (o) {
          var key = ['Commodity'].map(function (k) { return o[k]; }).join('|');
          if (!hash[key]) {
            hash[key] = { Issue_Date: o.Issue_Date, Scheme: o.Scheme, Commodity: o.Commodity, Quantity: 0 };
            abstract.push(hash[key]);
          }
          ['Quantity'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
        });
        this.schemeIssueMemoData.push({ Commodity: 'Abstract' });
        abstract.forEach(x => {
          this.schemeIssueMemoData.push({ Commodity: x.Commodity, Quantity: (x.Quantity * 1).toFixed(3) });;
        })
        ///End
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.schemeIssueMemoData = [];
  }

  onDateSelect(event) {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  public getColor(name: string): string {
    return (name === 'Total') ? "#53aae5" : "white";
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

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.SchemeIssueMemo + ".txt";
    saveAs(path + filename, filename);
  }

  onClose() {
    this.messageService.clear('t-err');
  }  
}