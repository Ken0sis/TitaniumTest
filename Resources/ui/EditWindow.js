exports.EditWindow = function(_id, _item, _goalID)
{
	
//Check input pass

	Ti.API.info('Input taskID:'+_id);

//Call required database and create temporary memory counter

	var db = require('db');
	var record = db.selectByID(_id);
	var imageLink = 
	{
		WorkHrs: 'images/Numbers-1-filled-icon.png',
		Combo1: 'images/Numbers-2-filled-icon.png',
		Combo2: 'images/Numbers-3-filled-icon.png',
		Early: 'images/Numbers-4-filled-icon.png',
		Goal: 'images/Numbers-5-filled-icon.png',
		DoneRed: 'images/Numbers-5-filled-icon.png',
		DoneOrange: 'images/Numbers-5-filled-icon.png',
		Total: 'images/Numbers-5-filled-icon.png'
	};
	var tempMem = 
	{
		WorkHrs: 0,
		Combo1: 0,
		Combo2: 0,
		Early: 0,
		Goal: 0,
		DoneRed: 0,
		DoneOrange: 0,
		Total: 0
	};
	Ti.App.addEventListener('app:resetCounter', function(e) {
	for (var i in tempMem)
	{
		tempMem[i]=0;
	}});

//Function to refresh counter

	var updateCounter = function (e)
	{
		for (var i in e) 
		{
			if (i != 'Work') 
				{
					tempMem[i] = tempMem[i]+1;
				}
		}
		tempMem['WorkHrs'] = tempMem['WorkHrs']+0.5;
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
		layout:'horizontal',
		bottom: 140,
	});


//Function to show badge

	var showBadge = function (e)
	{

		botView.removeAllChildren( );

		var a = Ti.UI.createAnimation({
			opacity:0,
			duration:1500,
			height: 15,
		});

		var b = Ti.UI.createAnimation({
			opacity:1,
			duration:2000,
			delay: 500,
		});

		var badgeImage = {};
		var badgeView = {};
		var badgeLabel = {};

		for (var i in e) 
		{
			if (i != 'Work') 
			{
			

				badgeView[i] = Ti.UI.createView({
					layout: 'vertical',
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
				});

				badgeImage[i] = Titanium.UI.createImageView ({
					image: imageLink[i],
					width: 30,
					height: 30,
				});

				badgeLabel[i] = Ti.UI.createLabel ({
					text: e[i],
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					font:
					{
						fontSize: 14,
					},
				});

				botView.add(badgeView[i]);
				badgeView[i].add(badgeLabel[i]);
				badgeView[i].add(badgeImage[i]);
				
			}

			if (i == 'Combo1')
			{
				badgeImage[i].animate(a);
			}

		}

		
	};

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
		updateCounter(db.addWork(_id, _goalID));
		showBadge(tempMem);
		console.log(tempMem);
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