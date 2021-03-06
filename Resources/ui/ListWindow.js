var platform = Ti.Platform.osname;

//A window object which will be associated with the stack of windows
exports.ListWindow = function(args) {
	var AddWindow = require('ui/AddWindow').AddWindow;
	var isDone = args.isDone;
	var self = Ti.UI.createWindow(args);
	var tableview = Ti.UI.createTableView({
		separatorColor:'#0088FF',
	});

	//Create necessary views for formatting

	var navBtnView = Ti.UI.createView({
		width: Titanium.UI.SIZE,
	});

	//Setting the data for table

	tableview.setData(getTableData(isDone));

	// Need to add a special 'add' button in the 'Todo' window for Mobile Web

	if (isDone || platform !== 'mobileweb') {
		self.add(tableview);
	}

	if (!isDone) {

		if (platform !== 'android') {
			var addBtn = Ti.UI.createButton({
				title:'+',
				font: {
					fontSize: 32,
					ontFamily: 'Arial',
				},
			});

			addBtn.addEventListener('click', function() {
				new AddWindow().open();
			});

		if (platform === 'mobileweb') {
			self.layout = 'vertical';
			addBtn.height = 40;
			addBtn.width = 40;
			addBtn.top = 0;
			addBtn.right = 10;
			self.add(addBtn);
			self.add(tableview);
			}
			else
			{
			navBtnView.add(addBtn);
			self.setRightNavButton(navBtnView);
			}
		}
	}

	//Add event listeners

	tableview.addEventListener('click', function(e) {
		if(e.source != "[object TiUIButton]") {
			createConfirmDialog(e.row.id, e.row.title, isDone).show();
		}
	});

	Ti.App.addEventListener('app:updateTables', function() {
		tableview.setData(getTableData(isDone));
	});

	return self;
};



var getTableData = function(Done) {
	var AddWindow = require('ui/AddWindow').AddWindow;
	var EditWindow = require('ui/EditWindow').EditWindow;
	var db = require('db');
	var data = [];    
	var row = null;
	var todoItems = db.selectByDone(Done);
	var catlist = [];
	var createHeader = function(_input) {
		var header = Ti.UI.createView (
		{
		height:28,
		backgroundColor:'#0080f0',
		});
		var headerTitle = Ti.UI.createLabel (
		{
			text: _input,
			color: 'white',
			font: {
				fontSize: 15,
				ontFamily: 'HelveticaNeue',
			},
			left:11,
		});
		header.add(headerTitle);

		return header;
	}

	//Create Category list

	for (var i=0; i < todoItems.length; i++) 
	{
		if (catlist.indexOf(todoItems[i].category) == -1) 
		{
		catlist.push(todoItems[i].category);
		}
	}

	//Create sections, create rows, and attach labels?

	for (var i=0; i < catlist.length; i++)            //For each Category, do this
	{
		var section = Ti.UI.createTableViewSection(
		{		
			headerView: new createHeader(catlist[i]),
		});
	
		for (var j=0; j < todoItems.length; j++)     //For each data Item, do this
		{

			if (todoItems[j].category == catlist[i])      //Create labels with eventlistner
			{

			function guideColor (type)
			{
				var colorTable = {};
				colorTable[1] = 'green';
				colorTable[2] = 'orange';
				colorTable[3] = 'red';
				
				return colorTable[type]; 
			}

			var label = Ti.UI.createButton({
				right: 7,
				title: todoItems[j].goalGuide == 0 ? '-' : todoItems[j].goalGuide,
				labelID: todoItems[j].taskID,
				labelItem: todoItems[j].item,
				goalID: todoItems[j].goalID,
				height: 30,
				width: 53,
				color: todoItems[j].goalGuide == 0 ? 'gray' : guideColor(todoItems[j].goalType),
				font: {
					fontWeight: 'normal',
					fontFamily: 'HelveticaNeue',
					fontSize: 24, 
				}	
			});

			Ti.API.info('taskID:'+todoItems[j].taskID, 'done:'+todoItems[j].done, 'goalType:'+todoItems[j].goalType, 'goalGuide:'+todoItems[j].goalGuide);

			label.addEventListener(
				'click', 
				function(e) 
				{
				Ti.App.fireEvent('app:resetCounter');
				new EditWindow(e.source.labelID, e.source.labelItem, e.source.goalID).open();      
				return false;
				}
			);

			var title = Ti.UI.createLabel({
				text: todoItems[j].item,
				color: '#424242',
				font: {
					fontSize: 18,
					fontFamily: 'HelveticaNeue'
				},
				width:200,
				ellipsize: true,
				wordWrap: false,
				horizontalWrap: false,
				left: 13,
				top: 7,
				height: 15,
			});

			var subtitle = Ti.UI.createLabel({
				text: '('+todoItems[j].loadSigma+' hrs), ('+todoItems[j].dueDate+')',
				color: 'gray',
				font: {
					fontStyle: 'italic',
					fontSize: 10
				},
				left: 14,
				top: 34,
				bottom: 7,
				height: Titanium.UI.SIZE,
			});
				
			var row = Ti.UI.createTableViewRow({    //Create row
				id: todoItems[j].taskID,    
				done: todoItems[j].done,
				color: '#000',
				font: {
					fontWeight: 'normal',
					fontSize: 13
					}
				});

			row.add(label);							//Add labels to the rows
			row.add(title);	
			row.add(subtitle);					
			section.add(row);	
			}
	    }
	    
		data.push(section);
		
	}

return data;

};

var createConfirmDialog = function(id, title, isDone) {
	var db = require('db');
	var buttons, DoneIndex, clickHandler;
     

	//Creates buttons and clickhandler.  Buttons and clickhandler are already declared as variables.
	//Buttons is just a list and clickhandler is a function.

	if (isDone) 
	{
		buttons = ['Delete', 'Cancel'];
		clickHandler = function(e) {
			if (e.index === 0) 
			{
				deleteItem(id, isDone);
				Ti.App.fireEvent('app:updateTables');       
			}
		};
	} 
	else 
	{
		buttons = ['Done', 'Delete', 'Cancel'];
		clickHandler = function(e) 
		{
			if (e.index === 0) {
				db.updateItem(id, 1);
				Ti.App.fireEvent('app:updateTables');
			} else if (e.index === 1) {
				db.deleteItem(id);
				console.log('deleted '+id);
				Ti.App.fireEvent('app:updateTables');
			}
		};
	}

	//This now creates the window for the buttons and clickhandler to act in.

	var confirm = Ti.UI.createAlertDialog({
		title: 'Change Task Status',
		message: title,
		buttonNames: buttons
	});
	confirm.addEventListener('click', clickHandler);

	return confirm;
};