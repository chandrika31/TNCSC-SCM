import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';
import { NgForm } from '@angular/forms';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-truck-receipt',
  templateUrl: './truck-receipt.component.html',
  styleUrls: ['./truck-receipt.component.css']
})
export class TruckReceiptComponent implements OnInit {
  viewPane: boolean = false;
  isValidStackBalance: boolean;
  isSaveSucceed: boolean = false;
  viewDate: Date;
  data: any;
  username: any;
  regions: any;
  godowns: any;
  itemCols: any;
  itemData: any = [];
  truckMemoViewCol: any;
  truckMemoViewData: any = [];
  index: number = 0;
  maxDate: Date;
  selectedValues: string[] = ['Road'];
  enableReceivorRegn: boolean = true;
  disableRailHead: boolean = true;
  transactionOptions: SelectItem[];
  toRailHeadOptions: SelectItem[];
  toStationOptions: SelectItem[];
  fromStationOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  receivorNameOptions: SelectItem[];
  receivorRegionOptions: SelectItem[];
  schemeOptions: SelectItem[];
  stackOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  wmtOptions: SelectItem[];
  freightOptions: SelectItem[];
  vehicleOptions: SelectItem[];
  stackYear: any;
  scheme_data: any;
  godownName: string;
  regionName: string;
  canShowMenu: boolean;
  RowId: any;
  MTransport: any;
  TKgs: any;
  STNo: any;
  STDate: Date;
  Trcode: any;
  trCode: any;
  transType: string = "I";
  OrderNo: any = '-';
  OrderDate: Date;
  RNo: any = '-';
  RDate: Date;
  LorryNo: any;
  RHCode: any;
  rhCode: any;
  RTCode: any;
  RNCode: any;
  rnCode: any;
  RCode: any;
  GCode: any;
  RRCode: any;
  ManualDocNo: any = '-';
  Scheme: any;
  schemeCode: any;
  TStockNo: any;
  StackDate: Date;
  ICode: any;
  iCode: any;
  GodownNo: any;
  LocationNo: any;
  IPCode: any;
  ipCode: any;
  PWeight: any;
  NoPacking: any;
  GKgs: any;
  NKgs: any;
  WTCode: any;
  wtCode: any;
  Moisture: any;
  StackBalance: any = 0;
  CurrentDocQtv: any = 0;
  NetStackBalance: any = 0;
  TransporterName: string = '-';
  LWBillNo: any = '-';
  WHDNo: any = 0;
  HCharges: any = 0;
  WCharges: any = 0;
  Kilometers: any = 0;
  FreightAmount: any = 0;
  LWBillDate: Date;
  Gunnyutilised: any = 0;
  GunnyReleased: any = 0;
  FCode: string;
  VCode: string;
  FStation: any;
  fStationCode: any;
  TStation: any;
  tStationCode: any;
  RRNo: any = 0;
  LDate: Date;
  WNo: any = 0;
  RailFreightAmt: any = 0;
  Remarks: string;
  IssueSlip: any;
  STTDetails: any = [];
  isViewed: boolean = false;
  blockScreen: boolean;
  DOCNumber: any;
  selectedIndex: any;
  submitted: boolean;
  missingFields: any;
  field: any;
  selected: any;
  itemGroup: any;
  // isSaved: boolean = false;
  showPreview: boolean;
  PreTDate: string;
  PreMODate: string;
  PreRODate: string;
  PreLWBDate: string;
  PreLoadingDate: string;
  PreRecName: any;
  PreRecType: any;
  PreRecRegion: any;
  PreRailHead: any;
  PreTransaction: any;
  PreRONo: any;
  PreMONo: any;
  PreManualDocNo: any;
  PreLorryNo: any;
  PreTransporterName: any;
  PreLWBNo: any;
  PreFreightAmnt: any;
  PreHCharges: any;
  PreWCharges: any;
  PreWDR: any;
  PreKms: any;
  PreUGunny: any;
  PreRGunny: any;
  PreVCode: any;
  PreFCode: any;
  PreFStation: any;
  PreTStation: any;
  PreRRNo: any;
  PreWNo: any;
  PreRailFreightAmt: any;
  PreRemarks: any;
  PreTransportMode: any;
  @ViewChild('tr', { static: false }) transactionPanel: Dropdown;
  @ViewChild('sc', { static: false }) schemePanel: Dropdown;
  @ViewChild('rt', { static: false }) receivorTypePanel: Dropdown;
  @ViewChild('rn', { static: false }) receivorNamePanel: Dropdown;
  @ViewChild('rr', { static: false }) receivorRegionPanel: Dropdown;
  @ViewChild('i_desc', { static: false }) commodityPanel: Dropdown;
  @ViewChild('wmt', { static: false }) weighmentPanel: Dropdown;
  @ViewChild('pt', { static: false }) packingPanel: Dropdown;
  @ViewChild('st_no', { static: false }) stackPanel: Dropdown;
  @ViewChild('fs', { static: false }) fromStationPanel: Dropdown;
  @ViewChild('ts', { static: false }) toStationPanel: Dropdown;
  @ViewChild('fc', { static: false }) freightPanel: Dropdown;
  @ViewChild('vc', { static: false }) vehiclePanel: Dropdown;
  @ViewChild('rh', { static: false }) railHeadPanel: Dropdown;

