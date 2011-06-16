// JavaScript Document
// E2cs alpha 0.0.14
// Extjs-Event-Calendar Solution 
// calendar.js
// Author: Carlos Mendez
// E2CS - is licensed under the terms of  the Open Source LGPL 3.0 license.  
// Commercial use is permitted to the extent
// that the code/component(s) do NOT become part of another Open Source or Commercially
// licensed development library or toolkit without explicit permission.
// 
// License details: http://www.gnu.org/licenses/lgpl.html
//  ------------------------------------------------------------------
//	NOTE: this widget its not stable for the moment to use on a production application (on your risk), 
//  only test and learning for the moments 
//  ------------------------------------------------------------------
//	Credits 
//  e2cs.dateParts and dateDiff taken from DOJO toolkit  
//	(im not stealing code so i give the proper credits)
//  ------------------------------------------------------------------
//  Thanks  to: 
//  ------------------------------------------------------------------
//	Jack and all the Extjs staff: for making a great framework with some unexplored power yet...!  
//  Saki: cause of his tutorials and samples and replies on forum i could make this new widget 
//	and learn a lot of new things , thanks Saki..!
//
//  LOG

//  23-Jan-2009 
//  Added loadMask and customMaskText properties 
//	When the store loads It will show the mask if LoadMask=true
//  If customMaskText='' then will use e2cs.cal_locale.loadmaskText  (new adition to lang file) 

//  Also Handler routines for all views For When rendering again the childnodes inside the calendar's body 
//	will be destroyed , on test we perform on FF, CHORME and opera RUNS faster but IE still hangs a little while 
//  but now it consumes less memory  (also we have tried on Browsers without any addins running which these ones 
//  increased significantly the memory on all the browsers ) 

//  When changing views and the view was null raised an error changeView method 

//	27-Sep-2008
//  -----------------------------------------------------------------
//  Polish locale file added thanks to Remy 
//  Changed style on Week (main) Header 
//	Changed Style on Hour / minute display 
//	bug fixes on task.js file (see file for more details)
//	week view fixed and plain style working now (see file for more details)
//	month view fix minor bugs (see file for more details)
//	day view 	some minor bugs and some changes (see file for more details)
//	General calendar WIP: 
//		1.- working on Slate theme for the calendar 
//		2.- Working on default forms for capture/edit events 
//		3.- google style for dayview 
//  -----------------------------------------------------------------
//  04-08-2008 
//  -----------------------------------------------------------------
//	user manual revision 0.0.1 first release on english only
//  new property added (tplTaskTip) for making a template for qtip on events tasks 
//  monthth view, day view and week view fixes (see on each file for changes with tag or text 0.0.4 ) 
//	tasks.js modified due to new property 
//  elocale files modified  (need change on localization files  chinese, portugesem german and french)
//  E2CS blog Web site almost ready for launch need some tutorials or samples(in the making) 
//  ------------------------------------------------------------------
//  To do 
//  ------------------------------------------------------------------
//  Developer manual / Documentation for All the classes (PDF) 
//  General 
//	- Clean up the code it's a big mess
// 	- toolbar fixes for beheavior and display 
// 	Week View
//	In development for the moment  
//  Utils 
//  - Exporters (server side files) for gmail and outlook (file generation) 


Ext.namespace('e2cs.dateParts');
e2cs.dateParts={ YEAR: 0,  MONTH: 1,  DAY: 2, HOUR: 3,  MINUTE: 4, SECOND: 5,    MILLISECOND: 6,	 QUARTER: 7, 	WEEK: 8, 	WEEKDAY: 9};

