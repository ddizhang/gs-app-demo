// search in a sheet for all rule number and their positions
// tested
function getAllRulePositions(colNames, content){
  // position: [startRow, startCol, endRow]
  var ruleNumColIndex = getColumnIndex('Rule No.', colNames);
  var rulePositions = [];
  
  for (var i=0; i<content.length; i++){

    // if it's the start row of a new rule
    //if (content[i][ruleNumColIndex]) {
    if (!(content[i][ruleNumColIndex].length === 0)){
      rulePositions.push({name:content[i][ruleNumColIndex], position:[i, ruleNumColIndex, i]});
    }
  }//for
  
  // set last rule row for each rule
  for (var j=0; j<rulePositions.length-1; j++){
    rulePositions[j]['position'][2] = rulePositions[j+1]['position'][0]-1
  }
  return rulePositions
}




// tested
function getRulePositionByName(ruleNum, rulePositions) {
  
  for (var i=0; i<rulePositions.length; i++){
    if (rulePositions[i]['name'] == ruleNum){
      return rulePositions[i]['position'];
    }
  }
  
  return Array[2]
}




// tested
function getRuleByPosition(position, colNames, content, pmLev) {


  var startRow = position[0];
  var startColumn = position[1];
  var endRow = position[2];

  // save all condition filters in a dictionary
  var condition = {};
  row = startRow;
  
  //while (row<=endRow && content[row][startColumn+1] && content[row][startColumn+2]){
  while (!(row>endRow || content[row][startColumn+1].length === 0 || content[row][startColumn+2].length === 0)){  
    Logger.log('row'+row);
    condition[content[row][startColumn+1]] = content[row][startColumn+2];
    row++;
  }//while
  
  // if method == 'Manual'
  if (content[startRow][startColumn+3] == 'Manual'){
      // grab other variables
    var ruleNum = content[startRow][startColumn];
    //var method = content[startRow][startColumn+3];
    var adjustField = content[startRow][startColumn+4];
    var adjustMethod = content[startRow][startColumn+5];
    var adjustValue = content[startRow][startColumn+7];
    var baseOn = content[startRow][startColumn+6];
  }

  // if method == 'Auto'
  if (content[startRow][startColumn+3] == 'Auto'){
    // grab other variables
    var ruleNum = content[startRow][startColumn];
    // var method = 'Manual';
    var adjustField = 'Effective Price';
    var adjustMethod = 'Relative';
    var adjustValue = pmLev;
    var baseOn = 'Nation';
  }
  
  // dump into a dictionary
  var rule = {ruleNum: ruleNum, 
          condition: condition,
         // method: method,
          adjustField: adjustField,
          adjustMethod: adjustMethod,
          adjustValue: adjustValue,
          baseOn: baseOn
          }
  
  return rule
  
}
