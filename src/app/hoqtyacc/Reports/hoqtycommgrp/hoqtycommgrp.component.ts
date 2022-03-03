
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
  selector: 'app-hoqtycommgrp',
  templateUrl: './hoqtycommgrp.component.html',
  styleUrls: ['./hoqtycommgrp.component.css']
})

 export class HoqtycommgrpComponent implements OnInit {
  QTYAbstractregREPORT: string;
  hoqtyacabstractcomData: any = [];
  hoqtyacabstractregCols: any; 
  Grandtotaldata: any = [];
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
    hoqtygrp: any;
    Trcode: any;
    Location: any;
    regionOptions: SelectItem[];
    godownOptions: SelectItem[];
    commodityOptions: SelectItem[]
    commoditySelection: any = [];
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
      this.mtype='3';
    
    }
  
    onSelect(item, type) {
     
      let godownSelection = [];
      // let transactoinSelection = [];
      let commoditySelection = [];
      switch (item) {
        
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
            case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.hoqtygrp, 'value': y.hoqtygrp });
                this.commodityOptions = commoditySelection;
              });
              this.commodityOptions.unshift({ label: 'All', value: 'All' });
            }
          })
        }
        break;
     
      }
    }
    oncheckbox() {
      if (this.checkBox == false) {
          this.mtype='3'
      } else {
        this.mtype='4'
      }
      
    }
    onView() {
      if (this.Location.value === '1') {
       
        this.header = 'Head Office Quantity Account Commodity Abstract Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.hoqtyacabstractregColumns;
      } else if (this.Location.value === '2') {
        
        this.header = 'Head Office Quantity Commodity Purchase Account Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyPurchaseColumns;
      } else if (this.Location.value === '3') {
        
        this.header = 'Head Office Quantity Account Commodity Free Receipt Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyFreeReceiptColumns;
      } else if (this.Location.value === '4') {
        
        this.header = 'Head Office Quantity Account Commodity Other Receipts Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyOtherReceiptColumns;
      }    
      else if (this.Location.value === '5') {
        
        this.header = 'Head Office Quantity Account Commodity Sales Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtySalesColumns;
      } 
      else if (this.Location.value === '6') {
        
        this.header = 'Head Office Quantity Account Commodity Free issues Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyFreeIssueColumns;
      }   
      else if (this.Location.value === '7') {
        
        this.header = 'Head Office Quantity Account Commodity Other Issues Consolidation';
        this.hoqtyacabstractregCols = this.tableConstants.HOQtyOtherIssueColumns;
      }  
     
      this.loading = true;
      this.hoqtyacabstractcomData = [];
      this.loading = true;
     
      const params = {
        // 'RoleId': this.roleId,
        'qtyMonth': this.datePipe.transform(this.fromDate, 'MM'),
        'qtyYear': this.datePipe.transform(this.fromDate, 'yyyy'),
        'RCode': this.RCode,
        'ITCode': this.hoqtygrp.value,
        /* 'Trcode': this.Trcode.value, */
          'reptype' : this.mtype,
          'repname' : this.Location.value        
        
      };
      this.restAPIService.getByParameters(PathConstants.HO_QTY_ABSRTACTCOMREP_GET, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.loading = false;
          this.hoqtyacabstractcomData = res;
          if (this.Location.value === '1') {
              this.caculatetotal1();
          }else if(this.Location.value === '2') {
            this.caculatetotal2();
          }
          else if(this.Location.value === '3') {
            this.caculatetotal3();
          }
          else if(this.Location.value === '4') {
            this.caculatetotal4();
          }
          else if(this.Location.value === '5') {
            this.caculatetotal5();
          }
          else if(this.Location.value === '6') {
             this.caculatetotal6();           
          }
          else if(this.Location.value === '7') {
            this.caculatetotal7();           
         }
          this.hoqtyacabstractcomData = this.Grandtotaldata
          
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
   caculatetotal1(){
    this.Grandtotaldata = [];
    let sno = 0;
    let Tob = 0;         
    let TPurchaseReceipt = 0;
    let TFreeReceipt = 0;
    let TOtherReceipt = 0;
    let TTotalReceipt= 0;
    let TSales= 0;
    let TFreeIssues= 0;
    let TOtherIssues= 0;
    let TTotalIssues= 0;
    let TCB = 0;
    let TCS= 0;
    let TActualBalance= 0;
    this.Grandtotaldata = this.hoqtyacabstractcomData
     this.Grandtotaldata.forEach(s => {
       sno += 1;
       s.SlNo = sno;
        Tob += (s.OpeBal !== undefined && s.OpeBal !== null) ? (s.OpeBal * 1) : 0;   
        TPurchaseReceipt += (s.PurchaseReceipt !== undefined && s.PurchaseReceipt !== null) ? (s.PurchaseReceipt * 1) : 0;
        TFreeReceipt += (s.FreeReceipt !== undefined && s.FreeReceipt !== null) ? (s.FreeReceipt * 1) : 0;
        TOtherReceipt += (s.OtherReceipt !== undefined && s.OtherReceipt !== null) ? (s.OtherReceipt * 1) : 0;
        TTotalReceipt += (s.TotalReceipt !== undefined && s.TotalReceipt !== null) ? (s.TotalReceipt * 1) : 0;
        TSales += (s.Sales !== undefined && s.Sales !== null) ? (s.Sales * 1) : 0;
        TFreeIssues += (s.FreeIssues !== undefined && s.FreeIssues !== null) ? (s.FreeIssues * 1) : 0;
        TOtherIssues += (s.OtherIssues !== undefined && s.OtherIssues !== null) ? (s.OtherIssues * 1) : 0;
        TTotalIssues += (s.TotalIssues !== undefined && s.TotalIssues !== null) ? (s.TotalIssues * 1) : 0;
        TCB += (s.CB !== undefined && s.CB !== null) ? (s.CB * 1) : 0;
        TCS += (s.CS !== undefined && s.CS !== null) ? (s.CS * 1) : 0;
        TActualBalance += (s.ActualBalance !== undefined && s.ActualBalance !== null) ? (s.ActualBalance * 1) : 0;
        });
     this.Grandtotaldata.push(
         {
           Region: 'Grand Total',
           OpeBal: Tob,               
           PurchaseReceipt: TPurchaseReceipt,
           FreeReceipt: TFreeReceipt,
           OtherReceipt: TOtherReceipt,
           TotalReceipt: TTotalReceipt,
           Sales: TSales,
           FreeIssues: TFreeIssues,
           OtherIssues: TOtherIssues,
           TotalIssues: TTotalIssues,
           CB: TCB,
           CS: TCS,
           ActualBalance: TActualBalance
           
         }
       );
   }
   caculatetotal2(){
    this.Grandtotaldata =[];
    let sno = 0;
    let TPriorityQty = 0;         
    let TAAY = 0;
    let TSeizure = 0;
    let TTideOver = 0;
    let THO= 0;
    let THostel= 0;
    let TICDS= 0;
    let TOMSS= 0;
    let TNPHS= 0;
    let TROPurchase = 0;
    let TLevy= 0;
    let TNonLevy= 0;
    let TTotalPurchase =0;
    this.Grandtotaldata = this.hoqtyacabstractcomData
     this.Grandtotaldata.forEach(s => {
       sno += 1;
       s.SlNo = sno;
       TPriorityQty += (s.PriorityQty !== undefined && s.PriorityQty !== null) ? (s.PriorityQty * 1) : 0;   
       TAAY += (s.AAY !== undefined && s.AAY !== null) ? (s.AAY * 1) : 0;
       TSeizure += (s.Seizure !== undefined && s.Seizure !== null) ? (s.Seizure * 1) : 0;
       TTideOver += (s.TideOver !== undefined && s.TideOver !== null) ? (s.TideOver * 1) : 0;
       THO += (s.HO !== undefined && s.HO !== null) ? (s.HO * 1) : 0;
       THostel += (s.Hostel !== undefined && s.Hostel !== null) ? (s.Hostel * 1) : 0;
       TICDS += (s.ICDS !== undefined && s.ICDS !== null) ? (s.ICDS * 1) : 0;
       TOMSS += (s.OMSS !== undefined && s.OMSS !== null) ? (s.OMSS * 1) : 0;
       TNPHS += (s.NPHS !== undefined && s.NPHS !== null) ? (s.NPHS * 1) : 0;
       TROPurchase += (s.ROPurchase !== undefined && s.ROPurchase !== null) ? (s.ROPurchase * 1) : 0;
       TLevy += (s.Levy !== undefined && s.Levy !== null) ? (s.Levy * 1) : 0;
       TNonLevy += (s.NonLevy !== undefined && s.NonLevy !== null) ? (s.NonLevy * 1) : 0;
       TTotalPurchase += (s.TotalPurchase !== undefined && s.TotalPurchase !== null) ? (s.TotalPurchase * 1) : 0;
        });
     this.Grandtotaldata.push(
         {
          RGNAME: 'Grand Total',
           PriorityQty: TPriorityQty,               
           AAY: TAAY,
           Seizure: TSeizure,
           TideOver: TTideOver,
           HO: THO,
           Hostel: THostel,
           ICDS: TICDS,
           OMSS: TOMSS,
           NPHS: TNPHS,
           ROPurchase: TROPurchase,
           Levy: TLevy,
           NonLevy: TNonLevy ,  
           TotalPurchase:TTotalPurchase       
         });
       }
   caculatetotal3(){
        this.Grandtotaldata =[];
        let sno = 0;
        let TNMP = 0;         
        let TSGRY = 0;
        let TANNAPOORNA = 0;
        let TPMGKY_AAY = 0;
        let TPMGKY_PRIORITY= 0;
        let TANB= 0;
        let TFORTIFIED_KERNELS= 0;
        let TTotalFreeRice= 0;
        this.Grandtotaldata = this.hoqtyacabstractcomData
         this.Grandtotaldata.forEach(s => {
           sno += 1;
           s.SlNo = sno;
           TNMP += (s.NMP !== undefined && s.NMP !== null) ? (s.NMP * 1) : 0;   
           TSGRY += (s.SGRY !== undefined && s.SGRY !== null) ? (s.SGRY * 1) : 0;
           TANNAPOORNA += (s.ANNAPOORNA !== undefined && s.ANNAPOORNA !== null) ? (s.ANNAPOORNA * 1) : 0;
           TPMGKY_AAY += (s.PMGKY_AAY !== undefined && s.PMGKY_AAY !== null) ? (s.PMGKY_AAY * 1) : 0;
           TPMGKY_PRIORITY += (s.PMGKY_PRIORITY !== undefined && s.PMGKY_PRIORITY !== null) ? (s.PMGKY_PRIORITY * 1) : 0;
           TFORTIFIED_KERNELS += (s.FORTIFIED_KERNELS !== undefined && s.FORTIFIED_KERNELS !== null) ? (s.FORTIFIED_KERNELS * 1) : 0;
           TANB += (s.ANB !== undefined && s.ANB !== null) ? (s.ANB * 1) : 0;
           TTotalFreeRice += (s.TotalFreeRice !== undefined && s.TotalFreeRice !== null) ? (s.TotalFreeRice * 1) : 0;
          });
         this.Grandtotaldata.push(
             {
              RGNAME: 'Grand Total',
               NMP: TNMP,               
               SGRY: TSGRY,
               ANNAPOORNA: TANNAPOORNA,
               PMGKY_AAY: TPMGKY_AAY,
               PMGKY_PRIORITY: TPMGKY_PRIORITY,
               FORTIFIED_KERNELS: TFORTIFIED_KERNELS,
               ANB: TANB,
               TotalFreeRice: TTotalFreeRice,                   
             });
           }
           caculatetotal4(){
            this.Grandtotaldata =[];
            let sno = 0;
            let TFromMRM = 0;         
            let TFromHulling = 0;
            let TWithinRegion = 0;
            let TOtherRegion = 0;
            let TExcess= 0;
            let TPacking= 0;
            let TBLG= 0;
            let TSalesReturn= 0;
            let TOthers= 0;
            let TTotalOtherReceipts= 0;
            this.Grandtotaldata = this.hoqtyacabstractcomData
             this.Grandtotaldata.forEach(s => {
               sno += 1;
               s.SlNo = sno;
               TFromMRM += (s.FromMRM !== undefined && s.FromMRM !== null) ? (s.FromMRM * 1) : 0;   
               TFromHulling += (s.FromHulling !== undefined && s.FromHulling !== null) ? (s.FromHulling * 1) : 0;
               TWithinRegion += (s.WithinRegion !== undefined && s.WithinRegion !== null) ? (s.WithinRegion * 1) : 0;
               TOtherRegion += (s.OtherRegion !== undefined && s.OtherRegion !== null) ? (s.OtherRegion * 1) : 0;
               TExcess += (s.Excess !== undefined && s.Excess !== null) ? (s.Excess * 1) : 0;
               TPacking += (s.Packing !== undefined && s.Packing !== null) ? (s.Packing * 1) : 0;
               TBLG += (s.BLG !== undefined && s.BLG !== null) ? (s.BLG * 1) : 0;
               TSalesReturn += (s.SalesReturn !== undefined && s.SalesReturn !== null) ? (s.SalesReturn * 1) : 0;
               TOthers += (s.Others !== undefined && s.Others !== null) ? (s.Others * 1) : 0;
               TTotalOtherReceipts += (s.TotalOtherReceipts !== undefined && s.TotalOtherReceipts !== null) ? (s.TotalOtherReceipts * 1) : 0;
              });
             this.Grandtotaldata.push(
                 {
                  RGNAME: 'Grand Total',
                  FromMRM: TFromMRM,               
                  FromHulling: TFromHulling,
                  WithinRegion: TWithinRegion,
                  OtherRegion: TOtherRegion,
                  Excess: TExcess,
                  Packing: TPacking,
                  BLG: TBLG,
                  SalesReturn: TSalesReturn, 
                  Others: TOthers,
                  TotalOtherReceipts: TTotalOtherReceipts,                   
                 });
               }
               caculatetotal5(){
                this.Grandtotaldata =[];
                let sno = 0;
                let TCRS = 0;         
                let TCOOP = 0;
                let TSPLPDS_CRS = 0;
                let TSPLPDS_COOP = 0;
                let TPOLICE= 0;
                let TPTMGR_NMP= 0;
                let TBULK_QTY= 0;
                let TICDS= 0;
                let TCREDIT= 0;
                let TOAP= 0;
                let TSrilanka= 0;
                let TFlood= 0;
                let TTenderSales= 0;
                let TNPHH_SSR= 0;
                let TAAY= 0;
                let TTotalSales= 0;              
                this.Grandtotaldata = this.hoqtyacabstractcomData
                 this.Grandtotaldata.forEach(s => {
                   sno += 1;
                   s.SlNo = sno;
                   TCRS += (s.CRS !== undefined && s.CRS !== null) ? (s.CRS * 1) : 0;   
                   TCOOP += (s.COOP !== undefined && s.COOP !== null) ? (s.COOP * 1) : 0;
                   TSPLPDS_CRS += (s.SPLPDS_CRS !== undefined && s.SPLPDS_CRS !== null) ? (s.SPLPDS_CRS * 1) : 0;
                   TSPLPDS_COOP += (s.SPLPDS_COOP !== undefined && s.SPLPDS_COOP !== null) ? (s.SPLPDS_COOP * 1) : 0;
                   TPOLICE += (s.POLICE !== undefined && s.POLICE !== null) ? (s.POLICE * 1) : 0;
                   TPTMGR_NMP += (s.PTMGR_NMP !== undefined && s.PTMGR_NMP !== null) ? (s.PTMGR_NMP * 1) : 0;
                   TBULK_QTY += (s.BULK_QTY !== undefined && s.BULK_QTY !== null) ? (s.BULK_QTY * 1) : 0;
                   TICDS += (s.ICDS !== undefined && s.ICDS !== null) ? (s.ICDS * 1) : 0;
                   TCREDIT += (s.CREDIT !== undefined && s.CREDIT !== null) ? (s.CREDIT * 1) : 0;
                   TOAP += (s.OAP !== undefined && s.OAP !== null) ? (s.OAP * 1) : 0;
                   TSrilanka += (s.Srilanka !== undefined && s.Srilanka !== null) ? (s.Srilanka * 1) : 0;
                   TFlood += (s.Flood !== undefined && s.Flood !== null) ? (s.Flood * 1) : 0;
                   TTenderSales += (s.TenderSales !== undefined && s.TenderSales !== null) ? (s.TenderSales * 1) : 0;
                   TNPHH_SSR += (s.NPHH_SSR !== undefined && s.NPHH_SSR !== null) ? (s.NPHH_SSR * 1) : 0;
                   TAAY += (s.AAY !== undefined && s.AAY !== null) ? (s.AAY * 1) : 0;
                   TTotalSales += (s.TotalSales !== undefined && s.TotalSales !== null) ? (s.TotalSales * 1) : 0;
                  });
                 this.Grandtotaldata.push(
                     {
                      RGNAME: 'Grand Total',
                      CRS: TCRS,               
                      COOP: TCOOP,
                      SPLPDS_CRS: TSPLPDS_CRS,
                      SPLPDS_COOP: TSPLPDS_COOP,
                      POLICE: TPOLICE,
                      PTMGR_NMP: TPTMGR_NMP,
                      BULK_QTY: TBULK_QTY,
                      ICDS: TICDS, 
                      CREDIT: TCREDIT,
                      OAP: TOAP,     
                      Srilanka: TSrilanka, 
                      Flood: TFlood,
                      TenderSales: TTenderSales,       
                      NPHH_SSR :TNPHH_SSR,
                      AAY:TAAY,
                      TotalSales:TTotalSales,                            
                     });
                   }
                   caculatetotal6(){
                    this.Grandtotaldata =[];
                    let sno = 0;
                    let TNMP = 0;         
                    let TSGRY = 0;
                    let TANNAPOORNA = 0;
                    let TPMGKY_AAY = 0;
                    let TPMGKY_PRIORITY= 0;
                    let TANB= 0;
                    let TFORTIFIED_KERNELS= 0;
                    let TTotalFreeRice= 0;
                    this.Grandtotaldata = this.hoqtyacabstractcomData
                     this.Grandtotaldata.forEach(s => {
                       sno += 1;
                       s.SlNo = sno;
                       TNMP += (s.NMP !== undefined && s.NMP !== null) ? (s.NMP * 1) : 0;   
                       TSGRY += (s.SGRY !== undefined && s.SGRY !== null) ? (s.SGRY * 1) : 0;
                       TANNAPOORNA += (s.ANNAPOORNA !== undefined && s.ANNAPOORNA !== null) ? (s.ANNAPOORNA * 1) : 0;
                       TPMGKY_AAY += (s.PMGKY_AAY !== undefined && s.PMGKY_AAY !== null) ? (s.PMGKY_AAY * 1) : 0;
                       TPMGKY_PRIORITY += (s.PMGKY_PRIORITY !== undefined && s.PMGKY_PRIORITY !== null) ? (s.PMGKY_PRIORITY * 1) : 0;
                       TFORTIFIED_KERNELS += (s.FORTIFIED_KERNELS !== undefined && s.FORTIFIED_KERNELS !== null) ? (s.FORTIFIED_KERNELS * 1) : 0;
                       TANB += (s.ANB !== undefined && s.ANB !== null) ? (s.ANB * 1) : 0;
                       TTotalFreeRice += (s.TotalFreeRice !== undefined && s.TotalFreeRice !== null) ? (s.TotalFreeRice * 1) : 0;
                      });
                     this.Grandtotaldata.push(
                         {
                          RGNAME: 'Grand Total',
                          NMP: TNMP,               
                          SGRY: TSGRY,
                          ANNAPOORNA: TANNAPOORNA,
                          PMGKY_AAY: TPMGKY_AAY,
                          PMGKY_PRIORITY: TPMGKY_PRIORITY,
                          FORTIFIED_KERNELS: TFORTIFIED_KERNELS,
                          ANB: TANB,
                          TotalFreeRice: TTotalFreeRice
                         });
                       }
                       caculatetotal7(){
                        this.Grandtotaldata =[];
                        let sno = 0;
                        let TToProcessMRM = 0;         
                        let TWithinRegion = 0;
                        let TOtherRegion = 0;
                        let TWriteOff = 0;
                        let TPacking= 0;
                        let TBLG= 0;
                        let TPurchaseReturn= 0;
                        let TOtherIssues = 0;
                        let TToProcessHULLING = 0;
                        let TTotalOtherIssuses = 0;

                         this.Grandtotaldata = this.hoqtyacabstractcomData
                         this.Grandtotaldata.forEach(s => {
                           sno += 1;
                           s.SlNo = sno;
                           TToProcessMRM += (s.ToProcessMRM !== undefined && s.ToProcessMRM !== null) ? (s.ToProcessMRM * 1) : 0;   
                           TWithinRegion += (s.WithinRegion !== undefined && s.WithinRegion !== null) ? (s.WithinRegion * 1) : 0;
                           TOtherRegion += (s.OtherRegion !== undefined && s.OtherRegion !== null) ? (s.OtherRegion * 1) : 0;
                           TWriteOff += (s.WriteOff !== undefined && s.WriteOff !== null) ? (s.WriteOff * 1) : 0;
                           TPacking += (s.Packing !== undefined && s.Packing !== null) ? (s.Packing * 1) : 0;
                           TBLG += (s.BLG !== undefined && s.BLG !== null) ? (s.BLG * 1) : 0;
                           TPurchaseReturn += (s.PurchaseReturn !== undefined && s.PurchaseReturn !== null) ? (s.PurchaseReturn * 1) : 0;
                           TOtherIssues += (s.OtherIssues !== undefined && s.OtherIssues !== null) ? (s.OtherIssues * 1) : 0;
                           TToProcessHULLING += (s.ToProcessHULLING !== undefined && s.ToProcessHULLING !== null) ? (s.ToProcessHULLING * 1) : 0;
                           TTotalOtherIssuses += (s.TotalOtherIssuses !== undefined && s.TotalOtherIssuses !== null) ? (s.TotalOtherIssuses * 1) : 0;
                           
                          });
                         this.Grandtotaldata.push(
                             {
                              RGNAME: 'Grand Total',
                              ToProcessMRM: TToProcessMRM,               
                              WithinRegion: TWithinRegion,
                              OtherRegion: TOtherRegion,
                              WriteOff: TWriteOff,
                              Packing: TPacking,
                              BLG: TBLG,
                              PurchaseReturn: TPurchaseReturn,
                              OtherIssues: TOtherIssues,
                              ToProcessHULLING: TToProcessHULLING,
                              TotalOtherIssuses:TTotalOtherIssuses
                             });
                           }
                      }
  




