# Invoice Line Grouping Templates

Custom invoice templates with dynamic line grouping by project, task, and expense category.

## Templates

| Template | Description |
|----------|-------------|
| `grouped_invoice_v1.xml` | Basic grouping - Item, Task, Expense Category columns |
| `grouped_invoice_v2_full_columns.xml` | Full columns - Project, Item, Task, Expense, Resource, Description |
| `grouped_invoice_v3_description_only.xml` | Streamlined - Description, Units, Rate, Amount only |

## Custom Fields

- `custpage_custom_lines` - Runtime field for grouped line data (beforeLoad)
- `custbody_st_invoice_print_datat` - Stored field for grouped line data (beforeSubmit)

## Usage

These templates read grouped line data from JSON stored in custom fields. The data is populated by the supporting User Event scripts in the `/Supporting_Scripts` folder.
