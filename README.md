# Evan Lausier - NetSuite FreeMarker Templates

A collection of NetSuite FreeMarker PDF templates, bank payment file templates, and supporting SuiteScripts for custom invoice printing with advanced line grouping features.

## Template Catalog

### SimiTree Invoice Grouping
Custom invoice templates for SimiTree with dynamic line grouping by project, task, and expense category.

| Template | Description |
|----------|-------------|
| [simitree_invoice_v1.xml](./SimiTree_Invoice_Grouping/simitree_invoice_v1.xml) | Basic grouping - Item, Task, Expense Category columns |
| [simitree_invoice_v2_full_columns.xml](./SimiTree_Invoice_Grouping/simitree_invoice_v2_full_columns.xml) | Full columns - Project, Item, Task, Expense, Resource, Description |
| [simitree_invoice_v3_description_only.xml](./SimiTree_Invoice_Grouping/simitree_invoice_v3_description_only.xml) | Streamlined - Description, Units, Rate, Amount only |

### ATC Custom Invoice
Custom invoice template with facility hierarchy handling and bank payment information.

| Template | Description |
|----------|-------------|
| [atc_custom_invoice.xml](./ATC_Custom_Invoice/atc_custom_invoice.xml) | Facility segment hierarchy stripping, service dates, barcode footer, bank remittance details |

### Bank Payment Templates
Electronic Bank Payment templates for generating payment files in ISO 20022, SEPA, and ACH formats.

| Template | Format | Description |
|----------|--------|-------------|
| [iso20022_sepa_credit_transfer.xml](./Bank_Payment_Templates/iso20022_sepa_credit_transfer.xml) | ISO 20022 pain.001.001.03 | SEPA Credit Transfer for EUR payments |
| [wells_fargo_ach_direct_deposit.xml](./Bank_Payment_Templates/wells_fargo_ach_direct_deposit.xml) | Wells Fargo XML | ACH Direct Deposit with PPD format |
| [iso20022_bank_template.xml](./Bank_Payment_Templates/iso20022_bank_template.xml) | ISO 20022 pain.001.001.03 | Generic bank payment template |

## Supporting Scripts

User Event scripts that power the invoice line grouping feature.

| Script | Type | Description |
|--------|------|-------------|
| [invoice_grouping_ue_v1.js](./Supporting_Scripts/invoice_grouping_ue_v1.js) | beforeLoad | Groups lines on print using `custpage_custom_lines` |
| [invoice_grouping_ue_beforesubmit.js](./Supporting_Scripts/invoice_grouping_ue_beforesubmit.js) | beforeSubmit | Groups lines on save to `custbody_st_invoice_print_datat` |

## FreeMarker Snippets

Reusable code snippets for NetSuite PDF templates.

| Snippet | Description |
|---------|-------------|
| [remove_parent_hierarchy.ftl](./Snippets/remove_parent_hierarchy.ftl) | Strip parent hierarchy from segment values (keeps child name only) |

## Key Features

- **Line Grouping**: Aggregate invoice lines by project, item, task, expense category, and rate
- **Hierarchy Stripping**: Remove parent names from segment values for cleaner display
- **Multi-language Support**: CJK font support (Chinese, Japanese, Korean, Thai)
- **Payment Links**: NetSuite payment link integration
- **Bank Details**: Configurable remittance information (ACH, lockbox, overnight)
- **ISO 20022 Compliance**: SEPA credit transfer and pain.001.001.03 format support
- **ACH/PPD Support**: Wells Fargo direct deposit formatting

## Custom Fields Used

### Invoice Templates
- `custpage_custom_lines` - Runtime field for grouped line data (beforeLoad)
- `custbody_st_invoice_print_datat` - Stored field for grouped line data (beforeSubmit)
- `custcol_simitree_oa_task` - OA Project Task
- `custcol_simitree_exp_category` - Expense Category
- `custcol_simitree_oa_user_display` - OA User Display
- `custcol_mfc_service_start_date` - Service Start Date
- `custcol_mfc_service_end_date` - Service End Date

### Bank Payment Templates
- `custrecord_2663_iban` - IBAN number
- `custrecord_2663_bic` - BIC/SWIFT code
- `custrecord_2663_issuer_num` - Bank identification number
- `custrecord_2663_acct_num` - Account number
- `custrecord_2663_bank_num` - ABA routing number

## Author

**Evan Lausier**  
Director of Strategy, Technology & Transformation  
[GitHub](https://github.com/Evan-Lausier-AI-Labs)
