// --------------------------------------------------
// E2CS Extjs-Event-Calendar-Solution alpha(0.0.1)
// @Version E2CS-0.0.1 October 4 2008
// Dutch
// @Author: pcrombach
// @contact:
// --------------------------------------------------
Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
	// Calendar locale
	dateSelectorText: 'Selecteer',
	dateSelectorTooltip: 'Selecteer een datum',
	// Why i have my own locale for days and months you will ask ?
	// i didn't want to mess with ext locale and prefer the widget will have his own locale
	monthtitles:["Januari", "Februari", "Maart", "April", "Mei", "Juni",
		"Juli", "Augustus", "September","Oktober", "November", "December"],
	daytitles: ["Zondag", "Maandag","Dinsdag", "Woensdag", "Donderdag",
		"Vrijdag", "Zaterdag"],
	todayLabel: 'Vandaag',
	todayToolTip: 'Ga naar vandaag',
	// toolbar buttons tooltips
	tooltipMonthView: 'Ga naar maand overzicht',
	tooltipWeekView: 'Ga naar week overzicht',
	tooltipDayView: 'Ga naar dag overzicht',
	// tpl for zoom tasks general labels
	win_tasks_format: 'm-d-Y',
	win_tasks_loading: 'Laden...',
	win_tasks_empty: 'Geen taken',
	// Month view locale
	win_month_zoomlabel:'Taken voor dag',
	headerTooltipsMonth: {
		prev: 'Vorige maand',
		next: 'Volgende maand'
	},
	contextMenuLabelsMonth: {
		task: "Voeg nieuwe taak toe voor",
		chgwview: "Ga naar week overzicht",
		chgdview: "Ga naar dag overzicht",
		gonextmonth: "Ga naar volgende maand", // 0.0.4
		goprevmonth: "Ga naar vorige maand" // 0.0.4
	},
		labelforTasksinMonth: 'Taken voor dag:',
		// Dayview and daytask locale
		task_MoreDaysFromTask: '<br>(+)',
		task_LessDaysFromTask: '(-)<br>',
		task_qtip_starts: 'Begin: ',
		task_qtip_ends: 'Einde: ',
		headerTooltipsDay: {
		prev: 'Vorige dag',
		next: 'Volgende dag'
	},
	contextMenuLabelsDay: {
		taskAdd: "Nieuwe Taak",
		taskDelete: "Verwijder Taak",
		taskEdit: "Wijzig Taak:",
		NextDay: "Ga naar volgende dag",
		PreviousDay: "Ga naar vorige dag",
		chgwview: "Ga naar week overzicht",
		chgmview: "Ga naar maand overzicht"
	},
	//Week view and weektask locale
	// 0.0.4
	contextMenuLabelsWeek: {
		prev: "Ga naar vorige week",
		next: "Ga naar volgende week",
		chgdview: "Ga naar dag overzicht",
		chgmview: "Ga naar maand overzicht"
	},
	//0.0.4
	headerTooltipsWeek: {
		prev: 'Vorige week',
		next: 'Volgende week'
	},
	labelforTasksinWeek: 'Meer Taken voor Week:',
	win_week_zoomlabel:'Meer Taken...',
	weekheaderlabel:'Week ',
	weekheaderlabel_from:'van:',
	weekheaderlabel_to:' t/m:',
	alldayTasksMaxLabel:'Bekijk meer Alle(+)dag(en) taken..'
}