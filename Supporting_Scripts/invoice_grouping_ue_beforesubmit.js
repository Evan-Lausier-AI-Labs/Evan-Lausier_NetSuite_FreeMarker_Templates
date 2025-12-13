/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @description Groups invoice lines and stores in custbody_st_invoice_print_datat on save
 */
define(['N/record', 'N/log', 'N/search', 'N/ui/serverWidget'],
function(record, log, search, ui) {

    function beforeSubmit(context) {
        try {
            if (context.type == context.UserEventType.DELETE) return;

            var recId = context.newRecord.id;
            var customLines = getLineData(recId);
            log.debug("customLines", customLines);
            context.newRecord.setValue('custbody_st_invoice_print_datat', JSON.stringify(customLines));
        } catch (e) {
            log.error('error in beforeSubmit', e);
        }
    }

    function getLineData(recId) {
        try {
            var lineDataArr = [];

            var invRecObj = record.load({
                type: 'invoice',
                id: recId
            });

            var lineCount = invRecObj.getLineCount('item');

            for (var i = 0; i < lineCount; i++) {
                var projectName = invRecObj.getSublistValue('item', 'job_display', i);
                var item = invRecObj.getSublistValue('item', 'item_display', i);
                var description = '';
                var oaUser = invRecObj.getSublistValue('item', 'custcol_simitree_oa_user_display', i);
                var quantity = parseFloat(invRecObj.getSublistValue('item', 'quantity', i)) || 0;
                var rate = invRecObj.getSublistValue('item', 'rate', i) || 0;
                var amount = parseFloat(invRecObj.getSublistValue('item', 'amount', i));
                var qAProjectTask = invRecObj.getSublistValue('item', 'custcol_simitree_oa_task', i);
                var expenseCategory = invRecObj.getSublistText('item', 'custcol_simitree_exp_category', i);

                if (expenseCategory) {
                    // Expense category lines - group by category without rate
                    if (i == 0) {
                        lineDataArr.push({
                            projectName: projectName,
                            item: item,
                            oaUser: oaUser,
                            description: description,
                            quantity: quantity,
                            qAProjectTask: qAProjectTask,
                            expenseCategory: expenseCategory,
                            rate: rate,
                            amount: amount
                        });
                    } else {
                        var index = -1;
                        for (var k in lineDataArr) {
                            if (lineDataArr[k].projectName == projectName &&
                                lineDataArr[k].item == item &&
                                lineDataArr[k].oaUser == oaUser &&
                                lineDataArr[k].description == description &&
                                lineDataArr[k].expenseCategory == expenseCategory &&
                                lineDataArr[k].qAProjectTask == qAProjectTask) {
                                index = k;
                                break;
                            }
                        }

                        if (index > -1) {
                            lineDataArr[index].amount = lineDataArr[index].amount + amount;
                            lineDataArr[index].quantity = lineDataArr[index].quantity + quantity;
                        } else {
                            lineDataArr.push({
                                projectName: projectName,
                                item: item,
                                oaUser: oaUser,
                                description: description,
                                quantity: quantity,
                                rate: rate,
                                amount: amount,
                                qAProjectTask: qAProjectTask,
                                expenseCategory: expenseCategory,
                            });
                        }
                    }
                } else {
                    // Non-expense lines - group by rate
                    if (i == 0) {
                        lineDataArr.push({
                            projectName: projectName,
                            item: item,
                            oaUser: oaUser,
                            description: description,
                            quantity: quantity,
                            qAProjectTask: qAProjectTask,
                            expenseCategory: expenseCategory,
                            rate: rate,
                            amount: amount
                        });
                    } else {
                        var index = -1;
                        for (var k in lineDataArr) {
                            if (lineDataArr[k].projectName == projectName &&
                                lineDataArr[k].item == item &&
                                lineDataArr[k].oaUser == oaUser &&
                                lineDataArr[k].description == description &&
                                lineDataArr[k].rate == rate &&
                                lineDataArr[k].qAProjectTask == qAProjectTask) {
                                index = k;
                                break;
                            }
                        }

                        if (index > -1) {
                            lineDataArr[index].amount = lineDataArr[index].amount + amount;
                            lineDataArr[index].quantity = lineDataArr[index].quantity + quantity;
                        } else {
                            lineDataArr.push({
                                projectName: projectName,
                                item: item,
                                oaUser: oaUser,
                                description: description,
                                quantity: quantity,
                                rate: rate,
                                amount: amount,
                                qAProjectTask: qAProjectTask,
                                expenseCategory: expenseCategory,
                            });
                        }
                    }
                }
            }

            // Recalculate quantity and collapse project names
            var newLineDataArr = [];
            var firstProj;
            for (var k = 0; k < lineDataArr.length; k++) {
                var calcQuantity = parseFloat(lineDataArr[k].amount) / parseFloat(lineDataArr[k].rate);
                
                if (k == 0) {
                    lineDataArr[k].quantity = calcQuantity;
                    newLineDataArr.push(lineDataArr[k]);
                } else {
                    if (firstProj == lineDataArr[k].projectName) {
                        newLineDataArr.push({
                            projectName: "",
                            item: lineDataArr[k].item,
                            oaUser: lineDataArr[k].oaUser,
                            description: lineDataArr[k].description,
                            quantity: calcQuantity,
                            rate: lineDataArr[k].rate,
                            amount: lineDataArr[k].amount,
                            qAProjectTask: lineDataArr[k].qAProjectTask,
                            expenseCategory: lineDataArr[k].expenseCategory,
                        });
                    } else {
                        newLineDataArr.push({
                            projectName: lineDataArr[k].projectName,
                            item: lineDataArr[k].item,
                            oaUser: lineDataArr[k].oaUser,
                            description: lineDataArr[k].description,
                            quantity: calcQuantity,
                            rate: lineDataArr[k].rate,
                            amount: lineDataArr[k].amount,
                            qAProjectTask: lineDataArr[k].qAProjectTask,
                            expenseCategory: lineDataArr[k].expenseCategory,
                        });
                    }
                }
                firstProj = lineDataArr[k].projectName;
            }

            // Clear qty/rate for expense category lines
            for (var m = 0; m < newLineDataArr.length; m++) {
                if (newLineDataArr[m].expenseCategory) {
                    newLineDataArr[m].quantity = '';
                    newLineDataArr[m].rate = '';
                }
            }

            return newLineDataArr;
        } catch (e) {
            log.error('error in getLineData', e);
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});