import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { AuthService } from '../shared-services/auth.service';
import { RoleBasedService } from '../common/role-based.service';
import { TableConstants } from '../constants/tableconstants';
import { RestAPIService } from '../shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { StatusMessage } from '../constants/Messages';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from '../constants/path.constants';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.css']
})
export class AuditReportComponent implements OnInit {
  canShowMenu: boolean;
  maxDate: Date;
  inspectionCols: any;
  inspectionData: any = [];
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  RCode: string;
  GCode: string;
  FromDate: any;
  ToDate: any;
  loading: boolean;
  regionsData: any;
  roleId: any;
  loggedInRCode: string;
  data: any;
  Designation: string;
  IDate: any;
  IName: string;
  ITeam: string;
  RName: string;
  GName: string;
  viewPane: boolean;
  inspectionItemDetailsData: any = [];
  inspectionItemDetailsCols: any;
  Remarks: any;
  itemDetailsData: any[];
  selectedRow: any;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
 

  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restApiService: RestAPIService,
    private datepipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.inspectionCols = this.tableConstants.InspectionReportCols;
    this.regionsData = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId); this.maxDate = new Date();
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
  }

  onSelect(item, type) {
    let godownSelection = [];
    let regionSelection = [];
    switch (item) {
      case 'reg':
        this.regionsData = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'godown':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
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
    this.loading = true;
    this.messageService.clear();
    const params = new HttpParams().set('IDate', this.datepipe.transform(this.FromDate, 'MM/dd/yyyy'))
      .append('ToDate', this.datepipe.transform(this.ToDate, 'MM/dd/yyyy')).append('GCode', this.GCode);
    this.restApiService.getByParameters(PathConstants.INSPECTION_DETAILS_GET, params).subscribe((res: any) => {
      if (res.Table !== null && res.Table !== undefined && res.Table.length !== 0 &&
        res.Table1 !== null && res.Table1 !== undefined && res.Table1.length !== 0) {
        let sno = 1;
        var data = []
        res.Table.forEach(x => {
          res.Table1.forEach(y => {
            if (x.InceptionID === y.InceptionID) {
              data.push({
               SlNo: sno,
               InceptionItemID: y.InceptionItemID,
               InceptionID: x.InceptionID,
               RGNAME: x.RGNAME,
               TNCSName: x.TNCSName,
               InspectionName: x.InceptionName,
               Name: x.Name,
               DesignationName: x.DesignationName,
               Remarks: x.Remarks,
               IDate: x.InceptionDate,
               InspectionDate: this.datepipe.transform(x.InceptionDate, 'dd/MM/yyyy'),
               Commodity: y.Commodity,
               StackNo: y.StackNo,
               Quantity: (y.Quantity * 1).toFixed(3),
               Year: y.CurYear,
               Type: y.TypeName
               });
               sno += 1;
            }
          });
        });
        this.inspectionData = data;
        var result = [];
        var index = 0;
        for(var x = 0; x < this.inspectionData.length; x++){
         index = result.findIndex(i => i.InceptionID === this.inspectionData[x].InceptionID);
          if(index < 0) {
            result.push(this.inspectionData[x]);
          }
         }
         this.inspectionData = result;
        this.itemDetailsData = data;
        this.loading = false;
      } else {
        this.loading = false;
        this.inspectionData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      if (err.status === 0 || err.status === 400) {
        this.inspectionData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onRowSelect(selectedRow, index) {
    if(selectedRow && this.itemDetailsData.length !== 0) {
      this.viewPane = true;
      this.selectedRow = selectedRow;
      this.RName = selectedRow.RGNAME;
      this.GName = selectedRow.TNCSName;
      this.IDate = this.datepipe.transform(selectedRow.IDate, 'MM/dd/yyyy');
      this.ITeam = selectedRow.InspectionName;
      this.IName = selectedRow.Name;
      this.Designation = selectedRow.DesignationName;
      this.Remarks = selectedRow.Remarks;
      this.inspectionItemDetailsCols = this.tableConstants.InspectionItemDetailsReportCols;
      var data = this.itemDetailsData.filter(i => {
        return i.InceptionID === selectedRow.InceptionID;
      })
      let sno = 1;
      data.forEach(x => {
        x.SlNo = sno;
        sno += 1;
      })
      this.inspectionItemDetailsData = data;
    } else {
      this.viewPane = false;
    }
  }

  onDownloadPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
        var col = ['Region', 'Godown', 'Inspection Date'];
        var col1 = ['Inception Team', 'Name', 'Designation'];
        var col2 = ['S.No', 'Commodity', 'Stack No.', 'Year', 'Quantity', 'Ex/Sht'];
        var col3 = ['Remarks'];
        var rows = [], rows1 = [], rows2 = [], rows3 = [];
        let sno = 0;
        var temp = [this.RName, this.GName, this.IDate];
        rows.push(temp);
        var temp1 = [this.ITeam, this.IName, this.Designation];
        var temp3 = [this.Remarks];
        rows1.push(temp1);
        rows3.push(temp3);
        this.inspectionItemDetailsData.forEach(el => {
            sno += 1;
            var temp2 = [sno, el.Commodity, el.StackNo, el.Year, el.Quantity, el.Type];
            rows2.push(temp2);
          });
        doc.autoTable(col, rows);
        doc.autoTable(col1, rows1);
        doc.autoTable(col2, rows2);
        doc.autoTable(col3, rows3);
        doc.save('Inspection_Details.pdf');
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  checkValidDateSelection() {
    if (this.FromDate !== undefined && this.ToDate !== undefined && this.FromDate !== '' && this.ToDate !== '') {
      let selectedFromDate = this.FromDate.getDate();
      let selectedToDate = this.ToDate.getDate();
      let selectedFromMonth = this.FromDate.getMonth();
      let selectedToMonth = this.ToDate.getMonth();
      let selectedFromYear = this.FromDate.getFullYear();
      let selectedToYear = this.ToDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000
          , summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
        });
        this.FromDate = this.ToDate = '';
      }
      return this.FromDate, this.ToDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.inspectionData = [];
    this.loading = false; this.viewPane = false;
    this.RName = null; this.GName = null;
    this.ITeam = null; this.IDate = null;
    this.IName = null; this.Designation = null;
    this.Remarks = null; this.itemDetailsData = [];
    this.inspectionItemDetailsData = [];
  }

}
