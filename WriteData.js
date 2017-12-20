function writePrices(newPrices, sheetName) {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var lr = sheet.getLastRow();
  //Logger.log('newPriceLength', newPrices['newRuleArray'].length);
  //Logger.log('lr-1', lr-1);
  
  if (newPrices['newRuleArray'].length !== lr-1) {
    Logger.log('unmatch row numbers!');
    return 0;
  }

  // newRuleArray: if 999 then set to blank
  for (var i=0; i<newPrices['newRuleArray'].length; i++){
    if (newPrices['newRuleArray'][i][0] == 999){
      newPrices['newRuleArray'][i][0] = null;
    } //if
  } //for
  
  sheet.getRange(2, getColumnIndex_sheet('Rule', sheet), lr-1, 1).setValues(newPrices['newRuleArray']);
  sheet.getRange(2, getColumnIndex_sheet('NewJobber', sheet), lr-1, 1).setValues(newPrices['newJobberArray']);
  sheet.getRange(2, getColumnIndex_sheet('NewEffectivePrice', sheet), lr-1, 1).setValues(newPrices['newEffPriceArray']);
}



function getUpdatedFields(colNames, content){
    // saving updated prices along with update rule
  var newJobberArray = [];
  var newEffPriceArray = [];
  var newRuleArray = [];
  var lr = content.length;
  
  for (var i=0; i<lr; i++) {
    newJobberArray.push([content[i][getColumnIndex('NewJobber', colNames)]])
    newEffPriceArray.push([content[i][getColumnIndex('NewEffectivePrice', colNames)]])
    newRuleArray.push([content[i][getColumnIndex('Rule', colNames)]])
  }//for
  
  return {newJobberArray: newJobberArray, newEffPriceArray: newEffPriceArray, newRuleArray: newRuleArray}
}
