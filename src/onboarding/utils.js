function addNewRecord(name, email) {
  var resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Emails");
  resultSheet.insertRowBefore(2);
  var newUserRowRange = resultSheet.getRange("A2:B2");
  newUserRowRange.setValues([ [name, email] ]);
}

function searchRow(keyword, sheet) {
  var textFinder = sheet.createTextFinder(keyword);
  var firstOccurRange = textFinder.findNext();
  var rowIndex = firstOccurRange.getRowIndex();
  return rowIndex;
}

function logInfo2StackdriverLogging(string) {
    console.info(string);
}

function setProperty(propertyName, propertyValue, type) {
    switch (type) {
        case PROPERTIES_TYPE_SCRIPT: 
            PropertiesService.getScriptProperties().setProperty(propertyName, propertyValue);
            break;
        case PROPERTIES_TYPE_USER:
        PropertiesService.getUserProperties().setProperty(propertyName, propertyValue);
            break;
        case PROPERTIES_TYPE_DOCUMENT: 
            PropertiesService.getDocumentProperties().setProperty(propertyName, propertyValue);
            break;
        default:
            // TODO: log errors
            break;
    } 
}