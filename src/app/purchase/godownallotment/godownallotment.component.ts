import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { Dropdown } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-godownallotment',
  templateUrl: './godownallotment.component.html',
  styleUrls: ['./godownallotment.component.css']
})
export class GodownAllotmentComponent implements OnInit {
  canShowMenu: boolean;
  regionOptions: SelectItem[];
  RCode: any;
  orderNoOptions: SelectItem[];
  OrderNo: any;
  Commodity: any;
  AllottedQty: any;
  maxDate: Date = new Date();
  PartyName: any;
  Quantity: any;
  showErrMsg: boolean;
  Remarks: any;
  godownOptions: SelectItem[];
  GCode: string;
  showDialog: boolean;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  gdnTenderAllotmentCols: any;
  gdnTenderAllotmentData: any = [];
  data = [];
  loggedInRCode: string;
  isViewed: boolean;
  regions: any;
  roleId: any;
  regionSelection: any = [];
  RegAllotmentID: any;
  GodownAllotementID: any;
  Spell: any;
  spellCode: any;
  regionalPartyData: any[] = [];
  regionalPartyCols: any;
  isDataAvailable: boolean;
  orderNoSelection: any = [];
  commodityCode: any;
  partyCode: any;
  blockScreen: boolean;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('orderNum', { static: false }) oredrNoPanel: Dropdown;
  @ViewChild('spell', { static: false }) spellPanel: Dropdown;
  @ViewChild('f', { static: false }) form: NgForm;

  constructor(private authService: AuthService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants, private datepipe: DatePipe, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regionalPartyCols = this.tableConstants.RegionalTenderAllotmentColumns;
  }

