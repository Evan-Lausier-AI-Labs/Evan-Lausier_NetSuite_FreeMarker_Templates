# Bank Payment FreeMarker Templates

NetSuite Electronic Bank Payment templates for generating payment files in various formats.

## Templates

| Template | Format | Description |
|----------|--------|-------------|
| [iso20022_sepa_credit_transfer.xml](./iso20022_sepa_credit_transfer.xml) | ISO 20022 pain.001.001.03 | SEPA Credit Transfer for EUR payments |
| [wells_fargo_ach_direct_deposit.xml](./wells_fargo_ach_direct_deposit.xml) | Wells Fargo XML | ACH Direct Deposit with PPD format |
| [iso20022_bank_template.xml](./iso20022_bank_template.xml) | ISO 20022 pain.001.001.03 | Generic bank payment template |

## Standards

- **ISO 20022**: International standard for electronic data interchange between financial institutions
- **pain.001.001.03**: Customer Credit Transfer Initiation message format
- **SEPA**: Single Euro Payments Area - standardized EUR transfers
- **ACH/PPD**: Automated Clearing House Prearranged Payment and Deposit

## Key Functions

### getReferenceNote(payment)
Builds comma-separated list of paid transaction IDs for remittance info.

### convertSEPACharSet(text)
Sanitizes special characters for SEPA compliance:
- `&` → `+`
- `*`, `$`, `%` → `.`
- `'` → ` `

### formatAmountDecimal(amount)
Converts cent amounts to decimal format (e.g., 10000 → 100.00)

## Custom Fields Used

**Company Bank:**
- `custrecord_2663_statement_name` - Company name for payments
- `custrecord_2663_iban` - Company IBAN
- `custrecord_2663_bic` - Company BIC/SWIFT
- `custrecord_2663_issuer_num` - Bank identification number
- `custrecord_2663_acct_num` - Account number
- `custrecord_2663_bank_num` - ABA routing number

**Entity Bank:**
- `custrecord_2663_entity_iban` - Payee IBAN
- `custrecord_2663_entity_bic` - Payee BIC/SWIFT
- `custrecord_2663_entity_acct_no` - Payee account number
- `custrecord_2663_entity_bank_no` - Payee ABA routing
