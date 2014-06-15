exports.AddWindow = function() {
	var db = require('db');
	var self = Ti.UI.createWindow({
		modal: true,
		title: 'Add Item',
		backgroundColor: '#fff'
	});
	
	var ItemField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '20dp',
		hintText: 'New Item',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_Done
	});
	ItemField.addEventListener('return', function(e) {
		addTask(ItemField.value, CategoryField.value, self);
	});
	
	var hint = function randomInt(max){
  		return Math.floor(Math.random() * max) + 1;
	};
	
    var CategoryField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '80dp',
		hintText: hint(10),
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_Done
	});
	ItemField.addEventListener('return', function(e) {
		addTask(ItemField.value, CategoryField.value, self);
	});	
	
	
	

	var addButton = Ti.UI.createButton({
		title: 'Add',
		width: '300dp',
		height: '40dp',
		top: '140dp'
	});
	addButton.addEventListener('click', function() {
		addTask(ItemField.value, CategoryField.value, self);
	});

	var cancelButton = Ti.UI.createButton({
		title: 'Cancel',
		width: '300dp',
		height: '40dp',
		top: '200dp'
	});
	cancelButton.addEventListener('click', function(e) {
		self.close();
	});

	self.add(ItemField);
	self.add(CategoryField);
	self.add(addButton);
	self.add(cancelButton);

	return self;
};

var addTask = function(_Item, _Category, win) {
	if (_Item === '') {
		alert('Please enter a task first');
		return;
	}

	require('db').addItem(_Item, _Category);
	Ti.App.fireEvent('app:updateTables');
	win.close();
};