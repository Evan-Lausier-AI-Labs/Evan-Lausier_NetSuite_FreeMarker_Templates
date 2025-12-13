/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @description Groups invoice lines by project, item, task, and expense category on print
 */
define(['N/record', 'N/log', 'N/search', 'N/ui/serverWidget'],
function(record, log, search, ui) {

    function beforeLoad(context) {
        try {
            if (context.type !== context.UserEventType.PRINT) return;

            var recId = context.newRecord.id;
            var fieldObj = context.form.addField({
                id: "custpage_custom_lines",
                label: 'Custom Lines',
                type: ui.FieldType.INLINEHTML,
            });
            var customLines = getLineData(recId);
            log.debug("customLines", customLines);
            fieldObj.defaultValue = JSON.stringify(customLines);

        } catch (e) {
            log.error('error in beforeLoad', e);
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
                var description = invRecObj.getSublistValue('item', 'description', i);
                var oaUser = invRecObj.getSublistValue('item', 'custcol_simitree_oa_user_display', i);
                var quantity = parseFloat(invRecObj.getSublistValue('item', 'quantity', i)) || 0;
                var rate = invRecObj.getSublistValue('item', 'rate', i) || 0;
                var amount = parseFloat(invRecObj.getSublistValue('item', 'amount', i));
                var qAProjectTask = invRecObj.getSublistValue('item', 'custcol_simitree_oa_task', i);
                var expenseCategory = invRecObj.getSublistText('item', 'custcol_simitree_exp_category', i);

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
            }

            // Collapse duplicate project names for cleaner display
            var newLineDataArr = [];
            var firstProj;
            for (var k = 0; k < lineDataArr.length; k++) {
                if (k == 0) {
                    newLineDataArr.push(lineDataArr[k]);
                } else {
                    if (firstProj == lineDataArr[k].projectName) {
                        newLineDataArr.push({
                            projectName: "",
                            item: lineDataArr[k].item,
                            oaUser: lineDataArr[k].oaUser,
                            description: lineDataArr[k].description,
                            quantity: lineDataArr[k].quantity,
                            rate: lineDataArr[k].rate,
                            amount: lineDataArr[k].amount,
                            qAProjectTask: lineDataArr[k].qAProjectTask,
                            expenseCategory: lineDataArr[k].expenseCategory,
                        });
                    } else {
                        newLineDataArr.push(lineDataArr[k]);
                    }
                }
                firstProj = lineDataArr[k].projectName;
            }

            return newLineDataArr;
        } catch (e) {
            log.error('error in getLineData', e);
        }
    }

    return {
        beforeLoad: beforeLoad
    };
});