function sendEmail(name, email) {
  var resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Emails");
  var userRowIndex = searchRow(name, resultSheet);
  var newUserRowRange = resultSheet.getRange(userRowIndex, 3); // get the "Email sent" cell
  
  if (!newUserRowRange.getValue()) {  // if there is no sending record
    // sending onboarding email
    var htmlTemplate = HtmlService.createTemplateFromFile("emailTemplate");
    htmlTemplate.name = name;
    htmlContent = htmlTemplate.evaluate().getContent();
    var subject = name + "'s " + "Coderbunker Onboarding";
    
    var profileImageFileId = getProperty("PROFILE_IMAGE_FILE_ID", PROPERTIES_TYPE_SCRIPT);
    var profileImage = DriveApp.getFileById(profileImageFileId);
    var addDriveImageId = getProperty("ADD_DRIVE_IMAGE_ID", PROPERTIES_TYPE_SCRIPT);
    var addDriveImage = DriveApp.getFileById(addDriveImageId);
    
    GmailApp.sendEmail(
      email, 
      subject, 
      "",  // leave the body of the email blank, because we are gonna use html templates (htmlBody)
      {
        from: "services@coderbunker.com",
        name: "Coderbunker Services", 
        cc: "bizdev@coderbunker.com",
        htmlBody: htmlContent, 
        inlineImages: {
          imageKey: profileImage.getAs(MimeType.PNG),
          addDrive: addDriveImage.getAs(MimeType.PNG),
        },
      }
    );
    
    // save the email sending result
    newUserRowRange.setValue(new Date());
  } else {
    console.log('Send onboarding Email to "' + user + '"' + ': Record existed in the table');
  }

}

function sendEmail2FailedOnes() {
  var profileImageFileId = getProperty("PROFILE_IMAGE_FILE_ID", PROPERTIES_TYPE_SCRIPT);
  var profileImage = DriveApp.getFileById(profileImageFileId);
  var addDriveImageId = getProperty("ADD_DRIVE_IMAGE_ID", PROPERTIES_TYPE_SCRIPT);
  var addDriveImage = DriveApp.getFileById(addDriveImageId);
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Emails");
  var firstRowToProcess = 2; // First row of data to process
  var numRowsToProcess = sheet.getLastRow(); // Number of rows to process 
  // Fetch the range of cells (row, column, numRows, numColumns--this check column 3 is it is duplicate)
  const SENT_COLUMN_INDEX = 3;
  var dataRange = sheet.getRange(firstRowToProcess, 1, numRowsToProcess - 1, SENT_COLUMN_INDEX);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var htmlTemplate = HtmlService.createTemplateFromFile('emailTemplate');
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var name = row[0]; // First column
    var email = row[1]; // Second column
    var isBlank = sheet.getRange(firstRowToProcess + i, SENT_COLUMN_INDEX, 1, 1).isBlank();
    Logger.log(isBlank);
    if (isBlank) { // Prevents sending duplicates
      htmlTemplate.name = name;
      htmlContent = htmlTemplate.evaluate().getContent();
      var subject = name + "'s " + "Coderbunker Onboarding";
  
      GmailApp.sendEmail(
        email, 
        subject, 
        "",  // leave the body of the email blank, because we are gonna use html templates (htmlBody)
        {
          from: "services@coderbunker.com", 
          name: "Coderbunker Services", 
          cc: "bizdev@coderbunker.com",
          htmlBody: htmlContent, 
          inlineImages: {
            imageKey: profileImage.getAs(MimeType.PNG), 
            addDrive: addDriveImage.getAs(MimeType.PNG),
          },
        }
      );
      sheet.getRange(firstRowToProcess + i, 3).setValue(new Date());
      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
 
    }
  }
}
