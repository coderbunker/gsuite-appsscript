function createFolder(folderName, ownerEmail) {
  var resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Emails");
  var userRowIndex = searchRow(folderName, resultSheet);
  var newUserRowRange = resultSheet.getRange(userRowIndex, 4); // get the "Folder created" cell
  
  if (!newUserRowRange.getValue()) {  // if there is no creating record
    var parentFolderId = getProperty("PERSONAL_PARENT_FOLDER_ID", PROPERTIES_TYPE_SCRIPT);
    //var personalPlanTemplateId = getProperty("PERSONAL_PLAN_TEMPLATE_DOC_ID", PROPERTIES_TYPE_SCRIPT);
    var introDocId = getProperty("COMMUNITY_INTRODUCTION_DOC_ID", PROPERTIES_TYPE_SCRIPT);
    
    var parentFolder = DriveApp.getFolderById(parentFolderId);
    var subFolders = parentFolder.getFolders();
    var userFolder;
    var createdDate;
    
    var existFolders = parentFolder.searchFolders('title = "' + folderName + '"');
    if (!existFolders.hasNext()) {
      userFolder = parentFolder.createFolder(folderName);
      var userFolderId = userFolder.getId();
      
      //var personalPlanTemplateDoc = DriveApp.getFileById(personalPlanTemplateId);
      //var makeCopy = personalPlanTemplateDoc.makeCopy(folderName + ' Coderbunker Resident Freelancer', userFolder);
      var introDoc = DriveApp.getFileById(introDocId);
      var makeCopy = introDoc.makeCopy('Introduction to Coderbunker', userFolder);
      
      createdDate = new Date();
      
      try {
        userFolder.setOwner(ownerEmail);  // TODO: cannot set a different domain user as owner!
      } catch (err) {
        showErrorDialog("Setting Folder Owner Failed" + folderName, err);
        log2File(err, "Setting Folder Owner Failed: " + folderName, LOG_LEVEL_ERROR);
        sendErrorEmail(err, "Setting Folder Owner Failed: " + folderName);
        console.error("Onboarding - create folder" + err);
      }
      
    } else {
      userFolder = existFolders.next();
      createdDate = userFolder.getDateCreated();
    }
    
    // save the folder creating result
    newUserRowRange.setValue(createdDate);
  }
}

//Create folder if does not exists only
function createFolder2FailedOnes(){
  var parentFolderId = getProperty("PERSONAL_PARENT_FOLDER_ID", PROPERTIES_TYPE_SCRIPT);
  //var personalPlanTemplateId = getProperty("PERSONAL_PLAN_TEMPLATE_DOC_ID", PROPERTIES_TYPE_SCRIPT);
  var introDocId = getProperty("COMMUNITY_INTRODUCTION_DOC_ID", PROPERTIES_TYPE_SCRIPT);

  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Emails");
  var firstRowToProcess = 2; // First row of data to process
  var numRowsToProcess = sheet.getLastRow(); // Number of rows to process 
  // Fetch the range of cells (row, column, numRows, numColumns--this check column 3 is it is duplicate)
  const FOLDER_CREATED_COLUMN_INDEX = 4;
  var dataRange = sheet.getRange(firstRowToProcess, 1, numRowsToProcess - 1, FOLDER_CREATED_COLUMN_INDEX);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var name = row[0]; // First column
    var email = row[1]; // Second column
    var createdDate = row[3]; // Fourth column
    
    if (createdDate) {  // already has a record in Email Sheet
      continue;
    }
 
    var folderName = name;
    var parentFolder = DriveApp.getFolderById(parentFolderId);
    var existFolders = parentFolder.searchFolders('title = "' + folderName + '"');
    
    if (!existFolders.hasNext()) {
      var userFolder = parentFolder.createFolder(folderName);
      var userFolderId = userFolder.getId();
      
      //var personalPlanTemplateDoc = DriveApp.getFileById(personalPlanTemplateId);
      //var makeCopy = personalPlanTemplateDoc.makeCopy(folderName + ' Coderbunker Resident Freelancer', userFolder);
      var introDoc = DriveApp.getFileById(introDocId);
      var makeCopy = introDoc.makeCopy('Introduction to Coderbunker', userFolder);
      
      sheet.getRange(firstRowToProcess + i, 4).setValue(new Date());
      
      try {
        userFolder.setOwner(ownerEmail);  // TODO: cannot set a different domain user as owner!
      } catch (err) {
        showErrorDialog("Setting Folder Owner Failed" + folderName, err);
        log2File(err, "Setting Folder Owner Failed: " + folderName, LOG_LEVEL_ERROR);
        sendErrorEmail(err, "Setting Folder Owner Failed: " + folderName);
        console.error("Onboarding - create folder" + err);
      }
      
    } else {  // already has a folder that has the same name in Google Drive
      throw new Error('Already has a folder named ' + folderName + ' in Google Drive');
      
      continue;
    }
  }
}