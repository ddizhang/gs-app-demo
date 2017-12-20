function main(){
  
  Logger.log('begin');
  //var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raw");
  
//  
//  ruleStartCell = getRuleStartCell();
//  rule = getUpdateRule(ruleStartCell);
//  Logger.log(rule);
//  
//  //
//  priceSheetName = 'Raw'
//  
//  //prepPrices tested
//  breakDown = prepPrices(priceSheetName);
//  //Logger.log('breakdown'+breakDown);
//  //colNames = breakDown['colNames'];
//  //content = breakDown['content'];
//  //Logger.log('colNames'+colNames);
//  //Logger.log('content'+content);
//  
//  // getColumnIndex tested
//  //ci = getColumnIndex('CUC', breakDown['colNames']);
//  //Logger.log('columnIndex'+ci);
//  //Logger.log('end');
//  
//  // getRelativeValue and updatePrice tested
//  //row = breakDown['content'][1];
//  //Logger.log(row);
//  //updatePrice(row, 130, 'Jobber', 11, breakDown['colNames']);
//  //Logger.log(row)
//  //getRelativeValue(row, 'Nation', 2, 'Jobber', breakDown['colNames']);
//
//  // checkCondition tested
//  //checkCondition = 
//  //  checkCondition(row, 3, rule['condition'], rule['adjustMethod'], rule['baseOn'], breakDown['colNames']);
//  //Logger.log(checkCondition);
//  
//  // updatePriceOnRule tested
//  newPrices = updatePriceOnRule(rule, breakDown, 11);
//  //Logger.log(newPrices['newJobberArray']);
//  //Logger.log(newPrices['newEffPriceArray']);
//  //Logger.log(newPrices['newRuleArray']);
//  
//  // writePrices tested
//  // writePrices(newPrices, priceSheetName)
//  
  // getAllSavedRulesFromSheet, getAllRulePositions, getRulePositionByName tested
//  var data = loadData('Saved Rules');
//  var ruleData = breakColNamesAndContent(data);
//  var rulePositions = getAllRulePositions(ruleData['colNames'], ruleData['content']);
//  Logger.log(rulePositions);
//  Logger.log(rulePositions[0]['position']);
//  //Logger.log(getRulePositionByName('test', rulePositions));
//  //Logger.log(getRulePositionByName('2', rulePositions));
//  
  //rule = getRuleByPosition(getRulePositionByName(2, rulePositions), ruleData['colNames'], ruleData['content'])
  //Logger.log(rule)
  
    rules = getAllSavedRulesFromSheet('Saved Rules', 1.05);
    Logger.log(rules);
  //Logger.log('begin');
  //updatePriceSheet('Saved Rules', 'Raw', 'GlobalVariables');
  //Logger.log('end');
  
  //Logger.log(getGlobalVars('Global Variables'))
  Logger.log(loadSavedRules('Rule Editor'))
  Logger.log(loadNewRule('Rule Editor'))
  
  //updatePriceSheet('Saved Rules', 'Test', 'Global Variables');
}



function button_UpdatePricing_old(){
  updatePriceSheet('Saved Rules', 'Raw', 'Global Variables');
  return 0;
}



function button_UpdatePricing(){
  updatePriceSheet('Rule Editor', 'Raw', 'Global Variables');
  return 0;
}







function updatePriceSheet(ruleSheet, 
                          priceSheet, 
                          globalVarSheet){
  
  // grab other global variables
  var globalVars = getGlobalVars(globalVarSheet);
  var avgDisc = globalVars['avgDisc'];
  var pmLev = globalVars['pmLev'];
  
  // grab all rules
  //Logger.log('fn_updatePriceSheet, pmLev:'+pmLev);
  var rules = getAllSavedRulesFromSheet(ruleSheet, pmLev);
  
  // grab price raw data
  var prices = prepPrices(priceSheet);
  
  // reset the rules to be 999, wipe NewJobber and NewEffectivePrice columns
  for (var i=0; i<prices['content'].length; i++){
    prices['content'][i][getColumnIndex('Rule', prices['colNames'])] = 999;
    prices['content'][i][getColumnIndex('NewJobber', prices['colNames'])] = null;
    prices['content'][i][getColumnIndex('NewEffectivePrice', prices['colNames'])] = null;
  }
  
  for (var i=0; i<rules.length; i++){
    var rule = rules[i];
    var newPricesFullData = updatePriceOnRule(rule, prices, avgDisc);
    var newPrices = getUpdatedFields(newPricesFullData['colNames'], newPricesFullData['content'])
    writePrices(newPrices, priceSheet);
  }// for
  

  return 0
};















