
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { Dropdown, SelectItem } from 'primeng/primeng';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { isNull } from 'util';

@Component({
  selector: 'app-tenderregionrep',
  templateUrl: './tenderregionrep.component.html',
  styleUrls: ['./tenderregionrep.component.css']
})

export class TenderregionrepComponent implements OnInit {
  canShowMenu: any;
  roleId: any;
  data: any;
  TenderDetailsReptCols: any;
  TenderDetailsReptData: any[] = [];
  regions: any;
  loggedInRCode: string;
  maxDate: Date;
  username: any;
  regionOptions: SelectItem[];
  RCode: any;
  godownOptions: SelectItem[];
  GCode: any;
  commodityOptions: SelectItem[];
  ITCode: any;
  // FromDate: any;
  // ToDate: any;
  loading: boolean;
  RepNo:any;
  // @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.TenderDetailsReptCols = this.tableConstants.TenderDetailsReptCols;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    // let godownSelection = [];
    let commoditySelection = [];
    switch (item) {
      // case 'reg':
      //   this.regions = this.roleBasedService.regionsData;
      //   if (type === 'enter') {
      //     this.regionPanel.overlayVisible = true;
      //   }
      //   if (this.roleId === 1) {
      //     if (this.regions !== undefined) {
      //       this.regions.forEach(x => {
      //         regionSelection.push({ 'label': x.RName, 'value': x.RCode });
      //       });
      //       this.regionOptions = regionSelection;
      //       this.regionOptions.unshift({ label: 'All', value: 'All' });
      //     }
      //   } else {
      //     if (this.regions !== undefined) {
      //       this.regions.forEach(x => {
      //         if (x.RCode === this.loggedInRCode) {
      //           regionSelection.push({ 'label': x.RName, 'value': x.RCode });
      //         }
      //       });
      //       this.regionOptions = regionSelection;
      //     }
      //   }
      //   break;
      // case 'gd':
      //   if (type === 'enter') { this.godownPanel.overlayVisible = true; }
      //   this.data = this.roleBasedService.instance;
      //   if (this.data !== undefined) {
      //     this.data.forEach(x => {
      //       if (x.RCode === this.RCode) {
      //         godownSelection.push({ 'label': x.GName, 'value': x.GCode });
      //       }
      //     });
      //     this.godownOptions = godownSelection;
      //     if (this.roleId !== 3) {
      //       this.godownOptions.unshift({ label: 'All', value: 'All' });
      //       this.godownOptions.unshift({ label: '-', value: '-' });
      //     }
      //   } else {
      //     this.godownOptions = godownSelection;
      //   }
      //   break;
      case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
            }
          })
        }
        break;
    }
  }

  onView() {
    this.onResetTable();
    // this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'ITCode': this.ITCode,         
      'RoleId': this.roleId,
    };
    this.restAPIService.getByParameters(PathConstants.SECTION_DAILY_TENDERT_GET, params).subscribe(res => {
      if (res !== undefined && res !== null ) {
        this.TenderDetailsReptData = res.Table;
        var hash = Object.create(null),
        abstract = [];
       this.TenderDetailsReptData.forEach(function (o) {
        var key = ['PartyName'].map(function (k) { return o[k]; }).join('|');
        if (!hash[key]) {
            hash[key] = {            
              AssignedQty:0, Quantity:0, PartyName: o.PartyName,
              
            };
            abstract.push(hash[key]);            
          }
  
            ['AssignedQty'].forEach(function (k) { hash[key][k] = (o[k] * 1); });
            ['Quantity'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
                 
          });
          this.TenderDetailsReptData.push({ PartyName: 'Abstract Details'});
          abstract.forEach(x => {           
            this.TenderDetailsReptData.push({ OrderNumber:'Total',PartyName: x.PartyName,
              AssignedQty: (x.AssignedQty * 1), Quantity: (x.Quantity * 1),
            
            });;
          })
          const result = this.calculateGrandTotal(this.TenderDetailsReptData);
            if (result) {
              this.TenderDetailsReptData.push(result);
            }
      this.loading = false;
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

  // onDateSelect() {
  //   this.checkValidDateSelection();
  //   this.onResetTable('');
  // }

  // checkValidDateSelection() {
  //   if (this.FromDate !== undefined && this.ToDate !== undefined && this.FromDate !== '' && this.ToDate !== '') {
  //     let selectedFromDate = this.FromDate.getDate();
  //     let selectedToDate = this.ToDate.getDate();
  //     let selectedFromMonth = this.FromDate.getMonth();
  //     let selectedToMonth = this.ToDate.getMonth();
  //     let selectedFromYear = this.FromDate.getFullYear();
  //     let selectedToYear = this.ToDate.getFullYear();
  //     if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
  //       (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
  //       (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
  //       this.messageService.clear();
  //       this.messageService.add({
  //         key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000
  //         , summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
  //       });
  //       this.FromDate = this.ToDate = '';
  //     }
  //     return this.FromDate, this.ToDate;
  //   }
  // }

  onResetTable() {
    
    this.TenderDetailsReptData = [];
  }

  onClose() {
    this.messageService.clear('t-err');
  }

  onAbstract() { 
//   var hash = Object.create(null),
//   abstract = [];
// this.sectionDailyStatementPartyData.forEach(function (o) {
//   var key = ['PartyName'].map(function (k) { return o[k]; }).join('|');
//   if (!hash[key]) {
//     hash[key] = {            
//       Allotment:0, OnTheDayQty:0, PartyName: o.PartyName,
//       UpToTheDayQty: 0,  Balance: 0,
//     };
//     abstract.push(hash[key]);
//   }
  
//   ['Allotment'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
//   ['OnTheDayQty'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
//   ['UpToTheDayQty'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
//   ['Balance'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
  
// });
// //this.TaxReportData.push({ CompanyName: 'Total' });
// abstract.forEach(x => {
//   this.sectionDailyStatementPartyData.push({ PartyName: x.PartyName,
//   Allotment: (x.Allotment * 1).toFixed(2), OnTheDayQty: (x.OnTheDayQty * 1).toFixed(2),
//   UpToTheDayQty: (x.UpToTheDayQty * 1).toFixed(2), Balance: (x.Balance * 1).toFixed(2)
//   });;
//})

}



calculateGrandTotal(data): any {
  let AssignedQty = 0; 
  let Quantity = 0; 
 

  // this.sectionDailyStatementPartyData.push({ PartyName: x.PartyName,
  //   Allotment: (x.Allotment * 1).toFixed(2), OnTheDayQty: (x.OnTheDayQty * 1).toFixed(2),
  //   UpToTheDayQty: (x.UpToTheDayQty * 1).toFixed(2), Balance: (x.Balance * 1).toFixed(2)
  var item = {};
  data.forEach(x => {
    if (x.OrderNumber === 'Total') {     
      AssignedQty += (x.AssignedQty * 1);
      Quantity += (x.Quantity * 1);
      
      item = {
        OrderNumber: 'GRAND TOTAL',      
        AssignedQty: AssignedQty,
        Quantity: Quantity, 
        
      };
    } 
    
  })
  return item;
}
}



