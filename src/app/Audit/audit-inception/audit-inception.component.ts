import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Dropdown } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-audit-inception',
  templateUrl: './audit-inception.component.html',
  styleUrls: ['./audit-inception.component.css']
})
export class AuditInceptionComponent implements OnInit {
  canShowMenu: boolean;
  maxDate: Date;
  IDate: Date;
  Name: string;
  ITeam: any;
  inspectionTeamOptions: SelectItem[];
  Remarks: string;
  totalRecords: number;
  inspectionData: any = [];
  inspectionCols: any;
  loading: boolean;
  IQuantity: any;
  typeOptions: SelectItem[];
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  Report: any;
  GCode: string;
  RCode: string;
  commodityOptions: SelectItem[];
  TStockNo: any;
  stackNoOptions: SelectItem[];
  ITCode: any;
  Designation: any;
  designationOptions: SelectItem[];
  iTCode: any;
  tyCode: any;
  CurrYear: string;
  curYearOptions: SelectItem[];
  stackNoSelection: any[];
  StackNoRowID: any;
  blockScreen: boolean;
  commoditySelection: any = [];
  currYrSelection: any = [];
  designationSelection: any = [];
  inspectionTeamSelection: any = [];
  typeSelection: any = [];
  InspectionItemID: any;
  InspectionID: any;
  roleId: any;
  data: any;
  regions: any;
  loggedInRCode: string;
  inspectionDetailsData: any = [];
  inspectionDetailsCols: any;
  selected: any;
  viewPane: boolean;
  viewDate: Date = new Date();
  DesignationCode: any;
  ITeamCode: any;
  @ViewChild('inspection', { static: false }) inspectionPanel: Dropdown;
  @ViewChild('designation', { static: false }) designationPanel: Dropdown;
  @ViewChild('curYear', { static: false }) curYearPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('stackNo', { static: false }) stackNoPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('f', { static: false }) form: NgForm;

  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restApiService: RestAPIService,
    private datepipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.IDate = this.maxDate;
    this.inspectionCols = this.tableConstants.InceptionCols;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.loadMasters();
  }

  loadMasters() {
    this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        data.forEach(y => {
          this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
        });
        this.commoditySelection.unshift({ 'label': '-select-', 'value': null, disabled: true });
        this.commodityOptions = this.commoditySelection;
      }
    })
    this.restApiService.get(PathConstants.STACKCARD_YEAR_GET).subscribe(res => {
      res.forEach(s => {
        this.currYrSelection.push({ label: s.StackYear, value: s.StackYear });
      });
      this.currYrSelection.unshift({ 'label': '-select-', 'value': null, disabled: true });
      this.curYearOptions = this.currYrSelection;
    });
    this.restApiService.get(PathConstants.DESIGNATION_MASTER).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        data.forEach(y => {
          if (y.Flag) {
            this.designationSelection.push({ 'label': y.DESGN, 'value': y.DESGNCOD });
          }
        });
        this.designationSelection.unshift({ 'label': '-select-', 'value': null, disabled: true });
        this.designationOptions = this.designationSelection;
      }
    })
    this.restApiService.get(PathConstants.INSPECTION_MASTER).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        data.forEach(y => {
          if (y.TypeCode === 1) {
            this.inspectionTeamSelection.push({ 'label': y.InceptionTeam, 'value': y.InceptionMasterID });
          } else {
            this.typeSelection.push({ 'label': y.InceptionTeam, 'value': y.InceptionMasterID })
          }
        });
        this.inspectionTeamSelection.unshift({ 'label': '-select-', 'value': null, disabled: true });
        this.inspectionTeamOptions = this.inspectionTeamSelection;
        this.typeSelection.unshift({ 'label': '-select-', 'value': null, disabled: true });
        this.typeOptions = this.typeSelection;
      }
    })
  }

  onSelect(id, type) {
    let regionSelection = [];
    let godownSelection = [];
    switch (id) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'tab') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null, disabled: true });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null, disabled: true });
          }
        }
        break;
      case 'gd':
        if (type === 'tab') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          this.godownOptions.unshift({ label: '-select-', value: null, disabled: true });
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'it':
        if (type === 'tab') {
          this.inspectionPanel.overlayVisible = true;
        }
        this.inspectionTeamOptions = this.inspectionTeamSelection;
        break;
      case 'cy':
        if (type === 'tab') {
          this.curYearPanel.overlayVisible = true;
        }
        this.curYearOptions = this.currYrSelection;
        break;
      case 'st':
        if (type === 'tab') {
          this.stackNoPanel.overlayVisible = true;
        }
        this.findMatchingStackNo();
        break;
      case 'des':
        if (type === 'tab') {
          this.designationPanel.overlayVisible = true;
        }
        this.designationOptions = this.designationSelection;
        break;
      case 'cd':
        if (type === 'tab') {
          this.commodityPanel.overlayVisible = true;
        }
        this.commodityOptions = this.commoditySelection;
        break;
      case 'ty':
        this.typeOptions = this.typeSelection;
        break;
    }
  }

  onChange(type) {
    if (type === 'cy') {
      this.stackNoSelection = [];
      this.stackNoOptions = [];
      this.TStockNo = null;
      if (this.CurrYear !== undefined && this.CurrYear !== null) {
        const params = new HttpParams().set('GCode', this.GCode).append('CurYear', this.CurrYear);
        this.restApiService.getByParameters(PathConstants.STACK_OPENING_ENTRY_REPORT_GET, params).subscribe((res: any) => {
          if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
            res.Table.forEach(s => {
              this.stackNoSelection.push({ label: s.StackNo, value: s.RowId, ITCode: s.CommodityCode });
            })
          }
        });
        this.findMatchingStackNo();
      } else {
        this.TStockNo = null;
        this.stackNoSelection = [];
        this.stackNoOptions = [];
      }
    } else if (type === 'cd') {
      this.stackNoOptions = [];
      this.TStockNo = null;
      this.findMatchingStackNo();
    }
  }

  findMatchingStackNo() {
    if(this.stackNoSelection === null || this.stackNoSelection === undefined) {
      this.onChange('cy');
    }
    if (this.ITCode !== undefined && this.ITCode !== null &&
      ((this.ITCode.value !== null && this.ITCode.value !== undefined) ||
        (this.iTCode !== null && this.iTCode !== undefined)) && this.stackNoSelection.length !== 0) {
      let iCode = (this.ITCode.value !== undefined && this.ITCode.value !== null) ?
        this.ITCode.value : this.iTCode;
      this.stackNoOptions = this.stackNoSelection.filter(x => {
        return iCode === x.ITCode;
      })
      this.stackNoOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
    } else {
      this.TStockNo = null;
      this.stackNoOptions = [];
    }
  }

  onEnter() {
    this.inspectionData.push({
      InspectionItemID: (this.InspectionItemID !== null && this.InspectionItemID !== undefined) ?
        this.InspectionItemID : 0,
      Commodity: (this.ITCode.label !== undefined && this.ITCode.label !== null) ?
        this.ITCode.label : this.ITCode,
      ITCode: (this.ITCode.value !== undefined && this.ITCode.value !== null) ?
        this.ITCode.value : this.iTCode,
      StackNo: (this.TStockNo.label !== undefined && this.TStockNo.label !== null)
        ? this.TStockNo.label : this.TStockNo,
      StackRowId: (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ?
        this.TStockNo.value : this.StackNoRowID,
      TypeName: (this.Report.label !== null && this.Report.label !== undefined) ?
        this.Report.label : this.Report,
      TypeCode: (this.Report.value !== null && this.Report.value !== undefined) ?
        this.Report.value : this.tyCode,
      Quantity: (this.IQuantity * 1).toFixed(3),
      CurYear: this.CurrYear
    })
    if (this.inspectionData.length !== 0) {
      this.onClear('2')
      let sno = 1;
      this.inspectionData.forEach(x => {
        x.SlNo = sno;
        sno += 1;
      })
    }
  }

  onSelectedRow(data, index, type) {
    if (type === '1') {
      if (data !== null && data !== undefined) {
        this.InspectionItemID = (data.InspectionItemID !== null && data.InspectionItemID !== undefined)
          ? data.InspectionItemID : 0;
        this.ITCode = data.Commodity;
        this.iTCode = data.ITCode;
        this.commodityOptions = [{ label: this.ITCode, value: this.iTCode }];
        this.TStockNo = data.StackNo;
        this.StackNoRowID = data.StackRowId;
        this.stackNoOptions = [{ label: this.TStockNo, value: this.StackNoRowID }];
        this.Report = data.TypeName;
        this.tyCode = data.TypeCode;
        this.typeOptions = [{ label: this.Report, value: this.tyCode }];
        this.CurrYear = data.CurYear;
        this.curYearOptions = [{ label: this.CurrYear, value: this.CurrYear }];
        this.IQuantity = data.Quantity;
        this.inspectionData.splice(index, 1);
        if (this.inspectionData.length !== 0) {
          let sno = 1;
          this.inspectionData.forEach(x => {
            x.SlNo = sno;
            sno += 1;
          })
        }
      }
    } else {
      this.inspectionData.splice(index, 1);
    }
  }

  onSave() {
    this.messageService.clear();
    this.blockScreen = true;
    const params = {
      'InspectionData': this.inspectionData,
      'InspectionID': (this.InspectionID !== null && this.InspectionID !== undefined) ?
        this.InspectionID : 0,
      'Remarks': this.Remarks.trim(),
      'GCode': this.GCode,
      'RCode': this.RCode,
      'InspectionTeam': (this.ITeam.value !== undefined && this.ITeam.value !== null) ?
        this.ITeam.value : this.ITeamCode,
      'Name': this.Name.trim(),
      'Designation': (this.Designation.value !== null && this.Designation.value !== undefined) ?
        this.Designation.value : this.DesignationCode,
      'InspectionDate': this.datepipe.transform(this.IDate, 'MM/dd/yyyy'),
    }
    this.restApiService.post(PathConstants.INSPECTION_DETAILS_POST, params).subscribe(res => {
      if (res.Item1) {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS,
          life: 5000, detail: res.Item2
        });
        this.onClear('1');
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
        });
      }
    });
  }

  onView() {
    this.viewPane = true;
    this.selected = null;
    this.messageService.clear();
    this.inspectionDetailsCols = this.tableConstants.InspectionDetailsColumns;
    const params = new HttpParams().set('IDate', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.GCode);
    this.restApiService.getByParameters(PathConstants.INSPECTION_DETAILS_GET, params).subscribe((res: any) => {
      if (res.Table !== null && res.Table !== undefined && res.Table.length !== 0) {
        let sno = 1;
        res.Table.forEach(data => {
          data.SlNo = sno;
          data.IDate = data.InceptionDate,
          data.InceptionDate = this.datepipe.transform(data.InceptionDate, 'dd/MM/yyyy');
          sno += 1;
        });
        this.inspectionDetailsData = res.Table;
        this.inspectionData = res.Table1;
        sno = 1;
        this.inspectionData.forEach(x => {
          x.SlNo = sno;
          sno += 1;
        })
      } else {
        this.inspectionDetailsData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.inspectionDetailsData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  getInspectionDetails() {
  //  this.blockScreen = true;
    this.viewPane = false;
    this.Remarks = this.selected.Remarks;
    this.IQuantity = this.selected.Quantity;
    this.ITeam = this.selected.InceptionName;
    this.ITeamCode = this.selected.InceptionTeam;
    this.inspectionTeamOptions = [{ label: this.ITeam, value: this.ITeamCode }];
    this.Designation = this.selected.DesignationName;
    this.DesignationCode = this.selected.Designation;
    this.designationOptions = [{ label: this.Designation, value: this.DesignationCode }];
    this.Name = this.selected.Name;
    this.IDate = new Date(this.selected.IDate);
   // setTimeout(() => {
    // },500, this.blockScreen = false);
  }


  onRowSelect(event) {
    this.selected = event.data;
    this.InspectionID = event.data.InceptionID;
  }

  onClear(type) {
    if (type === '1') {
      this.totalRecords = 0;
      this.IDate = this.maxDate;
      this.InspectionID = null;
      this, this.InspectionItemID = null;
      this.Name = null;
      this.ITeam = null; this.ITeamCode = null;
      this.inspectionTeamOptions = [];
      this.Designation = null; this.DesignationCode = null;
      this.ITCode = null; this.iTCode = null;
      this.IQuantity = null; this.Remarks = null;
      this.CurrYear = null; this.stackNoSelection = [];
      this.TStockNo = null; this.stackNoOptions = [];
      this.Report = null; this.typeOptions = [];
      this.StackNoRowID = null; this.inspectionData = [];
      this.form.controls.InceptionTeam.reset();
      this.form.controls.PName.reset();
      this.form.controls.DesignationType.reset();
      this.form.controls.InceptionDate.reset();
      this.form.controls.CurYear.reset();
      this.form.controls.Commodity.reset();
      this.form.controls.StackNo.reset();
      this.form.controls.Quantity.reset();
      this.form.controls.Type.reset();
      this.form.controls.RemarksText.reset();
      this.form.controls.Godown.reset();
      this.form.controls.Region.reset();
      this.form.form.markAsUntouched();
      this.form.form.markAsPristine();
    } else {
      this.IQuantity = null;
      this.ITCode = null; this.iTCode = null;
      this.CurrYear = null;
      this.TStockNo = null; this.stackNoOptions = [];
      this.Report = null; this.typeOptions = [];
      this.StackNoRowID = null;
      this.commodityOptions = [];
      this.curYearOptions = [];
      this.form.controls.CurYear.reset();
      this.form.controls.Commodity.reset();
      this.form.controls.StackNo.reset();
      this.form.controls.Quantity.reset();
      this.form.controls.Type.reset();
    }
  }

  onReset(type) { if (type === 'reg') { this.GCode = null; } }

  onClose() {
    this.messageService.clear('t-err');
  }

}