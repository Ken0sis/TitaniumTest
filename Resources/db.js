var DATABASE_NAME = 'todo';

exports.createDb = function() {
	Ti.Database.install('todo.sqlite', DATABASE_NAME);
};

exports.selectByDone = function(_Done) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from todo where Done = ?', _Done);
	while (rows.isValidRow()) {
		retData.push({
			taskID: rows.fieldByName('TaskID'),
			item: rows.fieldByName('Item'),
			category: rows.fieldByName('Category'),
			done: rows.fieldByName('Done'),
			positionID: rows.fieldByName('PositionID'),
			dueDate: rows.fieldByName('DueDate'),
			loadSigma: rows.fieldByName('LoadSigma'),
			loadDelta: rows.fieldByName('LoadDelta'),
			workSigma: rows.fieldByName('WorkSigma'),
			workDelta: rows.fieldByName('WorkDelta'),
			goalID: rows.fieldByName('GoalID'),
			goalGuide: rows.fieldByName('GoalGuide'),
			goalType: rows.fieldByName('GoalType'),
			dueDelta: rows.fieldByName('DueDelta'),
			sprintID: rows.fieldByName('SprintID'),
			goalReward: rows.fieldByName('GoalReward'),
			sprintReward: rows.fieldByName('SprintReward'),
			earlyReward: rows.fieldByName('EarlyReward'),
			comboReward: rows.fieldByName('ComboReward'),
		});
		rows.next();
	}
	db.close();
	return retData;
};

exports.updateItem = function(_id, _Done) { 
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('update todo set Done = ? where TaskID = ?', _Done, _id);
	var rows = mydb.execute('select * from todo where Done = ?', _Done);
	mydb.close();
	return rows;
};


exports.addItem = function(_Item, _Category, _LoadSigma, _DueDate) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	var taskID = new Date().getTime();
	var dummyGoal = Math.floor(Math.random() * 10) + 1;
	mydb.execute('insert into todo (Item,Category,LoadSigma,DueDate,TaskID, GoalGuide) values (?,?,?,?,?,?)', _Item, _Category, _LoadSigma, _DueDate, taskID, dummyGoal);
	mydb.close();
};

exports.deleteItem = function(_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('delete from todo where TaskID = ?', _id);
	mydb.close();
};

exports.selectByID = function(_taskID) {
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
			loadDelta: rows.fieldByName('LoadDelta'),
			workSigma: rows.fieldByName('WorkSigma'),
			workDelta: rows.fieldByName('WorkDelta'),
			goalID: rows.fieldByName('GoalID'),
			goalGuide: rows.fieldByName('GoalGuide'),
			goalType: rows.fieldByName('GoalType'),
			dueDelta: rows.fieldByName('DueDelta'),
			sprintID: rows.fieldByName('SprintID'),
			goalReward: rows.fieldByName('GoalReward'),
			sprintReward: rows.fieldByName('SprintReward'),
			earlyReward: rows.fieldByName('EarlyReward'),
			comboReward: rows.fieldByName('ComboReward'),
		});
		rows.next();
	}
	db.close();
	return retData;
};

exports.getTotalRewards = function () {
	var mydb = Ti.Database.open(DATABASE_NAME);
	var retData = [];
	var TotalReward = mydb.execute('select sum(WorkReVal)+sum(GoalReVal)+sum(SprintReVal)+sum(EarlyReVal)+sum(ComboReVal) from rewards');

	while (TotalReward.isValidRow()) 
	{
		retData.push(TotalReward.fieldByName('sum(WorkReVal)+sum(GoalReVal)+sum(SprintReVal)+sum(EarlyReVal)+sum(ComboReVal)'));
		TotalReward.next();
	}
	mydb.close();
	return retData[0];
};

exports.addWork = function () {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('insert into rewards (TaskID,Item,SprintReVal) values (?,?,?)', 33333,'Testing', 100);
	mydb.close();
	return null;
};