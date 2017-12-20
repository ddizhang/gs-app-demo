
function updatePriceOnRule(rule, raw, avgDisc){
  
  
  // retrieve values from rule dictionary
  var ruleNum = rule['ruleNum'];
  var condition = rule['condition'];
  //var method = rule['method'];
  var adjustMethod = rule['adjustMethod'];
  var adjustField = rule['adjustField'];
  var adjustValue = rule['adjustValue'];
  var baseOn = rule['baseOn'];
  
  //retrieve values from raw discionary
  var colNames = raw['colNames'];
  var content = raw['content'];
  var lr = content.length;
  
  // adjust pricing
  
  // Auto Adjust
  null
  // Manual Adjust
  //if (method == 'Manual'){
    
  // direct adjust
  if (adjustMethod == 'Direct') {
    
    for(var i=0; i<lr; i++){
      var row = content[i];
      
      if (Math.round(i%1000) == 0){
        Logger.log(i + 'rows iterated');
      }
      
      if (checkCondition(row, ruleNum, condition, adjustMethod, baseOn, colNames)) {
        updatePrice(row, adjustValue, adjustField, avgDisc, colNames);
        row[getColumnIndex('Rule', colNames)] = ruleNum;
      } // if check condition
    } // for
  }// if adjustMethod == Direct
  
  
  // relative adjust
  if (adjustMethod == 'Relative'){
    for(var i=0; i<lr; i++){
      var row = content[i];
      
      if (Math.round(i%1000) == 0){
        Logger.log(i + 'rows iterated');
      }
      
      if (checkCondition(row, ruleNum, condition, adjustMethod, baseOn, colNames)) {
        var newValue = getRelativeValue(row, baseOn, adjustValue, adjustField, colNames);
        updatePrice(row, newValue, adjustField, avgDisc, colNames);
        row[getColumnIndex('Rule', colNames)] = ruleNum;
      }
    } //for loop
  }//if adjustMethod == Relative
  //} // Manual adjust
  
  return {colNames: colNames, content: content}
  
}







// tested
function checkCondition(row, ruleNum, condition, adjustMethod, baseOn, colNames){

  satisfied = 1
  
  // check if price has been updated by previous rule
  if (row[getColumnIndex('Rule', colNames)] < ruleNum){
    satisfied = 0;
    return satisfied
  }
  
  // check rule underlying conditions (for relative update)
  if (adjustMethod == 'Relative' && (baseOn == 'Nation' || baseOn == 'Region')){
    if (row[getColumnIndex(baseOn.toLowerCase()+'_qsold_360', colNames)] < 10){
      satisfied = 0;
      return satisfied;
    }
  }
  
  // check rule conditions
  for (var [key,value] in condition){
    //Logger.log('current condition checked: ' + [key, value]);
    
    if (key == 'Category' || key == 'CUC'){ // in Category it's string, others are numeric
      newCondition = eval('"' + row[getColumnIndex(key, colNames)] + '"' + value);
    } else {
      newCondition = eval(row[getColumnIndex(key, colNames)] + value);
    }
    if (!newCondition) {
      satisfied = 0;
      break;
    }
  }
  return satisfied
}






// tested
function getRelativeValue(row, baseOn, ratio, adjustField, colNames) {
  
  if (baseOn == 'Nation' || baseOn == 'Region'){
    if (adjustField == 'Jobber' || adjustField == 'Effective Price'){
      
      var newValue = row[getColumnIndex(baseOn.toLowerCase()+'_ASP', colNames)] * ratio;
      //Logger.log('newValue'+ newValue);
    }
    
    if (adjustField == 'Jobber Margin' || adjustField == 'Effective Margin'){
      var newValue = row[getColumnIndex(baseOn.toLowerCase()+'_margin', colNames)] * ratio;
      newValue = Math.min(newValue, 0.9);
      //Logger.log('newValue'+ newValue);
    }
  } // Nation or Region
  
  
  if (baseOn == 'Current Value'){
    if (adjustField == 'Jobber'){
      var newValue = row[getColumnIndex('Jobber', colNames)] * ratio;
      Logger.log('newValue'+ newValue);
    }
    
    if (adjustField == 'Effective Price'){
      var newValue = row[getColumnIndex('EffectivePrice', colNames)] * ratio;
      Logger.log('newValue'+ newValue);
    }
    
    if (adjustField == 'Jobber Margin'){
      var newValue = (row[getColumnIndex('Jobber', colNames)] - 
                      row[getColumnIndex('Cost', colNames)]) * ratio;
      Logger.log('newValue'+ newValue);
    }
    
    if (adjustField == 'Effective Margin'){
      var newValue = (row[getColumnIndex('EffectivePrice', colNames)] - 
                      row[getColumnIndex('Cost', colNames)]) * ratio;
      newValue = Math.min(newValue, 0.9);
      Logger.log('newValue'+ newValue);
    }
  } // Current Value

  
  return newValue;
}




// tested
function updatePrice(row, newValue, adjustField, avgDisc, colNames){
  
  // input is a row from the grid: an 1d Array
  
  if (adjustField == 'Jobber'){
    var newJobber = newValue;
    var newEffPrice = calcEffPrice(newJobber, avgDisc);
  }
  
  if (adjustField == 'Effective Price'){
    var newEffPrice = newValue;
    var newJobber = calcJobber(newEffPrice, avgDisc);
  }
  
  if (adjustField == 'Jobber Margin'){
    var newJobber = calcPrice(row[getColumnIndex('Cost', colNames)], newValue);
    var newEffPrice = calcEffPrice(newJobber, avgDisc);
  }
  
  if (adjustField == 'Effective Margin'){
    var newEffPrice = calcPrice(row[getColumnIndex('Cost', colNames)], newValue);
    var newJobber = calcJobber(newEffPrice, avgDisc);
  }
  
  //Logger.log('newJobber '+newJobber);
  //Logger.log('newEffPrice'+newEffPrice);
  
  // update prices
  row[getColumnIndex('NewJobber', colNames)] = newJobber;
  row[getColumnIndex('NewEffectivePrice', colNames)] = newEffPrice;
}





// calculate effective price according to jobber
function calcEffPrice(jobber, avgDisc){
  var effPrice = jobber * (1-0.01*avgDisc)
  return effPrice
}

// calculate jobber according to effective price
function calcJobber(effPrice, avgDisc){
  
  var jobber = effPrice / (1-0.01*avgDisc)
  return jobber
}

// calculate price according to cost and margin
function calcPrice(cost, margin){
  
  var price = cost / (1-margin)
  return price
}
