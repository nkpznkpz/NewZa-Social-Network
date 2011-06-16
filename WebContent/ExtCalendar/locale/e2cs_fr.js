// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.1) 
// @Version E2CS-0.0.1  june 27 2008 
// French
// @Author- translation: phpuser 
// @contact: 
// --------------------------------------------------

Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
    // Calendar locale    
    dateSelectorText:    'Selectionner',
    dateSelectorTooltip: 'Selectionner une date',
    // Why i have my own locale for days and months you will ask ? 
    // i didn't want to mess with ext locale and prefer the widget will have his own locale    
    
    monthtitles:["Janvier",   "Fevrier",      "Mars",
                 "Avril",     "Mai",          "Juin",
                 "Juillet",   "Aout",         "Septembre",
                 "Octobre",   "Novembre",     "Decembre"],
    daytitles:  ["Dimanche",     "Lundi",         "Mardi",     "Mercredi","Jeudi",     "Vendredi",     "Samedi"],
    todayLabel: 'Aujourd\'hui',
    todayToolTip: 'Voir la date d\'aujourd\'hui',
    
    // toolbar buttons tooltips 

    
    moisLabel: 'Mois',
    tooltipMonthView:    'Vue par mois',
    
    semaineLabel: 'Semaine',
    tooltipWeekView:    'Vue par semaine',
    
    jourLabel: 'Jour',    
    tooltipDayView:        'Vue par jour',    
    
    // tpl for zoom tasks general labels 
    win_tasks_format:  'm-d-Y',
    win_tasks_loading: 'Chargement...',
    win_tasks_empty:   'Pas de tâche...',
    
    
    // Month view locale
    win_month_zoomlabel:'Les informations de ce jour',
    headerTooltipsMonth: { 
        prev: 'Mois pr&eacute;c&eacute;dent', 
        next: 'Mois suivant' 
    }, 
    contextMenuLabelsMonth: { 
        task: "Ajouter une nouvelle information", 
        chgwview: "Vue par semaine...", 
        chgdview: "Vue par jour...",
		gonextmonth: "Go to next month",     // 0.0.4
		goprevmonth: "Go previous month"     // 0.0.4
    },
    labelforTasksinMonth: 'Les informations de ce jour:',
    // Dayview and daytask  locale     
    task_MoreDaysFromTask: '<br>(+)',
    task_LessDaysFromTask: '(-)<br>',
    task_qtip_starts:     'D&eacute;but: ', 
    task_qtip_ends:     'Fin: ',     
    headerTooltipsDay: { 
            prev: 'Mois pr&eacute;c&eacute;dent', 
            next: 'Mois suivant' 
    }, 
    contextMenuLabelsDay: { 
        taskAdd: "Nouvelle information", 
        taskDelete: "Supprimer une information", 
        taskEdit: "Editer une information:",
        NextDay: "Mois suivant", 
        PreviousDay: "Mois pr&eacute;c&eacute;dent"
    },
    //Week view  and weektask locale 
	// 0.0.4
	contextMenuLabelsWeek: { 
		prev: "Go to Previous week.", 
		next: "Go Next week.", 
		chgdview: "Change to day view...", 
		chgmview: "Change to month view..."
	},	
	//0.0.4
	headerTooltipsWeek: { 
		prev: 'Previous week.', 
		next: 'Next week.' 
	},	
    labelforTasksinWeek: 'Plus d\'informations pour cette semaine:',
    win_week_zoomlabel:'Plus d\'informations...',
    weekheaderlabel:'Semaine #',
    weekheaderlabel_from:'De:',
    weekheaderlabel_to:' A:',    
    alldayTasksMaxLabel:'Voir toutes les informations...'

}