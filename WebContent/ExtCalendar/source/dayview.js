// JavaScript Document
// E2cs alpha  0.0.11
// Extjs-Event-Calendar Solution 
// dayview.js
// Author: Carlos Mendez
// Contact: cmendez21@gmail.com   (gmail and gtalk) 
//  Dayview LOG ------------------------------------------------------------------------------------------
//  Works fine on firefox 2.0, 3.0, ie6, ie7, chrome, chrome and IE may have some css issues as safari too 
//  because base development browser is firefox 2 and 3+ 
//  ------------------------------------------------------------------------------------------------------
//  Jan-15-2009  0.0.12 
//  CSS fixes for IE cause it wasnt rendering so good :( 
//	also some new styles for IE specific on calendar.css :) 													
//  10-Dic-2008  0.0.11
//  td .hour-marker when clicekd launches a new addevent based upen the hour when clicked , (bdetermined by taskAdd_dblclick property) 
//	Changed some issues on Menus for BODY element, added ShowMenuItems:[1,1,1,1,1,1,1,1] so you can allow which menu item appear 
//  Changed some issues on Menus for Each task/Event element, added task_ShowMenuItems:[1,1,1,1,1] so you can allow which menu item appear 
//	BUG - Fixed for Check if other views are still present or not=null and adjust the menu Items for changing view
//	Dynamic field modification on Code  very nice this one :) 
//  Added integration to Scheduler view  :)

//	27-Sep-2008
//  	Changed style on Day (main) Header 
//		Changed Style on Hour / minute display 
//		Changed hourFormat default value changed G for H 
//		New property taskAdd_dblclick: true
//			- When set to true if you click on the body of the dayview the event  'taskAdd' will be launched 

//		WIPs for next version: 
//			1.- Working for google style for day view just like google calendar (similar to week view on google style) 
//			2.- Handlers for click on the hour so you can add a new event at with the date and starting time which was clicked
//				2.1- will work with the upcoming default forms for capture/edit  events 
//  
// 		Note : the changes on styles were made in the calendar.css file 
//	08-sep-2008 
//  ------------------------------------------------------------------
//	repaired some display and render issues 
//  fix some ID conflicts when two or more calendars are  on the same page  (see //0.0.6 comment on sources) 
//  ------------------------------------------------------------------
//  17-june-2008
// 	1.- 'beforeDayChange' and 'afterDayChange'	events so you can query on the store for the records
//  2.- store  property removed, it uses the calendar store so no necesity to use another
//	3.- refactored the display and layout of the day cause issues of resize, more tasks on day 
//	(width greater than main layout)
//  4.- on fit layouts or containers goes weel everything  (firefox2) 
//	5.- addedd fix for scroll (overflow) 

//  --------------------------- CHANGE LOG ---------------------------
//  10-June-2008
//  ------------------------------------------------------------------
//  localized in lang file see locale dir for files 
//  no more need to set these properties 
//  :) 
//	headerTooltips: { prev: 'Previous day..', next: 'Next day' }, 
//	task_MoreDaysFromTask: '<br>(+)',   //used on task.js file
//	task_LessDaysFromTask: '(-)<br>',	//used on task.js file
//	contextMenuLabels: { 
//		taskAdd: "New Task", 
//		taskDelete: "Delete Task", 
//		taskEdit: "Edit Task:",
//		NextDay: "Go to Next Day", 
//		PreviousDay: "Go to Previous Day"
//	},	
//  ------------------------------------------------------------------

