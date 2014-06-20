exports.EditWindow = function(args)
{
	
//Call required database

	var db = require('db');
	var record = db.selectEdit(args);

	Ti.API.info(args);


//Create window

	var self = Ti.UI.createWindow(
	{
	title: 'Add Item',
	navBarHidden: false,
    backgroundColor:'#fff',
	});

	var cancelButton = Ti.UI.createButton({
		title: 'Cancel',
		width: '300dp',
		height: '40dp',
		top: '400dp'
	});
	cancelButton.addEventListener('click', function(e) {
		self.close();
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
	self.add(cancelButton);

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