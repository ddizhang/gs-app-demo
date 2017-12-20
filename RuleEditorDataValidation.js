

function setDataValid_(range, sourceRange) {
  var rule = SpreadsheetApp.newDataValidation().requireValueInRange(sourceRange, true).build();
  range.setDataValidation(rule);
}



function onEdit() {
  var aSheet = SpreadsheetApp.getActiveSheet();
  var aCell = aSheet.getActiveCell();
  var aColumn = aCell.getColumn();

  
  if (aColumn == 4 && aSheet.getName() == 'Rule Editor'){ // column "Method"
    
    
    if (aCell.getValue() == 'Manual'){
      
      // set validation for Adjust Field
      var range = aSheet.getRange(aCell.getRow(), aColumn + 1); // column 'Adjust Field'
      var sourceRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Global Variables').getRange(3,3,17,1)
      setDataValid_(range, sourceRange)   
      
      // set validation for Adjust Method
      var range = aSheet.getRange(aCell.getRow(), aColumn + 2); // column 'Adjust Method'
      var sourceRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Global Variables').getRange(3,4,17,1)
      setDataValid_(range, sourceRange)   
      
      // clear Base on
      var baseOnCell = aSheet.getRange(aCell.getRow(), aColumn+3)
      baseOnCell.setValue(null);
      baseOnCell.clearDataValidations();
      
      // clear  Adjust Value
      var adjustValueCell = aSheet.getRange(aCell.getRow(), aColumn+4)
      adjustValueCell.setValue(null);
      adjustValueCell.clearDataValidations();
      //numericRule = SpreadsheetApp.newDataValidation().requireNumberBetween(-999, 999).build();
      //adjustValueCell.setDataValidation(numericRule);
      }
    
    
    if (aCell.getValue() == 'Auto'){
      
      var range = aSheet.getRange(aCell.getRow(), aColumn + 1, 1, 4); 
      // clear 'Adjust Field', 'Adjust Method', 'Base On', 'Adjust Value'
      range.setValue(null);
      range.clearDataValidations();
      
      // set validation for 'Adjust Field', 'Adjust Method', 'Base On', 'Adjust Value'
      var range = aSheet.getRange(aCell.getRow(), aColumn + 1, 1, 4); 
      var sourceRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Global Variables').getRange(2,3);
      setDataValid_(range, sourceRange);
      
    }
  } // column 'Method'
  
  
  
  
    if (aColumn == 6 && aSheet.getName() == 'Rule Editor'){ // column "Adjust Method"
      
      if (aCell.getValue() == 'Relative'){
        // clear previous validations
        var range = aSheet.getRange(aCell.getRow(), aColumn+1, 1, 2)
        range.setValue(null);
        range.clearDataValidations();
        
        // set new validation to 'based on'
        var range = aSheet.getRange(aCell.getRow(), aColumn + 1); // column "Base On"
        var sourceRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Global Variables').getRange(4,5,17,1)
        setDataValid_(range, sourceRange) 
        
        // set new validation to 'adjust value'
        var adjustValueCell = aSheet.getRange(aCell.getRow(), aColumn+2)
        numericRule = SpreadsheetApp.newDataValidation().requireNumberBetween(-999, 999).build();
        adjustValueCell.setDataValidation(numericRule);
        }
      
      if (aCell.getValue() == 'Direct'){
        
        // clear previous validations
        var range = aSheet.getRange(aCell.getRow(), aColumn+1, 1, 2)
        range.setValue(null);
        range.clearDataValidations();
        
        // set validations for 'base on' and 'adjust value'
        var sourceRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Global Variables').getRange(3,5)
        }
      
      setDataValid_(range, sourceRange) 
  } // column 'Adjust Method'

  
  
  
  
  
}

