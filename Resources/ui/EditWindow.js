exports.EditWindow = function(_id, _item, _goalID)
{
	
//Check input pass

	Ti.API.info('Input taskID:'+_id);

//Call required database external functions

	var db = require('db');
	var record = db.selectByID(_id);
	var badgeLink = {};
	badgeLink['Combo1'] = 'images/Numbers-1-filled-icon.png';
	badgeLink['Combo2'] = 'images/Numbers-2-filled-icon.png';
	badgeLink['Early'] = 'images/Numbers-3-filled-icon.png';
	badgeLink['Goal'] = 'images/Numbers-4-filled-icon.png';
	badgeLink['DoneRed'] = 'images/Numbers-5-filled-icon.png';
	badgeLink['DoneOrange'] = 'images/Numbers-6-filled-icon.png';


//Batch variables for display inputs
	var workCounter = 0;
	var rewardsCounter = 
	{
		Combo1: 0,
		Combo2: 0,
		Early: 0,
		Goal: 0,
		DoneRed: 0,
		DoneOrange: 0,
		Total: 0
	};



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
		layout: 'vertical',
	});

	var botView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		bottom: 120,
		backgroundImage: 'images/Time-Timer-icon2.png',
	});


//Create labels and buttons

	var goalLbl = Ti.UI.createLabel({
		width: Titanium.UI.SIZE,
		height: Titanium.UI.SIZE,
		top: 25,
		text: db.selectByID(_id)[0].goalGuide == 0 ? '-' : db.selectByID(_id)[0].goalGuide,
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

	var goalProgress = Ti.UI.createLabel ({

		text: Math.round(db.selectByID(_id)[0].goalProgress)+'%',
		font:
		{
			fontSize: 14,
		},
	});
	Ti.App.addEventListener('app:updateDisplay', function(e) {
		goalProgress.text = db.selectByID(_id)[0].goalGuide == 0 ? '': Math.round(db.selectByID(_id)[0].goalProgress)+'%';
	});

	var botCounter = Ti.UI.createLabel({
		width: 25,
		height: 25,
		bottom: 120,
		backgroundImage: badgeLink['reward1'],
	}); 

	var rewardLbl = Ti.UI.createLabel ({
		text: '$'+db.getTotalRewards(_id),
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
		font: 
		{
			fontFamily:'HelveticaNeue',
		},
	});
	doneButton.addEventListener('click', function(e) {
		Ti.App.fireEvent('app:updateTables');
		tabGroup.close();
	});

	var addWorkButton = Ti.UI.createButton({
		title: '+ Work',
		width: '35%',
		height: 43,
		bottom: 30,
		backgroundColor: '#0080f0',
		color: 'white',
		borderRadius: 7,
		font: 
		{
			fontFamily:'HelveticaNeue',
			fontSize: 19,
		},
	});
	addWorkButton.addEventListener('touchstart', function(e) {
		showBadges(db.addWork(_id, _goalID));
		Ti.App.fireEvent('app:updateDisplay');
	});


//Add elements together

	leftNavView.add(rewardLbl);
	self.setLeftNavButton(leftNavView);
	self.add(vertBar);
	self.add(rightView);
	self.add(addWorkButton);
	self.setRightNavButton(doneButton);
	self.add(botView);
	rightView.add(goalLbl);
	rightView.add(goalProgress);
	tabGroup.addTab(tabWindow);
	tabGroup.currentTab = tabWindow;
	
	return tabGroup;

};

var showBadges = function (e)
{
	for (var i in e) 
	{
		if (e[i] != 'Work') 
			{
				console.log(e[i]);
			}
	}
};
