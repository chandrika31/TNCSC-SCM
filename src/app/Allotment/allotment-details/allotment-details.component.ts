import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Dropdown, SelectItem, MessageService } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { saveAs } from 'file-saver';
import { TableConstants } from 'src/app/constants/tableconstants';
import * as _ from 'lodash';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-allotment-details',
  templateUrl: './allotment-details.component.html',
  styleUrls: ['./allotment-details.component.css']
})
export class AllotmentDetailsComponent implements OnInit {
  roleId: any;
  canShowMenu: boolean;
  month: any;
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  year: any;
  username: any;
  curMonth: any;
  AllotmentCols: any = [];
  AllotmentData: any = [];
  totalRecords: number;
  allotmentCommodity = [];
  itemList = [];
  societyData: any;
  allotmentDetails: Array<Allotment> = [];
  regionName: string;
  godownName: string;
  GCode: string;
  RCode: string;
  errMsg: string;
  loading: boolean;
  disableSave: boolean;
  regions: any;
  data: any;
  regionOptions: SelectItem[];
  loggedInRCode: any;
  godownOptions: SelectItem[];
  blockScreen: boolean;
  count: number;
  cell_range: number;
  totalRow: any;
  totalRice: number = 0;
  totalSugar: number = 0;
  totalWheat: number = 0;
  totalDhall: number = 0;
  totalPoil: number = 0;
  abstractCols: any;
  abstractData: any = [];
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('fileSelector', { static: false }) fileSelector: ElementRef;
  @ViewChild('dt', { static: false }) table: Table;
  @ViewChild('abstract', { static: false }) abstract_table: Table;


