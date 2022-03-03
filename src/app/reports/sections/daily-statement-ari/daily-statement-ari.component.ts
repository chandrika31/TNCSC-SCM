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


@Component({
  selector: 'app-daily-statement-ari',
  templateUrl: './daily-statement-ari.component.html',
  styleUrls: ['./daily-statement-ari.component.css']
})
export class DailyStatementAriComponent implements OnInit {
  canShowMenu: any;
  roleId: any;
  data: any;
  sectionDailyStatementARICols: any;
  sectionDailyStatementARIData: any[] = [];
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
  FromDate: any;
  ToDate: any;
  loading: boolean;
  RepNo:any;
  // @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  // @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.sectionDailyStatementARICols = this.tableConstants.SectionDailyStatementARIReportColumns;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
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
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.FromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.ToDate, 'MM/dd/yyyy'),
      'RoleId': this.roleId,
      'ITCode': this.ITCode,
      'RCode': 'All',
      'GCode': 'All',
      'RepNo': 1
    };
    this.restAPIService.post(PathConstants.SECTION_DAILY_PARTYSTATEMENT_POST, params).subscribe(res => {
      if (res !== undefined && res !== null ) {
        this.sectionDailyStatementARIData = res.Table;
        var hash = Object.create(null),
        abstract = [];
       this.sectionDailyStatementARIData.forEach(function (o) {
        var key = ['Region'].map(function (k) { return o[k]; }).join('|');
        if (!hash[key]) {
            hash[key] = {            
              Allotment:0, OnTheDayRQty:0, Region: o.Region,
              UpToTheDayRQty: 0,  Balance: 0, OnTheDayIQty:0,UpToTheDayIQty:0,AvailableStock:0
            };
            abstract.push(hash[key]);            
          }
  
            ['Allotment'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
            ['OnTheDayRQty'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
            ['UpToTheDayRQty'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
            ['Balance'].forEach(function (k) { hash[key][k] += (o[k] * 1); });   
            ['OnTheDayIQty'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
            ['UpToTheDayIQty'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
            ['AvailableStock'].forEach(function (k) { hash[key][k] += (o[k] * 1); });         
          });
          this.sectionDailyStatementARIData.push({ Region: '',Godown: 'Abstract Details'});
          abstract.forEach(x => {           
            this.sectionDailyStatementARIData.push({ Region: x.Region,Godown: 'Total',
            Allotment: (x.Allotment * 1), OnTheDayRQty: (x.OnTheDayRQty * 1),
            UpToTheDayRQty: (x.UpToTheDayRQty * 1), Balance: (x.Balance * 1),
            OnTheDayIQty: (x.OnTheDayIQty * 1),
            UpToTheDayIQty: (x.UpToTheDayIQty * 1), AvailableStock: (x.AvailableStock * 1)
            });;
          })
          const result = this.calculateGrandTotal(this.sectionDailyStatementARIData);
            if (result) {
              this.sectionDailyStatementARIData.push(result);
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
    this.sectionDailyStatementARIData = [];
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
  let Allotment = 0; 
  let OnTheDayRQty = 0; 
  let UpToTheDayRQty = 0;  
  let Balance = 0; 
  let OnTheDayIQty = 0; 
  let UpToTheDayIQty = 0;  
  let AvailableStock = 0; 

  // this.sectionDailyStatementPartyData.push({ PartyName: x.PartyName,
  //   Allotment: (x.Allotment * 1).toFixed(2), OnTheDayQty: (x.OnTheDayQty * 1).toFixed(2),
  //   UpToTheDayQty: (x.UpToTheDayQty * 1).toFixed(2), Balance: (x.Balance * 1).toFixed(2)
  var item = {};
  data.forEach(x => {
    if (x.Godown === 'Total') {     
      Allotment += (x.Allotment * 1);
      OnTheDayRQty += (x.OnTheDayRQty * 1);
      UpToTheDayRQty += (x.UpToTheDayRQty * 1);
      Balance += (x.Balance * 1);   
      OnTheDayIQty += (x.OnTheDayIQty * 1);
      UpToTheDayIQty += (x.UpToTheDayIQty * 1);
      AvailableStock += (x.AvailableStock * 1);   
      item = {
        Region: 'GRAND TOTAL',      
        Allotment: Allotment,
        OnTheDayRQty: OnTheDayRQty, 
        UpToTheDayRQty: UpToTheDayRQty,
        Balance: Balance, 
        OnTheDayIQty: OnTheDayIQty ,
        UpToTheDayIQty: UpToTheDayIQty ,
        AvailableStock: AvailableStock    
      };
    } 
    
  })
  return item;
}
}


