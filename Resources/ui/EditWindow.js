exports.EditWindow = function(_id, _item, _goalID)
{
	
//Check input pass

	Ti.API.info(_id);

//Call required database external functions

	var db = require('db');
	var record = db.selectByID(_id);
	var getTotalRewards = db.getTotalRewards(_id);
	var imageLink = {};
	imageLink['reward1'] = 'images/Numbers-1-filled-icon.png';
	imageLink['reward2'] = 'images/Numbers-2-filled-icon.png';
	imageLink['reward3'] = 'images/Numbers-3-filled-icon.png';
	imageLink['reward4'] = 'images/Numbers-4-filled-icon.png';
	imageLink['reward5'] = 'images/Numbers-5-filled-icon.png';
	imageLink['reward6'] = 'images/Numbers-6-filled-icon.png';
	imageLink['reward7'] = 'images/Numbers-7-filled-icon.png';


//Create decisioning functions




//Create tabs, windows and views

	var self = Ti.UI.createWindow(
	{
		title: 'Edit Item',
    	backgroundColor:'#FFFFFF',
    	barColor:'#FFFFFF',
    	translucent: false,
    	tabBarHidden: true
	});

	var tabGroup = Titanium.UI.createTabGroup();

	var tabWindow = Titanium.UI.createTab(
	{ 
    	title:'Edit Item',
    	window:self
	});

	var leftNavView = Ti.UI.createView({
		width: Titanium.UI.SIZE,
		horizontalWrap: 'true',
		layout: 'horizontal',
	});

	var vertBar = Ti.UI.createView({
		width: .5,
		borderWidth: .25,
		borderColor: '#ADADAD',
		top: 20,
		height: 150,
	}); 

	var rightView = Ti.UI.createView({
		left: '50%',
	});

	/*var botView = Ti.UI.createView({
		width: 32,
		height: 32,
		bottom: 120,
		backgroundImage: 'images/Time-Timer-icon2.png',
	}); */


//Create labels and buttons

	var goalLbl = Ti.UI.createLabel({
		width: Titanium.UI.SIZE,
		height: Titanium.UI.SIZE,
		top: 25,
		text: db.selectByID(_id)[0].goalGuide == 0 ? 'F' : db.selectByID(_id)[0].goalGuide,
		textAlign: 'center',
		color: '#0080f0',
		font: 
		{
			fontSize: 60
		}
	});
	Ti.App.addEventListener('app:updateDisplay', function(e) {
		goalLbl.text = db.selectByID(_id)[0].goalGuide == 0 ? '-' : db.selectByID(_id)[0].goalGuide;
	});

	var botCounter = Ti.UI.createLabel({
		width: 25,
		height: 25,
		bottom: 120,
		backgroundImage: imageLink['reward1'],
	}); 

	var rewardLbl = Ti.UI.createLabel ({
		text: '$'+getTotalRewards,
		width: 100,
		layout: 'horizontal',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		font: {
			fontSize: 11
		}
	});
	Ti.App.addEventListener('app:updateDisplay', function(e) {
		rewardLbl.text = '$'+db.getTotalRewards(_id);
	});

	var doneButton = Ti.UI.createButton({
		title: 'Done',
		width: '40%',
		height: 35,
		bottom: 20,
		backgroundColor: '#0080f0',
		color: 'white',
		borderRadius: 5,
		font: 
		{
			fontFamily:'HelveticaNeue',
			fontSize: 17,
		},
	});
	doneButton.addEventListener('click', function(e) {
		Ti.App.fireEvent('app:updateTables');
		tabGroup.close();
	});

	var addWorkButton = Ti.UI.createButton({
		title: '+ Work',
		width: '40%',
		height: 35,
		bottom: 65,
		backgroundColor: '#0080f0',
		color: 'white',
		borderRadius: 5,
		font: 
		{
			fontFamily:'HelveticaNeue',
			fontSize: 17,
		},
	});
	addWorkButton.addEventListener('touchstart', function(e) {
		db.addWork(_id, _goalID);
		Ti.App.fireEvent('app:updateDisplay');
	});


//Add elements together

	leftNavView.add(rewardLbl);
	self.setLeftNavButton(leftNavView);
	self.add(vertBar);
	self.add(rightView);
	self.add(doneButton);
	self.add(addWorkButton);
	rightView.add(goalLbl);
	tabGroup.addTab(tabWindow);
	tabGroup.currentTab = tabWindow;
	
	return tabGroup;

};

var showBadges = function ()
{

};
