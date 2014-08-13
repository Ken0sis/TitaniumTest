var DATABASE_NAME = 'todo';

exports.createDb = function() {
	Ti.Database.install('todo.sqlite', DATABASE_NAME);
};

exports.selectByDone = function(_Done) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from todo where Done = ? and Active = 1', _Done);
	while (rows.isValidRow()) {
		retData.push({
			timeStamp: rows.fieldByName('TimeStamp'),
			taskID: rows.fieldByName('TaskID'),
			item: rows.fieldByName('Item'),
			category: rows.fieldByName('Category'),
			done: rows.fieldByName('Done'),
			active: rows.fieldByName('Active'),
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

exports.selectByID = function(_taskID) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from todo where TaskID = ? and Active = 1', _taskID);
	while (rows.isValidRow()) {
		retData.push(
		{ 
			timeStamp: rows.fieldByName('TimeStamp'),
			taskID: rows.fieldByName('TaskID'),
			item: rows.fieldByName('Item'),
			category: rows.fieldByName('Category'),
			done: rows.fieldByName('Done'),
			active: rows.fieldByName('Active'),
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
	mydb.execute('update todo set Done = ? where TaskID = ? and Active = 1', _Done, _id);
	var rows = mydb.execute('select * from todo where Done = ? and Active = 1', _Done);
	mydb.close();
	return rows;
};

exports.addItem = function(_Item, _Category, _LoadSigma, _DueDate) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	var taskID = new Date().getTime();
	var goalID = new Date().getTime();
	var dummyGoal = Math.floor(Math.random() * _LoadSigma);
	var dummyType = Math.floor(Math.random() * 2) + 1;

	if (dummyGoal<1)
	{
	dummyGoal = dummyGoal + 1;
	}

	mydb.execute('insert into todo (Item,Category,LoadSigma,DueDate,TaskID, GoalGuide, GoalType, GoalID) values (?,?,?,?,?,?,?,?)', _Item, _Category, _LoadSigma, _DueDate, taskID, dummyGoal, dummyType, goalID);
	mydb.close();
};

exports.deleteItem = function(_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('update todo set Active = 0 where TaskID = ?', _id);
	mydb.execute('update history set Active = 0 where TaskID = ?', _id);
	mydb.execute('update rewards set Active = 0 where TaskID = ?', _id);
	mydb.close();
};

exports.getTotalRewards = function (_id) {
	var db = Ti.Database.open(DATABASE_NAME);
	var Total = db.execute('select TotalReward from rewards where TimeStamp = (select max(TimeStamp) from rewards)');
	var reVar = Total.fieldByName('TotalReward');
	
	db.close();
	return reVar == null? 0 : reVar;
};



exports.addWork = function(_taskID, _goalID) {
	
	//Pull resources

	var db = Ti.Database.open(DATABASE_NAME);
	var now = new Date();
	var julianNow = Math.floor(now/86400000 + 2440587.5);
	var hourNow = now.getHours();
	
	//Setup variables that are changed

	var taskPull = db.execute('select * from todo where TaskID = ? and Active = 1', _taskID);
	var workDelta = taskPull.fieldByName('LoadSigma')>0 ? Math.min(0.5,taskPull.fieldByName('LoadSigma')) : 0.5;
	var lastUpdate = db.execute('select max(TimeStamp) from history');
	var n_LoadSigma = Math.max(taskPull.fieldByName('LoadSigma')-workDelta,0);
	var n_WorkSigma = taskPull.fieldByName('WorkSigma')+workDelta;
	var n_GoalType = taskPull.fieldByName('GoalProgress') >= 100 ? Math.max(taskPull.fieldByName('GoalType')-1,1) : taskPull.fieldByName('GoalType');
	var n_GoalGuide = taskPull.fieldByName('GoalProgress') >= 100 ? Math.min(taskPull.fieldByName('LoadSigma'),Math.max(Math.floor(taskPull.fieldByName('Goalguide')*0.5),1)) : taskPull.fieldByName('Goalguide');
	var n_GoalID = taskPull.fieldByName('GoalProgress') >= 100 ? new Date().getTime() : taskPull.fieldByName('GoalID');
	var p_goalWrk = db.execute('select sum(WorkDelta) from history where GoalID = ?', n_GoalID);
	var n_GoalProgress = n_GoalGuide == 0 ? 0 : (p_goalWrk.fieldByName('sum(WorkDelta)')+workDelta)/n_GoalGuide*100;

	//Write to todo and history DB

	db.execute('UPDATE todo SET WorkDelta=?, LoadSigma=?, WorkSigma=?, GoalProgress=?, GoalGuide = ?, GoalType = ?, GoalID = ? WHERE TaskID=? and Active=1', workDelta, n_LoadSigma, n_WorkSigma, n_GoalProgress, n_GoalGuide, n_GoalType, n_GoalID, _taskID);
	db.execute('INSERT into history (TaskID, Item, Category, Done, Active, PositionID, DueDate, DueDelta, LoadSigma, LoadDelta, WorkSigma, WorkDelta, GoalID, GoalGuide, GoalType, GoalProgress) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
			taskPull.fieldByName('TaskID'),
			taskPull.fieldByName('Item'),
			taskPull.fieldByName('Category'),
			taskPull.fieldByName('Done'),
			taskPull.fieldByName('Active'),
			taskPull.fieldByName('PositionID'),
			taskPull.fieldByName('DueDate'),
			taskPull.fieldByName('DueDelta'),
			n_LoadSigma,
			taskPull.fieldByName('LoadDelta'),
			n_WorkSigma,
			workDelta,
			n_GoalID,
			n_GoalGuide,
			n_GoalType,
			n_GoalProgress
	);

	//Create deicisioning input variables

	var d_lastCombo1Re = db.execute('select max(TimeStamp) from rewards where Combo1Reward > ?',0);
	var d_lastCombo2Re = db.execute('select max(TimeStamp) from rewards where Combo2Reward > ?',0);
	var d_lastDoneRedRe = db.execute('select cast(julianday(max(TimeStamp)) as integer) from rewards where DoneRedReward > ?',0);
	var d_lastDoneOrangeRe = db.execute('select cast(julianday(max(TimeStamp)) as integer) from rewards where DoneOrangeReward > ?',0);
	var d_totalEarlyRe = db.execute('select count(EarlyReward) from rewards where (cast(julianday(TimeStamp) as integer) = ? and strftime (\'%H\', TimeStamp) >= ? and strftime (\'%H\', TimeStamp) <= ?)', julianNow, 5, 12);
	var d_totalEarlyHrs = db.execute('select sum(WorkDelta) from history where (cast(julianday(TimeStamp) as integer) = ? and strftime (\'%H\', TimeStamp) >= ? and strftime (\'%H\', TimeStamp) <= ?)', julianNow, 5, 12);
	var d_redWrkToday = db.execute('select sum(WorkDelta) from history where GoalType = ? and cast(julianday(TimeStamp) as integer) = ?', 3, julianNow);
	var d_orangeWrkToday = db.execute('select sum(WorkDelta) from history where GoalType = ? and cast(julianday(TimeStamp) as integer) = ?', 2, julianNow);
	var d_redBalance = db.execute('select sum(GoalGuide*(1-GoalProgress/100)) from todo where GoalType = ? and Active = 1', 3);
	var d_orangeBalance = db.execute('select sum(GoalGuide*(1-GoalProgress/100)) from todo where GoalType = ? and Active = 1', 2);
	var d_totalRewards = db.execute('select TotalReward from rewards where TimeStamp = (select max(TimeStamp) from rewards)');
	var input =
		{
		goalProgress: n_GoalProgress,
		lastUpdate: lastUpdate.fieldByName('max(TimeStamp)'),
		lastCombo1Re: d_lastCombo1Re.fieldByName('max(TimeStamp)'),
		lastCombo2Re: d_lastCombo2Re.fieldByName('max(TimeStamp)'),
		lastDoneRedRe: d_lastDoneRedRe.fieldByName('cast(julianday(max(TimeStamp)) as integer)'),
		lastDoneOrangeRe: d_lastDoneOrangeRe.fieldByName('cast(julianday(max(TimeStamp)) as integer)'),
		totalEarlyRe: d_totalEarlyRe.fieldByName('count(EarlyReward)'),
		totalEarlyHrs: d_totalEarlyHrs.fieldByName('sum(WorkDelta)'),
		redWrkToday: d_redWrkToday.fieldByName('sum(WorkDelta)'),
		orangeWrkToday: d_orangeWrkToday.fieldByName('sum(WorkDelta)'),
		redBalance: d_redBalance.fieldByName('sum(GoalGuide*(1-GoalProgress/100))'),
		orangeBalance: d_orangeBalance.fieldByName('sum(GoalGuide*(1-GoalProgress/100))'),
		totalRewards: d_totalRewards.fieldByName('TotalReward'),
		};

	console.log('READ THIS'+input.lastDoneOrangeRe);

	//Create rewards output

	var rewardWork = 5;

	var reward =
		{
		Combo1: 0,
		Combo2: 0,
		Early: 0,
		Goal: 0,
		DoneRed: 0,
		DoneOrange: 0,
		};

	//Rewards decisioning

	if (input.goalProgress >= 100)
	{
		reward.Goal = n_GoalGuide*rewardWork;
	}

	if (input.totalEarlyRe<input.totalEarlyHrs)
	{
		reward.Early = Math.floor(input.totalEarlyHrs-input.totalEarlyRe)*rewardWork;
	}

	if (now.getTime()-Date.parse(input.lastUpdateTime)>(40*60*1000) && now.getTime()-Date.parse(input.lastCombo1Re)>(40*60*1000))
	{
		reward.Combo1 = 10;
	}

	if (Math.floor(input.lastUpdate/86400000 + 2440587.5) > julianNow && now.getTime()-Date.parse(input.lastUpdateTime)>(6*60*60*1000))
	{
		reward.Combo2 = input.totalRewards*0.15; 
	}

	if ((input.redBalance == null || input.redBalance == 0) && input.redWrkToday >0 && (input.lastDoneRedRe < julianNow || input.lastDoneRedRe == null))
	{
		reward.DoneRed = input.redWrkToday/12 * 160; 
	}

	if ((input.orangeBalance == null || input.orangeBalance == 0) && input.orangeWrkToday >0 && input.redBalance == null && (input.lastDoneOrangeRe < julianNow || input.lastDoneOrangeRe == null))
	{
		reward.DoneOrange = input.orangeWrkToday/12 * 120; 
	}

	var rewardTotal = input.totalRewards + rewardWork + reward.Goal + reward.Early + reward.Combo1 + reward.Combo2 + reward.DoneRed + reward.DoneOrange;

	db.execute ('insert into rewards (TaskID, Active, Category, Item, WorkReward, GoalReward, EarlyReward, Combo1Reward, Combo2Reward, DoneRedReward, DoneOrangeReward, TotalReward) values (?,?,?,?,?,?,?,?,?,?,?,?)', taskPull.fieldByName('TaskID'), 1, taskPull.fieldByName('Category'), taskPull.fieldByName('Item'), rewardWork, reward.Goal, reward.Early, reward.Combo1, reward.Combo2, reward.DoneRed, reward.DoneOrange, rewardTotal);

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
	console.log(reward);
	return reward;
};
