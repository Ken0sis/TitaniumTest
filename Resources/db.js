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


exports.addWork = function(_taskID) {
	
	//Pull resources

	var db = Ti.Database.open(DATABASE_NAME);
	var now = new Date();
	var julianNow = Math.floor(now/86400000 + 2440587.5);
	var hourNow = now.getHours();
	
	//Write to todo and history DB

	var taskPull = db.execute('select * from todo where TaskID = ?', _taskID);
	var workDelta = taskPull.fieldByName('LoadSigma')>0 ? Math.min(0.25,taskPull.fieldByName('LoadSigma')) : 0.25;
	var workToday = db.execute('select sum(WorkDelta) from history where TaskID = ? and cast(julianday(TimeStamp) as integer) = ?', _taskID, julianNow);
	var n_GoalType = taskPull.fieldByName('GoalProgress') >= 100 ? Math.max(taskPull.fieldByName('GoalType')-1,1) : taskPull.fieldByName('GoalType');
	var n_GoalGuide = taskPull.fieldByName('GoalProgress') >= 100 ? Math.max(taskPull.fieldByName('Goalguide')*0.5,0.5) : taskPull.fieldByName('Goalguide');
	var n_LoadSigma = taskPull.fieldByName('LoadSigma')-workDelta;
	var n_WorkSigma = taskPull.fieldByName('WorkSigma')+workDelta;
	var n_GoalProgress = Math.round((workToday.fieldByName('sum(WorkDelta)')+workDelta)/n_GoalGuide*100);
	


	db.execute('UPDATE todo SET WorkDelta=?, LoadSigma=?, WorkSigma=?, GoalProgress=?, GoalGuide = ?, GoalType = ? WHERE TaskID=?', workDelta, n_LoadSigma, n_WorkSigma, n_GoalProgress, n_GoalGuide, n_GoalType, _taskID);
	db.execute('INSERT into history (TaskID, Item, Category, Done, PositionID, DueDate, DueDelta, LoadSigma, LoadDelta, WorkSigma, WorkDelta, GoalID, GoalGuide, GoalType, GoalProgress) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
			taskPull.fieldByName('TaskID'),
			taskPull.fieldByName('Item'),
			taskPull.fieldByName('Category'),
			taskPull.fieldByName('Done'),
			taskPull.fieldByName('PositionID'),
			taskPull.fieldByName('DueDate'),
			taskPull.fieldByName('DueDelta'),
			n_LoadSigma,
			taskPull.fieldByName('LoadDelta'),
			n_WorkSigma,
			workDelta,
			taskPull.fieldByName('GoalID'),
			n_GoalGuide,
			n_GoalType,
			n_GoalProgress
	);

	//Create deicisioning input variables

	var d_WrkToday = db.execute('select sum(WorkDelta) from history where TaskID = ? and cast(julianday(TimeStamp) as integer) = ?', _taskID, julianNow);
	var d_goalProgress = db.execute('select GoalProgress from history where TaskID = ? and cast(julianday(TimeStamp) as integer) = ?', _taskID, julianNow);
	var d_lastUpdateTime = db.execute('select max(TimeStamp) from history');
	var d_lastCombo1Re = db.execute('select max(TimeStamp) from rewards where Combo1Reward > ?',0);
	var d_lastCombo2Re = db.execute('select max(TimeStamp) from rewards where Combo2Reward > ?',0);
	var d_totalEarlyRe = db.execute('select count(EarlyReward) from rewards where (cast(julianday(TimeStamp) as integer) = ? and strftime (\'%H\', TimeStamp) >= ? and strftime (\'%H\', TimeStamp) <= ?)', julianNow, 5, 12);
	var d_totalEarlyHrs = db.execute('select sum(WorkDelta) from history where (cast(julianday(TimeStamp) as integer) = ? and strftime (\'%H\', TimeStamp) >= ? and strftime (\'%H\', TimeStamp) <= ?)', julianNow, 5, 12);
	var d_redWrkToday = db.execute('select sum(WorkDelta) from history where GoalType = ? and cast(julianday(TimeStamp) as integer) = ?', 3, julianNow);
	var d_orangeWrkToday = db.execute('select sum(WorkDelta) from history where GoalType = ? and cast(julianday(TimeStamp) as integer) = ?', 2, julianNow);
	var d_totalRewards = db.execute('select TotalReward from rewards where TimeStamp = (select max(TimeStamp) from rewards)');
	var input =
		{
		WorkToday: d_WrkToday.fieldByName('sum(WorkDelta)'),
		goalProgress: d_goalProgress.fieldByName('GoalProgress'),
		lastUpdateTime: d_lastUpdateTime.fieldByName('max(TimeStamp)'),
		lastCombo1Re: d_lastCombo1Re.fieldByName('max(TimeStamp)'),
		lastCombo2Re: d_lastCombo2Re.fieldByName('max(TimeStamp)'),
		totalEarlyRe: d_totalEarlyRe.fieldByName('count(EarlyReward)'),
		totalEarlyHrs: d_totalEarlyHrs.fieldByName('sum(WorkDelta)'),
		redWrkToday: d_redWrkToday.fieldByName('sum(WorkDelta)'),
		orangeWrkToday: d_orangeWrkToday.fieldByName('sum(WorkDelta)'),
		totalRewards: d_totalRewards.fieldByName('TotalReward')
		};

	//Decide on Rewards

	var rewards =
		{
		Goal: 0,
		Early: 0,
		Combo1: 0,
		Combo2: 0,
		DoneRed: 0,
		DoneOrange: 0,
		Total: input.totalRewards
		};

	if (input.GoalProgress >= 100)
	{
		rewards.Goal = 1;
	}

	var retData = [];
	var rows = db.execute('select * from history where TimeStamp = (select max(TimeStamp) from history)');
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
	console.log(retData);
	console.log(d_WrkToday);
};
