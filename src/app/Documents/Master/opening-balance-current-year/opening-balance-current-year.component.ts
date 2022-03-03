import { Component, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/constants/path.constants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { NgForm } from '@angular/forms';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-opening-balance-current-year',
  templateUrl: './opening-balance-current-year.component.html',
  styleUrls: ['./opening-balance-current-year.component.css']
})
export class OpeningBalanceCurrentYearComponent implements OnInit {
  OpeningBalanceDetailCols: any;
  OpeningBalanceDetailData: any = [];
  data: any;
  g_cd: any;
  c_cd: any;
  Year: any;
  Rowid: any;
  WriteOff: any;
  BookBalanceBags: any;
  BookBalanceWeight: any;
  CumulativeShortage: any;
  PhysicalBalanceBags: any;
  PhysicalBalanceWeight: any;
  CurYear: any;
  yearOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  commoditySelection: any[] = [];
  commodityCd: any;
  gdata: any = [];
  opening_balance: any = [];
  selectedRow: any;
  disableOkButton: boolean = true;
  isViewed: boolean = false;
  viewPane: boolean;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;
  currYrSelection: any = [];
  @ViewChild('f', { static: false }) OBCurYrFrom: NgForm;
  @ViewChild('year', { static: false }) yearPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;

  constructor(private authService: AuthService, private messageService: MessageService, private roleBasedService: RoleBasedService, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    if (this.commodityOptions === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(y => {
            this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
            this.commodityOptions = this.commoditySelection;
          });
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      })
    }
    /// curyear
    this.restAPIService.get(PathConstants.STACKCARD_YEAR_GET).subscribe(res => {
      for (let i = 0; i <= 2; i++) {
        this.currYrSelection.push({ label: res[i].StackYear, value: res[i].StackYear });
      }
    });
  }
  onSelect(selectedItem, type) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (type === 'tab') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'cd':
        if (type === 'tab') {
          this.commodityPanel.overlayVisible = true;
        }
        break;
      case 'y':
        if (type === 'tab') {
          this.yearPanel.overlayVisible = true;
        }
        if (this.currYrSelection.length !== 0) {
          this.yearOptions = this.currYrSelection;
          this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
    }
  }

  onChange() {
    if (this.commodityOptions !== undefined && this.godownOptions !== undefined && this.yearOptions !== undefined) {
      const params = new HttpParams().set('ObDate', this.Year.value).append('GCode', this.g_cd.value);
      this.restAPIService.getByParameters(PathConstants.OPENING_BALANCE_MASTER_GET, params).subscribe((res: any) => {
        if (this.commodityOptions !== undefined && this.commodityOptions.length !== 0) {
          this.OpeningBalanceDetailData = res.filter((x: { ITDescription: any; }) => { return x.ITDescription === this.commodityCd.label });
          if (this.OpeningBalanceDetailData !== undefined && this.OpeningBalanceDetailData !== 0) {
            this.BookBalanceBags = this.OpeningBalanceDetailData[0].BookBalanceBags;
            this.BookBalanceWeight = this.OpeningBalanceDetailData[0].BookBalanceWeight;
            this.PhysicalBalanceBags = this.OpeningBalanceDetailData[0].PhysicalBalanceBags;
            this.PhysicalBalanceWeight = this.OpeningBalanceDetailData[0].PhysicalBalanceWeight;
            this.CumulativeShortage = this.OpeningBalanceDetailData[0].CumulitiveShortage;
            this.WriteOff = this.OpeningBalanceDetailData[0].WriteOff;
            this.Rowid = this.OpeningBalanceDetailData[0].Rowid;
          }
        }
      });
    }
  }

  onCommodityClicked() {
    if (this.commodityOptions !== undefined && this.commodityOptions.length <= 1) {
      this.commodityOptions = this.commoditySelection;
    }
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() { }

  onClear() {
    this.BookBalanceBags = null;
    this.BookBalanceWeight = null;
    this.PhysicalBalanceBags = null;
    this.PhysicalBalanceWeight = null;
    this.c_cd = null;
    this.commodityCd = null;
    this.g_cd = null;
    this.CumulativeShortage = null;
    this.WriteOff = null;
    this.Year = null;
    this.OBCurYrFrom.form.markAsPristine();
    this.OBCurYrFrom.form.markAsUntouched();
  }

  onSave() {
    const params = {
      'Rowid': this.Rowid,
      'WriteOff': this.WriteOff,
    };
    // const params = new HttpParams().set('RowId', this.Rowid).append('WriteOff', this.WriteOff);
    this.restAPIService.put(PathConstants.OPENING_BALANCE_MASTER_PUT, params).subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
    this.onClear();
  }
}
