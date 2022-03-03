import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from '../../constants/tableconstants';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-truck-transit',
  templateUrl: './truck-transit.component.html',
  styleUrls: ['./truck-transit.component.css']
})
export class TruckTransitComponent implements OnInit {
  TruckTransitCols: any;
  TruckTransitData: any = [];
  response: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  transferOptions: SelectItem[];
  transferOption = [];
  GCode: any;
  TrCode: any;
  RCode: any;
  regions: any;
  roleId: any;
  data: any;
  transferData: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  loggedInRCode: string;
  totalRecords: number;
  username: any;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('transaction', { static: false }) transactionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.TruckTransitCols = this.tableConstants.TruckTransit;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let transactionSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
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
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ label: x.GName, value: x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'transaction':
        if (type === 'enter') {
          this.transactionPanel.overlayVisible = true;
        }
        if (this.transferOptions === undefined) {
          transactionSelection.push({ label: 'TRANSFER', value: 'TRANSFER' }, { label: 'INTERNAL TRANSFER', value: 'INTERNAL TRANSFER' });
        }
        this.transferOption = transactionSelection;
    }
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'RCode': this.RCode,
      'Fdate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.GCode,
      'Username': this.username.user
    };
    this.restAPIService.getByParameters(PathConstants.TRUCK_TRANSIT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.TruckTransitData = res.filter(x => { return x.Transfertype === this.TrCode.label });
        this.loading = false;
        if (this.TruckTransitData !== null && this.TruckTransitData.length !== 0) {
          let sno = 0;
          let AckCode;
          this.TruckTransitData.forEach(data => {
            if (data.ReceivingCode !== null) {
              this.data.forEach(res => {
                if (res.GCode === data.ReceivingCode) {
                  data.AckCode = res.GName;
                }
              });
            }
            data.STDate = this.datePipe.transform(data.STDate, 'dd-MM-yyyy');
            data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
            data.Nkgs = (data.Nkgs * 1).toFixed(3);
            data.LNo = data.LNo.toUpperCase();
            sno += 1;
            data.SlNo = sno;
          });
          // this.TruckTransitData.forEach(value => {
          //   if (value.ReceivingCode !== null) {
          //     this.data.forEach(res => {
          //       if (res.GCode === value.ReceivingCode) {
          //         value.AckCode = res.GName;
          //       }
          //     });
          //   }
          // });
          //   this.data.forEach(gm => {
          //     (gm.GCode === data.ReceivingCode) ? AckCode = gm.GName : AckCode;
          // });
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
          });
        }
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }
  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
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
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000
          , summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
        });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.TruckTransitData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.TruckTransitFileName + ".txt";
    saveAs(path + filename, filename);
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}


// exportAsXLSX(): void {
//   var TruckTransitInternal = [];
//   var TruckTransitTransfer = [];
//   this.TruckTransitData.forEach(data => {
//     if (data.Transfertype == "INTERNAL TRANSFER") {
//       TruckTransitInternal.push({ SlNo: data.SlNo, STNo: data.STNo, STDate: data.STDate, Region: data.Region, TNCSName: data.TNCSName, LNo: data.LNo, NoPacking: data.NoPacking, Nkgs: data.Nkgs, AckNo: data.STNo, RTDate: data.STDate, RRegion: data.Region, RGodown: data.TNCSName, Bags: data.NoPacking, Quantity: data.Nkgs, type: data.Transfertype })
//     }
//     else
//       if (data.Transfertype == "TRANSFER") {
//         TruckTransitTransfer.push({ SlNo: data.SlNo, STNo: data.STNo, STDate: data.STDate, Region: data.Region, TNCSName: data.TNCSName, LNo: data.LNo, NoPacking: data.NoPacking, Nkgs: data.Nkgs, AckNo: data.STNo, RTDate: data.STDate, RRegion: data.Region, RGodown: data.TNCSName, Bags: data.NoPacking, Quantity: data.Nkgs, type: data.Transfertype })
//       }
//   })
//   this.excelService.exportAsExcelFile(TruckTransitInternal, 'Truck_Transit_Internal', this.TruckTransitCols);
//   this.excelService.exportAsExcelFile(TruckTransitTransfer, 'Truck_Transit_Transfer', this.TruckTransitCols);
// }