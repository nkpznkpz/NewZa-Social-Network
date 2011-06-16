// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.1) 
// @Version E2CS-0.0.1  june 27 2008 
// Polish
// @Author- translation: Remy
// @contact:
// --------------------------------------------------
Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
	// Calendar locale
	dateformat:          'Y-m-d',
	dateSelectorText:    'Wybierz..',
	dateSelectorTooltip: 'Wybierz Datê..',
	// Why i have my own locale for days and months you will ask ? 
	// i didn't want to mess with ext locale and prefer the widget will have his own locale	
	monthtitles:["Styczeñ",	 "Luty",	 "Marzec",
				 "Kwiecieñ",	 "Maj",			 "Czerwiec",
				 "Lipiec",	 "Sierpieñ",		 "Wrzesieñ",
				 "PaŸdziernik",	 "Listopad",	 "Grudzieñ"],
	daytitles:  ["Niedziela",	 "Poniedzia³ek",		 
				 "Wtorek",	 "Œroda","Czwartek",	 
				 "Pi¹tek",	 "Sobota"],
	
	todayLabel: 'Dzisiaj',
	todayToolTip: 'Ustaw Dzisiejsz¹ Datê...',
	
	// toolbar buttons tooltips 
	tooltipMonthView:	'Widok miesi¹ca...',
	tooltipWeekView:	'Widok Tygodnia',
	tooltipDayView:		'Widok Dnia...',
	
	// tpl for zoom tasks general labels 
	win_tasks_format:  'm-d-r',
	win_tasks_loading: '£aduje...',
	win_tasks_empty:   'Brak Zadania...',
	// Month view locale
	win_month_zoomlabel:'Zadania Dnia',
	headerTooltipsMonth: { 
		prev: 'Poprzedni Miesi¹c.', 
		next: 'Nastêpny Miesi¹c.' 
	}, 
	contextMenuLabelsMonth: { 
		task: "Dodaj Nowe Zadanie Dla", 
		chgwview: " Zmieñ na widok tygodnia...", 
		chgdview: " Zmieñ na widok dnia...",
		gonextmonth: " PrzejdŸ do nastêpnego miesi¹ca",     // 0.0.4
		goprevmonth: " PrzejdŸ do poprzedniego miesi¹ca"     // 0.0.4
	},
	labelforTasksinMonth: 'Zadania Dnia',
	// Dayview and daytask  locale 	
	task_MoreDaysFromTask: '<br>(+)',
	task_LessDaysFromTask: '(-)<br>',
	task_qtip_starts: 	'Pocz¹tek: ', 
	task_qtip_ends: 	'Koniec: ', 	
	headerTooltipsDay: { 
			prev: 'Poprzedni Dzieñ.', 
			next: 'Nastêpny Dzieñ' 
	}, 
	contextMenuLabelsDay: { 
		taskAdd: "Nowe Zadanie", 
		taskDelete: "Usuñ Zadanie", 
		taskEdit: "Edutuj Zadanie:",
		NextDay: "PrzejdŸ do nastêpnego dnia", 
		PreviousDay: "PrzejdŸ do poprzedniego dnia",
		chgwview: " Zmieñ na widok tygodnia...",
		chgmview: " Zmieñ na widok miesi¹ca..."
	},
	//Week view  and weektask locale 
	// 0.0.4
	contextMenuLabelsWeek: { 
		prev: "PrzejdŸ do poprzedniego tygodnia.", 
		next: "PrzejdŸ do nastêpnego tygodnia.", 
		chgdview: " Zmieñ na widok dnia...",
		chgmview: " Zmieñ na widok miesi¹ca..."
	},	
	//0.0.4
	headerTooltipsWeek: { 
		prev: 'Poprzedni Tydzieñ.',
		next: 'Nastêpny Tydzieñ.'
	},
	labelforTasksinWeek: 'Wiêcej Zadañ w Tygodniu:',
	win_week_zoomlabel:' Wiêcej Zadañ...',
	weekheaderlabel:' Tydzieñ #',
	weekheaderlabel_from:'Od:',
	weekheaderlabel_to:' Do:',	
	alldayTasksMaxLabel:'Zobacz Wszystkie zadania(+)..'
}