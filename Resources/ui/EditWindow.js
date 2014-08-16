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
		Combo1: 'images/orange-sticker-badges-036-icon.png',
		Combo2: 'images/orange_grunge_sticker_badges_209.png',
		Early: 'images/orange-sticker-badges-295-icon.png',
		Goal: 'images/orange_grunge_sticker_badges_145.png',
		DoneRed: 'images/orange-sticker-badges-139-icon.png',
		DoneOrange: 'images/orange_grunge_sticker_badges.png',
	};
	var newRewards = {};
	var tempMem = 
	{
		WorkHrs: 0,
		Combo1: 0,
		Combo2: 0,
		Early: 0,
		Goal: 0,
		DoneRed: 0,
		DoneOrange: 0,
	};
	Ti.App.addEventListener('app:resetCounter', function(e) {
	for (var i in tempMem)
	{
		tempMem[i]=[0,0];
		botView.removeAllChildren();
	}});
	

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
		width: '100%',
		height: '15%',
		backgroundColor: 'green',
		bottom: 190,
	});

	var badgeImage = {};
	var badgeView = {};
	var badgeLabel = {};


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
		bottom: 35,
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
		newRewards = db.addWork(_id, _goalID);
		console.log(newRewards);
		updateCounter();
		console.log(tempMem);
		showBadge();
		animateBadge();
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


//Function to update temporary memory counter

	var updateCounter = function ()
	{

		for (var i in newRewards) 
		{

			if (newRewards[i]>0) 
				{
					tempMem[i] = tempMem[i] + newRewards[i];
				}

		}
		tempMem['WorkHrs'] = tempMem['WorkHrs']+0.5;
	};

//Functions for animations

	var forward = Ti.UI.createAnimation({
		opacity:0.2,
		duration:80,
		autoreverse: false,
		width: 42,
		height: 42,

	});

	var backward = Ti.UI.createAnimation({
		opacity:1,
		duration:80,
		autoreverse: false,
		width: 50,
		height: 50,

	});

//Function to show badge

	var showBadge = function ()
	{

		for (var i in tempMem) 
		{
			if (i != 'WorkHrs' && newRewards[i]>0 && tempMem[i]-newRewards[i] == 0) 
			{

				badgeView[i] = Ti.UI.createView({
					width: '16%',
					height: '100%',
					backgroundColor: 'yellow',
				});

				badgeImage[i] = Titanium.UI.createImageView ({
					image: imageLink[i],
					width: 55,
					height: 55,
				});

				badgeLabel[i] = Ti.UI.createLabel ({
					text: '$'+tempMem[i],
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					color: 'gray',
					top: '1%',
					font:
					{
						fontSize: 8,
						fontStyle: 'italic',
					},
				});

				botView.add(badgeView[i]);
				badgeView[i].add(badgeLabel[i]);
				badgeView[i].add(badgeImage[i]);
			}
		}	

		for (var i in newRewards)
		{
			if (newRewards[i]>0)
			{
				badgeLabel[i].text = '$'+tempMem[i];
			}
		}
	};

//Function to animate

	var animateBadge = function ()
	{

		function animate1 (input, callback)
		{

			console.log(input);
			console.log(callback);

			if (newRewards[input] > 0)
			{
				var t = setTimeout(function()
				{
					badgeImage[input].animate(forward);
					if (callback != 1)
					{
						eval(callback);
					}
					console.log ('fired1 ' + new Date().getTime());
					clearInterval(t);
					t=null;
				}, 90);
			}
			else
			{
				if (callback != 1)
					{
						eval(callback);
					}
					console.log ('fired2 '+ new Date().getTime());
			}
		}

		function animate2 (input, callback)
		{
			if (newRewards[input] > 0)
			{
				var t = setTimeout(function()
				{
					badgeImage[input].animate(backward);
					if (callback != 1)
					{
						eval(callback);
					}
					console.log ('fired3 ' + new Date().getTime());
					clearInterval(t);
					t=null;
				}, 90);
			}
			else
			{
				if (callback != 1)
					{
						eval(callback);
					}
					console.log ('fired4 '+ new Date().getTime());
			}
		}


		animate1('Combo2',animate1('Combo1',animate1('Early',animate1('Goal',animate1('DoneRed',animate1('DoneOrange',1))))));
		var t1 = setTimeout(function () 
		{
			animate2('Combo2',animate2('Combo1',animate2('Early',animate2('Goal',animate2('DoneRed',animate2('DoneOrange',1))))));
			clearInterval(t1);
			t1=null;
		}, 90);

	};

	return tabGroup;

};