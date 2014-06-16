var DATABASE_NAME = 'todo';

exports.createDb = function() {
	Ti.Database.install('todo.sqlite', DATABASE_NAME);
};

exports.selectItems = function(_Done) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select ROWID, * from todo where Done = ?', _Done);
	while (rows.isValidRow()) {
		retData.push({Item: rows.fieldByName('Item'), cat: rows.fieldByName('TimeStamp') ,id:rows.fieldByName('ROWID')});
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

exports.addItem = function(_Item, _Category, _HoursRemain, _DueDate) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	var timeID = new Date().getTime();
	mydb.execute('insert into todo (Item,Category,HourRemain,DueDate,TaskID) values (?,?,?,?,?)', _Item, _Category, _HoursRemain, _DueDate, timeID);
	mydb.close();
};

exports.deleteItem = function(_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('delete from todo where ROWID = ?', _id);
	mydb.close();
};