Ext.ECalendar.dayview = function(config){
	Ext.apply(this,config);
	this.addEvents(
	    'beforeDayChange',  // fix for request to the store specific data from only a day 
		'afterDayChange'	// After the day was changed
	);	
	Ext.ECalendar.dayview.superclass.constructor.call(this);
};
Ext.extend(Ext.ECalendar.dayview, Ext.util.Observable, {
	referid:'dayview', //0.0.9
	header:true,
	headerFormat:'l - d - F  - Y',	// according to Ext.Date object 
	headerButtons: true,
	moreMenuItems:[],				// NOTE: this one is for the context menu on each task/event, the body will not take this one for use 
	// day specific 
	hourFormat: 'G:i', 				// 0.0.15 change to handle full format // according to Ext.Date object    //0.0.7 - beta 0.0.2  changed G for H 
	startTime: '7:00:00 am',		// format has to be 'H:s:i a'
	endTime:   '10:00:00 pm',		// format has to be 'H:s:i a'
	scrolltoHour: false , 			// 0.0.15  let the ciew scroll to the current hour if any 
	task_useBorderStyle: false,	  	// 0.0.15 (on day and week bodies for the moment)
	task_useBordercolor: '#225588',	// companion property for task_useBorderStyle
	// task settings 
	taskBaseColor:'#ffffff', 
	useMultiColorTasks: false,  	// not implemented yet
	multiColorTasks:[], 			// not implemented yet
	task_increment:5, 				// ** added on alpha 0.0.2
	task_width: 50, 				// ** added on alpha 0.0.2
	tasksOffset:0,  				// 0.0.15  fixed and implemented - for overlapping or separating task/events  
	task_clsOver:'',				// ** added on alpha 0.0.2  not implemented
	task_showqtip:true,				// ** added on alpha 0.0.2
	task_format:'d-m-Y H:i:s a', 	// added on 0.0.4 
	taskAdd_dblclick: true,			// added on 0.0.7 - beta 0.0.2
	taskAdd_timer_dblclick: true,   // 0.0.11  When the user dblclick on the Time display in the body will launch an add event with the date and time selected :) 
	task_DDeditable:true, 			// 0.0.11   
	task_eventLaunch:'click', 		// 0.0.11  'click, dblclick, if set to '' then no action is taken 
	ShowMenuItems:[1,1,1,1,1,1],   	// 0.0.11  ADD, next day, prev day , chg Month , CHG Week, chg Sched, (for daybody menu) 
	task_ShowMenuItems:[1,1,1,1,1], // 0.0.11  ADD, delete, edit, Next day , Prev Day  (for Taks/events) 
	customHTMLinpos : 'before',		// 0.0.13  Feature Request // When inserting custom HTML you decide the pos  
									// "before"  means that the custom HTML specified will be inserted before anything on the Event body 
									// "after"   means that the custom HTML specified will be inserted after inserting the subject or References (-) or (+)
	forceTaskFit: false,			// 0.0.14 Mayor feature // Force all the vents to fit on the View and the width its changed gradually
	headerUseTpl:false,				//0.0.15 new property to adapt the title header customizable 
	//0.0.15
	headerTpl: new Ext.XTemplate('<tpl for=".">{title}-{datetouse:this.formatx}</tpl>',
	{
		formatx:function(value){
			return value.format('l - d - F  - Y');		
		}
	}),
	//0.0.15
	headerData:{	
		title:'Custom header for Day', 
		datetouse:new Date()
	},	
	tasks:[],
	init: function(calendar,dateval){
		this.calx = calendar; 
		this.datetohandle = dateval; 
	},
	refreshView: function(){  this.render(); }, 
	// Private 	
	render: function(){
		//var myMask = new Ext.LoadMask( this.calx.id , {removeMask:true,msg:e2cs.cal_locale.loadmaskText});
		//myMask.show();		
		var updateview = Ext.get(this.calx.body); 
		//0.0.12 Small test for removing child nodes 
		var testrender= updateview.dom.childNodes.length; 
		if (testrender){ 
			for (var i=testrender;i<testrender;i++){
				updateview.dom.removeChild(updateview.dom.childNodes[0]);
			} 
		} 		
		updateview.update('');	
		var updateview = Ext.get(this.calx.body);
		var daycntbase =  '<div id="' + this.calx.id + '-main-calendar-header"></div>'; 
		    daycntbase+=  '<div id="' + this.calx.id + '-main-calendar-day-body"></div>';	
		updateview.update(daycntbase); 	
		this.datetohandle = this.calx.currentdate; 
		if (this.header){
			var dt = this.datetohandle; 
			var tmpheader = this.genHeader(this.datetohandle); 
			var tmpheader = Ext.get(this.calx.id + '-main-calendar-header');
			var prueba2   = tmpheader; 
			var myheaderwrap  = prueba2.wrap ({tag:'div',cls:'x-calendar-dayv-header',html:''}); 
			if (this.headerButtons){ // 0.0.4 bug 
				var prevdclick = myheaderwrap.createChild({id:this.calx.id + '-btn-pd', tag: 'div',	 cls: 'x-calendar-day-previous',html:'' 	}); //0.0.6 added ID  // 0.0.10 bug fix thanks to PTG 	
				var nextdclick = myheaderwrap.createChild({id:this.calx.id + '-btn-nd', tag: 'div',	 cls: 'x-calendar-day-next',	html:''		}); //0.0.6 added ID  // 0.0.10 bug fix thanks to PTG
				prevdclick.dom['qtip']= e2cs.cal_locale.headerTooltipsDay.prev;
				prevdclick.addListener('click', this.onclickprev_day, this);
				prevdclick.addClassOnOver('x-calendar-day-previous-over'); // 0.0.10 bug fix thanks to PTG
				nextdclick.dom['qtip']= e2cs.cal_locale.headerTooltipsDay.next;
				nextdclick.addListener('click', this.onclicknext_day, this);
				nextdclick.addClassOnOver('x-calendar-day-next-over');	   // 0.0.10 bug fix thanks to PTG
			} 
			if (this.headerUseTpl){ 
				var htmlinheader = this.headerTpl.apply(this.headerData);
				var headerdx=myheaderwrap.createChild({ tag: 'div',	 id:  'header',  html:'' + htmlinheader + ''	});			
			} else { 
				var headerdx=myheaderwrap.createChild({ tag: 'div',	 id:  'header',  html:'' + dt.format(this.headerFormat) + ''	});			
			} 
		} 
		Ext.get(this.calx.id + '-main-calendar-header').setStyle('z-index' ,'99999'); // 0.0.13b 
		// creates thebody of the month --------------------------------------------
		var htmlday = this.genBody(this.datetohandle); 
		var tmpdays = Ext.get(this.calx.id + '-main-calendar-day-body');
		var myheaderdayswrap = tmpdays.wrap({tag:'div',	cls:'x-calendar-dayv-day',	html:''	}); 	
		if (Ext.isIE) {  
			myheaderdayswrap.setStyle({position:'relative'}); 
		}  //0.0.13 fix for XHTML
		if (this.calx.ownerCt!=undefined){ //0.0.6 fix for ext.component containers such as tab and others and properly draw correctly
			if (this.calx.ownerCt.ctype && this.calx.ownerCt.ctype=="Ext.Component"){ 
				//this.calx.height =  this.calx.ownerCt.height;  
				this.calx.height =  this.calx.ownerCt.getInnerHeight(); //0.0.7  - beta 0.0.2 
			} 
		} 
		if (!this.calx.height || this.calx.height=='undefined'){ 
			if (this.calx.getEl().dom.offsetParent!=null) { 
				var tmpheight = this.calx.getEl().dom.offsetParent.clientHeight; //+ this.calx.getFrameHeight() ; //0.0.6
			} else { 
				var tmpheight = 0; 
			} 
		} else{ 
			var tmpheight = this.calx.height; 
		} 
		if (tmpheight ==0) { tmpheight  = 300; }  // 0.0.13 Fix for some containers  or layouts this is a temporal  height
		if (this.header){tmpheight+=-24;}
		if (this.calx.showCal_tbar){ tmpheight+=-26;} 	
		if (this.calx.header){tmpheight+=-26;} 
		
		var morehoffst=0; 
		
		//if (this.calx.showCal_tbar){ var morehoffst=76;  } else { var morehoffst=24; }
		myheaderdayswrap.setStyle({height:'' +  tmpheight-morehoffst + 'px' } );
		myheaderdayswrap.setStyle({overflow:'auto'});
		// ------------------------------------------------------------------		
		//0.0.3 bug posted on forum 
		//Correct the bug in IE7 when you scroll in DayView
		// ------------------------------------------------------------------
		tmpid = this.calx.id; 
		myheaderdayswrap.addListener('scroll',function(){
			if(Ext.get(tmpid + '-daybody')){
				Ext.get(tmpid + '-daybody').setStyle('filter','alpha(opacity=100)');
				Ext.get(tmpid + '-daybody').setStyle('filter','');
			}
		});
		// ------------------------------------------------------------------
		var mydays = myheaderdayswrap.createChild({ tag:'div',  id: this.calx.id + '-calendar-view-day', html:htmlday}); 
		if (Ext.isIE) {  mydays.setStyle({position:'relative'}); }  //0.0.13 fix for XHTML
		if ( Ext.isIE || Ext.isIE6){ 
			Ext.get('daylayoutbody').setStyle({position:'relative'});	//0.0.13 fix for XHTML	
			Ext.get('daylayoutbody').setWidth(Ext.get('daylayoutbody').getWidth()-25,false); //0.0.12 FIX CSS issues
			Ext.get(this.calx.id + '-tableallday').setStyle({position:'relative'});	//0.0.13 fix for XHTML		
		}
		// fix for the day grid 
		var mydaybody = Ext.get(this.calx.id + '-daybody'); 
		// 0.0.7 - beta 0.0.2  new feature , when the user dblclicks on the body of the day TaskAdd event launches similar to outlook 
		var dblclickdate = this.calx.currentdate; 
		var tmpcalendarobjinstance = this.calx; 
		var testdblclick = this.taskAdd_dblclick;
		if (testdblclick){ 
			mydaybody.addListener('dblclick', function(evx,elx,obx){ 							   
				if (elx.id.indexOf('-daybody')<0){	return false; } 
				//0.0.14 New feature WHEN double click then  Calc the position to set the time Base Hour
				//------------------------------------------------------------------------------------
				//0.0.13  Fix Now when you set the new event launcher from the menu inside the body  
				//it will determine the base hour:00 according to the current coordinate Y inside the body 
				var dt_tmp_dt = dblclickdate; 
				var tmpYtouse = Ext.get(tmpcalendarobjinstance.id + '-calendar-view-day').getY(); 
				//We will check otu the Y property according to THe Y of the event to see the current Time also and icnlude it on the app 
				if (Ext.isIE){ 
					var mytimeTD_elements = Ext.select('td.hour-marker_ie',true); 
				} else { 
					var mytimeTD_elements = Ext.select('td.hour-marker',true); 
				} 
				mytimeTD_elements.each(function(el, thisobj, index){
							if ( el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-dayv-')+1>=1){ 	
								 var CYtmp = Ext.get(el).getY(); 
								 var CHtmp = Ext.get(el).getHeight(); 
								 var tmpCurrY  = evx.getPageY(); 
								 if  (	tmpCurrY>=CYtmp && tmpCurrY<=(CYtmp + CHtmp)	) {  //applies for the time 
										if (el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-dayv-')<0 ){ 
											var mydt_element_test= Ext.get(el).parent().id.replace(tmpcalendarobjinstance.id + '-tdbody-dayv-',''); 
										} else { 
											var mydt_element_test= el.id.replace(tmpcalendarobjinstance.id + '-tdbody-dayv-',''); 
										} 
										dt_tmp_dt = new Date(mydt_element_test); 
										return false; 
								 } else { 
									 	return true; 
								 } 
							} 
						 },
					 this
				);
				//this.calx.fireEvent("taskAdd",dt_tmp_dt); 
				tmpcalendarobjinstance.fireEvent("taskAdd", dt_tmp_dt );
			   //------------------------------------------------------------------------------------			
			   ///if (testdblclick) { tmpcalendarobjinstance.fireEvent("taskAdd", dblclickdate );	}
			});	
		} 
		//------------------------------------------------------------------
		//0.0.11 if this.taskAdd_dblclick then also we will handle addevents to Labels for time so when the atasks add then will be on the specific hour set :) 
		if (this.taskAdd_timer_dblclick) {
			if (Ext.isIE) { 
				var mytimeTD_elements = Ext.select('td.hour-marker_ie',true); 
			} else { 
				var mytimeTD_elements = Ext.select('td.hour-marker',true); 
			} 
			mytimeTD_elements.each(function(el, thisobj, index){
						if ( el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-dayv-')+1>=1){ 	
									el.addListener('dblclick', function(evx,elx,obx){ 
										if (elx.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-dayv-')<0 ){ 
											var mydt_element_test= Ext.get(elx).parent().id.replace(tmpcalendarobjinstance.id + '-tdbody-dayv-',''); 
										} else { 
											var mydt_element_test= elx.id.replace(tmpcalendarobjinstance.id + '-tdbody-dayv-',''); 
										} 
										var mytmpdate= new Date(mydt_element_test); 
										tmpcalendarobjinstance.fireEvent("taskAdd", mytmpdate );
								});	
						} 
					 },
				 this
			);
		} 
//		tmpdatetohandleontd = dt.format('m/d/Y');
//		tmpdatetohandleontd+= ' ' + inittime.add(Date.HOUR, (i) ).format(this.hourFormat); 
//		tmpdatetohandleontd+= ':' + inittime.add(Date.HOUR,(i)).format('i a'); 
//		dviewbody +='<tr><td id="' + this.calx.id + '-tdbody-dayv-' + tmpdatetohandleontd + '" class="hour-marker"><span>'+ inittime.add(Date.HOUR, (i) ).format(this.hourFormat) + '</span>'; 
//		dviewbody +='<span class="minute">' + inittime.add(Date.HOUR,(i)).format('i a') + '</span></td></tr>'; 		
		mydaybody.setHeight( Ext.get('tdbaseday').getHeight(true)  );
		if (Ext.isOpera){ 
			mydaybody.addListener('mousedown',this.operadaybuttons,this); 
		} else { // feature posted by IOMANIP for context menu (right click) on the body of each day view 
			mydaybody.addListener('contextmenu', this.oncontextmenuBody, this,{ stopPropagation:false,  normalized :true,  preventDefault:true});
		}
		// now process the task from the store to display in the grid of the day
		this.tasks =[]; 
		//check how many will be rendered before 
		var dateinionthisday = new Date( this.datetohandle.format('m/d/Y') + ' ' + this.startTime);
		var dateendonthisday = new Date( this.datetohandle.format('m/d/Y') + ' ' + this.endTime  );
		var counttasks = this.calx.store.getCount(); 
		var countdone=0; 
		for (var i=0; i<counttasks; i++){ 
			var testrec 	= this.calx.store.getAt(i).data; 
			testdateinit 	= this.calx.store.getAt(i).data[this.calx.fieldsRefer.startdate];   //0.0.11dynamic fields
			testdateend 	= this.calx.store.getAt(i).data[this.calx.fieldsRefer.enddate]; 	//0.0.11dynamic fields		
			checkdates 		= this.datetohandle.between( new Date(testdateinit), new Date(testdateend) ); 
			chkformat 		= this.datetohandle.format('m/d/Y'); 
			test 			= new Date(testdateinit); 	if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
			test 			= new Date(testdateend); 	if (test.format('m/d/Y')==chkformat){  checkdates =true; } 			
			if (checkdates){ countdone+=1; } 
		}
		var counttasks= countdone;
		if ( counttasks>0 ){ 
			currentindex= 0;
			created=0;
			previndex=0;
			if (this.tasksOffset=='auto'){ 
				var newwfix = counttasks * this.task_width; 
			} else { 
				var newwfix = (counttasks * this.task_width) - ( (counttasks-1)* this.tasksOffset) ; 
			} 
			if (Ext.get('tdbaseday').getWidth(true)<newwfix){ 
				if (!this.calx.width ||this.calx.width=='undefined'){ 
				
				}  else { 
					Ext.get(this.calx.id + '-daybody').setWidth(newwfix,false); 
					Ext.get('daylayoutbody').setWidth(Ext.get(this.calx.id + '-tableallday').getWidth(true)+1,false); //0.0.6 added calendar ID
				} 
				var test=11;
			}
			var counttasks = this.calx.store.getCount(); 
			// Now we Check first the Events / Tasks that will be in the view so we can get the total count 
			// this is cause of the new property forceTaskFit
			var Tasktohandle=[]; 

			for (var itask=0; itask<counttasks ; itask++){
				dateinit 	= this.calx.store.getAt(itask).data[this.calx.fieldsRefer.startdate];   //0.0.11dynamic fields	
				dateend 	= this.calx.store.getAt(itask).data[this.calx.fieldsRefer.enddate]; 	//0.0.11dynamic fields		
				checkdates 	= this.datetohandle.between( new Date(dateinit), new Date(dateend) ); 
				chkformat 	= this.datetohandle.format('m/d/Y'); 
				test 		= new Date(dateinit); 	
				if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				test 		= new Date(dateend); 	
				if (test.format('m/d/Y')==chkformat){  checkdates =true; } 

				if ( checkdates ){ 
					Tasktohandle.push(itask);  //we store in the array the index of the record 
					// this.calx.store.getAt(itask).data[this.calx.fieldsRefer.id]); 
				} 	
			} 
			//0.0.13 mod 
			for (var i=0; i<Tasktohandle.length; i++){
					itask = Tasktohandle[i]; 
					if (this.calx.store.getAt(itask).data[this.calx.fieldsRefer.color]){ //0.0.11dynamic fields	
						colortask = this.calx.store.getAt(itask).data[this.calx.fieldsRefer.color]	; //0.0.11dynamic fields	
					} else { 
						colortask = this.taskBaseColor; 
					}
					var tmpdescription = this.calx.store.getAt(itask).data[this.calx.fieldsRefer.description];
					if (tmpdescription.length>this.calx.tipmaxLength){ 
						var tmpdescriptionx = tmpdescription.substring(0,this.calx.tipmaxLength) + '...'; 
					}
					var tmpholiday = this.calx.store.getAt(itask).data[this.calx.fieldsRefer.isHoliday]; 
					if (tmpholiday==undefined || tmpholiday==''){ tmpholiday = 0 ; }
					var tmpallday  = this.calx.store.getAt(itask).data[this.calx.fieldsRefer.task_isallday]; 
					if (tmpallday==undefined || tmpallday==''){ tmpallday = 0 ; }
					
					this.tasks[i]= new Ext.ECalendar.daytask({												
						tasksOffset: 		this.tasksOffset, 
						evenLaunch:			this.task_eventLaunch, 						//0.0.11  define event on which the task/event will be activated 
						editable: 			this.task_DDeditable , 						//0.0.11  OldValue = true, 
						parentview:			this, 										//dayview object
						baseBody:			mydaybody,          						//ext element already created 
						datehandle:			this.datetohandle,  						//date to handle 
						showQtip:			this.task_showqtip, 						//if show or not the qtip  deafults true 
						contextMenuLabels:  e2cs.cal_locale.contextMenuLabelsDay, 
						tplqTip:			this.calx.tplTaskTip,
						task_index:			itask,
						task_id:		    this.calx.store.getAt(itask).data[this.calx.fieldsRefer.id],			//0.0.11 dynamic fields				
						task_subject: 		this.calx.store.getAt(itask).data[this.calx.fieldsRefer.subject],		//0.0.11 dynamic fields
						task_starts:		this.calx.store.getAt(itask).data[this.calx.fieldsRefer.startdate],		//0.0.11 dynamic fields
						task_ends:			this.calx.store.getAt(itask).data[this.calx.fieldsRefer.enddate],		//0.0.11 dynamic fields
						task_description:	tmpdescriptionx,														//0.0.11 dynamic fields
						customHtml: 		this.calx.store.getAt(itask).data[this.calx.fieldsRefer.html], 			//0.0.13 Feature Request by many users 
						customHTMLinpos:	this.customHTMLinpos,
						task_clsOver:		this.task_clsOver, 														//0.0.11 dynamic fields
						task_increment: 	this.task_increment,
						task_width: 		this.task_width, 
						task_format:		this.task_format, 
						bgcolor:			colortask,			//0.0.11 dynamic fields
						moreMenuItems:		this.moreMenuItems,
						ShowMenuItems: 		this.task_ShowMenuItems, //0.0.11 setting permissions on the menu 
						forceTaskFit: 		this.forceTaskFit,
						totalTasksonView:	Tasktohandle.length,
						task_useBxStyle: 	this.task_useBorderStyle,
						task_useBxcolor:	this.task_useBordercolor,
						task_location:		this.calx.store.getAt(itask).data[this.calx.fieldsRefer.location], 		//0.0.15
						task_isholiday:		tmpholiday,		//0.0.15
						task_isallday:		tmpallday	//0.0.15						
					});
					this.tasks[i].init(this.calx,this); 
					this.tasks[i].render(); 			
			} 
			if (Ext.get('daylayoutbody').getWidth(true)<Ext.get(this.calx.id + '-tableallday').getWidth(true)) { //0.0.6 added calendar ID
				Ext.get('daylayoutbody').setWidth( Ext.get(this.calx.id + '-tableallday').getWidth(true)+1,false); //0.0.6 added calendar ID				
			} 
			if (this.tasks.length<=0){ 
				mydaybody.update('&nbsp;');			
			} 
		} else { 
			mydaybody.update('&nbsp;');
		} 
		// Scroll to the current hour any date :P 
		myheaderdayswrap.dom.scrollTop=0;
		if (this.scrolltoHour){ 
			var sct_top=0; //0.0.15 
			if (Ext.isIE) { var mytimeTD_elements = Ext.select('td.hour-marker_ie',true); } else { var mytimeTD_elements = Ext.select('td.hour-marker',true); 	} 
			mytimeTD_elements.each(function(el, thisobj, index){
						if ( el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-dayv-')+1>=1){ 	
							 var testfmt = this.datetohandle.format('G:i'); 
							 if (el.id.indexOf(testfmt)+1>=1){ //0.0.15 
								sct_top = Ext.get(el).getY();
								return false; 
							 }
						} 
					 },
				 this
			);
			if (sct_top>0){ 
				sct_top  = sct_top  - myheaderdayswrap.getY(); 
				myheaderdayswrap.dom.scrollTop=sct_top;		
			} 
		}
		//myMask.hide();	
	},	
	operadaybuttons: function (evx,elx,obx){ 
		if (Ext.isOpera){ 
			if (evx.button==2){ this.oncontextmenuBody(evx,elx,obx); }  
		} else { 
			return false; 
		} 	
	}, 
	//---------------------------------------------------------------------
	// oncontextmenuBody: feature posted by IOMANIP (ext forums)
	// for context menu (right click) on the body of each day view 
	oncontextmenuBody: function (evx,elx,obx){ 
		if (Ext.isOpera){ if (evx.button!=2){ return false; }  	}
		//0.0.11 Avoid to show menu cause no permission is set and also no custom Menus also 
		if (this.ShowMenuItems[0]!=true && this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true && this.ShowMenuItems[3]!=true && this.ShowMenuItems[4]!=true && this.ShowMenuItems[5]!=true){return false;}
		evx.stopEvent();
		if  (elx.id.indexOf(this.calx.id + "-daybody")<0) { return false; } 
		var tmpdata= Ext.get(elx.id);
		if (this.menu){ this.menu.removeAll();	}
		this.menu = new Ext.menu.Menu({
			// 0.0.10 bug fix thanks to PTG
			id: this.calx.id + '-contextmenu-day', //0.0.6 modified ID  and menu items also on ID 
			shadow: true, 
			items:[{id:this.calx.id + '-day_ctxbtn_task-add',		iconCls:'x-calendar-day-btnmv_add',			 text: e2cs.cal_locale.contextMenuLabelsDay.taskAdd, 	scope:this},
				   '-',
				   {id:this.calx.id + '-day_ctxbtn_task-go-nd', 	iconCls: 'x-calendar-day-btnmv_nextday',     text: e2cs.cal_locale.contextMenuLabelsDay.NextDay,	 scope:this},
				   {id:this.calx.id + '-day_ctxbtn_task-go-pd', 	iconCls: 'x-calendar-day-btnmv_prevday',     text: e2cs.cal_locale.contextMenuLabelsDay.PreviousDay, scope:this},
				   '-',
				   {id:this.calx.id + '-day_ctxbtn_viewmonth', 		iconCls: 'x-calendar-month-btnmv_viewmonth', text: e2cs.cal_locale.contextMenuLabelsDay.chgmview, scope:this},
				   {id:this.calx.id + '-day_ctxbtn_viewweek', 		iconCls: 'x-calendar-month-btnmv_viewweek',	 text: e2cs.cal_locale.contextMenuLabelsDay.chgwview, scope:this},
				   {id:this.calx.id + '-day_ctxbtn_viewsched', 		iconCls: 'x-calendar-month-btnmv_viewsched', text: e2cs.cal_locale.contextMenuLabelsDay.chgsview, scope:this} //0.0.11 				   				   
			]
		});
		this.menu.items.items[0].addListener('click', function(){ 
				//0.0.13  Fix Now when you set the new event launcher from the menu inside the body  
				//it will determine the base hour:00 according to the current coordinate Y inside the body 
				var dt_tmp_dt = this.calx.currentdate; 
				var tmpcalendarobjinstance = this.calx; 
				var tmpYtouse = Ext.get(this.calx.id + '-calendar-view-day').getY(); 
				//We will check otu the Y property according to THe Y of the event to see the current Time also and icnlude it on the app 
				if  (Ext.isIE){ 
					var mytimeTD_elements = Ext.select('td.hour-marker_ie',true); 
				} else { 
					var mytimeTD_elements = Ext.select('td.hour-marker',true); 
				} 
				mytimeTD_elements.each(function(el, thisobj, index){
							if ( el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-dayv-')+1>=1){ 	
								 var CYtmp = Ext.get(el).getY(); 
								 var CHtmp = Ext.get(el).getHeight(); 
								 var tmpCurrY  = evx.getPageY(); 
								 if  (	tmpCurrY>=CYtmp && tmpCurrY<=(CYtmp + CHtmp)	) {  //applies for the time 
										if (el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-dayv-')<0 ){ 
											var mydt_element_test= Ext.get(el).parent().id.replace(tmpcalendarobjinstance.id + '-tdbody-dayv-',''); 
										} else { 
											var mydt_element_test= el.id.replace(tmpcalendarobjinstance.id + '-tdbody-dayv-',''); 
										} 
										dt_tmp_dt = new Date(mydt_element_test); 
										return false; 
								 } else { 
									 	return true; 
								 } 
							} 
						 },
					 this
				);
				this.calx.fireEvent("taskAdd",dt_tmp_dt); 
				//this.calx.fireEvent("taskAdd", this.calx.currentdate); 
		}, this); 
		this.menu.items.items[2].addListener('click', function(){ this.onclicknext_day(); }, this);  //next day		
		this.menu.items.items[3].addListener('click', function(){ this.onclickprev_day(); }, this);  //prev day	
		this.menu.items.items[5].addListener('click', function(){ this.changeCalview( Ext.get(elx),this,1); 	}, this); 
		this.menu.items.items[6].addListener('click', function(){ this.changeCalview( Ext.get(elx),this,2); 	}, this);	
		this.menu.items.items[7].addListener('click', function(){ this.changeCalview( Ext.get(elx),this,3); 	}, this);
		//0.0.11 - check visibility on the menu-items according to the new property this.ShowMenuItems
		
		// ShowMenuItems:[1,1,1,1,1,1],   	// 0.0.11  ADD, next day, prev day , chg Month , CHG Week, chg Sched, (for daybody menu) 
		if (this.ShowMenuItems[0]!=true){
						this.menu.items.items[0].hidden=true;  // ADD 
						this.menu.items.items[1].hidden=true;  // SEPARATOR 	
		} 					
		if  (this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true && this.ShowMenuItems[3]!=true && this.ShowMenuItems[4]!=true && this.ShowMenuItems[1]!=true){ 
			this.menu.items.items[1].hidden=true;  // SEPARATOR 	
		} 
		if (this.ShowMenuItems[1]!=true){	this.menu.items.items[2].hidden=true;		} 
		if (this.ShowMenuItems[2]!=true){	this.menu.items.items[3].hidden=true;		} 	
		if (this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true){
			this.menu.items.items[4].hidden=true;	
		}
		if (this.ShowMenuItems[3]!=true){	this.menu.items.items[5].hidden=true;		} 
		if (this.ShowMenuItems[4]!=true){	this.menu.items.items[6].hidden=true;		} 
		if (this.ShowMenuItems[5]!=true){	this.menu.items.items[7].hidden=true;		} 
		// check the existence of view objects  0.0.11 
		if (!this.calx.mview){ this.menu.items.items[5].hidden=true; }
		if (!this.calx.wview){ this.menu.items.items[6].hidden=true; }
		if (!this.calx.sview){ this.menu.items.items[7].hidden=true; }
		//this.menu.showAt(evx.xy);	
		this.menu.showAt( [ evx.getPageX(), evx.getPageY() ] ); //0.0.11 
	}, 	
	//---------------------------------------------------------------------
	changeCalview: function(objx, mviewx, typeview){
		if (objx.dom.className=='noday' || objx.dom.className=='today' || objx.dom.className=='monthday') { 
			var refdate= new Date(objx.id);
		} else if (objx.dom.className=='tasks' ){ 
			var refdate = new Date(objx.dom.parentNode.firstChild.id); 
		} else { 
			var refdate= new Date(objx.dom.firstChild.id);
		} 
		if (typeview==1){
			varview='month'; 
		} else if (typeview==2){ 
			varview='week'; 
		} else { 
			varview='schedule';
		} 
		this.calx.changeView(varview);
	},	
	onclickprev_day: function (evx, elx, obx){
		var changedaydate = this.datetohandle.add(Date.DAY,-1); 
		var check = this.fireEvent("beforeDayChange", this.datetohandle, changedaydate); 
		if (check){ 
			this.calx.currentdate = changedaydate; 		
			this.datetohandle = changedaydate; 
			this.render();			
			this.fireEvent("afterDayChange", changedaydate);
		} 
	}, 
	onclicknext_day: function (evx, elx, obx){
		var changedaydate = this.datetohandle.add(Date.DAY,1); 
		var check = this.fireEvent("beforeDayChange", this.datetohandle, changedaydate); 
		if (check){ 
			this.calx.currentdate = changedaydate;  	
			this.datetohandle = changedaydate; 
			this.render();
			this.fireEvent("afterDayChange", changedaydate); 
		} 
	},
	genHeader: function(dateval){
		var dt = new Date(dateval);
		Date.monthNames = e2cs.cal_locale.monthtitles; 
		Date.dayNames   = e2cs.cal_locale.daytitles; 
		var myheader    = '<div class="x-calendar-dayv-header" style="width:' + (this.calx.width - 10) + 'px;">';
			myheader+=	  '<div id="header">' + dt.format(this.headerFormat)  + '</div>'; 
		if (this.headerButtons){
		    myheader+= '<div class="x-calendar-day-previous"></div>';
		    myheader+= '<div class="x-calendar-day-next"></div>'; 
		} 
		myheader+='</div>';
		return myheader; 
	},
	genBody: function(dateval){
		var dt = new Date(dateval);
		var inittime = new Date(dt.format('m/d/Y') + ' ' + this.startTime); 
		var endtime  = new Date(dt.format('m/d/Y') + ' ' + this.endTime); 		
		this.diffhrs  = this.calx.dateDiff(inittime,endtime,e2cs.dateParts.HOUR); 
		//fix for IE6 and IE7
		var wtdisp=''; 
		if ( Ext.isIE || Ext.isIE6){ wtdisp='97.8'; } else { wtdisp='100';}
		wtdisp = '100';
		//---------------------------------
		var dviewbody ='<div id="daylayoutbody" class="x-calendar-dayv-body">'; //0.0.6 added calendar ID
		dviewbody += '<table id="' + this.calx.id + '-tableallday" width="' + wtdisp + '%" border="0" cellspacing="1" cellpadding="0"><tr><td valign="top" width="50">'; 
		dviewbody += '<table width="50" border="0" align="center" cellpadding="0" cellspacing="0">'; 
		
		for (var  i=0; i<this.diffhrs; i++){ 
			//dviewbody +='<tr><td class="hour-marker">'+ inittime.add(Date.HOUR, (i) ).format( this.hourFormat + ':i a') + '</td></tr>'; 
			tmpdatetohandleontd = dt.format('m/d/Y');
			tmpdatetohandleontd+= ' ' + inittime.add(Date.HOUR, (i) ).format('G'); //this.hourFormat); 
			tmpdatetohandleontd+= ':' + inittime.add(Date.HOUR,(i)).format('i'); 
			if ( Ext.isIE  ) { 
				var mymarker = 'hour-marker_ie'; 
				var mydatatd = ' align="center" valign="middle" '; 
			} else { 
				var mymarker = 'hour-marker';
				var mydatatd = '';
			} 
			dviewbody +='<tr><td ' + mydatatd + ' id="' + this.calx.id + '-tdbody-dayv-' + tmpdatetohandleontd + '" class="' + mymarker + '">';
			
			//0.0.15 The hour format handle all the format now
			dviewbody +='<span>'+ inittime.add(Date.HOUR, (i) ).format(this.hourFormat) + '</span></td></tr>'; 		
//			dviewbody +='<span>'+ inittime.add(Date.HOUR, (i) ).format(this.hourFormat) + '</span>'; 
//			if (Ext.isIE){ //0.0.12 CSS correction
//				dviewbody +='<span class="minute_ie">'; //+='<span class="minute_ie">';
//			} else { 
//				dviewbody +='<span class="minute">';
//			} 
//			dviewbody +=inittime.add(Date.HOUR,(i)).format('i a') + '</span></td></tr>'; 
		} 
		var mydatacomp =''; 
		if (Ext.isIE || Ext.isIE6 ||Ext.isIE7){//0.0.13 CSS correction   for XHTML doctype  files
			mydatacomp = ' style="position:relative;" '; 
		} 
		dviewbody +='</table></td><td valign="top" id="tdbaseday"' + mydatacomp  + '>'; //0.0.13 fix for XHTML 
		if (Ext.isIE || Ext.isIE6 ||Ext.isIE7){//0.0.12 CSS correction 
			dviewbody +='<div id="' + this.calx.id + '-daybody" class="basegridday_ie6"' + mydatacomp + '>';//0.0.13 fix for XHTML
		} else { 
			dviewbody +='<div id="' + this.calx.id + '-daybody" class="basegridday">';
		} 
		dviewbody +='&nbsp;';
		dviewbody +='</div>'; 
		dviewbody +='</td></tr></table>'; 
		dviewbody +='</div>';
		return dviewbody; 
	} 
});