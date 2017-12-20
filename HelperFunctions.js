
// find the column number given a column name
// tested
function getColumnIndex(colName, colNameArray){
  // colNames: an Array
  // return: the Array index of the column (first column 0)
  //Logger.log('fn:getColumnIndex')
  
  var lc = colNameArray[0].length
  
  for(var i = 0; i < lc; i++){
    if(colNameArray[0][i] == colName){
      return i;
    }
  }
}



// find the column number given a column name: in a Google Sheet
function getColumnIndex_sheet(columnName, sheet){
  
  var lc = sheet.getLastColumn();
  
  for(var i = 1; i<= lc; i++){
    if(sheet.getRange(1,i).getValue() == columnName){
      //Logger.log((i))
      return i;
    }
  }
}

