  onSelect(id, type) {
    let godownSelection = [];
    let regionSelection = [];
    switch (id) {
      case 'order':
        this.orderNoOptions = [];
        if (type == 'tab') {
          this.oredrNoPanel.overlayVisible = true;
        }
        this.orderNoOptions = this.orderNoSelection;
        break;
      case 'reg':
        if (type === 'tab') {
          this.regionPanel.overlayVisible = true;
        }
        this.regions = this.roleBasedService.regionsData;
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null });
          } else { this.regionOptions = regionSelection; }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null });
          } else { this.regionOptions = regionSelection; }
        }
        break;
      case 'gd':
        if (type === 'tab') {
          this.godownPanel.overlayVisible = true;
        }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          this.godownOptions.unshift({ label: '-select-', value: null });
        } else {
          this.godownOptions = godownSelection;
        }
        break;
    }
  }

  resetFields(type) {
    if (type === 'R') {
      this.OrderNo = null;
      this.orderNoOptions = [];
      this.orderNoSelection = [];
      this.regionalPartyData = [];
      if (this.RCode.value !== undefined && this.RCode.value !== null) {
        const params = new HttpParams().set('Type', '2')
          .append('value', (this.RCode.value !== undefined && this.RCode.value !== null) ? this.RCode.value : null);
        this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_ORDER_NO_GET, params).subscribe(res => {
          if (res !== undefined && res !== null) {
            if (res.length !== 0) {
              res.forEach(o => {
                this.orderNoSelection.push({ label: o.OrderNumber, value: o.OrderNumber });
              })
              this.orderNoSelection.unshift({ label: '-select-', value: null });
            } else {
              this.orderNoSelection = [];
              this.orderNoSelection.unshift({ label: '-select-', value: null });
            }
          }
        })
      }
    }
  }

  onChangeList() {
    if (this.OrderNo !== undefined && this.OrderNo !== null && this.RCode !== null && this.RCode !== null) {
      let rcode = (this.RCode.value !== null && this.RCode.value !== undefined) ? this.RCode.value : null;
      const params = {
        'OrderNo': (this.OrderNo !== undefined) ? this.OrderNo : '',
        'Code': rcode,
        'Type': 2,
        'PartyCode': ''
      }
      this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_GODOWN_GET, params).subscribe(data => {
        if (data !== undefined && data !== null) {
          if (data.length !== 0) {
            data.forEach(d => {
              d.SpellName = 'Spell' + d.Spell;
            })
            this.regionalPartyData = data;
          } else {
            this.messageService.clear();
            this.messageService.add({
              key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
              detail: 'No party found for selected order number in this region !'
            });
          }
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
            detail: 'No party found for selected order number in this region !'
          });
        }
      })
    } else {
      this.regionalPartyData = [];
    }
  }

  onEdit(selectedItem) {
    if (selectedItem !== null && selectedItem !== undefined) {
      this.showDialog = true;
      this.RegAllotmentID = selectedItem.RegAllotementID;
      this.Commodity = selectedItem.ITDescription;
      this.commodityCode = selectedItem.ITCode;
      this.Spell = selectedItem.SpellName;
      this.spellCode = selectedItem.Spell;
      this.PartyName = selectedItem.PartyName;
      this.partyCode = selectedItem.PartyCode;
      this.AllottedQty = (selectedItem.Quantity * 1); //from region wise order details
      this.onView();
    }
  }

  calculateQty(value) {
    if (value !== null && value !== undefined) {
      const qty = (value * 1);
      const allottedQty = (this.AllottedQty * 1);
      if (qty > allottedQty) {
        this.Quantity = null;
        this.showErrMsg = true;
      } else {
        this.showErrMsg = false;
      }
    }
  }

  onView() {
    if (this.RCode !== undefined && this.RCode !== null && this.OrderNo !== undefined && this.OrderNo !== null) {
      this.gdnTenderAllotmentData = [];
      this.showDialog = true;
      const params = new HttpParams().set('Code', this.RCode.value)
        .append('Type', '1').append('OrderNo', this.OrderNo).append('PartyCode', this.partyCode);
      this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_GODOWN_GET, params).subscribe(data => {
        if (data !== null && data !== undefined) {
          if (data.length !== 0) {
            this.gdnTenderAllotmentCols = this.tableConstants.TenderAllotmentToGodownCols;
            data.forEach(d => {
              d.SpellName = 'Spell' + d.Spell;
            });
            this.gdnTenderAllotmentData = data;
          } else {
            this.gdnTenderAllotmentData = [];
            this.messageService.clear();
            this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: 'No existing record of godown allotment for selection region !' });
          }
        } else {
          this.gdnTenderAllotmentData = [];
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: 'No existing record of godown allotment for selection region !' });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
        detail: 'Please select Region, Godown & OrderNo. to view allotted godown data !'
      });
    }
  }

  onSelectedRow(data, index) {
    this.isViewed = true;
    this.isDataAvailable = false;
    this.RCode = { label: data.Region, value: data.RCode };
    this.regionOptions = [{ label: data.Region, value: data.RCode }];
    this.Quantity = (data.Quantity * 1);
    this.Remarks = data.Remarks;
    this.GCode = data.GCode;
    this.godownOptions = [{ label: data.Godown, value: data.GCode }];
    this.OrderNo = data.OrderNumber;
    this.orderNoOptions = [{ label: data.OrderNumber, value: data.OrderNumber }];
    this.spellCode = data.Spell;
    this.Spell = 'Spell' + data.Spell;
    this.AllottedQty = (data.TotalQuantity * 1);
    this.Commodity = data.ITDescription;
    this.commodityCode = data.ITCode;
    this.PartyName = data.PartyName;
    this.partyCode = data.PartyCode;
    this.GodownAllotementID = data.GodownAllotementID;
    this.RegAllotmentID = data.RegAllotementID;
    this.gdnTenderAllotmentData.splice(index, 1);
  }

  onSave() {
    var allowSave: boolean = false;
    var validationMsg: string = '';
    if (this.gdnTenderAllotmentData.length !== 0) {
      let totalGodownAssignedQty = 0;
      this.gdnTenderAllotmentData.forEach(g => {
        totalGodownAssignedQty += (g.Quantity * 1);
      })
      let enteredQty = (this.Quantity !== undefined && this.Quantity !== null) ? (this.Quantity * 1) : 0;
      totalGodownAssignedQty = (totalGodownAssignedQty + enteredQty);
      if (totalGodownAssignedQty > this.AllottedQty) {
        allowSave = false;
        validationMsg = 'Cannot assign quantity greater than alloted quantity of ' + this.AllottedQty;
      } else {
        allowSave = true;
      }
    } else if ((this.Quantity * 1) > this.AllottedQty) {
      allowSave = false;
      validationMsg = 'Cannot assign quantity greater than alloted quantity of ' + this.AllottedQty;
    } else {
      allowSave = true;
      validationMsg = 'Please check if you have entered all values correctly !';
    }
    if (allowSave) {
      this.blockScreen = true;
      const GodownAllotementID = (this.GodownAllotementID !== undefined && this.GodownAllotementID !== null) ? this.GodownAllotementID : 0;
      const params = {
        'GodownAllotementID': GodownAllotementID,
        'RegAllotementID': this.RegAllotmentID,
        'OrderNumber': this.OrderNo,
        'PartyCode': this.partyCode,
        'GCode': (this.GCode !== undefined && this.GCode !== null) ? this.GCode : null,
        'RCode': (this.RCode !== undefined && this.RCode !== null) ? this.RCode.value : null,
        'ITCode': (this.commodityCode !== undefined && this.commodityCode !== null) ? this.commodityCode : null,
        'Spell': this.spellCode,
        'Quantity': this.Quantity,
        'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : ''
      }
      this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_GODOWN_POST, params).subscribe(res => {
        if (res.Item1) {
          this.blockScreen = false;
          this.onView();
          this.onClear(2);
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
        } else {
          this.blockScreen = false;
          this.isViewed = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }, (err: HttpErrorResponse) => {
        this.blockScreen = false;
        if (err.status === 0 || err.status === 400) {
          this.isViewed = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.isViewed = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: validationMsg });
    }
  }

  onClear(type) {
    if (type === 1) {
      //  this.form.controls.region_name.reset();
      //  this.form.controls.order_Num.reset();
      this.form.controls.commdity_type.reset();
      this.form.controls.total_qty.reset();
      this.form.controls.party_name.reset();
      this.form.controls.godown_name.reset();
      this.form.controls.assigning_qty.reset();
      this.form.controls.remarks_text.reset();
      this.form.controls.spell_cycle.reset();
      this.form.form.markAsUntouched();
      this.form.form.markAsPristine();
      this.showDialog = false;
      this.showErrMsg = false;
      this.gdnTenderAllotmentData = [];
      // this.OrderNo = null; this.orderNoOptions = [];
      this.Commodity = null; this.commodityCode = null; this.AllottedQty = null;
      //  this.RCode = null; this, this.regionOptions = [];
      this.GCode = null; this.godownOptions = [];
      this.Remarks = null; this.Quantity = null;
      this.RegAllotmentID = null; this.GodownAllotementID = null;
      this.isViewed = false; this.isDataAvailable = false;
      this.spellCode = null; this.Spell = null;
      this.PartyName = null; this.partyCode = null;
      //  this.regionalPartyData = [];
    } else {
      this.godownOptions = [];
      this.GCode = null;
      this.Remarks = null;
      this.Quantity = 0;
      this.form.controls.godown_name.reset();
      this.form.controls.assigning_qty.reset();
      this.form.controls.remarks_text.reset();
    }
  }

}
