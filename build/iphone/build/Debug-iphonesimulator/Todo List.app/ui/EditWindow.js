exports.EditWindow = function(_id, _item)
{
	
//Check input pass

	Ti.API.info(_id);

//Call required database and create visual elements

	var db = require('db');
	var record = db.selectByID(_id);
	var totalRewards = db.getTotalRewards();

	Ti.API.info(totalRewards[0].results);

	var self = Ti.UI.createWindow(
	{
		title: 'Edit Item',
    	backgroundColor:'#fff',
    	tabBarHidden: true
	});

	var navView = Ti.UI.createView({
		width: Titanium.UI.SIZE,
		horizontalWrap: 'false',
		layout: 'horizontal',
		right:0,
		left: 0,
	});

	var rewardBtn = Ti.UI.createLabel ({
		text: '$125',
		right: 0,
		width: Titanium.UI.SIZE,
	});

	var cancelButton = Ti.UI.createButton({
		title: 'Cancel',
		width: '300dp',
		height: '40dp',
		top: '400dp'
	});
	cancelButton.addEventListener('click', function(e) {
		tabGroup.close();
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

	navView.add(rewardBtn);
	self.setRightNavButton(navView);
	self.add(goalField);
	self.add(cancelButton);

//Add tab elements together

	var tabGroup = Titanium.UI.createTabGroup();

	var tabWindow = Titanium.UI.createTab(
	{ 
    	title:'Edit Item',
    	window:self
	});

	tabGroup.addTab(tabWindow);
	tabGroup.currentTab = tabWindow;
	
//Set to display
	
	return tabGroup;


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