  constructor(private roleBasedService: RoleBasedService, private authService: AuthService,
    private restAPIService: RestAPIService, private tableConstants: TableConstants,
    private datepipe: DatePipe, private messageService: MessageService) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.itemCols = this.tableConstants.TruckMemoItemDetails;
    this.truckMemoViewCol = this.tableConstants.TruckMemoViewDocumentCols;
    this.regions = this.roleBasedService.getRegions();
    this.godowns = this.roleBasedService.getGodowns();
    this.username = JSON.parse(this.authService.getCredentials());
    this.fromStationOptions = [{ label: '-', value: '-' }];
    this.fStationCode = '-';
    this.FStation = '-';
    this.toStationOptions = [{ label: '-', value: '-' }];
    this.tStationCode = '-';
    this.TStation = '-';
    this.freightOptions = [{ label: '-', value: '-' }];
    this.FCode = '-';
    this.vehicleOptions = [{ label: '-', value: '-' }];
    this.VCode = '-';
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.viewDate = this.maxDate;
    this.STDate = this.maxDate;
    this.LWBillDate = this.maxDate;
    this.OrderDate = this.maxDate;
    this.LDate = this.maxDate;
    this.RDate = this.maxDate;
  }

  onSelect(selectedItem, type) {
    let transactoinSelection = [];
    let railHeads = [];
    let fromStation = [];
    let stackNo = [];
    let toStation = [];
    let schemeSelection = [];
    let receivorTypeList = [];
    let packingTypes = [];
    let receivorNameList: any = [];
    let weighment = [];
    let regionsData = [];
    let itemDesc = [];
    switch (selectedItem) {
      case 'tr':
        if (type === 'tab') {
          this.transactionPanel.overlayVisible = true;
        }
        transactoinSelection.push({ 'label': 'Transfer', 'value': 'TR004', 'transType': this.transType },
          { 'label': 'Internal Transfer', 'value': 'TR021', 'transType': this.transType });
        this.transactionOptions = transactoinSelection;
        this.transactionOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        if (this.Trcode.value !== null && this.Trcode.value !== undefined) {
          this.enableReceivorRegn = (this.Trcode.value === 'TR021' || this.trCode === 'TR021') ? true : false;
        }
        break;
      case 'sc':
        if (type === 'tab') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        } else {
          this.schemeOptions = schemeSelection;
        }
        break;
      case 'rt':
        if (type === 'tab') {
          this.receivorTypePanel.overlayVisible = true;
        }
        if (this.Trcode !== null && this.Trcode !== undefined) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null) || (this.trCode !== null && this.trCode !== undefined)) {
            const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.GCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(rt => {
                  if (this.Trcode.label === 'Transfer') {
                    receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
                  } else {
                    receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
                  }
                });
                this.receivorTypeOptions = receivorTypeList;
              }
              // this.isReceivorNameDisabled = false;
              this.receivorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        } else {
          this.receivorTypeOptions = receivorTypeList;
        }
        break;
      case 'rn':
        if (type === 'tab') {
          this.receivorNamePanel.overlayVisible = true;
        }
        if (this.Trcode !== null && this.RTCode !== null && this.Trcode !== undefined && this.RTCode !== undefined) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null &&
            this.RTCode.value !== undefined && this.RTCode.value !== null) ||
            (this.trCode !== undefined && this.trCode !== null)) {
            const params = new HttpParams().set('TyCode', this.RTCode.value).append('TRType', this.transType)
              .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(rn => {
                  if ((this.Trcode.value === 'TR004' || this.trCode === 'TR004')
                    && (this.RRCode !== null && this.RRCode !== undefined)) {
                    if (rn.RCode === this.RRCode.value) {
                      receivorNameList.push({ 'label': rn.DepositorName, 'value': rn.DepositorCode, 'IssuerRegion': rn.IssuerRegion });
                    }
                  } else {
                    receivorNameList.push({ 'label': rn.DepositorName, 'value': rn.DepositorCode, 'IssuerRegion': rn.IssuerRegion });
                  }
                });
                this.receivorNameOptions = receivorNameList;
              }
              this.receivorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        } else {
          this.receivorNameOptions = receivorNameList;
        }
        break;
      case 'rr':
        if (type === 'tab') {
          this.receivorRegionPanel.overlayVisible = true;
        }
        if (this.regions !== undefined && this.regions !== null) {
          this.regions.forEach(r => {
            if (r.RCode !== this.RCode) {
              regionsData.push({ 'label': r.RName, 'value': r.RCode });
            }
          });
          this.receivorRegionOptions = regionsData;
          this.receivorRegionOptions.unshift({ 'label': '-select-', 'value': null });
        } else {
          this.receivorRegionOptions = regionsData;
        }
        break;
      case 'rh':
        // if (this.toRailHeadOptions === undefined) {
        if (type === 'tab') {
          this.railHeadPanel.overlayVisible = true;
        }
        const rail_params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.transType)
          .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, rail_params).subscribe((res: any) => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(rh => {
              railHeads.push({ 'label': rh.DepositorName, 'value': rh.DepositorCode });
            });
            this.toRailHeadOptions = railHeads;
          }
          this.toRailHeadOptions.unshift({ label: '-select-', value: null });
        });
        // }
        break;
      case 'fs':
        // if (this.fromStationOptions === undefined) {
        if (type === 'tab') {
          this.fromStationPanel.overlayVisible = true;
        }
        const fromStation_params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.transType)
          .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, fromStation_params).subscribe((res: any) => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(fs => {
              fromStation.push({ 'label': fs.DepositorName, 'value': fs.DepositorCode });
            });
            this.fromStationOptions = fromStation;
          }
          this.fromStationOptions.unshift({ label: '-select-', value: null });
        });
        // }
        break;
      case 'ts':
        // if (this.toStationOptions === undefined) {
        if (type === 'tab') {
          this.toStationPanel.overlayVisible = true;
        }
        const toStation_params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.transType)
          .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, toStation_params).subscribe((res: any) => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(ts => {
              toStation.push({ 'label': ts.DepositorName, 'value': ts.DepositorCode });
            });
            this.toStationOptions = toStation;
          }
          this.toStationOptions.unshift({ label: '-select-', value: null });
        });
        // }
        break;
      case 'i_desc':
        if (type === 'tab') {
          this.commodityPanel.overlayVisible = true;
        }
        if (this.Scheme !== undefined && this.Scheme !== null) {
          if ((this.Scheme.value !== undefined && this.Scheme.value !== null) || (this.schemeCode !== undefined && this.schemeCode !== null)) {
            const params = new HttpParams().set('SCode', (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode);
            this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(i => {
                  itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode, 'GRName': i.GRName });
                });
                this.itemDescOptions = itemDesc;
              }
              this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        } else {
          this.itemDescOptions = itemDesc;
        }
        break;
      case 'st_no':
        if (type === 'tab') {
          this.stackPanel.overlayVisible = true;
        }
        if (this.RCode !== undefined && this.ICode !== undefined && this.ICode !== null) {
          if ((this.ICode.value !== undefined && this.ICode.value !== null) || (this.iCode !== null && this.iCode !== undefined)) {
            const params = new HttpParams().set('GCode', this.GCode).append('ITCode', (this.ICode.value !== undefined) ? this.ICode.value : this.iCode);
            this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(s => {
                  stackNo.push({ 'label': s.StackNo, 'value': s.StackNo, 'stack_date': s.ObStackDate, 'stack_yr': s.CurYear });
                });
                this.stackOptions = stackNo;
              }
              this.stackOptions.unshift({ label: '-select-', value: null, disabled: true });
            });
          }
        } else {
          this.stackOptions = stackNo;
        }
        break;
      case 'pt':
        if (type === 'tab') {
          this.packingPanel.overlayVisible = true;
        }
        // if (this.packingTypeOptions === undefined) {
        this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.Table.forEach(p => {
              packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
            });
            this.packingTypeOptions = packingTypes;
          }
          this.packingTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        });
        //  }
        break;
      case 'wmt':
        if (type === 'tab') {
          this.weighmentPanel.overlayVisible = true;
        }
        // if (this.wmtOptions === undefined) {
        this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.Table1.forEach(w => {
              weighment.push({ 'label': w.WEType, 'value': w.WECode });
            })
            this.wmtOptions = weighment;
          }
          this.wmtOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        });
        // }
        break;
      case 'fc':
        if (type === 'tab') {
          this.freightPanel.overlayVisible = true;
        }
        this.freightOptions = [{ label: '-select-', value: null }, { label: 'PAID', value: 'PAID' }, { label: 'PAY', value: 'PAY' }];
        break;
      case 'vc':
        if (type === 'tab') {
          this.vehiclePanel.overlayVisible = true;
        }
        this.vehicleOptions = [{ label: '-select-', value: null }, { label: 'CASUAL', value: 'CASUAL' },
        { label: 'CONTRACT', value: 'CONTRACT' }, { label: 'GOVT', value: 'GOVT' }];
        break;
    }
  }

  refreshSelect(id) {
    switch (id) {
      case 'tr':
        this.receivorNameOptions = []; this.receivorTypeOptions = [];
        this.rnCode = null; this.RTCode = null; this.RNCode = null;
        break;
      case 'sc':
        this.itemDescOptions = []; this.stackOptions = [];
        this.TStockNo = null; this.stackYear = null;
        this.StackBalance = 0; this.CurrentDocQtv = 0;
        this.NetStackBalance = 0;
        this.iCode = null; this.ICode = null;
        this.itemGroup = null; this.TStockNo = null;
        break;
      case 'i_desc':
        this.stackOptions = [];
        this.TStockNo = null;
        this.stackYear = null;
        break;
      case 'rr':
        this.receivorNameOptions = []; this.receivorTypeOptions = [];
        this.rnCode = null; this.RTCode = null; this.RNCode = null;
        break;
      case 'rt':
        this.receivorNameOptions = [];
        this.rnCode = null; this.RNCode = null;
        break;
    }
  }

  onSelectTransportMode() {
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 1) {
        this.disableRailHead = (this.selectedValues[0] === 'Rail') ? false : true;
      } else if (this.selectedValues.length === 2) {
        this.disableRailHead = false;
      }
    }
  }

  deleteRow(data, index) {
    this.selectedIndex = index;
    let sno = 1;
    this.TStockNo = data.TStockNo;
    this.stackOptions = [{ label: data.TStockNo, value: data.TStockNo }];
    this.Scheme = data.SchemeName; this.schemeCode = data.Scheme;
    this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme }];
    this.StackDate = data.StackDate;
    this.ICode = data.ITDescription; this.iCode = data.ICode;
    this.itemGroup = data.GRName;
    this.itemDescOptions = [{ label: data.ITDescription, value: data.ICode }];
    this.IPCode = data.PackingType; this.ipCode = data.IPCode;
    this.PWeight = (data.PWeight * 1);
    this.packingTypeOptions = [{ label: data.PackingType, value: data.IPCode }];
    this.WTCode = data.WmtType; this.wtCode = data.WTCode;
    this.wmtOptions = [{ label: data.WmtType, value: data.WTCode }];
    this.NoPacking = (data.NoPacking * 1),
      this.GKgs = (data.GKgs * 1).toFixed(3);
    this.NKgs = (data.Nkgs * 1).toFixed(3);
    this.stackYear = data.StackYear;
    this.Moisture = ((data.Moisture * 1) !== 0) ? (data.Moisture * 1).toFixed(2) : (data.Moisture * 1).toFixed(0);
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      let index;
      index = this.TStockNo.toString().indexOf('/', 2);
      const totalLength = this.TStockNo.length;
      this.GodownNo = this.TStockNo.toString().slice(0, index);
      this.LocationNo = this.TStockNo.toString().slice(index + 1, totalLength);
    }
    this.TKgs = (this.GKgs !== undefined && this.NKgs !== undefined) ? ((this.GKgs * 1) - (this.NKgs * 1)).toFixed(3) : 0;
    this.itemData.splice(index, 1);
    this.itemData.forEach(x => { x.sno = sno; sno += 1; })
    const list = { stack_no: this.TStockNo, stack_date: this.StackDate, stack_yr: this.stackYear, curDocQty: this.NKgs }
    this.onStackNoChange(list);
  }

  parseMoisture(event) {
    let totalLength = event.target.value.length;
    let value = event.target.value;
    let findDot = this.Moisture.toString().indexOf('.');
    if ((event.keyCode >= 32 && event.keyCode <= 47) || (event.keyCode >= 58 && event.keyCode <= 64)
      || (event.keyCode >= 91 && event.keyCode <= 95) || (event.keyCode >= 123 && event.keyCode <= 127)
      || (findDot > 1)) {
      return false;
    } else if (totalLength === 1 && event.keyCode === 190) {
      return true;
    }
    else if (totalLength >= 2 && event.keyCode !== 8) {
      if (findDot < 0) {
        let checkValue: any = this.Moisture.toString().slice(0, 2);
        checkValue = (checkValue * 1);
        if (checkValue > 25) {
          let startValue = this.Moisture.toString().slice(0, 1);
          let endValue = this.Moisture.toString().slice(1, totalLength);
          this.Moisture = startValue + '.' + endValue;
        } else {
          let startValue = this.Moisture.toString().slice(0, 2);
          let endValue = this.Moisture.toString().slice(2, totalLength);
          endValue = (endValue !== undefined && endValue !== '') ? endValue : '';
          this.Moisture = (endValue.trim() !== '') ? (startValue + '.' + endValue) : startValue;
        }
      }
    } else {
      return true;
    }
  }

  onCalculateKgs() {
    this.NoPacking = (this.NoPacking * 1);
    if (this.NoPacking !== undefined && this.NoPacking !== null
      && this.IPCode !== undefined && this.IPCode !== null) {
      let wt = (this.IPCode.weight !== undefined && this.IPCode.weight !== null) ? this.IPCode.weight : this.PWeight;
      this.GKgs = this.NKgs = ((this.NoPacking * 1) * (wt * 1)).toFixed(3);
      this.TKgs = ((this.GKgs * 1) - (this.NKgs * 1)).toFixed(3);
    } else {
      this.GKgs = this.NKgs = this.TKgs = null;
    }
  }

  onCalculateWt(value, id) {
    const kgs = (value * 1);
    if (kgs !== null && kgs !== undefined) {
      if (id === 'gkgs') { this.NKgs = kgs; }
    }
    if (this.GKgs !== undefined && this.GKgs !== null && this.NKgs !== undefined && this.NKgs !== null) {
      let grossWt = (this.GKgs * 1);
      let netWt = (this.NKgs * 1);
      if (grossWt < netWt) {
        this.NKgs = null; this.GKgs = null; this.TKgs = null;
      } else {
        this.TKgs = (grossWt - netWt).toFixed(3);
      }
    }
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  onClose() {
    this.messageService.clear('t-err');
  }

  onClear() {
    this.itemData = []; this.STTDetails = [];
    this.STDate = new Date(); this.OrderDate = new Date(); this.RDate = new Date();
    this.LWBillDate = new Date(); this.LDate = new Date();
    this.Trcode = null; this.trCode = null; this.rnCode = null;
    this.OrderNo = '-'; this.selectedValues = ['Road']; this.RNo = '-'; this.LorryNo = null;
    this.RRCode = null; this.RHCode = null; this.rhCode = null;
    this.RTCode = null; this.RNCode = null; this.ManualDocNo = '-'; this.Remarks = null;
    this.TransporterName = '-'; this.LWBillNo = '-';
    this.FreightAmount = 0; this.Kilometers = 0; this.WHDNo = 0; this.WCharges = 0;
    this.HCharges = 0; this.TStation = '-'; this.FStation = '-';
    this.fStationCode = '-'; this.tStationCode = '-';
    this.GunnyReleased = 0; this.Gunnyutilised = 0; this.STNo = null;
    this.FCode = '-'; this.VCode = '-'; this.RRNo = 0; this.WNo = 0; this.RailFreightAmt = 0;
    this.CurrentDocQtv = 0; this.StackBalance = 0; this.NetStackBalance = 0;
    this.transactionOptions = []; this.toRailHeadOptions = [];
    this.receivorNameOptions = []; this.receivorRegionOptions = [];
    this.receivorTypeOptions = []; this.packingTypeOptions = undefined;
    this.schemeOptions = []; this.itemDescOptions = []; this.wmtOptions = undefined;
    this.schemeCode = null; this.Scheme = null; this.ICode = null;
    this.iCode = null; this.itemGroup = null;
    this.GodownNo = null; this.LocationNo = null;
    this.stackOptions = []; this.TStockNo = null; this.ipCode = null;
    this.IPCode = null; this.WTCode = null; this.wtCode = null;
    this.NoPacking = null; this.GKgs = null;
    this.NKgs = null; this.Moisture = null;
    this.freightOptions = [{ label: '-', value: '-' }];
    this.vehicleOptions = [{ label: '-', value: '-' }];
    this.fromStationOptions = [{ label: '-', value: '-' }];
    this.toStationOptions = [{ label: '-', value: '-' }];
    // this.isSaved = false;
    //this.isViewed = false;
    ///Preview Data Clear
    this.PreFCode = null; this.PreFreightAmnt = null;
    this.PreFStation = null; this.PreHCharges = null;
    this.PreKms = null; this.PreLWBDate = null; this.PreLWBNo = null;
    this.PreLoadingDate = null; this.PreLorryNo = null;
    this.PreMODate = null; this.PreMONo = null; this.PreManualDocNo = null;
    this.PreRGunny = null; this.PreRODate = null; this.PreRONo = null;
    this.PreRRNo = null; this.PreRailFreightAmt = null;
    this.PreRailHead = null; this.PreRecName = null;
    this.PreRecRegion = null; this.PreRecType = null;
    this.PreRemarks = null; this.PreTDate = null; this.PreUGunny = null;
    this.PreVCode = null; this.PreWCharges = null; this.PreWDR = null;
    this.PreWNo = null; this.PreTransaction = null; this.PreTStation = null;
    this.PreTransportMode = null; this.PreTransporterName = null;
    this.showPreview = false;
  }

  onStackNoChange(event) {
    this.messageService.clear();
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      const i_GRName: string = (this.ICode.GRName !== null && this.ICode.GRName !== undefined) ?
        this.ICode.GRName : this.itemGroup;
      this.stackYear = (this.TStockNo.stack_yr !== undefined && this.TStockNo.stack_yr !== null) ? this.TStockNo.stack_yr : this.stackYear;
      let stack_data = (event.value !== undefined) ? event.value : event;
      let ind;
      let stockNo: string = (stack_data.value !== undefined && stack_data.value !== null) ? stack_data.value : stack_data.stack_no;
      ind = stockNo.indexOf('/', 2);
      const totalLength = stockNo.length;
      this.GodownNo = stockNo.slice(0, ind);
      this.LocationNo = stockNo.slice(ind + 1, totalLength);
      const params = {
        DocNo: (this.STNo !== undefined && this.STNo !== null) ? this.STNo : 0,
        TStockNo: stockNo,
        StackDate: this.datepipe.transform(stack_data.stack_date, 'MM/dd/yyyy'),
        StackYear: stack_data.stack_yr,
        GCode: this.GCode,
        ICode: (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
        Type: 1
      };
      this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.StackBalance = (res[0].StackBalance * 1).toFixed(3);
          // this.StackBalance = (this.StackBalance * 1);
          if ((this.StackBalance * 1) > 0) {
            this.isValidStackBalance = false;
            this.CurrentDocQtv = 0; this.NetStackBalance = 0;
            if (this.itemData.length !== 0) {
              this.itemData.forEach(x => {
                if (x.TStockNo.trim() === stockNo.trim()) {
                  this.CurrentDocQtv += (x.Nkgs * 1);
                  this.NetStackBalance = (this.StackBalance * 1) - (this.CurrentDocQtv * 1);
                }
              });
            }
          } else if (i_GRName !== 'M024') {
            this.isValidStackBalance = true;
            this.CurrentDocQtv = 0;
            this.NetStackBalance = 0;
            this.messageService.clear();
            this.messageService.clear();
            this.messageService.add({
              key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
              summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NotSufficientStackBalance
            });
          } else {
            this.isValidStackBalance = false;
            this.messageService.clear();
          }
        }
      })
    } else {
      this.GodownNo = null; this.stackYear = null; this.LocationNo = null;
      this.CurrentDocQtv = 0; this.NetStackBalance = 0;
    }
  }

  onEnter() {
    this.messageService.clear();
    this.itemData.push({
      TStockNo: (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ? this.TStockNo.value : this.TStockNo,
      ITDescription: (this.ICode.label !== undefined && this.ICode.label !== null) ? this.ICode.label : this.ICode,
      PackingType: (this.IPCode.label !== undefined && this.IPCode.label !== null) ? this.IPCode.label : this.IPCode,
      IPCode: (this.IPCode.value !== undefined && this.IPCode.value !== null) ? this.IPCode.value : this.ipCode,
      ICode: (this.ICode.value !== undefined && this.ICode.value) ? this.ICode.value : this.iCode,
      NoPacking: this.NoPacking,
      WmtType: (this.WTCode.label !== undefined && this.WTCode.label !== null) ? this.WTCode.label : this.WTCode,
      WTCode: (this.WTCode.value !== undefined && this.WTCode.value !== null) ? this.WTCode.value : this.wtCode,
      GKgs: this.GKgs, Nkgs: this.NKgs, Moisture: (this.Moisture === undefined) ? 0 : this.Moisture,
      SchemeName: (this.Scheme.label !== undefined && this.Scheme.label !== null) ? this.Scheme.label : this.Scheme,
      Scheme: (this.Scheme.value !== undefined && this.Scheme.value !== null) ? this.Scheme.value : this.schemeCode,
      PWeight: (this.IPCode.weight !== undefined) ? this.IPCode.weight : this.PWeight,
      StackDate: (this.TStockNo.stack_date !== undefined && this.TStockNo.stack_date !== null) ?
        new Date(this.TStockNo.stack_date) : this.StackDate, Rcode: this.RCode,
      StackYear: (this.stackYear !== undefined && this.stackYear !== null) ? this.stackYear : '-',
      GRName: (this.ICode.GRName !== null && this.ICode.GRName !== undefined) ? this.ICode.GRName : this.itemGroup
    });
    if (this.itemData.length !== 0) {
      this.StackBalance = (this.StackBalance * 1).toFixed(3);
      this.CurrentDocQtv = 0;
      let sno = 1;
      let stock_no = (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ? this.TStockNo.value : this.TStockNo;
      this.itemData.forEach(x => {
        x.sno = sno;
        if (x.TStockNo === stock_no) {
          this.CurrentDocQtv += (x.Nkgs * 1);
        }
        sno += 1;
      });
      let lastIndex = this.itemData.length - 1;
      const i_GRName: string = (this.ICode.GRName !== null && this.ICode.GRName !== undefined) ?
        this.ICode.GRName : this.itemGroup;
      if (this.CurrentDocQtv > (this.StackBalance * 1) && i_GRName !== 'M024') {
        this.itemData.splice(lastIndex, 1);
        ///calculating current document quantity based on stock number after splicing data from table
        this.CurrentDocQtv = 0;
        this.itemData.forEach(x => {
          if (x.TStockNo.trim() === stock_no.trim()) {
            this.CurrentDocQtv += (x.Nkgs * 1);
          }
        });
        ///end 
        // this.NetStackBalance = 0;
        this.NoPacking = null;
        this.GKgs = null; this.NKgs = null; this.TKgs = null;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
          life: 5000, detail: StatusMessage.ExceedingStackBalance
        });
      } else {
        this.NetStackBalance = (this.StackBalance * 1) - (this.CurrentDocQtv * 1);
        this.TStockNo = null; this.ICode = null; this.IPCode = null; this.NoPacking = null;
        this.GKgs = null; this.NKgs = null; this.GodownNo = null; this.LocationNo = null;
        this.TKgs = null; this.WTCode = null; this.Moisture = null; this.Scheme = null;
        this.schemeOptions = []; this.itemDescOptions = []; this.stackOptions = [];
        this.packingTypeOptions = []; this.wmtOptions = [];
      }
    }
  }

  onRowSelect(event) {
    this.selected = event;
    this.STNo = event.data.STNo;
  }

  onView() {
    this.viewPane = true;
    this.selected = null;
    this.truckMemoViewData = [];
    this.messageService.clear();
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.GCode).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        let sno = 1;
        res.forEach(data => {
          data.sno = sno;
          data.STDate = this.datepipe.transform(data.STDate, 'dd-MM-yyyy');
          sno += 1;
        });
        this.truckMemoViewData = res;
      } else {
        this.truckMemoViewData = [];
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.truckMemoViewData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  resetForm(truckMemoForm: NgForm) {
    truckMemoForm.form.markAsUntouched();
    truckMemoForm.form.markAsPristine();
  }

  getDocBySTNo() {
    this.messageService.clear();
    this.itemData = [];
    this.viewPane = false;
    this.isViewed = true;
    const params = new HttpParams().set('sValue', this.STNo).append('Type', '2').append('GCode', this.GCode);
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0) {
        this.onClear();
        this.STNo = res[0].STNo;
        this.RowId = res[0].RowId;
        this.STDate = new Date(res[0].STDate);
        this.transactionOptions = [{ label: res[0].TransactionName, value: res[0].TrCode }];
        this.Trcode = res[0].TransactionName;
        this.trCode = res[0].TrCode;
        this.enableReceivorRegn = (this.Trcode.value === 'TR021' || this.trCode === 'TR021') ? true : false;
        this.OrderDate = new Date(res[0].MDate);
        this.OrderNo = res[0].MNo;
        this.RNo = res[0].RNo;
        this.RDate = new Date(res[0].RDate);
        this.LorryNo = res[0].LNo.toUpperCase();
        if (res[0].TransportMode !== 'UPCountry') {
          this.selectedValues = [];
          this.selectedValues.push(res[0].TransportMode);
          this.disableRailHead = (res[0].TransportMode === 'Rail') ? false : true;
        } else {
          this.selectedValues = [];
          this.selectedValues.push('Road', 'Rail');
          this.disableRailHead = false;
        }
        if (res[0].RailHead !== null) {
          this.toRailHeadOptions = [{ label: res[0].RHName, value: res[0].RailHead }];
          this.RHCode = res[0].RHName;
          this.rhCode = res[0].RailHead
        }
        this.receivorNameOptions = [{ label: res[0].ReceivorName, value: res[0].ReceivingCode }];
        this.RNCode = res[0].ReceivorName,
          this.rnCode = res[0].ReceivingCode,
          this.ManualDocNo = res[0].Flag1;
        this.TransporterName = (res[0].TransporterName !== undefined && res[0].TransporterName !== null) ? res[0].TransporterName : '-';
        this.LWBillDate = new Date(res[0].LWBillDate);
        this.LWBillNo = (res[0].LWBillNo !== null) ? res[0].LWBillNo : 0;
        this.FreightAmount = (res[0].FreightAmount !== null) ? res[0].FreightAmount : 0;
        this.Kilometers = (res[0].Kilometers !== null) ? res[0].Kilometers : 0;
        this.WHDNo = (res[0].WHDNo !== null) ? res[0].WHDNo : 0;
        this.WCharges = (res[0].WCharges !== null) ? res[0].WCharges : 0;
        this.HCharges = (res[0].HCharges !== null) ? res[0].HCharges : 0;
        this.GunnyReleased = (res[0].GunnyReleased !== null) ? res[0].GunnyReleased : 0;
        this.Gunnyutilised = (res[0].GunnyUtilised !== null) ? res[0].GunnyUtilised : 0;
        this.FCode = (res[0].FCode !== null && res[0].FCode.trim() !== '') ? res[0].FCode : '-';
        this.freightOptions = [{ label: this.FCode, value: this.FCode }];
        this.VCode = (res[0].Vcode !== null && res[0].Vcode.trim() !== '') ? res[0].Vcode : '-';
        this.vehicleOptions = [{ label: this.VCode, value: this.VCode }],
          this.FStation = (res[0].FromStation !== null && res[0].FromStation.trim() !== '') ? res[0].FromStation : '-';
        this.fStationCode = (res[0].FStation !== null && res[0].FStation.trim() !== '') ? res[0].FStation : '-';
        this.fromStationOptions = [{ label: this.FStation, value: this.fStationCode }];
        this.TStation = (res[0].ToStation !== null && res[0].ToStation.trim() !== '') ? res[0].ToStation : '-';
        this.tStationCode = (res[0].TStation !== null && res[0].TStation.trim() !== '') ? res[0].TStation : '-';
        this.toStationOptions = [{ label: this.TStation, value: this.tStationCode }],
          this.RRNo = (res[0].RRNo !== null) ? res[0].RRNo : 0;
        this.RailFreightAmt = (res[0].RFreightAmount !== null) ? res[0].RFreightAmount : 0;
        this.LDate = new Date(res[0].LDate);
        this.WNo = (res[0].Wno !== null) ? res[0].Wno : 0;
        this.Remarks = res[0].Remarks;
        this.IssueSlip = res[0].IssueSlip;
        let sno = 1;
        res.forEach(i => {
          this.itemData.push({
            sno: sno,
            TStockNo: i.TStockNo,
            ICode: i.ICode,
            GRName: i.GRName,
            IPCode: i.IPCode,
            NoPacking: i.NoPacking,
            GKgs: i.GKgs,
            Nkgs: i.Nkgs,
            WTCode: i.WTCode,
            Moisture: i.Moisture,
            Scheme: i.Scheme,
            ITDescription: i.ITName,
            SchemeName: i.SchemeName,
            PackingType: i.PName,
            WmtType: i.WEType,
            PWeight: i.PWeight,
            StackDate: i.StackDate,
            StackYear: i.StackYear,
            RCode: i.RCode
          });
          sno += 1;
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onSave(type) {
    this.messageService.clear();
    this.blockScreen = true;
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 2) {
        this.MTransport = 'UPCountry';
      } else if (this.selectedValues.length === 1) {
        this.MTransport = (this.selectedValues[0] === 'Rail') ? 'Rail' : 'Road';
      }
    }
    this.STTDetails.push({
      TransportMode: this.MTransport,
      TransporterName: (this.TransporterName.length !== 0 && this.TransporterName !== '') ? this.TransporterName : '-',
      LWBillNo: this.LWBillNo,
      LWBillDate: this.datepipe.transform(this.LWBillDate, 'MM/dd/yyyy'),
      FreightAmount: this.FreightAmount,
      Kilometers: this.Kilometers,
      WHDNo: (this.WHDNo !== undefined && this.WHDNo !== null) ? this.WHDNo : 0,
      WCharges: (this.WCharges !== null && this.WCharges !== undefined) ? this.WCharges : 0,
      HCharges: (this.HCharges !== null && this.HCharges !== undefined) ? this.HCharges : 0,
      FStation: (this.FStation !== null && this.FStation !== undefined) ? ((this.FStation.value !== undefined) ? this.FStation.value : this.fStationCode) : '-',
      TStation: (this.TStation !== null && this.TStation !== undefined) ? ((this.TStation.value !== undefined) ? this.TStation.value : this.tStationCode) : '-',
      Remarks: (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks.trim() : '-',
      FCode: this.FCode,
      Vcode: this.VCode,
      LDate: this.datepipe.transform(this.LDate, 'MM/dd/yyyy'),
      LNo: this.LorryNo,
      Wno: (this.WNo !== undefined && this.WNo !== null) ? this.WNo : 0,
      RRNo: (this.RRNo !== undefined && this.RRNo !== null) ? this.RRNo : 0,
      RailHead: (this.RHCode !== undefined && this.RHCode !== null) ? ((this.RHCode.value !== undefined && this.RHCode.value !== null) ? this.RHCode.value : this.rhCode) : '-',
      RFreightAmount: (this.RailFreightAmt !== undefined && this.RailFreightAmt !== null) ? this.RailFreightAmt : 0,
      Rcode: this.RCode
    });
    this.RowId = (this.RowId !== undefined && this.RowId !== null) ? this.RowId : 0;
    this.STNo = (this.STNo !== undefined && this.STNo !== null) ? this.STNo : 0;
    this.IssueSlip = (this.STNo === undefined || this.STNo === null) ? 'N' : this.IssueSlip;
    const params = {
      'Type': type,
      'STNo': this.STNo,
      'RowId': this.RowId,
      'STDate': this.datepipe.transform(this.STDate, 'MM/dd/yyyy'),
      'TrCode': (this.Trcode.value !== undefined && this.Trcode.value !== null) ? this.Trcode.value : this.trCode,
      'MNo': this.OrderNo,
      'MDate': this.datepipe.transform(this.OrderDate, 'MM/dd/yyyy'),
      'RNo': this.RNo,
      'RDate': this.datepipe.transform(this.RDate, 'MM/dd/yyyy'),
      'LorryNo': this.LorryNo.toString().toUpperCase(),
      'ReceivingCode': (this.RNCode.value !== undefined && this.RNCode.value !== null) ? this.RNCode.value : this.rnCode,
      'IssuingCode': this.GCode,
      'RCode': this.RCode,
      'GunnyUtilised': (this.Gunnyutilised !== undefined && this.Gunnyutilised !== null) ? this.Gunnyutilised : 0,
      'GunnyReleased': (this.GunnyReleased !== undefined && this.GunnyReleased !== null) ? this.GunnyReleased : 0,
      'GodownName': this.godownName,
      'TransactionName': (this.Trcode.label !== undefined && this.Trcode.value !== null) ? this.Trcode.value : this.Trcode,
      'ReceivingName': (this.RNCode.label !== undefined && this.RNCode.label !== null) ? this.RNCode.label : this.RNCode,
      'ManualDocNo': this.ManualDocNo,
      'RegionName': this.regionName,
      'RailHeadName': (this.RHCode !== undefined && this.RHCode !== null) ?
        ((this.RHCode.label !== undefined) ? this.RHCode.label : this.RHCode) : '-',
      'IssueSlip': this.IssueSlip,
      'UserID': this.username.user,
      'documentSTItemDetails': this.itemData,
      'documentSTTDetails': this.STTDetails
    };
    // this.isSaved = true;
    this.restAPIService.post(PathConstants.STOCK_TRUCK_MEMO_DOCUMENT, params).subscribe(res => {
      if (res.Item1 !== undefined && res.Item1 !== null && res.Item2 !== undefined && res.Item2 !== null) {
        if (res.Item1) {
          this.DOCNumber = res.Item3;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
            summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2
          });
          this.onClear();
          if (type !== '2') {
            this.isSaveSucceed = true;
            this.isViewed = false;
          } else {
            this.isSaveSucceed = false;
            this.loadDocument();
            this.isViewed = false;
          }
          this.blockScreen = false;
        } else {
          this.blockScreen = false;
          this.isSaveSucceed = false;
          this.isViewed = true;
          this.STTDetails = [];
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2
          });
        }
      }
    }, (err: HttpErrorResponse) => {
      this.isSaveSucceed = false;
      this.isViewed = false;
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.STTDetails = [];
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

  loadDocument() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StockTruckMemoDocument;
    let filepath = path + filename + ".txt";
    var w = window.open(filepath);
    w.print();
    this.messageService.clear();
    this.messageService.clear();
  }

  onPrint() {
    // this.blockScreen = true;
    if (this.isViewed) {
      this.onSave('2');
    } else {
      this.loadDocument();
      const params = { DOCNumber: this.DOCNumber }
      this.restAPIService.put(PathConstants.TRUCK_MEMO_DUPLICATE_DOCUMENT, params).subscribe(res => {
        if (res) { this.DOCNumber = null; }
      }); this.isSaveSucceed = false;
      this.isViewed = false;
    }
  }

  onSubmit(form) {
    this.submitted = true;
    let arr = [];
    let no = 0;
    if (form.invalid) {
      for (var key in form.value) {
        if (key !== 'TNo' && key !== 'GodownNum' && key !== 'LocNo'
          && key !== 'TareWt' && key !== 'StackBal' && key !== 'CurQtv' && key !== 'NetStackBal') {
          if (this.itemData.length !== 0 && (key !== 'Schemes' && key !== 'Commodity' && key !== 'NetWt'
            && key !== 'GrossWt' && key !== 'StockNo' && key !== 'PackingType' && key !== 'NoOfPacking'
            && key !== 'MoistureNo' && key !== 'WmtType') && (form.value[key] === null || form.value[key] === undefined
              || form.value[key] === '')) {
            no += 1;
            arr.push({ label: no, value: no + '.' + key });
            this.missingFields = arr;
          } else if ((this.itemData.length === 0) && (form.value[key] === null || form.value[key] === undefined || form.value[key] === '')) {
            no += 1;
            arr.push({ label: no, value: no + '.' + key });
            this.missingFields = arr;
          }
        }
      }
    } else if (this.itemData.length === 0) {
      arr.push({ label: '1', value: 'Please add item details! ' });
      this.missingFields = arr;
    } else {
      this.submitted = false;
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
        summary: StatusMessage.SUMMARY_ALERT, detail: StatusMessage.SuccessValidationMsg
      });
    }
  }

  viewPreview(f) {
    this.showPreview = true;
    this.PreTDate = (f.value['TruckMemoDate'] !== null) ?
      this.datepipe.transform(f.value['TruckMemoDate'], 'dd/MM/yyyy') : f.value['TruckMemoDate'];
    this.PreMODate = (f.value['MovementOrderDate'] !== null) ?
      this.datepipe.transform(f.value['MovementOrderDate'], 'dd/MM/yyyy') : f.value['MovementOrderDate'];
    this.PreRODate = (f.value['ReleaseOrderDate'] !== null) ?
      this.datepipe.transform(f.value['ReleaseOrderDate'], 'dd/MM/yyyy') : f.value['ReleaseOrderDate'];
    this.PreLWBDate = (f.value['WBillDate'] !== null) ?
      this.datepipe.transform(f.value['WBillDate'], 'dd/MM/yyyy') : f.value['WBillDate'];
    this.PreLoadingDate = (f.value['LDate'] !== null) ?
      this.datepipe.transform(f.value['LDate'], 'dd/MM/yyyy') : f.value['LDate'];
    this.PreMONo = (f.value['MovementOrderNo'] !== null) ?
      f.value['MovementOrderNo'].toString().toUpperCase() : f.value['MovementOrderNo'];
    this.PreRONo = (f.value['ReleaseOrderNo'] !== null) ?
      f.value['ReleaseOrderNo'].toString().toUpperCase() : f.value['ReleaseOrderNo'];
    this.PreTransportMode = (f.value['TransportMode'] !== null) ?
      f.value['TransportMode'].toString().toUpperCase() : f.value['TransportMode'];
    this.PreTransaction = (f.value['TransactionType'] !== null) ?
      ((f.value['TransactionType'].label !== undefined)
        ? f.value['TransactionType'].label : f.value['TransactionType']) : '';
    if (!this.disableRailHead) {
      this.PreRailHead = (f.value['RailHead'] !== null) ?
        ((f.value['RailHead'].label !== undefined) ? f.value['RailHead'].label : f.value['RailHead']) : '';
      this.PreFStation = (f.value['FromStation'] !== null) ?
        ((f.value['FromStation'].label !== undefined) ?
          f.value['FromStation'].label : f.value['FromStation']) : '';
      this.PreTStation = (f.value['ToStation'] !== null) ?
        ((f.value['ToStation'].label !== undefined) ?
          f.value['ToStation'].label : f.value['ToStation']) : '';
    }
    if (!this.enableReceivorRegn) {
      this.PreRecRegion = (f.value['ReceivorRegion'] !== null) ?
        ((f.value['ReceivorRegion'].label !== undefined) ? f.value['ReceivorRegion'].label
          : f.value['ReceivorRegion']) : '';
    }
    this.PreRecType = (f.value['ReceivorType'] !== null) ?
      ((f.value['ReceivorType'].label !== undefined) ?
        f.value['ReceivorType'].label : f.value['ReceivorType']) : '';
    this.PreRecName = (f.value['ReceivorName'] !== null) ?
      ((f.value['ReceivorName'].label !== undefined) ?
        f.value['ReceivorName'].label : f.value['ReceivorName']) : '';
    this.PreLorryNo = (f.value['LorryNumber'] !== null) ?
      f.value['LorryNumber'].toString().toUpperCase() : f.value['LorryNumber'];
    this.PreManualDocNo = (f.value['ManualDocumentNo'] !== null) ?
      f.value['ManualDocumentNo'].toString().toUpperCase() : f.value['ManualDocumentNo'];
    this.PreTransporterName = (f.value['TName'] !== null) ? f.value['TName'].toString().toUpperCase()
      : f.value['TName'];
    this.PreLWBNo = (f.value['LWBNo'] !== null) ? f.value['LWBNo'].toString().toUpperCase()
      : f.value['LWBNo'];
    this.PreFreightAmnt = f.value['FAmt'];
    this.PreKms = f.value['Kms'];
    this.PreWDR = f.value['WHDeposit'];
    this.PreWCharges = f.value['WmtCharges'];
    this.PreHCharges = f.value['Handlingcharges'];
    this.PreRGunny = f.value['GReleased'];
    this.PreUGunny = f.value['GUtilised'];
    this.PreFCode = (f.value['Freight'] !== null) ?
      ((f.value['Freight'].label !== undefined) ?
        f.value['Freight'].label : f.value['Freight']) : '';
    this.PreVCode = (f.value['Vehicle'] !== null) ?
      ((f.value['Vehicle'].label !== undefined) ?
        f.value['Vehicle'].label : f.value['Vehicle']) : '';
    this.PreRRNo = f.value['RR_No'];
    this.PreWNo = f.value['WagonNo'];
    this.PreRailFreightAmt = f.value['RailFAmnt'];
    this.PreRemarks = f.value['RemarksText'];
  }
}
