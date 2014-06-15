exports.AddWindow = function() {
	var db = require('db');
	var self = Ti.UI.createWindow({
		modal: true,
		title: 'Add Item',
		backgroundColor: '#fff'
	});
	
	//Setting up the input fields
	
	var hint = function randomInt(max){
  		return Math.floor(Math.random() * max) + 1;
	};
	
	var ItemField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '70dp',
		hintText: 'New Item',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_Done
	});
	
	var CategoryField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '135dp',
		hintText: 'Category',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_Done
	});
	
	var HoursField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '200dp',
		hintText: 'Estimated Hours',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_Done
	});
	
	var DueField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '265dp',
		hintText: 'Due Date',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_Done
	});
	
	
	
	//Setting up Listeners
	
	ItemField.addEventListener('return', function(e) {
		addTask(ItemField.value, CategoryField.value, HoursField.value, DueField.value, self);
	});
    
	CategoryField.addEventListener('return', function(e) {
		addTask(ItemField.value, CategoryField.value, HoursField.value, DueField.value, self);
	});	
	
	DueField.addEventListener('return', function(e) {
		addTask(ItemField.value, CategoryField.value, HoursField.value, DueField.value, self);
	});	
	
	HoursField.addEventListener('return', function(e) {
		addTask(ItemField.value, CategoryField.value, HoursField.value, DueField.value, self);
	});	
	
	
	//Setting up Buttons
	
	var addButton = Ti.UI.createButton({
		title: 'Add',
		width: '300dp',
		height: '40dp',
		top: '350dp'
	});
	addButton.addEventListener('click', function() {
		addTask(ItemField.value, CategoryField.value, HoursField.value, DueField.value, self);
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

	self.add(ItemField);
	self.add(CategoryField);
	self.add(HoursField);
	self.add(DueField);
	self.add(addButton);
	self.add(cancelButton);

	return self;
};

var addTask = function(_Item, _Category, _HoursRemain, _DueDate, win) {
	if (_Item === '') {
		alert('Please enter a task first');
		return;
	}
	require('db').addItem(_Item, _Category, _HoursRemain, _DueDate);
	Ti.App.fireEvent('app:updateTables');
	win.close();
};