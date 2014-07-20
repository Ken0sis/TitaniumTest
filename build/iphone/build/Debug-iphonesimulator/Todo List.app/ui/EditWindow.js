exports.EditWindow = function(_id, _item)
{
	
//Check input pass

	Ti.API.info(_id);

//Call required database and create visual elements

	var db = require('db');
	var record = db.selectByID(_id);
	var getTotalRewards = db.getTotalRewards();

	Ti.API.info(getTotalRewards);

	var self = Ti.UI.createWindow(
	{
		title: 'Edit Item',
    	backgroundColor:'#FFFFFF',
    	barColor:'#FFFFFF',
    	translucent: false,
    	tabBarHidden: true
	});

	var leftNavView = Ti.UI.createView({
		width: Titanium.UI.SIZE,
		horizontalWrap: 'false',
		layout: 'horizontal',
		right:0,
		left: 0,
	});

	var vertBar = Ti.UI.createView({
		width: .5,
		borderWidth: .25,
		borderColor: '#ADADAD',
		top: 20,
		height: 220,
	}); 

	var rewardLbl = Ti.UI.createLabel ({
		text: '$'+getTotalRewards,
		right: 0,
		width: Titanium.UI.SIZE,
		font: {
			fontSize: 11
		}
	});
	Ti.App.addEventListener('app:updateRewards', function(e) {
		rewardLbl.text = '$'+db.getTotalRewards();
	});

	var cancelButton = Ti.UI.createButton({
		title: 'Cancel',
		width: '300dp',
		height: '40dp',
		bottom: '40dp'
	});
	cancelButton.addEventListener('click', function(e) {
		tabGroup.close();
	});

	var addWorkButton = Ti.UI.createButton({
		title: '+ Work',
		width: '300dp',
		height: '40dp',
		bottom: '85dp'
	});
	addWorkButton.addEventListener('touchstart', function(e) {
		db.addWork();
		Ti.App.fireEvent('app:updateRewards');
	});

//Define output data

	

//Create fields

	var goalLbl = Ti.UI.createLabel({
		width: Titanium.UI.SIZE,
		height: Titanium.UI.SIZE,
		top: 25,
		left: '69%',
		text: record[0].goalGuide,
		textAlign: 'center',
		color: '#424242',
		font: 
		{
			fontSize: 60
		}
	});

//Add elements

	leftNavView.add(rewardLbl);
	self.setLeftNavButton(leftNavView);
	self.add(vertBar);
	self.add(goalLbl);
	self.add(cancelButton);
	self.add(addWorkButton);

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