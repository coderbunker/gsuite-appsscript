function testAddNewRow() {
  var testUserName = "Test User - Andie";
  var testUserEmail = "angdichu@gmail.com";
  addNewRecord(testUserName, testUserEmail);
}

function testSearchRow() {
  var keyword = "Test User - Andie";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Emails");
  Logger.log(searchRow(keyword, sheet));
}

function testSearchFolder() {
  var parentFolder = DriveApp.getFolderById("0B-PYJiOSewXLUE1obURNLURxX1k");
  var subFolders = parentFolder.getFolders();
  var folderExists = false;
    
  var folders = parentFolder.searchFolders('title = "Angdi Chu"');
  if (!folders.hasNext()) {
    Logger.log("No folder named: Angdi Chu");
  }
  while (folders.hasNext()) {
    Logger.log(folders.next().getName());
  }
}

function testSendEmail() {
    var testUserName = "Test User - Andie";
    var testUserEmail = "angdichu@gmail.com";

    sendEmail(testUserName, testUserEmail);
}

function testCreateFolder() {
  var testUserName = "Andie - Test";
  var testUserEmail = "angdichu@gmail.com";
  
  createFolderNew(testUserName, testUserEmail);
}

function testEmailAlias() {
  var me = Session.getActiveUser().getEmail();
  var aliases = GmailApp.getAliases();
  Logger.log(aliases);
  Logger.log(me)
}

function testOnboarding() {
  // mimic event data
  var namedValues = {};
  namedValues["Full name"] = "Test User - Andie";
  namedValues["Email Address"] = "angdichu@gmail.com";
  var event = { namedValues: namedValues };

  onboarding(event);
}