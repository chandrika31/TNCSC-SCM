import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/shared-services/excel.service';
import 'rxjs/add/observable/from';
import 'rxjs/Rx';
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-pds-liftment-riceonly',
  templateUrl: './pds-liftment-riceonly.component.html',
  styles: [`
  .loading-text {
      display: block;
      background-color: #f1f1f1;
      min-height: 19px;
      animation: pulse 1s infinite ease-in-out;
      text-indent: -99999px;
      overflow: hidden;
  }
`],
  styleUrls: ['./pds-liftment-riceonly.component.css']
})
export class PdsLiftmentRiceonlyComponent implements OnInit {
  PDSLiftmentRiceOnlyData: any = [];
  PDSLiftmentRiceonlyCols: any;
  Date: Date = new Date();
  roleId: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  userId: any;
  yearRange: string;
  AllotmentPeriod: Date;
  viewPane: boolean;
  canLoad: boolean;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService,
    private messageService: MessageService, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.PDSLiftmentRiceonlyCols = this.tableConstants.PDSLiftmentRiceonlyColumns;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.userId = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
    this.yearRange = (this.maxDate.getFullYear() - 10) + ':' + this.maxDate.getFullYear();
    this.AllotmentPeriod = new Date();

  }

  onView() {

    this.table.reset();
    const month = this.AllotmentPeriod.getMonth() + 1;
    this.PDSLiftmentRiceOnlyData.length = 0;

    const params = {
      adate: this.datePipe.transform(this.Date, 'MM/dd/yyyy'),
      Mmonth: (month <= 9) ? '0' + month : month,
      Myear: this.AllotmentPeriod.getFullYear()

    };

    this.restAPIService.getByParameters(PathConstants.PDS_LIFTMENT_RICEONLY_GET, params).subscribe(res => {

      if (res !== undefined && res !== null && res.length !== 0) {
        this.PDSLiftmentRiceOnlyData = res;
        this.loading = false;
        let sno = 0;
        let TotalQuantity = 0;
        this.PDSLiftmentRiceOnlyData.forEach(data => {
          sno += 1;
          TotalQuantity += (data.IssueQty !== undefined && data.IssueQty !== null) ? (data.IssueQty * 1) : 0;
          data.SlNo = sno;
        });
        this.PDSLiftmentRiceOnlyData.push(
          {
            IssueQty: TotalQuantity,
            RGNAME: 'Grand Total'
          }
        );
      } else {
        this.loading = false;
        this.PDSLiftmentRiceOnlyData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.PDSLiftmentRiceOnlyData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }
  calculateTotal(data, type) {
    ///Grand Total

    return data;
  }

  onResetTable(item) {
    this.PDSLiftmentRiceOnlyData = [];
    this.loading = false;
  }

  exportExcel(value) {


  }

  onClose() {
    this.messageService.clear('t-err');
  }
}


