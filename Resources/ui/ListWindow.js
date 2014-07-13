var platform = Ti.Platform.osname;

//A window object which will be associated with the stack of windows
exports.ListWindow = function(args) {
	var AddWindow = require('ui/AddWindow').AddWindow;
	var self = Ti.UI.createWindow(args);
	var tableview = Ti.UI.createTableView();
	var isDone = args.isDone;

	tableview.setData(getTableData(isDone));

	// Need to add a special 'add' button in the 'Todo' window for Mobile Web

	if (isDone || platform !== 'mobileweb') {
		self.add(tableview);
	}

	if (!isDone) {
		if (platform !== 'android') {
			var addBtn = Ti.UI.createButton({
				title:'+ '
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
			else{
				self.rightNavButton = addBtn;
			}
		}
	}

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
	var todoItems = db.selectItems(Done);
	var catlist = [];

	//Create Category list

	for (var i=0; i < todoItems.length; i++) 
	{
		if (catlist.indexOf(todoItems[i].cat) == -1) 
		{
		catlist.push(todoItems[i].cat);
		}
	}

	//Create sections, create rows, and attach labels?

	for (var i=0; i < catlist.length; i++)            //For each Category, do this
	{
		var section = Ti.UI.createTableViewSection({
		headerTitle:catlist[i],
		font: {
			fontSize: 20
		}
		});
	
		for (var j=0; j < todoItems.length; j++)     //For each data Item, do this
		{

			if (todoItems[j].cat == catlist[i])      //Creates label with eventlistner
			{

			var label = Ti.UI.createButton({
				right: 10,
				title: todoItems[j].goalGuide,
				labelID: todoItems[j].id,
				height: 30,
				width: 25,
				font: {
					fontWeight: 'normal',
					fontSize: 19, 
				}	
			});

			Ti.API.info(todoItems[j].id, todoItems[j].done);

			label.addEventListener(
				'click', 
				function(e) 
				{
				new EditWindow(e.source.labelID).open();        
				return false;
				}
			);

			
			var title = Ti.UI.createLabel({
				text: todoItems[j].item,
				color: 'black',
				font: {
					fontSize: 14,
					fontFamily: 'Helvetica'
				},
				left: 15,
				top: 5,
				height: 15
			});

			var subtitle = Ti.UI.createLabel({
				text: '('+todoItems[j].hours+' hrs), ('+todoItems[j].due+')',
				color: '#0080f0',
				font: {
					fontStyle: 'italic',
					fontSize: 9
				},
				left: 16,
				top: 24,
				bottom: 6,
				height: 15
			});
				
			var row = Ti.UI.createTableViewRow({    //Creates row
				id: todoItems[j].id,    
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
				deleteItem(db, id, isDone);
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
				deleteItem(db, id, isDone);
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

var deleteItem = function(db, id, isDone) {
	if (platform === 'mobileweb') {
		db.deleteItem(id, isDone);
	}
	else {
		db.deleteItem(id);
	}
};
