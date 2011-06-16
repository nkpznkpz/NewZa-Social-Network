// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.1) 
// @Version E2CS-0.0.1  june 1 2008 
// Spanish
// @Author: Carlos Mendez  
// @contact: cmendez@mm-mendez.com, for MSN chat:cmendez21@hotmail.com
// --------------------------------------------------

Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
	//Load Mask legend 
	loadmaskText: 'Procesando informaci&Oacute;n, espere un momento...!',  //0.0.12 
	// Calendar locale
	dateSelectorText:    'Seleccionar',
	dateSelectorTooltip: 'Seleccionar fecha',
	// Why i have my own locale for days and months you will ask ? 
	// i didn't want to mess with ext locale and prefer the widget will have his own locale
	monthtitles:["Enero", 	"Febrero", 	 "Marzo",
				 "Abril", 	"Mayo",	 	 "Junio",
				 "Julio", 	"Agosto",	 "Septiembre",
				 "Octubre", "Noviembre", "Deciembre"],
	daytitles:  ["Domingo", "Lunes", "Martes",  "Miercoles",  "Jueves",  "Viernes", "Sabado"],
	todayLabel: 	'Hoy',
	todayToolTip:	'Fecha actual...',
	// toolbar buttons tooltips 
	tooltipMonthView:	'Cambiar a Vista de Mes...',
	tooltipWeekView:	'Cambiar a Vista Semanal...',	
	tooltipDayView:		'Cambiar a vista de D&iacute;a...',
	tooltipSchedView:   'Cambiar a vista de Planeaci&oacute;n...',		//0.0.10 new view 
	// tpl for zoom tasks general labels 
	win_tasks_format:  'm-d-Y',
	win_tasks_loading: 'Cargando...',
	win_tasks_empty:   'No hay eventos...',	
	// Month view locale
	win_month_zoomlabel:'Tareas del dia',
	headerTooltipsMonth: { 
			prev: 'Mes Anterior', 
			next: 'Siguiente Mes' 
	}, 
	contextMenuLabelsMonth: { 
			task: "Agregar nuevo evento en", 
			chgwview: "Cambiar a Vista Semanal...", 
			chgdview: "Cambiar a Vista de D&iacute;a...",
			chgsview: "Cambiar a vista de Planeaci&oacute;n...",	// 0.0.11
			gonextmonth: "Go to next month",     // 0.0.4
			goprevmonth: "Go previous month"     // 0.0.4			
	},	
	labelforTasksinMonth: 'Tareas:', 
	// Dayview and daytask  locale 
	task_MoreDaysFromTask: '<br>(+)',
	task_LessDaysFromTask: '(-)<br>',
	task_qtip_starts: 	'Inicia: ', 
	task_qtip_ends: 	'Termina: ', 	
	headerTooltipsDay: { 
			prev: 'D&iacute;a anterior..', 
			next: 'Siguiente D&iacute;a' 
	}, 
	contextMenuLabelsDay: { 
		taskAdd: "Nuevo evento", 
		taskDelete: "Eliminar evento", 
		taskEdit: "Editar evento:",
		NextDay: "Ir al d&iacute;a siguiente", 
		PreviousDay: "Ir al d&iacute;a anterior",
		chgwview: "Cambiar a vista semanal...", 
		chgmview: "Cambiar a vista mensual...",
		chgsview: "Cambiar a vista de Planeaci&oacute;n..."			//0.0.11
	},	
	//Week view  and weektask locale 
	// 0.0.4
	contextMenuLabelsWeek: { 
		prev: "Ir a la semana anterior.", 
		next: "Ir a la siguiente semana.", 
		chgdview: "Cambiar a Vista diaria.", 
		chgmview: "Cambiar a vista de mes.",
		chgsview: "Cambiar a vista de Planeaci&oacute;n...."			//0.0.11 
		
	},	
	// 0.0.4
	headerTooltipsWeek: { 
		prev: 'Semana anterior.', 
		next: 'Siguiente semana.' 
	},	
	labelforTasksinWeek: 'Mas eventos en Semana:',
	win_week_zoomlabel:'Mas eventos de la semana',
	weekheaderlabel:'Semana #',
	weekheaderlabel_from:'De:',
	weekheaderlabel_to:' A:',
	alldayTasksMaxLabel:'Ver Mas eventos de mas de un dia..'
	//-----------------------------------------------------------------
	//Scheduler view strings//0.0.10 & 0.0.11 
	Scheduler_selector:'Seleccionar periodo', 
	scheduler_noeventsonview:'<p>No hay eventos para este periodo, por favor agrege uno o mas</p>',
	scheduler_period_from_to:{
		starts:'Desde',
		ends:'Hasta'
	},
	headerTooltipsScheduler: { 
		prev: 'Periodo anterior.', 
		next: 'Siguiente periodo.' 
	},
	scheduler_headerListStrings: {
		Day: "Dia",
		week: "Semana",
		period:"Periodo",
		start: "Desde",
		end: "Hasta"
	},
	contextMenuLabelsSchedule: { 
		taskAdd: 	"Nuevo Evento", 							
		taskDelete: "Eliminar evento", 					
		taskEdit: 	"Editar evento:",						
		NextPeriod: 	"Ir al siguiente periodo", 
		PreviousPeriod: "Ir al periodo anterior",
		chgdview: "Cambiar a Vista diaria.", 
		chgmview: "Cambiar a vista de mes.",
		chgwview: "Cambiar a vista semanal...",
	}
	
}