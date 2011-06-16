// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.14) 
// @Version E2CS-0.0.14  JUL-2009
// Swedish
// @Author: Ilon Sjögren
// @contact:  ilon.sjogren@gmail.com, for MSN chat:medialabs@hotmail.com, Skype: ilonworks
// --------------------------------------------------
Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
	loadmaskText: 'Behandlar Data....<br>Var v&auml;nlig v&auml;nta...!',  //0.0.12 
	// Calendar locale	
	dateSelectorText:    'V&auml;lj..',
	dateSelectorTooltip: 'V&auml;lj ett datum..',
	// Why i have my own locale for days and months you will ask ? i didn't want to mess with ext locale and prefer the widget will have his own locale	
	monthtitles:["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"],
	daytitles:  ["S&auml;ndag","M&aring;ndag","Tisdag","Onsdag","Torsdag","Fredag","L&ouml;rdag"],
	todayLabel: 'Idag',
	todayToolTip: 'V&auml;lj dagens datum...',
	// toolbar buttons tooltips 
	tooltipMonthView:	'Se m&aring;nadsvy...',
	tooltipWeekView:	'Se veckovy...',	
	tooltipDayView:		'Se dagsvy...',	
	tooltipSchedView:   'Se schemavy...',		//0.0.10 new view 	
	// Button labels
	btntextMonthView:	'M&aring;nad',
	btntextWeekView:	'Vecka',
	btntextDayView:		'Dag',
	btntextSchedView:	'Schema',
	// tpl for zoom tasks general labels 
	win_tasks_format:  'Y-m-d',
	win_tasks_loading: 'Laddar...',
	win_tasks_empty:   'Inga h&auml;ndelser...', 	 				//0.0.7  tasks changed to events
	// Month view locale
	win_month_zoomlabel:'H&auml;ndelser f&ouml;r dag', 				//0.0.7  tasks changed to events
	headerTooltipsMonth: { 
		prev: 'F&ouml;reg&aring;ende m&aring;nad.', 
		next: 'N&auml;sta m&aring;nad.' 
	}, 
	contextMenuLabelsMonth: { 
		task: "L&auml;gg till uppgift f&ouml;r", 
		chgwview: "&Auml;ndra till veckovy...", 
		chgdview: "&Auml;ndra till dagsvy...",
		chgsview: "&Auml;ndra till schemavy...",			// 0.0.11
		gonextmonth: "G&aring; till f&ouml;reg&aring;ende m&aring;nad",     			// 0.0.4
		goprevmonth: "G&aring; till n&auml;sta m&aring;nad"     			// 0.0.4
	},
	labelforTasksinMonth: 'H&auml;ndelser f&ouml;r dag:',				//0.0.7  tasks changed to events
	//-----------------------------------------------------------------
	// Dayview and daytask  locale 	
	//-----------------------------------------------------------------	
	task_MoreDaysFromTask: '<br>(+)',
	task_LessDaysFromTask: '(-)<br>',
	task_qtip_starts: 	'Startar: ', 
	task_qtip_ends: 	'Slutar: ', 	
	headerTooltipsDay: { 
			prev: 'F&ouml;reg&aring;ende dag', 
			next: 'N&auml;sta dag' 
	}, 
	contextMenuLabelsDay: { 
		taskAdd: "Ny h&auml;ndelse", 							//0.0.7  tasks changed to events
		taskDelete: "Ta bort h&auml;ndelse", 					//0.0.7  tasks changed to events
		taskEdit: "Redigera h&auml;ndelse:",						//0.0.7  tasks changed to events
		NextDay: "G&aring; till n&auml;sta dag", 
		PreviousDay: "G&aring; till f&ouml;reg&aring;ende dag",
		chgwview: "&Auml;ndra till veckovy...", 
		chgmview: "&Auml;ndra till m&aring;nadsvy...",
		chgsview: "&Auml;ndra till schemavy..."			//0.0.11 
	},
	//-----------------------------------------------------------------
	//Week view  and weektask locale  // 0.0.4
	contextMenuLabelsWeek: { 
		prev: "F&ouml;reg&aring;ende vecka.", 
		next: "N&auml;sta vecka.", 
		chgdview: "&Auml;ndra till dagsvy...", 
		chgmview: "&Auml;ndra till m&aring;nadsvy...",
		chgsview: "&Auml;ndra till schemavy..."			//0.0.11 
	},	
	//0.0.4
	headerTooltipsWeek: { 
		prev: 'F&ouml;reg&aring;ende vecka.', 
		next: 'N&auml;sta vecka.' 
	},
	labelforTasksinWeek: 'Fler h&auml;ndelser f&ouml;r vecka:',   		//0.0.7  tasks changed to events
	win_week_zoomlabel:'Fler h&auml;ndelser...',				//0.0.7  tasks changed to events
	weekheaderlabel:'Vecka #',
	weekheaderlabel_from:'Fr&aring;n:',
	weekheaderlabel_to:' Till:',	
	alldayTasksMaxLabel:'See More All(+)day(s) events..', //0.0.7  tasks changed to events
	//-----------------------------------------------------------------
	//Scheduler view strings//0.0.10 & 0.0.11 
	Scheduler_selector:'V&auml;lj period', 
	scheduler_noeventsonview:'<p>Det finns inga h&auml;ndelser f&ouml;r denna period, var god l&auml;gg till ett</p>',
	scheduler_period_from_to:{
		starts:'Fr&aring;n',
		ends:'Till'
	},
	headerTooltipsScheduler: { 
		prev: 'F&ouml;reg&aring;ende period.', 
		next: 'N&auml;sta period.' 
	},
	scheduler_headerListStrings: {
		Day: "Dag",
		week: "Vecka",
		period:"Period",
		start: "Fr&aring;n",
		end: "Till"
	},
	contextMenuLabelsSchedule: { 
		taskAdd: 	"Ny H&auml;ndelse", 							
		taskDelete: "Ta bort h&auml;ndelse", 					
		taskEdit: 	"Redigera h&auml;ndelse:",						
		NextPeriod: 	"G&aring; till n&auml;sta period", 
		PreviousPeriod: "G&aring; till f&ouml;reg&aring;ende period",
		chgwview: "&Auml;ndra till veckovy...", 
		chgmview: "&Auml;ndra till m&aring;nadsvy...",
		chgdview: "&Auml;ndra till dagsvy..."
	}
}