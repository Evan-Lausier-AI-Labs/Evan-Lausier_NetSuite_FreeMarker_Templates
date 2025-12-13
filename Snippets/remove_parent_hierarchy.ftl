<#-- Removes parent hierarchy from segment values, keeping only the child name -->
<#-- Usage: For custom segments that display as "Parent : Child" but you only want "Child" -->

<#if item.cseg3?contains(":")>
    <td align="left" colspan="5" line-height="150%">${item.cseg3?keep_after_last(":")}</td>
<#else>
    <td align="left" colspan="5" line-height="150%">${item.cseg3}</td>
</#if>