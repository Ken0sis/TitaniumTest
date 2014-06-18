var DATABASE_NAME = 'todo';

exports.createDb = function() {
	Ti.Database.install('todo.sqlite', DATABASE_NAME);
};

exports.selectItems = function(_Done) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from todo where Done = ?', _Done);
	while (rows.isValidRow()) {
		retData.push({item: rows.fieldByName('Item'), cat: rows.fieldByName('TaskID') ,id: rows.fieldByName('TaskID')});
		rows.next();
	}
	db.close();
	return retData;
};

exports.updateItem = function(_id, _Done) { 
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('update todo set Done = ? where ROWID = ?', _Done, _id);
	var rows = mydb.execute('select * from todo where Done = ?', _Done);
	mydb.close();
	return rows;
};


exports.addItem = function(_Item, _Category, _LoadSigma, _DueDate) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	var taskID = new Date().getTime();
	mydb.execute('insert into todo (Item,Category,LoadSigma,DueDate,TaskID) values (?,?,?,?,?)', _Item, _Category, _LoadSigma, _DueDate, taskID);
	mydb.close();
};

exports.deleteItem = function(_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('delete from todo where ROWID = ?', _id);
	mydb.close();
};

exports.selectEdit = function(_taskID) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from todo where TaskID = ?', _taskID);
	while (rows.isValidRow()) {
		retData.push(
		{ 
			taskID: rows.fieldByName('TaskID'),
			item: rows.fieldByName('Item'),
			category: rows.fieldByName('Category'),
			done: rows.fieldByName('Done'),
			positionID: rows.fieldByName('PositionID'),
			dueDate: rows.fieldByName('DueDate'),
			loadSigma: rows.fieldByName('LoadSigma'),
			workSigma: rows.fieldByName('WorkSigma'),
			goalID: rows.fieldByName('GoalID'),
			goalGuide: rows.fieldByName('GoalGuide'),
			goalType: rows.fieldByName('GoalType'),
			goalSigma: rows.fieldByName('GoalSigma'),
			loadDelta: rows.fieldByName('LoadDelta'),
			workDelta: rows.fieldByName('WorkDelta'),
			dueDelta: rows.fieldByName('DueDelta') 
		});
		rows.next();
	}
	db.close();
	return retData;
};