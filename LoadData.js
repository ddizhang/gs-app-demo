
// ------------------------------------------
// Global Variables
function getGlobalVars(sheetName){
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var avgDisc = sheet.getRange(2, getColumnIndex_sheet('WH Avg Discount', sheet)).getValue();
  var pmLev = sheet.getRange(2, getColumnIndex_sheet('WH PM Price Level', sheet)).getValue();
  
  return {avgDisc:avgDisc, pmLev:pmLev}
}





// ------------------------------------------
// Raw Price Sheet
// tested
function prepPrices(sheetName){
  
  data = loadData(sheetName);
  breakDown = breakColNamesAndContent(data);
  return breakDown;
}


function loadData(sheetName){
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  return data
}


function breakColNamesAndContent(data) {
  
  var content = data.splice(1); //data: first row, content:the rest
  return {colNames: data, content: content}
}




// ------------------------------------------
// Price Update Rule Sheet
// tested
function getAllSavedRulesFromSheet(sheetName, pmLev) {
  
  //var data = loadData(sheetName);
  var data = loadSavedRules(sheetName);
  var ruleData = breakColNamesAndContent(data);
  var allRulePositions = getAllRulePositions(ruleData['colNames'], ruleData['content']);
  //Logger.log(allRulePositions);
  rules = []
  //for (var rulePosition in allRulePositions){
  for (i=0; i<allRulePositions.length; i++){
    //Logger.log(allRulePositions[i]['position']);
    rules.push(getRuleByPosition(allRulePositions[i]['position'], 
                                 ruleData['colNames'], ruleData['content'], 
                                 pmLev));
  }
  return rules
}




function loadSavedRules(sheetName){

  var data = loadData(sheetName);
  var savedRuleStartRow = 0;
  
  for (var i=0; i<data.length; i++){
    if (data[i][0] == 'Rule No.'){
      savedRuleStartRow = i;
      break;
    } //if
  }//for
  
  savedRules = data.splice(savedRuleStartRow);
  return savedRules
 
}



function loadNewRule(sheetName){
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var newRule = sheet.getRange(3,1,2,8).getValues();
  // New Rule is coded as Rule No.998
  newRule[0][0] = 'Rule No.'
  newRule[1][0] = 998  
  
  return newRule
}