Ext.ECalendar = Ext.extend(Ext.Panel,{		   
	id:'e-calendar',
	title:'Calendar', 
	mytitle: '',
	html:null, 
	showCal_tbar:true,
	showRefreshbtn:true,  // ** added on alpha 0.0.2
	refreshAction:'view', // 0.0.11 'view','data'
	// currentView  :  'month', 'week' or 'day'
	currentView: 'month',
	currentdate: new Date(),
	dateSelector: false,
	dateSelectorIcon: '',
	// dateSelectorIconCls: 'selector', removed on alpha 0.0.4 
	dateformat :'d-m-Y',
	//binding controls 
	//same control type to refresh and keep  in the same frequence
	fieldsRefer:{	//0.0.11
		id:'',				//event/task id 
		subject:'',			//string Value   - title ot main of the event topic 
		description:'', 	//string Value   - short description of the event
		color:'',			//string Value   - valid color format for custom color that will use the event
		startdate:'',		//string/date Value
		enddate:'',			//string/date Value
		priority:'',		// numeric value or (id) value - Optional 
		parent:'',			// if the task has a parent (will apply to the timeline)
		html:'',			// string Value   - custom HTML for the event		
		isHoliday:'', 		//0.0.15  // boolean value  - for holiday handling  (but the data have to come from your server side)
		alldaytask:'',		//0.0.15  // boolean value  - if the task can  be used as all day or not
		location:''			//0.0.15  // string Value   - new companion data for display on the events
	},
	tipmaxLength : 100, 		  // this one id for the description of the event (some reports may seem to raise an error when its too long) 
	rendertaskonHolidays: false,  //0.0.15 to set if the holiday day can render the tasks if there are more (on day body)
	
	storeOrderby:'', 		//0.0.11 
	storeOrder:'ASC',		//0.0.11 
//	widgetsBind: { 
//		bindMonth:null,	
//		bindDay:null,
//		binWeek:null
//	},
	//added on 0.0.4 
	tplTaskTip : new Ext.XTemplate( 
		'<tpl for=".">{location}{starxl}{startval}<br>{endxl}{endval}<hr color=\'#003366\' noshade>{details}</tpl>'
    ),
	//0.0.15  Updated lang for default tpltaskzoom 
	tplTaskZoom: new Ext.XTemplate(  
		'<tpl for=".">',
		'<div class="ecal-show-basetasktpl-div">Task:{subject}<br />',
		'Location:{location}<br />',
		'Starts:{startdate}<br />Ends:{enddate}<br>Description:<br>{description}<div><hr>',
		'</tpl>'
	),		
	monitorBrowserresize:false,  //0.0.7 beta 0.0.2 
	//Today button config--------------------------
	iconToday:'',
	// month view config--------------------------- 
	mview: null,
	iconMonthView:'',
	// week view config---------------------------- 
	wview: null,
	iconWeekView:'',
	// day view config ----------------------------
	dview: null, 
	iconDayView:'',
	// --------------------------------------------
	sview:null,
	iconSchedView:'',
	store: null, 	//store
	// --------------------------------------------
	pickerStartDay: 0, // 0.0.14  new feature to match according to Week View StartDay 	
	// private use --------------------------------
	viewmonth:null,
	viewday	 :null, 
	viewweek :null,
	viewscheduler:null, //0.0.10 
	viewready:false,  //0.0.7
	loadMask: true,
	customMaskText: '',
	calendarMask:null, // 0.0.12  internal use 
	//functions 
	
	// 'beforeRefresh',				// event not used  0.0.15 removed from event list 
	initComponent:function() {
		this.addEvents(
		   'onRefresh',
		   
		   'beforeChangeView', 		// Ok revisited 0.0.15
		   'onChangeView',
		   
		   'beforeChangeDate',  	// Ok revisited 0.0.15
		   'afterChangeDate',
		   
		   'beforeContextMenuTask', // 0.0.15
		   	//0.0.14 Added  To provide logic on the contextmenus of the Tasks	  
			
		   'customMenuAction',
		   'taskAdd',
		   'taskDblClick',

		   'beforeTaskMove',		// apply only on day view Drag Drop for resizing Time on task  //Ok revisited 0.0.15
		   'TaskMoved',

		   'beforeTaskDelete', 		// Ok revisited 0.0.15
		   'onTaskDelete',
		   'afterTaskDelete',

		   'beforeTaskEdit',		// Ok revisited 0.0.15 
		   'onTaskEdit',
		   'afterTaskEdit'
		);	
		//'taskDeleted', 0.0.4  removed  not use at all with the other events
		//'taskChanged'  0.0.4  removed not yet an implementation 
		if (this.html!=null) { this.html =null; } 
		toolspanel=[]; 
		this.btnrefresh	= {	id:'refresh',tooltip:'Actualizar contenido'	};
		if (this.showRefreshbtn){toolspanel.push(this.btnrefresh); 	} 
		this.btn_today ={
			id: this.id + '-btn_settoday', 
			cls: 'x-btn-text-icon', 
			text: e2cs.cal_locale.todayLabel,
			icon: this.iconToday, 
			tooltip: e2cs.cal_locale.todayToolTip
		};
		
		this.btn_monthviewchange = { 
			id: this.id + '-btn_monthview', 
			cls: 'x-btn-icon',	
			text: '', 
			icon: this.iconMonthView, 
			tooltip: e2cs.cal_locale.tooltipMonthView 
		};
		
		this.btn_weekviewchange =  { 
			id: this.id + '-btn_weekview',	 
			cls: 'x-btn-icon',	
			text: '', 
			icon: this.iconWeekView,	
			tooltip: e2cs.cal_locale.tooltipWeekView  
		};
		
		this.btn_dayviewchange =   { 
			id: this.id + '-btn_dayview',	 
			cls: 'x-btn-icon',	
			text: '', 
			icon: this.iconDayView, 	
			tooltip: e2cs.cal_locale.tooltipDayView   
		};		
		this.btn_schedviewchange = {
			id: this.id + '-btn_sched_view',	 
			cls: 'x-btn-icon',	
			text: '', 
			icon: this.iconSchedView, 	
			tooltip: e2cs.cal_locale.tooltipSchedView   
		};
		if (this.showCal_tbar){ 
			this.tbar_calendar= new Ext.Toolbar({	
				id:  this.id +'-cmscalendartoolbar', 
				autoWidth: true, 
				autoHeight:false,	
				items:[ this.btn_today ,'-',this.btn_monthviewchange,this.btn_weekviewchange,this.btn_dayviewchange,this.btn_schedviewchange,'-']  
			});	
		} else { 
			this.tbar_calendar=null; 
		} 
		this.selector_dateMenu  = new Ext.menu.DateMenu({ defaultAlign:'tr-br',subMenuAlign :''});
		if ( this.width){  var_autoWidth = false; } else { 	var_autoWidth = true;	} 
		if ( this.height){ var_autoHeight = false;} else {  var_autoHeight = true;	} 
		Ext.apply(this,{
			header: this.header,
			headerAsText: true, 
			title: this.title + this.mytitle,
			border:true,
			width:   this.width, 		//common width for all views 
			height:  this.height,  		//used on week view and day view
			monitorResize:true, 
			autoShow   :true, 
			autoWidth  :var_autoWidth,		    // default :( 
			autoHeight :var_autoHeight,			// used on month view
			autoScroll :false,  		// used on dayview
			html:this.html,    			// avoid other data displayed 
			tools: toolspanel,
			tbar:this.tbar_calendar,
			loadMask: this.loadMask
        });
		Ext.ECalendar.superclass.initComponent.call(this); 
		if (this.mview){ 
			this.viewmonth = this.getViewMonth(); 
			this.viewmonth.init(this,this.currentdate);		
		}
		if (this.dview ){ 
			this.viewday = this.getViewDay();
			this.viewday.init(this,this.currentdate);		
		} 
		if (this.wview){
			this.viewweek = this.getViewWeek();
			this.viewweek.init(this,this.currentdate);		
		} 
		if (this.sview){
			this.viewscheduler = this.getViewShedule();
			this.viewscheduler.init(this,this.currentdate);		
		} 
		

	}, // end of function initComponent
	// Override other inherited methods 
	onResize: function(){
		Ext.ECalendar.superclass.onResize.apply(this, arguments);
		this.doLayout();
		if (this.viewready){  //0.0.7
			if (this.currentView=='month'){     this.viewmonth.render(); 	} 
			if (this.currentView=='week') {     this.viewweek.render();  	} 
			if (this.currentView=='day')  {	    this.viewday.render(); 		} 
			if (this.currentView=='schedule'){  this.viewscheduler.render();}	 //0.0.12
		} 
	}, 
    onRender: function(){
        Ext.ECalendar.superclass.onRender.apply(this,arguments);	
    },
	afterRender: function(){
		Ext.ECalendar.superclass.afterRender.call(this);
		if (this.loadMask){ 
			if (this.store==null && this.store==undefined){
			} else { 
				if (this.customMaskText==''){
					var TexttoshowonProgress =e2cs.cal_locale.loadmaskText; 
				} else { 
					var TexttoshowonProgress =this.customMaskText; 
				} 
				this.calendarMask = new Ext.LoadMask(Ext.get(this.id),{msg:TexttoshowonProgress});
//				this.store.on({'beforeload':{
//							fn:function(){ 
//								testtmp.show(); 
//							},scope:this
//						},
//						'load':{
//							fn:function(success,dataxx,purebax){
//								testtmp.hide();
//							},scope:this
//						} 
//				});	
			}	
		} 
		//0.0.11 Sort the order of the store if this.storeOrderby is specified 
		if (this.storeOrderby==''){ } else { this.store.sort(this.storeOrderby, this.storeOrder); 	} 		
		if (this.showCal_tbar){
			var btntoday = this.topToolbar.items.items[0]; 
			btntoday.setHandler( this.setCurrentDate, this );
			var btnmonth =  this.topToolbar.items.items[2]; 
			var btnweek  =  this.topToolbar.items.items[3];
			var btnday   =  this.topToolbar.items.items[4];
			var btnsched =  this.topToolbar.items.items[5]; // 0.0.10 
			
			if (!this.mview){ btnmonth.setVisible(false);  } else { btnmonth.setVisible(true);	}
			if (!this.dview){ btnday.setVisible(false);    } else { btnday.setVisible(true);	}
			if (!this.wview){ btnweek.setVisible(false);   } else { btnweek.setVisible(true);	}
			if (!this.sview){ btnsched.setVisible(false);  } else { btnsched.setVisible(true);	} //0.0.10
			
			btnmonth.addListener('click',  function(){   this.changeView('month'); 		}  , this); 
			btnday.addListener('click',    function(){   this.changeView('day');   		}  , this); 
			btnweek.addListener('click',   function(){   this.changeView('week');  		}  , this); 
			btnsched.addListener('click',  function(){   this.changeView('schedule');  	}  , this); 
			
		}
		if (this.header && this.tools.refresh){ // 0.0.10 Bug fix Thanks to Remy 
			if 	(this.refreshAction=='view'){   // 0.0.11    'view', 'data'
					this.tools.refresh.addListener('click', this.refreshCalendarView, this );
			} else { 
					this.tools.refresh.addListener('click', function(){
																this.store.reload(); 
															}, this );
			} 
		} 
		if (this.dateSelector && this.showCal_tbar){
			this.selector_dateMenu.picker.startDay  = this.pickerStartDay;
			this.selector_dateMenu.picker.todayText = e2cs.cal_locale.todayLabel;
			this.selector_dateMenu.picker.todayTip  = e2cs.cal_locale.todayToolTip;
			this.selector_dateMenu.picker.monthNames= e2cs.cal_locale.monthtitles;
			this.selector_dateMenu.picker.dayNames  = e2cs.cal_locale.daytitles;
			this.selector_dateMenu.picker.setValue(this.currentdate);
			this.selector_dateMenu.addListener('select', this.selectdatefromSelector , this); 
			//this.tbar_calendar.addFill() ;
			this.btn_selector  = {
					id: this.id + '-btn_dateselector',		
					cls: 'x-btn-text-icon',	
					text: e2cs.cal_locale.dateSelectorText,
					icon: this.dateSelectorIcon,
					tooltip: e2cs.cal_locale.dateSelectorTooltip,
					menu: this.selector_dateMenu
			};	
			this.tbar_calendar.addButton(this.btn_selector);
		} 
		if (this.ownerCt==undefined){
			if (this.currentView=='month'){  	this.viewmonth.render(); 	} 
			if (this.currentView=='week') {  	this.viewweek.render(); 	} 
			if (this.currentView=='day')  {  	this.viewday.render(); 		} 
			if (this.currentView=='schedule'){  this.viewscheduler.render();}	 //0.0.10
		} else { 
			if (this.currentView=='month'){  	this.viewmonth.render(); 	} 
			if (this.currentView=='week') {  	this.viewweek.render(); 	} 
			if (this.currentView=='day')  {  	this.viewday.render(); 		} 
			if (this.currentView=='schedule'){  this.viewscheduler.render();}	 //0.0.10
		} 
		this.doLayout();
		this.viewready = true; //0.0.7 
		tmpobj = this;
		if (this.monitorBrowserResize){  //0.0.7 
			Ext.EventManager.onWindowResize( function(){ //console.log('change...inside calendar');
				tmpobj.refreshCalendarView(); 
			});
		} 
	},
	refreshCalendarView: function(btn){
		if (this.rendered){ 
			//0.0.11 Sort the order of the store if this.storeOrderby is specified 
			if (this.storeOrderby==''){ } else { this.store.sort(this.storeOrderby, this.storeOrder); 	} 	
			if (this.currentView=='month'){  	this.viewmonth.render(); 		} 
			if (this.currentView=='week') {  	this.viewweek.render(); 		} 
			if (this.currentView=='day')  {	 	this.viewday.render(); 			} 
			if (this.currentView=='schedule'){  this.viewscheduler.render(); 	}	 //0.0.10   
			this.doLayout();
			this.fireEvent("onRefresh",this);
		}	
	}, 
	setNewDate:function(newdate){ 
		if ( this.fireEvent("beforeChangeDate", newdate , this)==false ) { 
			this.selector_dateMenu.picker.setValue(this.currentdate);	
			return false; 
		} 
		//0.0.11 Sort the order of the store if this.storeOrderby is specified 
		if (this.storeOrderby==''){ } else { this.store.sort(this.storeOrderby, this.storeOrder); 	} 
		this.currentdate = new Date(newdate); 	
		this.selector_dateMenu.picker.setValue(this.currentdate);
		if (this.currentView=='month'){ 	this.viewmonth.render(); 	} 
		if (this.currentView=='week') { 	this.viewweek.render(); 	} 
		if (this.currentView=='day')  {	 	this.viewday.render(); 	}  
		if (this.currentView =='schedule'){ this.viewscheduler.render(); 	} //0.0.10   
		this.doLayout();
		this.fireEvent("afterChangeDate", this.currentdate , this);
	} , 
	setCurrentDate: function(){ 
		this.setNewDate(Date());
	},
	changeView: function(datastr, opdate){
		var newView  = datastr;	//0.0.15 changed to local var 
		var oldView  = this.currentView; //0.0.15 changed to local var 
		if  (newView==oldView){  //0.0.15  if its the same view whay to change ?:[
			return false; 
		} 
		if ( this.fireEvent("beforeChangeView", newView , this.currentView, this)==false ) { 
			return false; 
		} 
		//if (oldView=='schedule' && newView !='schedule'){ }//0.0.10  not implemented yet //remove period selector if any 
		if(datastr=='month'){//0.0.12 FIX 	
			if (this.viewmonth==null || this.viewmonth==undefined){ return false; 	
			} else { this.currentView='month'; this.viewmonth.render();
			}
		} else if (datastr=='week'){//0.0.12 FIX 
			if (this.viewweek==null || this.viewweek==undefined){ return false; 	
			} else {  this.currentView='week'; this.viewweek.render(); 	
			} 
		} else if (datastr=='day') {//0.0.12 FIX 
			if (this.viewday==null || this.viewday==undefined){ return false; 	
			} else {   this.currentView='day';  this.viewday.render(); 	
			} 
		} else if (datastr =='schedule'){ //0.0.12 FIX 
			if (this.viewscheduler==null || this.viewscheduler==undefined){ return false; 	
			} else { this.currentView='schedule';  this.viewscheduler.render(); 
			} 
		} else {
			return false; 
		}
		this.fireEvent("onChangeView", newView, oldView, this); 
	}, 
	//--------------------------------------------------------------
	//private ------------------------------------------------------
	//--------------------------------------------------------------	
	selectdatefromSelector: function(dp, dateval){ 
		this.setNewDate(dateval);
	},
	getCurrentDate: function(){ //0.0.11 
		return this.currentdate; 
	},	
	getViewMonth:function(){  
		if(!this.viewmonth){ this.viewmonth = new Ext.ECalendar.monthview(this.mview); }
        return this.viewmonth;
	}, 
	getViewDay: function(){
		if(!this.viewday){   this.viewday = new Ext.ECalendar.dayview(this.dview); }
        return this.viewday;
	},
	getViewWeek: function(){
		if(!this.viewweek){  this.viewweek = new Ext.ECalendar.weekview(this.wview);}
        return this.viewweek;
	},	
	getViewShedule: function(){ //0.0.10 new View (O.O) 
		if(!this.viewscheduler){  this.viewscheduler = new Ext.ECalendar.scheduleview(this.sview);}
        return this.viewscheduler;
	}, 
	//------------------------------------------------------------------
	//------------------------------------------------------------------
	//------------------------------------------------------------------
	// Util functions  
	// -----------------------------------------------------------------
	//goNextMonth: function(){   alert("Mes siguiente"); 	}, removed for alpha 0.0.4
	//goPrevMonth: function(){   alert("Mes Anterior"); 	}, removed for alpha 0.0.4
	getCalendarMonth:	function(){			return ( this.currentdate.getMonth() + 1); 		}, 
	getCalendarYear: 	function(){ 		return ( this.currentdate.getFullYear() ) ;  	}, 
	getCalendarDay:		function(){  		return ( this.currentdate.getUTCDate() ) ; 		},
	getCalendarWeekDay: function(dataformat){ 
		if (dataformat=='str') { 
			return  Date.dayNames[this.currentdate.getDay()]; 
		} else { 
			return ( this.currentdate.getDay() ) ; 
		} 
	},
	//-------------------------------------------------------------------------------
	//getDateRangeOfWeek - Utility Date tool  new //0.0.10   also this give us the hope of week view to set the view with ChangebyWeek(weekno)  
	//-------------------------------------------------------------------------------
	getRangeofMonth: function(datevalue){ // 0.0.15 the range that will be rendered in the monthview 
		var dt= new Date(dateval); 													
		var initday = dt.getFirstDayOfMonth()-this.startDay;//0.0.8
		var daysgen = dt.getDaysInMonth(); 
 	    if (dt.getMonth()==1) { // February only!
		  	if(( dt.getFullYear() % 4 == 0 && dt.getFullYear() % 100 != 0) || dt.getFullYear() % 400 == 0){	daysgen = 29;}
	  	}
		if (initday<0){ initday = 7	+ (initday)	;  	}
		var dtstart   = new Date( (dateval.getMonth()+ 1)  + '/1/' + dateval.getFullYear()).add(Date.DAY,(initday * -1 )); 
		var icount = initday; 
		startmonthdate = new Date( dt.format('m') + '/01/' + dt.format('Y') ); 
		for (var imonth=0; imonth<daysgen; imonth++){ 
			if (icount>=7){ icount=0;} 	var datecreatetmp= new Date(startmonthdate).add(Date.DAY, imonth); 	icount+=1; 
		}
		var dtend_tmp = new Date( (dateval.getMonth()+ 1)  + '/1/' + dateval.getFullYear()).add(Date.DAY,(daysgen)); 
		var countertest= dtend_tmp.getDay();
		if (icount<7 ){ 
			var datatmp =0;
			for (var iday=icount; iday<7; iday++){
				datatmp=datatmp+1;	var datenew = new Date(datecreatetmp).add(Date.DAY,datatmp); 
			} 
		} 
		var toretn = [dtstart,datenew];	return toretn;
	},
	getDateRangeOfWeekByDate:function(startDay,Dateval){ 
		var dw = new Date(Dateval).getDay();
		if (startDay==1){ // monday 
			dw = ((dw==0)?6:dw-1); // day of week, monday first
			var initdate = new Date(Dateval.add(Date.DAY,-dw).format('m/d/Y') + ' 00:00:00'); // monday always
			var enddate  = new Date(Dateval.add(Date.DAY,-dw+6).format('m/d/Y') + ' 23:59:59');			
		} else if (startDay==0) { // sunday 
			if (dw ==0){ 
				var initdate = new Date(Dateval.add(Date.DAY,0).format('m/d/Y') + ' 00:00:00'); // sunday always
				var enddate  = new Date(Dateval.add(Date.DAY,6).format('m/d/Y') + ' 23:59:59');			
			} else { 
				var initdate = new Date(Dateval.add(Date.DAY,-(dw)).format('m/d/Y') + ' 00:00:00'); // sunday always
				var enddate  = new Date(initdate.add(Date.DAY,6).format('m/d/Y') + ' 23:59:59');			
			} 
		} else {  //saturday 
			if (dw==6){ 
				var initdate = new Date(Dateval.add(Date.DAY,0).format('m/d/Y') + ' 00:00:00'); // saturday always
				var enddate  = new Date(Dateval.add(Date.DAY,6).format('m/d/Y') + ' 23:59:59');			
			} else { 
				var initdate = new Date(Dateval.add(Date.DAY,-(dw+1)).format('m/d/Y') + ' 00:00:00'); // saturday always
				var enddate  = new Date(initdate.add(Date.DAY,6).format('m/d/Y') + ' 23:59:59');			
			} 
		} 	
		return [initdate,enddate];		
	},
	getDateRangeOfWeek: function(weekNo){
		var d1 = new Date();
		numOfdaysPastSinceLastMonday = eval(d1.getDay()- 1);
		d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
		var weekNoToday = d1.getWeekOfYear();
		var weeksInTheFuture = eval( weekNo - weekNoToday );
		d1.setDate(d1.getDate() + eval( 7 * weeksInTheFuture ));
		var rangeIsFrom = new Date(    (d1.getMonth()+1) +"/" + d1.getDate() + "/" + d1.getFullYear() );
		d1.setDate(d1.getDate() + 6);
		var rangeIsTo = new Date (     (d1.getMonth()+1) +"/" + d1.getDate() + "/" + d1.getFullYear() );
		return [rangeIsFrom , rangeIsTo] ;
	},
	//-------------------------------------------------------------------------------
	// Dojo Date function -  altered  only the part of (fleegix.date.util.dateParts)
	//-------------------------------------------------------------------------------
	dateDiff: function (date1, date2, interv) {
	// date1  	// Date object or Number equivalent
	// date2	// Date object or Number equivalent
	// interval	// A constant representing the interval, e.g. YEAR, MONTH, DAY. See fleegix.date.util.dateParts.
	// Accept timestamp input
	  if (typeof date1 == 'number') { date1 = new Date(date1); }
	  if (typeof date2 == 'number') { date2 = new Date(date2); }
	  if  (date1.format('m/d/Y H:i:s') == date2.format('m/d/Y H:i:s') ) { return 0;  } 
	  var yeaDiff = date2.getFullYear() - date1.getFullYear();
	  var monDiff = (date2.getMonth() - date1.getMonth()) + (yeaDiff * 12);
	  var msDiff =  date2.getTime() - date1.getTime(); // Millisecs
	  var secDiff = msDiff/1000;
	  var minDiff = secDiff/60;
	  var houDiff = minDiff/60;
	  var dayDiff = houDiff/24;
	  var weeDiff = dayDiff/7;
	  var delta = 0; // Integer return value
	  with (e2cs.dateParts) {
		switch (interv) {
		  case YEAR:
			delta = yeaDiff;
			break;
		  case QUARTER:
			var m1 = date1.getMonth();
			var m2 = date2.getMonth();
			// Figure out which quarter the months are in
			var q1 = Math.floor(m1/3) + 1;
			var q2 = Math.floor(m2/3) + 1;
			// Add quarters for any year difference between the dates
			q2 += (yeaDiff * 4);
			delta = q2 - q1;
			break;
		  case MONTH:
			delta = monDiff;
			break;
		  case WEEK:
			// Truncate instead of rounding
			// Don't use Math.floor -- value may be negative
			delta = parseInt(weeDiff);
			break;
		  case DAY:
			delta = dayDiff;
			break;
		  case WEEKDAY:
			var days = Math.round(dayDiff);
			var weeks = parseInt(days/7);
			var mod = days % 7;
	 
			// Even number of weeks
			if(mod == 0){
			  days = weeks*5;
			}else{
			  // Weeks plus spare change (< 7 days)
			  var adj = 0;
			  var aDay = date1.getDay();
			  var bDay = date2.getDay();
			  weeks = parseInt(days/7);
			  mod = days % 7;
			  // Mark the date advanced by the number of
			  // round weeks (may be zero)
			  var dtMark = new Date(date1);
			  dtMark.setDate(dtMark.getDate()+(weeks*7));
			  var dayMark = dtMark.getDay();
			  // Spare change days -- 6 or less
			  if(dayDiff > 0){
				switch(true){
				  // Range starts on Sat
				  case aDay == 6:
					adj = -1;
					break;
				  // Range starts on Sun
				  case aDay == 0:
					adj = 0;
					break;
				  // Range ends on Sat
				  case bDay == 6:
					adj = -1;
					break;
				  // Range ends on Sun
				  case bDay == 0:
					adj = -2;
					break;
				  // Range contains weekend
				  case (dayMark + mod) > 5:
					adj = -2;
					break;
				  default:
					// Do nothing
					break;
				}
			  }else if(dayDiff < 0){
				switch (true) {
				  // Range starts on Sat
				  case aDay == 6:
					adj = 0;
					break;
				  // Range starts on Sun
				  case aDay == 0:
					adj = 1;
					break;
				  // Range ends on Sat
				  case bDay == 6:
					adj = 2;
					break;
				  // Range ends on Sun
				  case bDay == 0:
					adj = 1;
					break;
				  // Range contains weekend
				  case (dayMark + mod) < 0:
					adj = 2;
					break;
				  default:// Do nothing
					break;
				}
			  }
			  days += adj;
			  days -= (weeks*2);
			}
			delta = days;
	 
			break;
		  case HOUR:
			delta = houDiff;
			break;
		  case MINUTE:
			delta = minDiff;
			break;
		  case SECOND:
			delta = secDiff;
			break;
		  case MILLISECOND:
			delta = msDiff;
			break;
		  default:// Do nothing
			break;
		}
	  }
	  return Math.round(delta); // Number (integer) // Round for fractional values and DST leaps
	}
});
// ** added on alpha 0.0.2
Ext.reg('e2cs_calendar',Ext.ECalendar); 