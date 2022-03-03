import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

import * as _ from 'lodash';

@Component({
  selector: 'app-hoqtyregion',
  templateUrl: './hoqtyregion.component.html',
  styleUrls: ['./hoqtyregion.component.css']
})
export class HoqtyregionComponent implements OnInit {
  QTYAbstractregREPORT: string;
  hoqtyacabstractregData: any = [];
  hoqtyacabstractregCols: any; 
  header: string;
  checkBox: any;
  mtype : any;
   fromDate: any = new Date();
    data: any;
    regions: any;
    RCode: any;
    GCode: any;
    qtymonth: any;
    qtyyear: any;
    ITCode: any;
    Trcode: any;
    Location: any;
    regionOptions: SelectItem[];
    godownOptions: SelectItem[];
    // commodityOptions: SelectItem[];
    locationOptions: SelectItem[];
    truckName: string;
    canShowMenu: boolean;
    maxDate: Date;
    yearRange: string;
    loading: boolean;
    roleId: any;
    username: any;
    formUser = [];
    loggedInRCode: any;
    RowId: any;
  
    @ViewChild('godown', { static: false }) godownPanel: Dropdown;
    @ViewChild('region', { static: false }) regionPanel: Dropdown;
    @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
    @ViewChild('location', { static: false }) locationPanel: Dropdown;
  
  
    constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private router: Router,
      private messageService: MessageService, private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }
    ngOnInit() {
      this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
      this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
      this.data = this.roleBasedService.getInstance();
      this.regions = this.roleBasedService.getRegions();
      this.loggedInRCode = this.authService.getUserAccessible().rCode;
      this.maxDate = new Date();
      this.yearRange = (this.maxDate.getFullYear() - 1) + ':' + this.maxDate.getFullYear();
      this.username = JSON.parse(this.authService.getCredentials());  
      this.RowId = 0;  
      this.mtype='1';
    
    }
  
    onSelect(item, type) {
      let regionSelection = [];
      let godownSelection = [];
      // let transactoinSelection = [];
      // let commoditySelection = [];
      switch (item) {
        case 'reg':
          this.regions = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
              this.regionOptions.unshift({ label: 'All', value: 'All' });
            }
          } else {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                if (x.RCode === this.loggedInRCode) {
                  regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                }
              });
              this.regionOptions = regionSelection;
            }
          }
          break;
        case 'gd':
          if (type === 'enter') { this.godownPanel.overlayVisible = true; }
          this.data = this.roleBasedService.instance;
          if (this.data !== undefined) {
            this.data.forEach(x => {
              if (x.RCode === this.RCode) {
                godownSelection.push({ 'label': x.GName, 'value': x.GCode });
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
          case 'lc':
            if (type === 'tab') {
              this.locationPanel.overlayVisible = true;
            }
            this.locationOptions = [{ label: 'Abstract', value: '1' }, { label: 'Purchase', value: '2' },
            { label: 'Free Receipts', value: '3' },{ label: 'Other Receipts', value: '4' }, 
            { label: 'Sales', value: '5' },{ label: 'Free Issues', value: '6' },
            { label: 'Other Issues', value: '7' }          ];
            break;
     
      }
    }
    oncheckbox() {
      if (this.checkBox == false) {
          this.mtype='1'
      } else {
        this.mtype='2'
      }
      
    }
    onView() {
      if (this.Location.value === '1') {
       
        this.header = 'Head Office Quantity Account Region Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.hoqtyacabstractregColumns;
      } else if (this.Location.value === '2') {
        
        this.header = 'Head Office Quantity Purchase Account  Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyPurchaseColumns;
      } else if (this.Location.value === '3') {
        
        this.header = 'Head Office Quantity Account Free Receipt Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyFreeReceiptColumns;
      } else if (this.Location.value === '4') {
        
        this.header = 'Head Office Quantity Account Other Receipts Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyOtherReceiptColumns;
      }    
      else if (this.Location.value === '5') {
        
        this.header = 'Head Office Quantity Account Sales Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtySalesColumns;
      } 
      else if (this.Location.value === '6') {
        
        this.header = 'Head Office Quantity Account Free issues Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyFreeIssueColumns;
      }   
      else if (this.Location.value === '7') {
        
        this.header = 'Head Office Quantity Account Other Issues Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyOtherIssueColumns;
      }  
     
      this.loading = true;
      this.hoqtyacabstractregData = [];
      this.loading = true;
     
      const params = {
        // 'RoleId': this.roleId,
        'qtyMonth': this.datePipe.transform(this.fromDate, 'MM'),
        'qtyYear': this.datePipe.transform(this.fromDate, 'yyyy'),
        'RCode': this.RCode,
      /*   'ITCode': this.ITCode.value,
        'Trcode': this.Trcode.value, */
       
          'reptype' : this.mtype,
          'repname' : this.Location.value        
        
      };
      this.restAPIService.getByParameters(PathConstants.HO_QTY_ABSRTACTREGREP_GET, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.loading = false;
          this.hoqtyacabstractregData = res;
          let sno = 0;
          this.hoqtyacabstractregData.forEach(s => {
            sno += 1;
            s.SlNo = sno;
          });
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
      if (this.fromDate !== undefined && this.fromDate !== '') {
  
        let selectedFromYear = this.fromDate.getFullYear();
        let todaydate = new Date();
        let curyear = todaydate.getFullYear();
  
  
        if ((selectedFromYear > curyear)) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_INVALID,
            life: 5000, detail: StatusMessage.ValidDateErrorMessage
          });
  
        }
        return this.fromDate
      }
    }
  
    onResetTable(item) {
      this.loading = false;
    }
    onClose() {
      this.messageService.clear('t-err');
    }
   
  }
  


