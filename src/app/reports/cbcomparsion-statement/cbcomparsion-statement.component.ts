import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/observable/from';
import 'rxjs/Rx';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-cbcomparsion-statement',
  templateUrl: './cbcomparsion-statement.component.html',
  styleUrls: ['./cbcomparsion-statement.component.css']
})
export class CBComparsionStatementComponent implements OnInit {
  loading: boolean;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  RCode: any;
  GCode: any;
  canShowMenu: boolean;
  data = [];
  Date: any = new Date();
  roleId: any;
  disbaleGodown: boolean;
  maxDate: Date = new Date();
  loggedInRCode: string;
  regions: any;
  CBCols: any;
  CBData: any = [];
  CBManualData: any = [];
  rowGroupMetadata: any;
  showRowGroupMD: boolean;
  Records: any;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApiService: RestAPIService, private authService: AuthService,
    private messageService: MessageService, private excelService: ExcelService,
    private tableConstants: TableConstants, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.rowGroupMetadata = {};
    this.showRowGroupMD = true;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.CBCols = this.tableConstants.CBFromTNDailyStatementColumns;
    this.onLoadManualCBData();
  }

  onLoadManualCBData() {
    this.loading = true;
    this.restApiService.get(PathConstants.CB_FROM_TN_DAILY).subscribe(res => {
      if (res.Table !== null && res.Table !== undefined && res.Table.length !== 0) {
        this.CBManualData = res.Table;
        this.onLoadCBData();
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        this.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onLoadCBData() {
    this.CBData.length = 0;
    this.loading = true;
    const params = new HttpParams().set('Date', this.datepipe.transform(this.Date, 'MM/dd/yyyy'))
      .append('GCode', 'All').append('RCode', 'All').append('RoleId', this.roleId);
    this.restApiService.getByParameters(PathConstants.CB_STATEMENT_REPORT, params).subscribe((response: any) => {
      if (response !== undefined && response !== null && response.length !== 0) {
        this.CBData = response;
        this.CBData.forEach(record => {
          let boiledRiceTotal = ((record.BOILED_RICE_A !== null && record.BOILED_RICE_A !== undefined) ? (record.BOILED_RICE_A * 1) : 0) +
            ((record.BOILED_RICE_A_HULLING !== null && record.BOILED_RICE_A_HULLING !== undefined) ? (record.BOILED_RICE_A_HULLING * 1) : 0) +
            ((record.BOILED_RICE_C_HULLING !== null && record.BOILED_RICE_C_HULLING !== undefined) ? (record.BOILED_RICE_C_HULLING * 1) : 0) +
            ((record.BOILED_RICE_COMMON !== null && record.BOILED_RICE_COMMON !== undefined) ? (record.BOILED_RICE_COMMON * 1) : 0);
          record.boiledRice = (boiledRiceTotal !== 0) ? boiledRiceTotal.toFixed(3) : boiledRiceTotal;
          record.boiledRice = (record.boiledRice * 1);
          let rawRiceTotal = ((record.RAW_RICE_A !== null && record.RAW_RICE_A !== undefined) ? (record.RAW_RICE_A * 1) : 0) +
            ((record.RAW_RICE_A_HULLING !== null && record.RAW_RICE_A_HULLING !== undefined) ? (record.RAW_RICE_A_HULLING * 1) : 0) +
            ((record.RAW_RICE_COM_HULLING !== null && record.RAW_RICE_COM_HULLING !== undefined) ? (record.RAW_RICE_COM_HULLING * 1) : 0) +
            ((record.RAW_RICE_COMMON !== null && record.RAW_RICE_COMMON !== undefined) ? (record.RAW_RICE_COMMON * 1) : 0);
          record.rawRice = (rawRiceTotal !== 0) ? rawRiceTotal.toFixed(3) : rawRiceTotal;
          record.rawRice = (record.rawRice * 1);
          let kanadaToorDhallTotal = ((record.Candian_Yellow_lentil_TD !== null && record.Candian_Yellow_lentil_TD !== undefined) ?
            record.Candian_Yellow_lentil_TD * 1 : 0) + ((record.YELLOW_LENTAL_US !== null && record.YELLOW_LENTAL_US !== undefined) ?
              record.YELLOW_LENTAL_US * 1 : 0);
          record.kanadaToorDhall = (kanadaToorDhallTotal !== 0) ? kanadaToorDhallTotal.toFixed(3) : kanadaToorDhallTotal;
          record.kanadaToorDhall = (record.kanadaToorDhall * 1);
          let toorDhallTotal = ((record.TOOR_DHALL !== null && record.TOOR_DHALL !== undefined) ?
            record.TOOR_DHALL * 1 : 0) + ((record.TUR_ARUSHA !== null && record.TUR_ARUSHA !== undefined) ?
              record.TUR_ARUSHA * 1 : 0) + ((record.TUR_LEMON !== null && record.TUR_LEMON !== undefined) ?
                record.TUR_LEMON * 1 : 0) + ((record.LIARD_LENTIL_GREEN !== null && record.LIARD_LENTIL_GREEN !== undefined) ?
                  record.LIARD_LENTIL_GREEN * 1 : 0);
          record.toorDhall = (toorDhallTotal !== 0) ? toorDhallTotal.toFixed(3) : toorDhallTotal;
          record.toorDhall = (record.toorDhall * 1);
          let uridDhallTotal = ((record.URAD_FAQ !== null && record.URAD_FAQ !== undefined) ?
            record.URAD_FAQ * 1 : 0) + ((record.URAD_SQ !== null && record.URAD_SQ !== undefined) ?
              record.URAD_SQ * 1 : 0) + ((record.URID_DHALL !== null && record.URID_DHALL !== undefined) ?
                record.URID_DHALL * 1 : 0) + ((record.URID_DHALL_FAQ !== null && record.URID_DHALL_FAQ !== undefined) ?
                  record.URID_DHALL_FAQ * 1 : 0) + ((record.URID_DHALL_SPLIT !== null && record.URID_DHALL_SPLIT !== undefined) ?
                    record.URID_DHALL_SPLIT * 1 : 0) + ((record.URID_DHALL_SQ !== null && record.URID_DHALL_SQ !== undefined) ?
                      record.URID_DHALL_SQ * 1 : 0);
          record.uridDhall = (uridDhallTotal !== 0) ? uridDhallTotal.toFixed(3) : uridDhallTotal;
          record.uridDhall = (record.uridDhall * 1);
          let palmoilTotal = ((record.PALMOLIEN_OIL !== null && record.PALMOLIEN_OIL !== undefined) ?
            record.PALMOLIEN_OIL * 1 : 0) + ((record.PALMOLIEN_POUCH !== null && record.PALMOLIEN_POUCH !== undefined) ?
              record.PALMOLIEN_POUCH * 1 : 0);
          record.palmoil = (palmoilTotal !== 0) ? palmoilTotal.toFixed(3) : palmoilTotal;
          record.palmoil = (record.palmoil * 1);
          let totalRice = boiledRiceTotal + rawRiceTotal;
          let totalDhall = toorDhallTotal + kanadaToorDhallTotal;
          record.totalRice = (totalRice !== 0) ? totalRice.toFixed(3) : totalRice;
          record.totalRice = (record.totalRice * 1);
          record.totalDhall = (totalDhall !== 0) ? totalDhall.toFixed(3) : totalDhall;
          record.totalDhall = (record.totalDhall * 1);
          record.WHEAT = (record.WHEAT !== 0) ? record.WHEAT.toFixed(3) : record.WHEAT;
          record.WHEAT = (record.WHEAT * 1);
          record.SUGAR = (record.SUGAR !== 0) ? record.SUGAR.toFixed(3) : record.SUGAR;
          record.SUGAR = (record.SUGAR * 1);
          for (let i = 0; i < this.CBManualData.length; i++) {
            if (record.RCode === this.CBManualData[i].RCode && record.GCode === this.CBManualData[i].GCode) {
              record.ManualBoiledRice = (this.CBManualData[i].BR !== null && this.CBManualData[i].BR !== undefined) ?
                (this.CBManualData[i].BR * 1).toFixed(3) : 0;
              record.ManualBoiledRice = (record.ManualBoiledRice * 1);
              record.ManualRawRice = (this.CBManualData[i].RR !== null && this.CBManualData[i].RR !== undefined) ?
                (this.CBManualData[i].RR * 1).toFixed(3) : 0;
              record.ManualRawRice = (record.ManualRawRice * 1);
              record.ManualTotalRice = ((this.CBManualData[i].BR * 1) + (this.CBManualData[i].RR * 1)).toFixed(3);
              record.ManualTotalRice = (record.ManualTotalRice * 1);
              record.ManualSugar = (this.CBManualData[i].SUGAR !== null && this.CBManualData[i].SUGAR !== undefined) ?
                (this.CBManualData[i].SUGAR * 1).toFixed(3) : 0;
              record.ManualSugar = (record.ManualSugar * 1);
              record.ManualWheat = (this.CBManualData[i].WHEAT !== null && this.CBManualData[i].WHEAT !== undefined) ?
                (this.CBManualData[i].WHEAT * 1).toFixed(3) : 0;
              record.ManualWheat = (record.ManualWheat * 1);
              record.ManualPOil = (this.CBManualData[i].POIL !== null && this.CBManualData[i].POIL !== undefined) ?
                (this.CBManualData[i].POIL * 1) : 0;
              record.ManualToorDhall = (this.CBManualData[i].TD !== null && this.CBManualData[i].TD !== undefined) ?
                (this.CBManualData[i].TD * 1).toFixed(3) : 0;
              record.ManualToorDhall = (record.ManualToorDhall * 1);
              record.ManualUridDhall = (this.CBManualData[i].UD !== null && this.CBManualData[i].UD !== undefined) ?
                (this.CBManualData[i].UD * 1).toFixed(3) : 0;
              record.ManualUridDhall = (record.ManualUridDhall * 1);
              record.ManualCYLDhall = (this.CBManualData[i].CYL !== null && this.CBManualData[i].CYL !== undefined) ?
                (this.CBManualData[i].CYL * 1).toFixed(3) : 0;
              record.ManualCYLDhall = (record.ManualCYLDhall * 1);
              record.ManualTotalDhall = ((this.CBManualData[i].TD * 1) + (this.CBManualData[i].CYL * 1)).toFixed(3);
              record.ManualTotalDhall = (record.ManualTotalDhall * 1);
              break;
            } else {
              continue;
            }
          }
        });
        this.CBData.splice(this.CBData.length, 0, '');
        let groupedData;
        Rx.Observable.from(this.CBData)
          .groupBy((x: any) => x.RNAME) // using groupBy from Rxjs
          .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
          .map(g => {// mapping 
            return {
              RNAME: g[0].RNAME,//take the first name because we grouped them by name
              boiledRice: _.sumBy(g, 'boiledRice'), // using lodash to sum quantity
              rawRice: _.sumBy(g, 'rawRice'),
              totalRice: _.sumBy(g, 'totalRice'),
              SUGAR: _.sumBy(g, 'SUGAR'),
              WHEAT: _.sumBy(g, 'WHEAT'),
              toorDhall: _.sumBy(g, 'toorDhall'),
              kanadaToorDhall: _.sumBy(g, 'kanadaToorDhall'),
              totalDhall: _.sumBy(g, 'totalDhall'),
              uridDhall: _.sumBy(g, 'uridDhall'),
              palmoil: _.sumBy(g, 'palmoil'),
              manualBoiledRice: _.sumBy(g, 'ManualBoiledRice'),
              manualRawRice: _.sumBy(g, 'ManualRawRice'),
              manualTotalRice: _.sumBy(g, 'ManualTotalRice'),
              manualSugar: _.sumBy(g, 'ManualSugar'),
              manualWheat: _.sumBy(g, 'ManualWheat'),
              manualPOil: _.sumBy(g, 'ManualPOil'),
              manualToorDhall: _.sumBy(g, 'ManualToorDhall'),
              manualUridDhall: _.sumBy(g, 'ManualUridDhall'),
              manualCYLDhall: _.sumBy(g, 'ManualCYLDhall'),
              manualTotalDhall: _.sumBy(g, 'ManualTotalDhall')
            }
          })
          .toArray() //.toArray because I guess you want to loop on it with ngFor      
          .do(sum => console.log('sum:', sum)) // just for debug
          .subscribe(d => groupedData = d);
        let index = 0;
        let item;
        for (let i = 0; i < this.CBData.length; i++) {
          if (this.CBData[i].RNAME !== groupedData[index].RNAME) {
            item = {
              TNCSName: 'TOTAL',
              boiledRice: (groupedData[index].boiledRice * 1).toFixed(3),
              rawRice: (groupedData[index].rawRice * 1).toFixed(3),
              totalRice: (groupedData[index].totalRice * 1).toFixed(3),
              totalDhall: (groupedData[index].totalDhall * 1).toFixed(3),
              toorDhall: (groupedData[index].toorDhall * 1).toFixed(3),
              kanadaToorDhall: (groupedData[index].kanadaToorDhall * 1).toFixed(3),
              kanadaToorDhallTotal: (groupedData[index].kanadaToorDhallTotal * 1).toFixed(3),
              SUGAR: (groupedData[index].SUGAR * 1).toFixed(3), WHEAT: (groupedData[index].WHEAT * 1).toFixed(3),
              uridDhall: (groupedData[index].uridDhall * 1).toFixed(3),
              palmoil: (groupedData[index].palmoil * 1), manualPOil: (groupedData[index].manualPOil !== null && groupedData[index].manualPOil !== undefined) ? groupedData[index].manualPOil : 0,
              ManualBoiledRice: (groupedData[index].manualBoiledRice * 1).toFixed(3),
              ManualSugar: (groupedData[index].manualSugar * 1).toFixed(3),
              ManualRawRice: (groupedData[index].manualRawRice * 1).toFixed(3),
              ManualTotalRice: (groupedData[index].manualTotalRice * 1).toFixed(3),
              ManualWheat: (groupedData[index].manualWheat * 1).toFixed(3),
              ManualToorDhall: (groupedData[index].manualToorDhall * 1).toFixed(3),
              ManualUridDhall: (groupedData[index].uridDhall * 1).toFixed(3),
              ManualTotalDhall: (groupedData[index].manualTotalDhall * 1).toFixed(3),
              ManualCYLDhall: (groupedData[index].manualCYLDhall * 1).toFixed(3),
              ManualPOil: (groupedData[index].manualPOil * 1)
            };
            this.CBData.splice(i, 0, item);
            index += 1;
          }
        }
        for (let i = 0; i < this.CBData.length; i++) {
          let rowData = this.CBData[i];
          let RNAME = rowData.RNAME;
          if (i == 0) {
            this.rowGroupMetadata[RNAME] = { index: 0, size: 1 };
          }
          else {
            let previousRowData = this.CBData[i - 1];
            let previousRowGroup = previousRowData.RNAME;
            if (RNAME === previousRowGroup)
              this.rowGroupMetadata[RNAME].size++;
            else
              this.rowGroupMetadata[RNAME] = { index: i, size: 1 };
          }
        }
        let gt_BR = 0; let gt_RR = 0; let gt_TR = 0; let gt_SU = 0;
        let gt_WH = 0; let gt_TD = 0; let gt_UR = 0; let gt_CYL = 0;
        let gt_TLD = 0; let gt_PO = 0; let gt_MBR = 0; let gt_MRR = 0;
        let gt_MTR = 0; let gt_MTD = 0; let gt_MUD = 0; let gt_MTLD = 0;
        let gt_MCYL = 0; let gt_MPO = 0; let gt_MSU = 0; let gt_MWH = 0;
        this.CBData.forEach(x => {
          if (x.TNCSName === 'TOTAL') {
            gt_BR += (x.boiledRice * 1);
            gt_RR += (x.rawRice * 1);
            gt_TR += (x.totalRice * 1);
            gt_SU += (x.SUGAR * 1);
            gt_WH += (x.WHEAT * 1);
            gt_CYL += (x.kanadaToorDhall * 1);
            gt_PO += (x.palmoil * 1);
            gt_TD += (x.toorDhall * 1);
            gt_UR += (x.uridDhall * 1);
            gt_TLD += (x.totalDhall * 1);
            gt_MBR += (x.ManualBoiledRice * 1);
            gt_MRR += (x.ManualRawRice * 1);
            gt_MTR += (x.ManualTotalRice * 1);
            gt_MSU += (x.ManualSugar * 1);
            gt_MWH += (x.ManualWheat * 1);
            gt_MCYL += (x.ManualCYLDhall * 1);
            gt_MTD += (x.ManualToorDhall * 1);
            gt_MUD += (x.ManualUridDhall * 1);
            gt_MTLD += (x.ManualTotalDhall * 1);
            gt_MPO += (x.ManualPOil * 1);
          }
        })
        this.CBData.push({
          TNCSName: 'GRAND-TOTAL',
          boiledRice: gt_BR.toFixed(3), rawRice: gt_RR.toFixed(3),
          totalRice: gt_TR.toFixed(3), toorDhall: gt_TD.toFixed(3),
          kanadaToorDhall: gt_CYL.toFixed(3), kanadaToorDhallTotal: gt_CYL.toFixed(3),
          uridDhall: gt_UR.toFixed(3), totalDhall: gt_TLD.toFixed(3),
          SUGAR: gt_SU.toFixed(3), WHEAT: gt_WH.toFixed(3),
          palmoil: gt_PO, ManualBoiledRice: gt_MBR.toFixed(3),
          ManualRawRice: gt_MRR.toFixed(3), ManualTotalRice: gt_MTR.toFixed(3),
          ManualWheat: gt_MWH.toFixed(3), ManualSugar: gt_MSU.toFixed(3),
          ManualToorDhall: gt_MTD.toFixed(3), ManualUridDhall: gt_MUD.toFixed(3),
          ManualTotalDhall: gt_MTLD.toFixed(3), ManualCYLDhall: gt_MCYL.toFixed(3),
          ManualPOil: gt_MPO
        })
        this.Records = this.CBData.slice(0);
        this.loading = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        this.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onFilterTable(event) {
    if (event.target.value !== null && event.target.value !== undefined && event.target.value.trim() !== '') {
      this.table.filterGlobal(event.target.value, 'contains');
      this.showRowGroupMD = false;
    } else {
      this.showRowGroupMD = true;
      this.table.reset();
      this.CBData = this.Records.slice(0);
      for (let i = 0; i < this.CBData.length; i++) {
        let rowData = this.CBData[i];
        let RNAME = rowData.RNAME;
        if (i == 0) {
          this.rowGroupMetadata[RNAME] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.CBData[i - 1];
          let previousRowGroup = previousRowData.RNAME;
          if (RNAME === previousRowGroup)
            this.rowGroupMetadata[RNAME].size++;
          else
            this.rowGroupMetadata[RNAME] = { index: i, size: 1 };
        }
      }
    }
  }

  public getColor(name: string): string {
    return name === 'TOTAL' ? "#ECECEC" : ((name === 'GRAND-TOTAL') ? "D4D4D4" : "white");
  }

  public setFloat(name): string {
    return name === 'TNCSName' ? 'left' : 'right';
  }
}
