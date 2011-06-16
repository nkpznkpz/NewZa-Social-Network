// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.12) 
// @Version E2CS-0.0.12  DIC-2008
// UK English
// @Author: Claire Knight (ext forum krider2010)
// @contact:
// --------------------------------------------------
Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale = {
    loadmaskText: 'Processing Data....<br>Please Wait a moment...!',  //0.0.12
    // Calendar locale
    dateformat:          'd-m-Y',
    dateSelectorText:    'Select..',
    dateSelectorTooltip: 'Select a Date..',
    // Why i have my own locale for days and months you will ask ? i didn't want to mess with ext locale and prefer the widget will have his own locale 
    monthtitles:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    daytitles:  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    todayLabel: 'Today',
    todayToolTip: 'Set Todays date...',
    // toolbar buttons tooltips 
    tooltipMonthView:   'See Month view...',
    tooltipWeekView:    'See Week View...', 
    tooltipDayView:     'See Day View...',  
    tooltipSchedView:   'See Scheduler View...',        //0.0.10 new view
    // tpl for zoom tasks general labels 
    win_tasks_format:  'm-d-Y',
    win_tasks_loading: 'Loading...',
    win_tasks_empty:   'No Events...',                  //0.0.7  tasks changed to events
    // Month view locale
    win_month_zoomlabel:'Events in day',                //0.0.7  tasks changed to events
    headerTooltipsMonth: { 
        prev: 'Previous month',
        next: 'Next month'
    }, 
    contextMenuLabelsMonth: {
        task: "Add new task for",
        chgwview: "Change to week view...",
        chgdview: "Change to day view...",
        chgsview: "Change to schedule view...",         // 0.0.11
        gonextmonth: "Go to next month",                // 0.0.4
        goprevmonth: "Go previous month"                // 0.0.4
    },
    labelforTasksinMonth: 'Events in day:',             //0.0.7  tasks changed to events
    //-----------------------------------------------------------------
    // Dayview and daytask  locale  
    //----------------------------------------------------------------- 
    task_MoreDaysFromTask: '<br>(+)',
    task_LessDaysFromTask: '(-)<br>',
    task_qtip_starts:   'Starts: ', 
    task_qtip_ends:     'Ends: ',   
    headerTooltipsDay: { 
            prev: 'Previous day', 
            next: 'Next day' 
    }, 
    contextMenuLabelsDay: { 
        taskAdd: "New Event",                           //0.0.7  tasks changed to events
        taskDelete: "Delete Event",                     //0.0.7  tasks changed to events
        taskEdit: "Edit Event:",                        //0.0.7  tasks changed to events
        NextDay: "Go to next day", 
        PreviousDay: "Go to previous day",
        chgwview: "Change to week view...", 
        chgmview: "Change to Month view...",
        chgsview: "Change to Scheduler view..."         //0.0.11 
    },
    //-----------------------------------------------------------------
    //Week view  and weektask locale  // 0.0.4
    contextMenuLabelsWeek: { 
        prev: "Go to Previous week.", 
        next: "Go to Next week.", 
        chgdview: "Change to day view...", 
        chgmview: "Change to month view...",
        chgsview: "Change to Scheduler view..."         //0.0.11 
    },  
    //0.0.4
    headerTooltipsWeek: { 
        prev: 'Previous week.', 
        next: 'Next week.' 
    },
    labelforTasksinWeek: 'More Events on Week:',        //0.0.7  tasks changed to events
    win_week_zoomlabel:'More Events...',                //0.0.7  tasks changed to events
    weekheaderlabel:'Week #',
    weekheaderlabel_from:'From:',
    weekheaderlabel_to:' To:',  
    alldayTasksMaxLabel:'See More All(+)day(s) events..', //0.0.7  tasks changed to events
    //-----------------------------------------------------------------
    //Scheduler view strings//0.0.10 & 0.0.11 
    Scheduler_selector:'Select Period', 
    scheduler_noeventsonview:'<p>There are no Events in this period please add one</p>',
    scheduler_period_from_to:{
        starts:'From',
        ends:'Until'
    },
    headerTooltipsScheduler: {
        prev: 'Previous period',
        next: 'Next period'
    },
    scheduler_headerListStrings: {
        Day: "Day",
        week: "Week",
        period:"Period",
        start: "From",
        end: "Until"
    },
    contextMenuLabelsSchedule: {
        taskAdd:    "New Event",
        taskDelete: "Delete Event",
        taskEdit:   "Edit Event:",
        NextPeriod:     "Go to next period",
        PreviousPeriod: "Go to previous period",
        chgwview: "Change to week view...",
        chgmview: "Change to Month view...",
        chgdview: "Change to day view..."
    }
    
}