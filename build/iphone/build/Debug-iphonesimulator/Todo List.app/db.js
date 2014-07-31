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
			timeStamp: rows.fieldByName('TimeStamp'),
			taskID: rows.fieldByName('TaskID'),
			item: rows.fieldByName('Item'),
			category: rows.fieldByName('Category'),
			done: rows.fieldByName('Done'),
			positionID: rows.fieldByName('PositionID'),
			dueDate: rows.fieldByName('DueDate'),
			dueDelta: rows.fieldByName('DueDelta'),
			loadSigma: rows.fieldByName('LoadSigma'),
			loadDelta: rows.fieldByName('LoadDelta'),
			workSigma: rows.fieldByName('WorkSigma'),
			workDelta: rows.fieldByName('WorkDelta'),
			goalID: rows.fieldByName('GoalID'),
			goalGuide: rows.fieldByName('GoalGuide'),
			goalType: rows.fieldByName('GoalType'),
			goalProgress: rows.fieldByName('GoalProgress'),
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
	var dummyGoal = Math.floor(Math.random() * _LoadSigma);
	var dummyType = Math.floor(Math.random() * 2) + 1;

	if (dummyGoal<1)
	{
	dummyGoal = dummyGoal + 1;
	}

	mydb.execute('insert into todo (Item,Category,LoadSigma,DueDate,TaskID, GoalGuide, GoalType) values (?,?,?,?,?,?,?)', _Item, _Category, _LoadSigma, _DueDate, taskID, dummyGoal, dummyType);
	mydb.close();
};

exports.deleteItem = function(_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('delete from todo where TaskID = ?', _id);
	mydb.close();
};


exports.addWork = function (_id, _item) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('insert into rewards (TaskID,Item,WorkReward) values (?,?,?)', _id, _item, 100);
	mydb.execute('insert into history (TaskID,Item,WorkDelta) values (?,?,?)', _id, _item, 0.25);
	mydb.close();
	return null;
};


exports.selectByID = function(_taskID) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from todo where TaskID = ?', _taskID);
	while (rows.isValidRow()) {
		retData.push(
		{ 
			timeStamp: rows.fieldByName('TimeStamp'),
			taskID: rows.fieldByName('TaskID'),
			item: rows.fieldByName('Item'),
			category: rows.fieldByName('Category'),
			done: rows.fieldByName('Done'),
			positionID: rows.fieldByName('PositionID'),
			dueDate: rows.fieldByName('DueDate'),
			dueDelta: rows.fieldByName('DueDelta'),
			loadSigma: rows.fieldByName('LoadSigma'),
			loadDelta: rows.fieldByName('LoadDelta'),
			workSigma: rows.fieldByName('WorkSigma'),
			workDelta: rows.fieldByName('WorkDelta'),
			goalID: rows.fieldByName('GoalID'),
			goalGuide: rows.fieldByName('GoalGuide'),
			goalType: rows.fieldByName('GoalType'),
			goalProgress: rows.fieldByName('GoalProgress'),
		});
		rows.next();
	}
	db.close();
	return retData;
};


exports.getTotalRewards = function (_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	var retData = [];
	var TotalReward = mydb.execute('select sum(WorkReward)+sum(GoalReward)+sum(EarlyReward)+sum(Combo1Reward)+sum(Combo2Reward)+sum(DoneRedReward)+sum(DoneOrangeReward)+sum(PushPenalty) from rewards where TaskID = ?', _id);

	while (TotalReward.isValidRow()) 
	{
		retData.push(TotalReward.fieldByName('sum(WorkReward)+sum(GoalReward)+sum(EarlyReward)+sum(Combo1Reward)+sum(Combo2Reward)+sum(DoneRedReward)+sum(DoneOrangeReward)+sum(PushPenalty)'));
		TotalReward.next();
	}
	mydb.close();
	
	if (retData[0] == null)
	{
		return 0;
	}
	else
	{
		return retData[0];
	}
};


exports.getEditInputs = function(_taskID) {
	var db = Ti.Database.open(DATABASE_NAME);
	var now = new Date();
	var julianNow = Math.floor(now/86400000 + 2440587.5);
	var hourNow = now.getHours();
	var taskPull = db.execute('select * from todo where TaskID = ?', _taskID);
	var rewardsPull = db.execute('select max(TimeStamp), TotalReward from rewards');
	var d_WrkToday = db.execute('select sum(WorkDelta) from history where TaskID = ? and cast(julianday(TimeStamp) as integer) = ?', _taskID, julianNow);
	var d_lastUpdateTime = db.execute('select max(TimeStamp) from history');
	var d_lastCombo1Re = db.execute('select max(TimeStamp) from rewards where Combo1Reward > ?',0);
	var d_lastCombo2Re = db.execute('select max(TimeStamp) from rewards where Combo2Reward > ?',0);
	var d_totalEarlyRe = db.execute('select count(EarlyReward) from rewards where (cast(julianday(TimeStamp) as integer) = ? and strftime (\'%H\', TimeStamp) >= ? and strftime (\'%H\', TimeStamp) <= ?)', julianNow, 5, 12);
	var d_totalEarlyHrs = db.execute('select sum(WorkDelta) from history where (cast(julianday(TimeStamp) as integer) = ? and strftime (\'%H\', TimeStamp) >= ? and strftime (\'%H\', TimeStamp) <= ?)', julianNow, 5, 12);
	var d_redWrkToday = db.execute('select sum(WorkDelta) from history where GoalType = ? and cast(julianday(TimeStamp) as integer) = ?', 3, julianNow);
	var d_orangeWrkToday = db.execute('select sum(WorkDelta) from history where GoalType = ? and cast(julianday(TimeStamp) as integer) = ?', 2, julianNow);

	//Create temporary memory variables

	var tempMem = [
		{
			tmWorkDelta: taskPull.fieldByName('WorkDelta'),
			tmWorkSigma: taskPull.fieldByName('WorkSigma'),
			tmLoadSiga: taskPull.fieldByName('LoadSigma'),
			tmGoalGuide: taskPull.fieldByName('GoalGuide'),
			tmGoalType: taskPull.fieldByName('GoalType'),
			tmGoalProgress: taskPull.fieldByName('GoalProgress'),
			tmGoalReward: 0,
			tmEarlyReward: 0,
			tmCombo1Reward: 0,
			tmCombo2Reward: 0,
			tmDoneRedReward: 0,
			tmDoneOrangeReward: 0,
			tmPushPenalty: 0, 
			tmTotalReward: rewardsPull.fieldByName('TotalReward'),
		}
	];


	//Create deicisioning variables

	var decisionVar = [
		{
			WorkToday: d_WrkToday.fieldByName('sum(WorkDelta)'),
			lastUpdateTime: d_lastUpdateTime.fieldByName('max(TimeStamp)'),
			lastCombo1Re: d_lastCombo1Re.fieldByName('max(TimeStamp)'),
			lastCombo2Re: d_lastCombo2Re.fieldByName('max(TimeStamp)'),
			totalEarlyRe: d_totalEarlyRe.fieldByName('count(EarlyReward)'),
			totalEarlyHrs: d_totalEarlyHrs.fieldByName('sum(WorkDelta)'),
			redWrkToday: d_redWrkToday.fieldByName('sum(WorkDelta)'),
			orangeWrkToday: d_orangeWrkToday.fieldByName('sum(WorkDelta)'),
		}
	];

	db.close();
	return decisionVar;
};