  constructor(private authService: AuthService, private datepipe: DatePipe, private restAPIService: RestAPIService,
    private messageService: MessageService, private roleBasedService: RoleBasedService,
    private tableConstants: TableConstants) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.username = JSON.parse(this.authService.getCredentials());
    this.curMonth = ((new Date().getMonth() + 1) <= 9) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.regions = this.roleBasedService.getRegions();
    this.data = this.roleBasedService.getInstance();
    this.restAPIService.get(PathConstants.ALLOTMENT_COMMODITY_MASTER).subscribe(data => {
      this.allotmentCommodity = data;
    })
    this.count = 0;
  }

  onSelect(selectedItem, type) {
    let regionSelection = [];
    let godownSelection = [];
    let yearArr: any = [];
    const range = 3;
    switch (selectedItem) {
      case 'y':
        if (type === 'tab') {
          this.yearPanel.overlayVisible = true;
        }
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          } else if (i === 1) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          } else {
            yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null });
        break;
      case 'm':
        if (type === 'tab') {
          this.monthPanel.overlayVisible = true;
        }
        this.monthOptions = [{ 'label': 'Jan', 'value': '01' },
        { 'label': 'Feb', 'value': '02' }, { 'label': 'Mar', 'value': '03' }, { 'label': 'Apr', 'value': '04' },
        { 'label': 'May', 'value': '05' }, { 'label': 'Jun', 'value': '06' }, { 'label': 'Jul', 'value': '07' },
        { 'label': 'Aug', 'value': '08' }, { 'label': 'Sep', 'value': '09' }, { 'label': 'Oct', 'value': '10' },
        { 'label': 'Nov', 'value': '11' }, { 'label': 'Dec', 'value': '12' }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null });
        break;
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
        if (type === 'tab') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
          break;
        }
    }
  }

  getAllotmentDetails() {
    this.onClear('');
    this.fileSelector.nativeElement.value = null;
    if (this.GCode !== undefined && this.GCode !== null && this.month !== null && this.month !== undefined
      && ((this.month.value !== undefined && this.month.value !== null)
        || (this.curMonth !== undefined && this.curMonth !== null)) && this.year !== null
      && this.year !== undefined && this.curMonth !== null && this.curMonth !== undefined) {
      const params = new HttpParams().set('GCode', this.GCode)
        .append('AMonth', (this.month.value !== undefined && this.month.value !== null) ? this.month.value : this.curMonth)
        .append('AYear', this.year);
      this.loading = true;
      this.restAPIService.getByParameters(PathConstants.ALLOTMENT_BALANCE_GET, params).subscribe(res => {
        if (res.length !== 0 && res !== undefined && res !== null) {
          this.AllotmentCols = this.tableConstants.AllotmentDetailsCols;
          let sno = 1;
          res.forEach(x => {
            x.SlNo = sno;
            x.Quantity = (x.Quantity * 1).toFixed(3);
            sno += 1;
          })
          this.AllotmentData = res;
          this.totalRecords = res.length;
          this.constructAbstract(this.AllotmentData, 2);
          this.loading = false;
          this.disableSave = true;
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        }
      }, (err: HttpErrorResponse) => {
        this.disableSave = false;
        this.loading = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    }
  }

  onSort() {
    let sno = 1;
    this.AllotmentData.forEach(x => {
      x.SlNo = sno;
      sno += 1;
    })
  }

  uploadData(event) {
    this.onClear('');
    this.blockScreen = true;
    let filesData = event.target.files;
    if (this.GCode !== undefined && this.GCode !== null) {
      const params = { 'Type': 2, 'GCode': this.GCode }
      this.restAPIService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(data => {
        this.societyData = data.filter(x => {
          const acsCode: string = (x.ACSCode !== null) ? x.ACSCode : '';
          const flag: string = (x.Activeflag !== null) ? x.Activeflag : '';
          return (acsCode.trim() !== '' && flag.trim() === 'A');
        });
        let sortedArray = _.sortBy(this.societyData, 'ACSCode');
        this.societyData = sortedArray;
        if (checkfile(filesData[0])) {
          this.parseExcel(filesData[0]);
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
            life: 5000, detail: this.errMsg
          });
        }
      })
    }
  }

  parseExcel(file) {
    this.blockScreen = true;
    let reader = new FileReader();
    reader.onload = (e) => {
      let data = (<any>e.target).result;
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      let sheetName: any = workbook.SheetNames[0];
      let worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
      // removing unwanted rows from imported excel
      for (let i = 1; i <= 15; i++) {
        if (worksheet['A' + i] !== undefined && (worksheet['A' + i].t === 's' && worksheet['A' + i].v === '#')) {
          this.cell_range = i;
          break;
        } else {
          delete worksheet['A' + i];
          continue;
        }
      }
      //setting worksheet ref number according to imported excel
      var ref_len = worksheet["!ref"].length;
      var ref = 'A' + this.cell_range + worksheet["!ref"].slice(2, ref_len);
      worksheet["!ref"] = ref;

      let XL_row_object = XLSX.utils.sheet_to_json(worksheet, { blankrows: false });
      let headers = get_header_row(worksheet, this.cell_range - 1);
      let isValid = this.checkValidHeaders(headers);
      if (isValid.result) {
        headers.forEach(c => {
          this.AllotmentCols.push({ header: c, field: c, width: '180px' });
        })
        let json_object = JSON.stringify(XL_row_object);
        // bind the parse excel file data to Grid  
        let JSONdata = JSON.parse(json_object);
        // trim the space in json key and value
        JSONdata = JSONdata.filter(x => {
          if (x['#'] === 'Total') { this.totalRow = x; }
          return x['#'] !== 'Total';
        })
        const excelData = trimObj(JSONdata);
        if (excelData[1]['Godown Code'] == this.GCode) {
          this.disableSave = false;
          this.totalRecords = excelData.length;
          this.AllotmentData = excelData;
          const objLen = this.AllotmentCols.length - 6;
          for (let obj of this.AllotmentData) {
            var itemList = [];
            for (let key in obj) {
              obj['FPSName'] = obj['FPS Name'];
              if (key !== 'FPS Code' && key !== '#' && key !== 'Taluk' && key !== 'FPS Name'
                && key !== 'Godown Name' && key !== 'Godown Code') {
                let j = 0;
                this.allotmentCommodity.forEach(c => {
                  const len = key.length;
                  const trim: string = key.slice(len - 5, len);
                  const val: string = key.replace(trim, '').replace(/\s/g, '').toUpperCase();
                  const commodity: string = c.Acommname;
                  // if (j <= objLen) {
                  if (val === commodity.replace(/\s/g, '')) {
                    itemList.push({ ITCode: c.Acommcode, ITName: val, Quantity: obj[key] });
                  }
                  this.itemList = itemList;
                  obj['ItemList'] = this.itemList; //adding new key value pair
                  // j += 1;
                  //  } 
                  // else {
                  //     this.itemList = [];
                  //   }
                })
              }
            }
            this.itemList = [];
          }
          this.constructData(this.AllotmentData);
          console.log('data', this.AllotmentData);
          if (this.totalRow !== undefined && this.totalRow !== null) {
            this.constructAbstract(this.totalRow, 1);
          } else {
            this.constructAbstract(this.AllotmentData, 3);
          }
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
            life: 5000, detail: StatusMessage.GodownCodeMismatch
          });
        }
      } else {
        let missingFields: string = '';
        this.blockScreen = false;
        if (isValid.res.length > 1) {
          isValid.res.forEach((x, index) => {
            missingFields += (index + 1) + '.' + x.toUpperCase() + ' ';
          })
          missingFields += ' columns are missing!';
        } else {
          missingFields = isValid.res[0].toUpperCase() + ' column is missing!';
        }
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
          life: 5000, detail: missingFields
        });
      }
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  };

  constructAbstract(data, type) {
    this.abstractData.length = 0;
    if (data !== undefined && data !== null) {
      //  this.abstract_table.reset();
      if (type === 1) {
        for (let key in data) {
          var item: string = key.toUpperCase();
          if (item.indexOf('RICE') !== -1 || item.indexOf('SUGAR') !== -1 || item.indexOf('WHEAT') !== -1 ||
            item.indexOf('DHALL') !== -1 || item.indexOf('PALMOIL') !== -1) {
            if (item.includes('RICE', 0)) {
              this.totalRice += (data[key] * 1);
            } else if (item.includes('SUGAR', 0)) {
              this.totalSugar += (data[key] * 1);
            } else if (item.includes('WHEAT', 0)) {
              this.totalWheat += (data[key] * 1);
            } else if (item.includes('DHALL', 0)) {
              this.totalDhall += (data[key] * 1);
            } else if (item.includes('PALMOIL', 0)) {
              this.totalPoil += (data[key] * 1);
            } else {
              console.log('No matching key found!');
            }
          } else {
            console.log('No matching key found!');
          }
        }
      } else if (type === 2) {
        data.forEach(item => {
          var commodity: string = item['Commodity'].toUpperCase();
          if (commodity.includes('RICE', 0)) {
            this.totalRice += (item['Quantity'] * 1);
          } else if (commodity.includes('SUGAR', 0)) {
            this.totalSugar += (item['Quantity'] * 1);
          } else if (commodity.includes('WHEAT', 0)) {
            this.totalWheat += (item['Quantity'] * 1);
          } else if (commodity.includes('DHALL', 0)) {
            this.totalDhall += (item['Quantity'] * 1);
          } else if (commodity.includes('PALMOIL', 0)) {
            this.totalPoil += (item['Quantity'] * 1);
          } else {
            console.log('No matching key found!');
          }
        })
      } else {
        data.forEach(obj => {
          for (let key in obj) {
            var item: string = key.toUpperCase();
            if (item.indexOf('RICE') !== -1 || item.indexOf('SUGAR') !== -1 || item.indexOf('WHEAT') !== -1 ||
              item.indexOf('DHALL') !== -1 || item.indexOf('PALMOIL') !== -1) {
              if (item.includes('RICE', 0)) {
                this.totalRice += (obj[key] * 1);
              } else if (item.includes('SUGAR', 0)) {
                this.totalSugar += (obj[key] * 1);
              } else if (item.includes('WHEAT', 0)) {
                this.totalWheat += (obj[key] * 1);
              } else if (item.includes('DHALL', 0)) {
                this.totalDhall += (obj[key] * 1);
              } else if (item.includes('PALMOIL', 0)) {
                this.totalPoil += (obj[key] * 1);
              } else {
                console.log('No matching key found!');
              }
            } else {
              console.log('No matching key found!');
            }
          }
        })
      }
      this.abstractCols = [
        { header: 'Commodity', field: 'commodity' },
        { header: 'Quantity', field: 'qty' }
      ];
      this.abstractData.push(
        { commodity: 'RICE', qty: (this.totalRice * 1).toFixed(3) },
        { commodity: 'WHEAT', qty: (this.totalWheat * 1).toFixed(3) },
        { commodity: 'SUGAR', qty: (this.totalSugar * 1).toFixed(3) },
        { commodity: 'DHALL', qty: (this.totalDhall * 1).toFixed(3) },
        { commodity: 'PALMOIL', qty: (this.totalPoil * 1).toFixed(3) }
      )
    }
  }

  checkValidHeaders(headers): any {
    let result: boolean;
    let tempArr = ['Taluk', 'FPS Code', 'FPS Name', 'Godown Name', 'Godown Code'];
    if (headers !== undefined && headers !== null && headers.length !== 0) {
      let res = tempArr.filter(f => !headers.includes(f));
      if (res.length !== 0) {
        result = false;
      } else {
        result = true;
      }
      return { result, res }
    }
  }

  constructData(data) {
    let records = 1;
    data.forEach(i => {
      if (records <= data.length) {
        this.allotmentDetails.push({
          Type: 2, FPSName: i['FPS Name'], FPSCode: i['FPS Code'],
          ItemList: i.ItemList, GCode: this.GCode, RCode: this.RCode, Taluk: i.Taluk,
          AllotmentMonth: (this.month.value !== undefined) ? this.month.value : this.curMonth, AllotmentYear: this.year
        });
        records += 1;
      }
    })
    this.blockScreen = false;
  }

  set_cell_range(range) {
    this.cell_range = range;
  }

  onResetTable(item) {
    if (item === 'reg') {
      this.GCode = null;
    }
    this.AllotmentData = [];
    this.table.reset();
    this.totalRecords = 0;
    if (this.abstractData.length !== 0) { this.abstract_table.reset(); }
  }

  onSave() {
    this.disableSave = true;
    this.blockScreen = true;
    const params = JSON.stringify(this.allotmentDetails);
    this.restAPIService.post(PathConstants.ALLOTMENT_QUANTITY_POST, this.allotmentDetails).subscribe((res: any) => {
      if (res.Item1) {
        this.count += 1;
        if (this.count <= 1) {
          this.allotmentDetails.forEach(x => {
            if ((x.AllotmentMonth * 1) === 12) {
              x.AllotmentMonth = '01';
              x.AllotmentYear = (x.AllotmentYear * 1) + 1;
            } else {
              const AllotmentMonth = (x.AllotmentMonth * 1) + 1;
              x.AllotmentMonth = ((AllotmentMonth * 1) <= 9) ? '0' + AllotmentMonth : AllotmentMonth;
            }
          })
          this.onSave();
          this.blockScreen = false;
          this.onClear('1');
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
        }
      } else {
        this.blockScreen = false;
        this.disableSave = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.disableSave = false;
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.disableSave = false;
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }

  onClear(type) {
    if (type === '1') {
      this.RCode = null; this.GCode = null;
      this.regionOptions = [];
      this.godownOptions = [];
      this.disableSave = false;
      this.loading = false;
      this.blockScreen = false;
      this.fileSelector.nativeElement.value = null;
    }
    this.AllotmentData = [];
    this.AllotmentCols.length = 0;
    this.table.reset();
    this.totalRecords = 0;
    this.curMonth = ((new Date().getMonth() + 1) <= 9) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.totalRice = 0; this.totalWheat = 0;
    this.totalSugar = 0; this.totalDhall = 0;
    this.totalPoil = 0;
    if (this.abstractData.length !== 0) { this.abstract_table.reset(); }
    this.abstractData.length = 0;
  }

  downloadSample() {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=UTF-8';
    const path = "../../assets/Sample_Allotment/Sample_Excel.xlsx";
    const filename = 'Sample_Excel' + ".xlsx";
    saveAs(path, filename);
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}

function checkfile(sender) {
  var validExts = new Array(".xlsx", ".xls");
  var fileName: string = sender.name;
  var fileExt = fileName.substring(fileName.lastIndexOf('.'));
  if (validExts.indexOf(fileExt) < 0) {
    this.errMsg = "Invalid file selected, valid files are of " +
      validExts.toString() + " types.";
    return false;
  }
  else return true;
}

function get_header_row(sheet, cell_range) {
  var headers = [];
  var range = XLSX.utils.decode_range(sheet['!ref']);
  var C = range.s.r;
  var R = (cell_range !== undefined) ? cell_range : range.s.r; /* start in the first row */
  /* walk every column in the range */
  for (C = range.s.c; C <= range.e.c; ++C) {
    var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
    var hdr: any = "HEADER " + C; // <-- replace with your desired default 
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    hdr = hdr.trimRight();
    headers.push(hdr);
  }
  return headers;
}

function trimObj(obj) {
  if (!Array.isArray(obj) && typeof obj != 'object') return obj;
  return Object.keys(obj).reduce(function (acc, key) {
    acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
    return acc;
  }, Array.isArray(obj) ? [] : {});
}

function ec(r, c) {
  return XLSX.utils.encode_cell({ r: r, c: c });
}

function delete_row(ws, row_index) {
  var variable = XLSX.utils.decode_range(ws["!ref"])
  for (var R = row_index; R < variable.e.r; ++R) {
    for (var C = variable.s.c; C <= variable.e.c; ++C) {
      ws[ec(R, C)] = ws[ec(R + 1, C)];
    }
  }
  variable.e.r--
  ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
}

// function set_cell_range(range) {
//   let cell_range = range;
// }
// function get_cell_range() {
//   return cell_range;
// }

export interface Allotment {
  Type: number;
  FPSName: string;
  FPSCode: string;
  GCode: string;
  RCode: string;
  Taluk: string;
  AllotmentMonth: any;
  AllotmentYear: any;
  ItemList: any[];
}

export interface ItemList {
  ITCode: any;
  ITName: any;
  Quantity: any;
}


