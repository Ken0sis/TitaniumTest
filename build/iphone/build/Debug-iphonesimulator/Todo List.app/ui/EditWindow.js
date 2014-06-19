exports.EditWindow = function(args)
{
	
//Call required database

	var db = require('db');
	var record = db.selectEdit(args);
	var tester = record[0].taskID;

	Ti.API.info(tester);

//Create window

	var self = Titanium.UI.createWindow(
	{
    title:'Edit Item',
    backgroundColor:'#fff',
    navBarHidden: false,
	});

//Test display

	var ItemField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '70dp',
		hintText: record[0].taskID,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_Done
	});

	self.add(ItemField);

	return self;


//Write function to grab all relevant data about Item



//Add display boxes
	//Define what each box displays in term of the data just we grabbed

//Add increment buttons to window
	//Create functions

/*Add event listener at end to refresh data when any increment button is clicked:

Ti.App.addEventListener('app:updateTables', function() {
	tableview.setData(getTableData(isDone));*/

};

//Write a function in db.js to pull all relevant data for an edit Item
	//You can probably just declar this output as a variable in main window, because we don't need a special function for this