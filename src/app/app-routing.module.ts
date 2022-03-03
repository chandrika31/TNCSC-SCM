import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DailyStockStatementComponent } from './reports/dailystockstatement/dailystockstatement.component';
import { GodownDataComponent } from './masters/godown-data/godown-data.component';
import { CRSDataComponent } from './masters/crsdata/crsdata.component';
import { MRMDataComponent } from './masters/mrmdata/mrmdata.component';
import { AADSDataComponent } from './masters/aadsdata/aadsdata.component';
import { HullingAgenciesComponent } from './masters/hulling-agencies/hulling-agencies.component';
import { AuthGuard } from './shared-services/auth.guard';
import { FCIDataComponent } from './masters/fcidata/fcidata.component';
import { RegionsDataComponent } from './masters/regions-data/regions-data.component';
import { SchemesComponent } from './masters/schemes/schemes.component';
import { DepositorsComponent } from './masters/depositors/depositors.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StockPurchaseComponent } from './purchase/stockpurchase/stockpurchase.component';
import { RegionAllotmentComponent } from './purchase/regionallotment/regionallotment.component';
import { GodownAllotmentComponent } from './purchase/godownallotment/godownallotment.component';
import { CBStatementComponent } from './reports/cb-statement/cb-statement.component';
import { StockReceiptComponent } from './Documents/stock-receipt/stock-receipt.component';
import { IssueReceiptComponent } from './Documents/issue-receipt/issue-receipt.component';
import { DeliveryReceiptComponent } from './Documents/delivery-receipt/delivery-receipt.component';
import { TruckReceiptComponent } from './Documents/truck-receipt/truck-receipt.component';
import { StockIssueRegisterComponent } from './reports/stock-issue-register/stock-issue-register.component';
import { TruckMemoRegisterComponent } from './reports/truck-memo-register/truck-memo-register.component';
import { StockReceiptRegisterComponent } from './reports/stock-receipt-register/stock-receipt-register.component';
import { DeliveryOrderRegisterComponent } from './reports/delivery-order-register/delivery-order-register.component';
import { CommodityReceiptComponent } from './reports/commodity-receipt/commodity-receipt.component';
import { SchemeReceiptComponent } from './reports/scheme-receipt/scheme-receipt.component';
import { TransactionReceiptComponent } from './reports/transaction-receipt/transaction-receipt.component';
import { CommodityIssueMemoComponent } from './reports/commodity-issue-memo/commodity-issue-memo.component';
import { SchemeIssueMemoComponent } from './reports/scheme-issue-memo/scheme-issue-memo.component';
import { WriteOffComponent } from './reports/write-off/write-off.component';
import { HullingDetailsComponent } from './reports/hulling-details/hulling-details.component';
import { TruckToRegionComponent } from './reports/TransferAc/truck-to-region/truck-to-region.component';
import { TruckFromRegionComponent } from './reports/TransferAc/truck-from-region/truck-from-region.component';
import { ReceiptHOPurchaseComponent } from './reports/purchase-AC/receipt-ho-purchase/receipt-ho-purchase.component';
import { ReceiptRONOPurchaseComponent } from './reports/purchase-AC/receipt-rono-purchase/receipt-rono-purchase.component';
import { ReceiptROPurchaseComponent } from './reports/purchase-AC/receipt-ro-purchase/receipt-ro-purchase.component';
import { CustomerDetailsComponent } from './reports/sales-AC/issue-memo/customer-details/customer-details.component';
import { SocietyWiseCommodityAbstractComponent } from './reports/sales-AC/issue-memo/society-wise-commodity-abstract/society-wise-commodity-abstract.component';
import { GunnyGuGrComponent } from './reports/gunny-gu-gr/gunny-gu-gr.component';
// import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { TruckTransitComponent } from './reports/truck-transit/truck-transit.component';
import { SocietMasterComponent } from './Documents/Master/society-master/societ-master.component';
import { OpeningBalanceDetailsComponent } from './Documents/Master/opening-balance-details/opening-balance-details.component';
import { DepositorCustomerMasterComponent } from './Documents/Master/depositor-customer-master/depositor-customer-master.component';
import { RateMasterComponent } from './Documents/Master/rate-master/rate-master.component';
import { ShopSocietUpdateMasterComponent } from './Documents/Master/shopSocietyUpdate/shopSocietyUpdate.component';
import { ItemMasterModificationComponent } from './Documents/Master/item-master-modification/item-master-modification.component';
import { CustomerListComponent } from './Documents/Master/customer-list/customer-list.component';
import { OpeningBalanceCurrentYearComponent } from './Documents/Master/opening-balance-current-year/opening-balance-current-year.component';
import { UserMasterComponent } from './Documents/Master/user-master/user-master.component';
import { StockstatementreportComponent } from './reports/stockstatementreport/stockstatementreport.component';
import { TransactionStatusComponent } from './reports/transaction-status/transaction-status.component';
import { StackCardOpeningEntryComponent } from './Documents/StackCard/stack-card-opening-entry/stack-card-opening-entry.component';
import { DailyDocumentsComponent } from './reports/DailyDocument/daily-document-receipt/daily-documents.component';
import { DailyDocumentIssueComponent } from './reports/DailyDocument/daily-document-issue/daily-document-issue.component';
import { StackCardOpeningComponent } from './reports/StackCard/stack-card-opening/stack-card-opening.component';
import { StackCardComponent } from './reports/StackCard/stack-card/stack-card.component';
import { GodownProfileComponent } from './godown-profile/godown-profile.component';
import { PackingMasterComponent } from './UserMaster/packing-master/packing-master.component';
import { OtherMasterComponent } from './UserMaster/other-master/other-master.component';
import { CncCorrectionComponent } from './UserMaster/cnc-correction/cnc-correction.component';
import { SchemeCommodityComponent } from './Documents/Master/scheme-commodity/scheme-commodity.component';
import { SocietyMasterNewComponent } from './Documents/Master/society-master-new/society-master-new.component';
import { OtherSchemesComponent } from './reports/DeliveryOrderReport/Other-schemes/other-schemes.component';
import { AllSchemeComponent } from './reports/DeliveryOrderReport/All-scheme/all-scheme.component';
import { SocietyAbstractComponent } from './reports/DeliveryOrderReport/society-abstract/society-abstract.component';
import { DemandDraftComponent } from './reports/DeliveryOrderReport/demand-draft/demand-draft.component';
import { MarginAmountComponent } from './reports/DeliveryOrderReport/margin-amount/margin-amount.component';
import { DDChequeEntryComponent } from './Documents/DD-cheque-entry/DD-cheque-entry.component';
import { IssuerMasterComponent } from './Documents/Master/IssuerMaster/Issuer-master.component';
import { ReceiptSchemeComponent } from './reports/Quantity/receipt-scheme/receipt-scheme.component';
import { IssueSchemeComponent } from './reports/Quantity/IssueScheme/issue-scheme/issue-scheme.component';
import { IssueSchemeCrsComponent } from './reports/Quantity/IssueScheme/issue-scheme-crs/issue-scheme-crs.component';
import { IssueSchemeCoOpComponent } from './reports/Quantity/IssueScheme/issue-scheme-co-op/issue-scheme-co-op.component';
import { IssueTypeAbstractComponent } from './reports/Quantity/issue-type-abstract/issue-type-abstract.component';
import { ReceiptTypeAbstractComponent } from './reports/Quantity/receipt-type-abstract/receipt-type-abstract.component';
import { TruckMemoSchemeComponent } from './reports/Quantity/truckmemo-scheme/truckmemo-scheme.component';
import { QuantityDetailCommodityComponent } from './reports/Quantity/quantity-detail-commodity/quantity-detail-commodity.component';
import { SplpdsComponent } from './reports/DeliveryOrderReport/splpds/splpds.component';
import { AnnapoornaComponent } from './reports/DeliveryOrderReport/annapoorna/annapoorna.component';
import { OapComponent } from './reports/DeliveryOrderReport/oap/oap.component';
import { StackCardRegisterComponent } from './reports/StackCard/stack-card-register/stack-card-register.component';
import { OCRReportComponent } from './reports/ocr-report/ocr-report.component';
import { CashReceiptRegisterComponent } from './reports/cash-receipt-register/cash-receipt-register.component';
import { DocumentCorrectionComponent } from './Documents/document-correction/document-correction.component';
import { CorrectionSlipComponent } from './reports/correction-slip/correction-slip.component';
import { OWSComponent } from './reports/Annavitran/ows/ows.component';
import { StackClosingCard2Component } from './reports/StackCard/stack-closing-card-2/stack-closing-card-2.component';
import { OpeningBalanceStackDetailsComponent } from './reports/StackCard/StackDetail/opening-balance-stack-details/opening-balance-stack-details.component';
import { PartyLedgerMasterComponent } from './GST/Master/party-ledger-master/party-ledger-master.component';
import { SalesTaxEntryComponent } from './GST/Documents/sales-tax-entry/sales-tax-entry.component';
import { PurchaseTaxEntryComponent } from './GST/Documents/purchase-tax-entry/purchase-tax-entry.component';
import { AllotmentDetailsComponent } from './Allotment/allotment-details/allotment-details.component';
import { ServiceProviderEntryComponent } from './GST/Documents/service-provider-entry/service-provider-entry.component';
import { AllotmentIssueQuantityComponent } from './Allotment/QuotaWatchRegister/allotment-issue-quantity.component';
import { ProcessToG2GComponent } from './G2G/process-to-G2G/process-to-G2G.component';
import { PartyLedgerUpdateComponent } from './GST/Master/party-ledger-update/party-ledger-update.component';
import { GodownEmployeeDetailsComponent } from './Documents/Master/godown-employee-details/godown-employee-details.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { NotificationPopupComponent } from './notification/notification-popup/notification-popup.component';
import { DailyDocumentTruckComponent } from './reports/DailyDocument/daily-document-truck/daily-document-truck.component';
import { DailyStatementComponent } from './reports/sections/daily-statement/daily-statement.component';
import { LoadMenWagesComponent } from './reports/wages/load-men-wages/load-men-wages.component';
import { LoadMenUnloadingWagesComponent } from './reports/wages/load-men-unloading-wages/load-men-unloading-wages.component';
import { GodownDashboardComponent } from './godown-dashboard/godown-dashboard.component';
import { ProcessToGPSComponent } from './GPS/process-to-gps/process-to-gps.component';
import { IssueGatepassComponent } from './Documents/issue-gatepass/issue-gatepass.component';
import { QuantityDetailIssueComponent } from './reports/Quantity/quantity-detail-gunny/quantity-detail-gunny.component';
import { StackCardCorrectionComponent } from './Documents/stack-card-correction/stack-card-correction.component';
import { StackRunningCardDateComponent } from './Documents/StackCard/stack-running-card-date/stack-running-card-date.component';
import { StockLedgerStatementComponent } from './reports/stock-ledger-statement/stock-ledger-statement.component';
import { AuditInceptionComponent } from './Audit/audit-inception/audit-inception.component';
import { SalesTaxComponent } from './GST/Reports/sales-tax/sales-tax.component';
import { PurchaseTaxComponent } from './GST/Reports/purchase-tax/purchase-tax.component';
import { ServiceProviderComponent } from './GST/Reports/service-provider/service-provider.component';
import { AuditReportComponent } from './audit-report/audit-report.component';
import { StockCommodityComponent } from './reports/stock-commodity/stock-commodity.component';
import { GodownInchargeComponent } from './godown-incharge/godown-incharge.component';
import { AuditFileReportComponent } from './reports/audit-file-report/audit-file-report.component';
import { LorryMasterComponent } from './Documents/Master/lorry-master/lorry-master.component';
import { LorryGatePassComponent } from './Documents/Master/lorry-gate-pass/lorry-gate-pass.component';
import { EInvoiceComponent } from './reports/DeliveryOrderReport/e-invoice/e-invoice.component';
import { PdsLiftmentReportComponent } from './reports/pds-liftment-report/pds-liftment-report.component';
import { QuotationDetailsComponent } from './Documents/quotation-details/quotation-details.component';
import { DoToSalesTaxComponent } from './GST/do-to-sales-tax/do-to-sales-tax.component';
import { DoApprovalDocsComponent } from './reports/do-approval-docs/do-approval-docs.component';
import { TaxAbstractComponent } from './GST/Reports/tax-abstract/tax-abstract.component';
import { TaxAbstractPurchaseComponent } from './GST/Reports/tax-abstractpurchase/tax-abstractpurchase.component';
import { TaxAbstractServiceComponent } from './GST/Reports/tax-abstractservice/tax-abstractservice.component';
import { HoqtyabstractComponent } from './hoqtyacc/hoqtyabstract/hoqtyabstract.component';
import { HoqtyabstractrepComponent } from './hoqtyacc/Reports/hoqtyabstractrep.component';
import { TransferOpeningBalanceToHOQtyComponent } from './transfer-opening-balance-to-hoqty/transfer-opening-balance-to-hoqty.component';
import { CBComparsionStatementComponent } from './reports/cbcomparsion-statement/cbcomparsion-statement.component';
import { GstcommoditymasterComponent } from './GST/Master/gstcommoditymaster/gstcommoditymaster.component';
import { HoqtypurchaseComponent } from './hoqtyacc/hoqtypurchase/hoqtypurchase.component';
import { HoqtyfreereceiptComponent } from './hoqtyacc/hoqtyfreereceipt/hoqtyfreereceipt.component';
import { HoqtyOtherReceiptComponent } from './hoqtyacc/hoqty-other-receipt/hoqty-other-receipt.component';
import { HoqtyFreeIssuesComponent } from './hoqtyacc/hoqty-free-issues/hoqty-free-issues.component';
import { HoqtyOtherIssuesComponent } from './hoqtyacc/hoqty-other-issues/hoqty-other-issues.component';
import { HoqtySalesComponent } from './hoqtyacc/hoqty-sales/hoqty-sales.component';
import { HoqtyComponent } from './hoqtyacc/Reports/hoqty/hoqty.component';
import { HoqtyregionComponent } from './hoqtyacc/Reports/hoqtyregion/hoqtyregion.component';
import { DailyStatementPartyComponent } from './reports/sections/daily-statement-party/daily-statement-party.component';
import { HoqtycommComponent } from './hoqtyacc/Reports/hoqtycomm/hoqtycomm.component';
import { DailyStatementAriComponent } from './reports/sections/daily-statement-ari/daily-statement-ari.component';
import { TenderregionrepComponent } from './purchase/tenderregionrep/tenderregionrep.component';
import { PdsLiftmentRiceonlyComponent } from './pds-liftment-riceonly/pds-liftment-riceonly.component';
import { HoqtycommgrpComponent } from './hoqtyacc/Reports/hoqtycommgrp/hoqtycommgrp.component';
import { OtpComponent } from './otp/otp.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'Daily Stock Statement', component: DailyStockStatementComponent, canActivate: [AuthGuard] },
  { path: 'godownData', component: GodownDataComponent, canActivate: [AuthGuard] },
  { path: 'crsData', component: CRSDataComponent, canActivate: [AuthGuard] },
  { path: 'mrmData', component: MRMDataComponent, canActivate: [AuthGuard] },
  { path: 'aadsData', component: AADSDataComponent, canActivate: [AuthGuard] },
  { path: 'hullingAgencies', component: HullingAgenciesComponent, canActivate: [AuthGuard] },
  { path: 'fciData', component: FCIDataComponent, canActivate: [AuthGuard] },
  { path: 'regions', component: RegionsDataComponent, canActivate: [AuthGuard] },
  { path: 'schemes', component: SchemesComponent, canActivate: [AuthGuard] },
  { path: 'depositors', component: DepositorsComponent, canActivate: [AuthGuard] },
  { path: 'Tender Details', component: StockPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'Regional Tender Allotment', component: RegionAllotmentComponent, canActivate: [AuthGuard] },
  { path: 'Godown Tender Allotment', component: GodownAllotmentComponent, canActivate: [AuthGuard] },
  { path: 'cbStatement', component: CBStatementComponent, canActivate: [AuthGuard] },
  { path: 'Stock Receipt', component: StockReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Stock Issue Memo', component: IssueReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Delivery Order', component: DeliveryReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Truck Memo', component: TruckReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Stock Receipt Register', component: StockReceiptRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Stock Issue Register', component: StockIssueRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Truck Memo Register', component: TruckMemoRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Delivery Order Register', component: DeliveryOrderRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Commodity Receipt', component: CommodityReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Scheme Receipt', component: SchemeReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Transaction Receipt', component: TransactionReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Commodity Issuememo', component: CommodityIssueMemoComponent, canActivate: [AuthGuard] },
  { path: 'Scheme Issuememo', component: SchemeIssueMemoComponent, canActivate: [AuthGuard] },
  { path: 'Writeoff', component: WriteOffComponent, canActivate: [AuthGuard] },
  { path: 'Hulling Details', component: HullingDetailsComponent, canActivate: [AuthGuard] },
  { path: 'Truck to Region', component: TruckToRegionComponent, canActivate: [AuthGuard] },
  { path: 'Truck from Region', component: TruckFromRegionComponent, canActivate: [AuthGuard] },
  { path: 'Ho Purchase', component: ReceiptHOPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'Release Orderno', component: ReceiptRONOPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'Regional Purchase', component: ReceiptROPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'Issue Memo Customer Details', component: CustomerDetailsComponent, canActivate: [AuthGuard] },
  { path: 'Issue Memo Society Wise', component: SocietyWiseCommodityAbstractComponent, canActivate: [AuthGuard] },
  { path: 'Gunny_GUGR', component: GunnyGuGrComponent, canActivate: [AuthGuard] },
  // { path: 'Opening Balance', component: OpeningBalanceComponent, canActivate: [AuthGuard] },
  { path: 'Truck Transit', component: TruckTransitComponent, canActivate: [AuthGuard] },
  { path: 'Do All Scheme', component: AllSchemeComponent, canActivate: [AuthGuard] },
  { path: 'Do Oap Scheme', component: OapComponent },
  { path: 'Do SPLPDS Scheme', component: SplpdsComponent },
  { path: 'Do Annapoorna Scheme', component: AnnapoornaComponent },
  { path: 'Do Other Scheme', component: OtherSchemesComponent },
  { path: 'E-Invoice', component: EInvoiceComponent },
  { path: 'Do Society Abstract', component: SocietyAbstractComponent, canActivate: [AuthGuard] },
  { path: 'Demand Draft', component: DemandDraftComponent, canActivate: [AuthGuard] },
  { path: 'Do Margin Details', component: MarginAmountComponent, canActivate: [AuthGuard] },
  { path: 'Quantity AC All Scheme Receipt', component: ReceiptSchemeComponent, canActivate: [AuthGuard] },
  { path: 'Quantity AC All Scheme Issue', component: IssueSchemeComponent, canActivate: [AuthGuard] },
  { path: 'Quantity AC All Scheme Issue Crs', component: IssueSchemeCrsComponent, canActivate: [AuthGuard] },
  { path: 'Quantity AC All Scheme Issue Coop', component: IssueSchemeCoOpComponent, canActivate: [AuthGuard] },
  { path: 'Quantity AC All Scheme Truck', component: TruckMemoSchemeComponent, canActivate: [AuthGuard] },
  { path: 'QADetailsForCommodity', component: QuantityDetailCommodityComponent, canActivate: [AuthGuard] },
  { path: 'QADetailsForGunny', component: QuantityDetailIssueComponent, canActivate: [AuthGuard] },
  { path: 'Society Master', component: SocietMasterComponent, canActivate: [AuthGuard] },
  { path: 'Opening Balance Master', component: OpeningBalanceDetailsComponent, canActivate: [AuthGuard] },
  { path: 'Current Year Shortage', component: OpeningBalanceCurrentYearComponent, canActivate: [AuthGuard] },
  { path: 'Depositor Master', component: DepositorCustomerMasterComponent, canActivate: [AuthGuard] },
  { path: 'GodownEmployeeDetails', component: GodownEmployeeDetailsComponent, canActivate: [AuthGuard] },
  { path: 'RateMaster', component: RateMasterComponent, canActivate: [AuthGuard] },
  { path: 'UserMaster', component: UserMasterComponent, canActivate: [AuthGuard] },
  { path: 'Shop Society Update', component: ShopSocietUpdateMasterComponent, canActivate: [AuthGuard] },
  { path: 'Commodity Break', component: ItemMasterModificationComponent, canActivate: [AuthGuard] },
  { path: 'Godown Customer List', component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: 'Stack Card Opening Entry', component: StackCardOpeningEntryComponent, canActivate: [AuthGuard] },
  { path: 'Stock Statement', component: StockstatementreportComponent, canActivate: [AuthGuard] },
  { path: 'Transaction Status', component: TransactionStatusComponent, canActivate: [AuthGuard] },
  { path: 'Daily Receipt', component: DailyDocumentsComponent, canActivate: [AuthGuard] },
  { path: 'Daily Issue', component: DailyDocumentIssueComponent, canActivate: [AuthGuard] },
  { path: 'Daily TruckMemo', component: DailyDocumentTruckComponent, canActivate: [AuthGuard] },
  { path: 'Stack Card Opening', component: StackCardOpeningComponent, canActivate: [AuthGuard] },
  { path: 'Stack Card', component: StackCardComponent, canActivate: [AuthGuard] },
  { path: 'Godown Profile', component: GodownProfileComponent, canActivate: [AuthGuard] },
  { path: 'Packing Master', component: PackingMasterComponent, canActivate: [AuthGuard] },
  { path: 'Other Master', component: OtherMasterComponent, canActivate: [AuthGuard] },
  { path: 'Cnc Correction', component: CncCorrectionComponent, canActivate: [AuthGuard] },
  { path: 'Scheme Commodity', component: SchemeCommodityComponent, canActivate: [AuthGuard] },
  { path: 'DD Receipt Entry', component: DDChequeEntryComponent, canActivate: [AuthGuard] },
  { path: 'Society Master Entry', component: SocietyMasterNewComponent, canActivate: [AuthGuard] },
  { path: 'Issuer Master Report', component: IssuerMasterComponent, canActivate: [AuthGuard] },
  { path: 'Cash Receipt Register', component: CashReceiptRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Quantity AC Issue Abstract', component: IssueTypeAbstractComponent, canActivate: [AuthGuard] },
  { path: 'Quantity AC Receipt Abstract', component: ReceiptTypeAbstractComponent, canActivate: [AuthGuard] },
  { path: 'Stack Card Register', component: StackCardRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Document Correction', component: DocumentCorrectionComponent, canActivate: [AuthGuard] },
  { path: 'Correction Slip', component: CorrectionSlipComponent, canActivate: [AuthGuard] },
  { path: 'OCR Report', component: OCRReportComponent, canActivate: [AuthGuard] },
  { path: 'OWS Report', component: OWSComponent, canActivate: [AuthGuard] },
  { path: 'Stack Closing Card 2', component: StackClosingCard2Component, canActivate: [AuthGuard] },
  { path: 'Opening Balance Stack Details', component: OpeningBalanceStackDetailsComponent },
  { path: 'PartyLedgerMaster', component: PartyLedgerMasterComponent, canActivate: [AuthGuard] },
  { path: 'PartyLedgerUpdate', component: PartyLedgerUpdateComponent, canActivate: [AuthGuard] },
  { path: 'SalesTaxEntry', component: SalesTaxEntryComponent, canActivate: [AuthGuard] },
  { path: 'PurchaseTaxEntry', component: PurchaseTaxEntryComponent, canActivate: [AuthGuard] },
  { path: 'ServiceProviderEntry', component: ServiceProviderEntryComponent, canActivate: [AuthGuard] },
  { path: 'Allotment Details', component: AllotmentDetailsComponent, canActivate: [AuthGuard] },
  { path: 'QuotaWatchRegister', component: AllotmentIssueQuantityComponent, canActivate: [AuthGuard] },
  { path: 'Process To G2G', component: ProcessToG2GComponent, canActivate: [AuthGuard] },
  { path: 'Notification', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'Daily Statement', component: DailyStatementComponent, canActivate: [AuthGuard] },
  { path: 'NotificationPopup', component: NotificationPopupComponent, canActivate: [AuthGuard] },
  { path: 'WagesLoading', component: LoadMenWagesComponent, canActivate: [AuthGuard] },
  { path: 'WagesUnLoading', component: LoadMenUnloadingWagesComponent, canActivate: [AuthGuard] },
  { path: 'GodownDashboard', component: GodownDashboardComponent, canActivate: [AuthGuard] },
  { path: 'ProcessToGPS', component: ProcessToGPSComponent, canActivate: [AuthGuard] },
  { path: 'IssueGatePass', component: IssueGatepassComponent },
  { path: 'StackCardCorrection', component: StackCardCorrectionComponent },
  { path: 'IssueGatePass', component: IssueGatepassComponent, canActivate: [AuthGuard] },
  { path: 'RunningStackCard', component: StackRunningCardDateComponent, canActivate: [AuthGuard] },
  { path: 'StockLedgerStatement', component: StockLedgerStatementComponent, canActivate: [AuthGuard] },
  { path: 'AuditInspection', component: AuditInceptionComponent, canActivate: [AuthGuard] },
  { path: 'SalesTax', component: SalesTaxComponent, canActivate: [AuthGuard] },
  { path: 'PurchaseTax', component: PurchaseTaxComponent, canActivate: [AuthGuard] },
  { path: 'ServiceProviderTax', component: ServiceProviderComponent, canActivate: [AuthGuard] },
  { path: 'InspectionReport', component: AuditReportComponent, canActivate: [AuthGuard] },
  { path: 'StockCommodityReport', component: StockCommodityComponent, canActivate: [AuthGuard] },
  { path: 'GodownInchargeApproval', component: GodownInchargeComponent, canActivate: [AuthGuard] },
  { path: 'AuditFileReport', component: AuditFileReportComponent, canActivate: [AuthGuard] },
  { path: 'LorryReport', component: LorryMasterComponent, canActivate: [AuthGuard] },
  { path: 'LorryGatePassReport', component: LorryGatePassComponent, canActivate: [AuthGuard] },
  { path: 'PDSLiftmentReport', component: PdsLiftmentReportComponent, canActivate: [AuthGuard] },
  { path: 'QuotationDetails', component: QuotationDetailsComponent, canActivate: [AuthGuard] },
  { path: 'DoToSalesTax', component: DoToSalesTaxComponent, canActivate: [AuthGuard] },
  { path: 'DoApproval', component: DoApprovalDocsComponent, canActivate: [AuthGuard] },
  { path: 'TaxAbstract', component: TaxAbstractComponent, canActivate: [AuthGuard] },
  { path: 'TaxAbstractPurchase', component: TaxAbstractPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'TaxAbstractService', component: TaxAbstractServiceComponent, canActivate: [AuthGuard] },
  { path: 'Hoqtyabstract', component: HoqtyabstractComponent, canActivate: [AuthGuard] },
  { path: 'Hoqtyabstractrep', component: HoqtyabstractrepComponent, canActivate: [AuthGuard] },
  { path: 'TransferOBToHOQty', component: TransferOpeningBalanceToHOQtyComponent, canActivate: [AuthGuard] },
  { path: 'CBFromTNDaily', component: CBComparsionStatementComponent, canActivate: [AuthGuard] },
  { path: 'Gstcommoditymaster', component: GstcommoditymasterComponent, canActivate: [AuthGuard] },
  { path: 'HoQtyPurchase', component: HoqtypurchaseComponent, canActivate: [AuthGuard] },
  { path: 'HoQtyFreeReceipt', component: HoqtyfreereceiptComponent, canActivate: [AuthGuard] },
  { path: 'HoQtyOtherReceipt', component: HoqtyOtherReceiptComponent, canActivate: [AuthGuard] },
  { path: 'HoQtyFreeIssue', component: HoqtyFreeIssuesComponent, canActivate: [AuthGuard] },
  { path: 'HoQtyOtherIssue', component: HoqtyOtherIssuesComponent, canActivate: [AuthGuard] },
  { path: 'HoQtySales', component: HoqtySalesComponent, canActivate: [AuthGuard] },
  {
    path: 'HoQty',
    children: [
      { path: 'freereceipt', component: HoqtyComponent, data: { kind: 'freereceipt' } },
      { path: 'otherreceipt', component: HoqtyComponent, data: { kind: 'otherreceipt' } },
      { path: 'freeissue', component: HoqtyComponent, data: { kind: 'freeissue' } },
      { path: 'otherissue', component: HoqtyComponent, data: { kind: 'otherissue' } },
      { path: 'purchase', component: HoqtyComponent, data: { kind: 'purchase' } },
      { path: 'sales', component: HoqtyComponent, data: { kind: 'sales' } },
    ]
  },
  { path: 'Hoqtyregion', component: HoqtyregionComponent, canActivate: [AuthGuard] },
  { path: 'DailyStatementParty', component: DailyStatementPartyComponent, canActivate: [AuthGuard] },
  { path: 'Hoqtycommodity', component: HoqtycommComponent, canActivate: [AuthGuard] },
  { path: 'DailyStatementARI', component: DailyStatementAriComponent, canActivate: [AuthGuard] },
  { path: 'Tenderregionrep', component: TenderregionrepComponent, canActivate: [AuthGuard] },
  { path: 'pdsliftmentriceonly', component: PdsLiftmentRiceonlyComponent, canActivate: [AuthGuard] },
  { path: 'Hoqtycommoditygrp', component: HoqtycommgrpComponent, canActivate: [AuthGuard] },
  { path: 'Hoqtycommoditygrp', component: HoqtycommgrpComponent, canActivate: [AuthGuard] },
  { path: 'Otp', component: OtpComponent, canActivate: [AuthGuard] },
  
  
  { path: 'pageNotFound', redirectTo: 'Home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
