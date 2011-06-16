// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.12) 
// @Version E2CS-0.0.11  FEB-2009
// Italian
// @Author: Alessandro Luciani (bebetoblu)
// @contact:  alessandro.luciani@inforoma.com, Skype: bebetoblu
// --------------------------------------------------
Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
	loadmaskText: 'Acquisizione Dati....<br>Attendere Prego...!',  //0.0.12 
	// Calendar locale	
	dateSelectorText:    'Seleziona..',
	dateSelectorTooltip: 'Seleziona una Data..',
	// Why i have my own locale for days and months you will ask ? i didn't want to mess with ext locale and prefer the widget will have his own locale	
	monthtitles:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],
	daytitles:  ["Domenica","Luned&igrave;","Marted&igrave;","Mercoled&igrave;","Gioved&igrave;","Venerd&igrave;","Sabato"],
	todayLabel: 'Oggi',
	todayToolTip: 'Seleziona la Data di Oggi...',
	// toolbar buttons tooltips 
	tooltipMonthView:	'Visualizza in formato Mensile...',
	tooltipWeekView:	'Visualizza in formato Settimanale...',	
	tooltipDayView:		'Visualizza in formato Giornaliero...',	
	tooltipSchedView:   'Visualizza in formato Schedulazione...',		//0.0.10 new view 	
	// tpl for zoom tasks general labels 
	win_tasks_format:  'd-m-Y',
	win_tasks_loading: 'Caricamento...',
	win_tasks_empty:   'Nessun Evento...', 	 				//0.0.7  tasks changed to events
	// Month view locale
	win_month_zoomlabel:'Eventi del Giorno', 				//0.0.7  tasks changed to events
	headerTooltipsMonth: { 
		prev: 'Mese Precedente.', 
		next: 'Mese Successivo.' 
	}, 
	contextMenuLabelsMonth: { 
		task: "Aggiungi un nuovo Task", 
		chgwview: "Passa alla visione Settimanale...", 
		chgdview: "Passa alla visione Giornaliera...",
		chgsview: "Passa alla visione Schedulazione...",			// 0.0.11
		gonextmonth: "Vai al Mese Successivo",     			// 0.0.4
		goprevmonth: "Vai al Mese Precedente"     			// 0.0.4
	},
	labelforTasksinMonth: 'Eventi del Giorno:',				//0.0.7  tasks changed to events
	//-----------------------------------------------------------------
	// Dayview and daytask  locale 	
	//-----------------------------------------------------------------	
	task_MoreDaysFromTask: '<br>(+)',
	task_LessDaysFromTask: '(-)<br>',
	task_qtip_starts: 	'Inizio: ', 
	task_qtip_ends: 	'Fine: ', 	
	headerTooltipsDay: { 
			prev: 'Giorno Precedente', 
			next: 'Giorno Successivo' 
	}, 
	contextMenuLabelsDay: { 
		taskAdd: "Nuovo Evento", 							//0.0.7  tasks changed to events
		taskDelete: "Cancella Evento", 					//0.0.7  tasks changed to events
		taskEdit: "Modifica Evento:",						//0.0.7  tasks changed to events
		NextDay: "Passa al Giorno Successivo", 
		PreviousDay: "Passa al Giorno Precedente",
		chgwview: "Passa alla visione Settimanale...", 
		chgmview: "Passa alla visione Mensile...",
		chgsview: "Passa alla visione Schedulazione..."			//0.0.11 
	},
	//-----------------------------------------------------------------
	//Week view  and weektask locale  // 0.0.4
	contextMenuLabelsWeek: { 
		prev: "Passa alla Settimana Precedente", 
		next: "Passa alla Settimana Successiva", 
		chgdview: "Passa alla visione Giornaliera...", 
		chgmview: "Passa alla visione Mensile...",
		chgsview: "Passa alla visione Schedulazione..."			//0.0.11 
	},	
	//0.0.4
	headerTooltipsWeek: { 
		prev: 'Settimana Precedente.', 
		next: 'Settimana Successiva.' 
	},
	labelforTasksinWeek: 'Pi&ugrave; eventi nella settimana:',   		//0.0.7  tasks changed to events
	win_week_zoomlabel:'Pi&ugrave; Eventi...',				//0.0.7  tasks changed to events
	weekheaderlabel:'Settimana #',
	weekheaderlabel_from:'Dal:',
	weekheaderlabel_to:' Al:',	
	alldayTasksMaxLabel:'Mostra tutti gli Eventi...(+)', //0.0.7  tasks changed to events
	//-----------------------------------------------------------------
	//Scheduler view strings//0.0.10 & 0.0.11 
	Scheduler_selector:'Seleziona il Periodo', 
	scheduler_noeventsonview:'<p>Non ci sono Eventi per questo Periodo. Prego aggiungere un Evento</p>',
	scheduler_period_from_to:{
		starts:'Dal',
		ends:'Fino Al'
	},
	headerTooltipsScheduler: { 
		prev: 'Periodo Precedente.', 
		next: 'Periodo Successivo.' 
	},
	scheduler_headerListStrings: {
		Day: "Giorno",
		week: "Settimana",
		period:"Periodo",
		start: "Dal",
		end: "Fino Al"
	},
	contextMenuLabelsSchedule: { 
		taskAdd: 	"Nuovo Evento", 							
		taskDelete: "Cancella Evento", 					
		taskEdit: 	"Modifica Evento:",						
		NextPeriod: 	"Passa al Periodo Successivo", 
		PreviousPeriod: "Passa al Periodo Precedente",
		chgwview: "Passa alla visione Settimanale...", 
		chgmview: "Passa alla visione Mensile...",
		chgdview: "Passa alla visione Giornaliera..."
	}
	
	
	
}