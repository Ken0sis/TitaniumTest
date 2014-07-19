exports.AddWindow = function() {
	var db = require('db');
	var self = Ti.UI.createWindow({
		modal: true,
		title: 'Add Item',
		backgroundColor: '#fff'
	});
	var scrollView = Ti.UI.createScrollView(
	{
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: true,
  		showHorizontalScrollIndicator: true,
  		height: Titanium.UI.FILL,
  		width: Titanium.UI.FILL,
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
		returnKeyType: Titanium.UI.RETURNKEY_NEXT
	});
	
	var CategoryField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '135dp',
		hintText: 'Category',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT
	});
	
	var HoursField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '200dp',
		hintText: 'Estimated Hours',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT
	});
	
	var DueField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '265dp',
		hintText: 'Due Date',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType: Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
		returnKeyType: Titanium.UI.RETURNKEY_DONE
	});
	
	
	
	//Setting up Listeners
	
	ItemField.addEventListener('return', function(e) {
		CategoryField.focus();
	});
    
	CategoryField.addEventListener('return', function(e) {
		HoursField.focus();
	});	
	
	HoursField.addEventListener('return', function(e) {
		DueField.focus();
		});	

	DueField.addEventListener('return', function(e) {
		addTask(ItemField.value, CategoryField.value, HoursField.value, DueField.value, self);
	});	
	
	
	
	//Setting up Buttons
	
	var addButton = Ti.UI.createButton({
		title: 'Add',
		width: '300dp',
		height: '40dp',
		bottom: '85dp'
	});
	addButton.addEventListener('click', function() {
		addTask(ItemField.value, CategoryField.value, HoursField.value, DueField.value, self);
	});

	var cancelButton = Ti.UI.createButton({
		title: 'Cancel',
		width: '300dp',
		height: '40dp',
		bottom: '40dp'
	});
	cancelButton.addEventListener('click', function(e) {
		self.close();
	});

	scrollView.add(ItemField);
	scrollView.add(CategoryField);
	scrollView.add(HoursField);
	scrollView.add(DueField);
	scrollView.add(addButton);
	scrollView.add(cancelButton);
	self.add(scrollView);

	return self;
};

var addTask = function(_Item, _Category, _LoadSigma, _DueDate, win) {
	if (_Item === '' || _Category ==='' || _LoadSigma ==='' || _DueDate ==='') {
		alert('Please provide more details about this task');
		return;
	}
	require('db').addItem(_Item, _Category, _LoadSigma, _DueDate);
	Ti.App.fireEvent('app:updateTables');
	win.close();
};