// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.11) 
// @Version E2CS-0.0.11  May 20 2009
// Chinese
// @Author:   Feng Gao - (AKA) sniperdiablo  
// @contact:  sniperdiablo@gmail.com, for MSN chat:sniperdiablo@hotmail.com
// --------------------------------------------------
Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
	loadmaskText: '处理数据....<br>请稍候...!',  //0.0.12 
	// Calendar locale	
	dateSelectorText:    '选择..',
	dateSelectorTooltip: 'e2cs_cn.js..',
	// Why i have my own locale for days and months you will ask ? i didn't want to mess with ext locale and prefer the widget will have his own locale	
	monthtitles:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
	daytitles:  ["日","一","二","三","四","五","六"],
	todayLabel: '今天',
	todayToolTip: '设置今天日期...',
	// toolbar buttons tooltips 
	tooltipMonthView:	'查看月视图...',
	tooltipWeekView:	'查看周视图...',	
	tooltipDayView:		'查看日视图...',	
	tooltipSchedView:   '查看调度视图...',		//0.0.10 new view 	
	// tpl for zoom tasks general labels 
	win_tasks_format:  'm-d-Y',
	win_tasks_loading: '载入中...',
	win_tasks_empty:   '没有事件...', 	 				//0.0.7  tasks changed to events
	// Month view locale
	win_month_zoomlabel:'事件', 				//0.0.7  tasks changed to events
	headerTooltipsMonth: { 
		prev: '上月.', 
		next: '下月.' 
	}, 
	contextMenuLabelsMonth: { 
		task: "添加新任务", 
		chgwview: "切换至周视图...", 
		chgdview: "切换至日视图...",
		chgsview: "切换至调度视图...",			// 0.0.11
		gonextmonth: "查看下个月",     			// 0.0.4
		goprevmonth: "查看上个月"     			// 0.0.4
	},
	labelforTasksinMonth: '事件:',				//0.0.7  tasks changed to events
	//-----------------------------------------------------------------
	// Dayview and daytask  locale 	
	//-----------------------------------------------------------------	
	task_MoreDaysFromTask: '<br>(+)',
	task_LessDaysFromTask: '(-)<br>',
	task_qtip_starts: 	'开始: ', 
	task_qtip_ends: 	'结束: ', 	
	headerTooltipsDay: { 
			prev: '上一日', 
			next: '下一日' 
	}, 
	contextMenuLabelsDay: { 
		taskAdd: "新事件", 							//0.0.7  tasks changed to events
		taskDelete: "删除事件", 					//0.0.7  tasks changed to events
		taskEdit: "编辑事件:",						//0.0.7  tasks changed to events
		NextDay: "下一日", 
		PreviousDay: "上一日",
		chgwview: "切换至周视图...", 
		chgmview: "切换至月视图...",
		chgsview: "切换至调度视图..."			//0.0.11 
	},
	//-----------------------------------------------------------------
	//Week view  and weektask locale  // 0.0.4
	contextMenuLabelsWeek: { 
		prev: "上一周.", 
		next: "下一周.", 
		chgdview: "切换至日视图...", 
		chgmview: "切换至月视图...",
		chgsview: "切换至调度视图..."			//0.0.11 
	},	
	//0.0.4
	headerTooltipsWeek: { 
		prev: '上一周.', 
		next: '下一周.' 
	},
	labelforTasksinWeek: '更多周事件:',   		//0.0.7  tasks changed to events
	win_week_zoomlabel:'更多事件...',				//0.0.7  tasks changed to events
	weekheaderlabel:'周 #',
	weekheaderlabel_from:'从:',
	weekheaderlabel_to:' 至:',	
	alldayTasksMaxLabel:'查看全部日事件..', //0.0.7  tasks changed to events
	//-----------------------------------------------------------------
	//Scheduler view strings//0.0.10 & 0.0.11 
	Scheduler_selector:'选择时间段', 
	scheduler_noeventsonview:'<p>本时间段内无事件,请增加</p>',
	scheduler_period_from_to:{
		starts:'从',
		ends:'至'
	},
	headerTooltipsScheduler: { 
		prev: '上一时间段.', 
		next: '下一时间段.' 
	},
	scheduler_headerListStrings: {
		Day: "日",
		week: "周",
		period:"时间段",
		start: "从",
		end: "至"
	},
	contextMenuLabelsSchedule: { 
		taskAdd: 	"新事件", 							
		taskDelete: "删除事件", 					
		taskEdit: 	"编辑事件:",						
		NextPeriod: 	"下一时间段", 
		PreviousPeriod: "上一时间段",
		chgwview: "切换至周视图...", 
		chgmview: "切换至月视图...",
		chgdview: "切换至日视图..."
	}
	
	
	
}