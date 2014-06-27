exports.EditWindow = function(args)
{
	
//Call required database and creat window

	var db = require('db');
	var record = db.selectEdit(args);

	Ti.API.info(args);

	var self = Ti.UI.createWindow(
	{
	title: 'Add Item',
    backgroundColor:'#fff',
	});

//Create buttons

	var cancelButton = Ti.UI.createButton({
		title: 'Cancel',
		width: '300dp',
		height: '40dp',
		top: '400dp'
	});
	cancelButton.addEventListener('click', function(e) {
		self.close();
	});




//Create fields

	var goalField = Ti.UI.createLabel({
		width: '200dp',
		height: '45dp',
		top: '70dp',
		left:'10dp',
		text: record[0].goalGuide,
		textAlign: 'center',
		borderColor: '#0080f0',
		returnKeyType: Ti.UI.RETURNKEY_Done
	});

//Add elements

	self.add(goalField);
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