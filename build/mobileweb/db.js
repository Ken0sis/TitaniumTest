/* 
 * Database is currently not available on Mobile Web.
 * Use Ti.App.Properties for lightweight key/value store.
 */

var DATABASE_NAME = 'todo';

exports.createDb = function() {
	var list = {
		todoList: ['Pick up groceries', 'Sleep', 'Take out the garbage', 'Make dinner'],
		DoneList: ['Create a Titanium app']
	};
	Ti.App.Properties.setString(DATABASE_NAME, JSON.stringify(list));
};

exports.selectItems = function(_Done) {
	var retData = [];
	var allData = JSON.parse(Ti.App.Properties.getString(DATABASE_NAME));
	var rows = [];
	
	if (_Done === 0) {
		rows = allData.todoList;
	}
	else {
		rows = allData.DoneList;
	}
	
	for (var i=0; i<rows.length; i++) {
		retData.push({Item:rows[i], id:i});
	}
	return retData;
};

exports.updateItem = function(_id, _Done) { 
	var allData = JSON.parse(Ti.App.Properties.getString(DATABASE_NAME));
	var todoList = allData.todoList;
	var DoneList = allData.DoneList;
	var rows = [];
	if (_Done == 1) {
		var Item = todoList[_id];
		DoneList.push(Item);
		todoList.splice(_id, 1);
		rows = DoneList;
	}
	else {
		var Item = DoneList[_id];
		todoList.push(Item);
		DoneList.splice(_id, 1);
		rows = todoList;
	}
	Ti.App.Properties.setString(DATABASE_NAME, JSON.stringify(allData));
	return rows;
};

exports.addItem = function(_Item) {
	var allData = JSON.parse(Ti.App.Properties.getString(DATABASE_NAME));
	var todoList = allData.todoList;
	todoList.push(_Item);
	Ti.App.Properties.setString(DATABASE_NAME, JSON.stringify(allData));
};

exports.deleteItem = function(_id, _Done) {
	var allData = JSON.parse(Ti.App.Properties.getString(DATABASE_NAME));
	if (_Done == 0) {
		allData.todoList.splice(_id, 1);
	}
	else {
		allData.DoneList.splice(_id, 1);
	}
	Ti.App.Properties.setString(DATABASE_NAME, JSON.stringify(allData));
};