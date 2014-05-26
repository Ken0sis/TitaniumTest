exports.AddWindow = function() {
	var db = require('db');
	var self = Ti.UI.createWindow({
		modal: true,
		title: 'Add Item',
		backgroundColor: '#fff'
	});
	
	var itemField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '20dp',
		hintText: 'New Item',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_DONE
	});
	itemField.addEventListener('return', function(e) {
		addTask(itemField.value, categoryField.value, self);
	});
	
	
	
    var categoryField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '80dp',
		hintText: 'Category',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_DONE
	});
	itemField.addEventListener('return', function(e) {
		addTask(itemField.value, categoryField.value, self);
	});	
	
	
	

	var addButton = Ti.UI.createButton({
		title: 'Add',
		width: '300dp',
		height: '40dp',
		top: '140dp'
	});
	addButton.addEventListener('click', function() {
		addTask(itemField.value, categoryField.value, self);
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

	self.add(itemField);
	self.add(categoryField);
	self.add(addButton);
	self.add(cancelButton);

	return self;
};

var addTask = function(_item, _category, win) {
	if (_item === '') {
		alert('Please enter a task first');
		return;
	}

	require('db').addItem(_item, _category);
	Ti.App.fireEvent('app:updateTables');
	win.close();
};