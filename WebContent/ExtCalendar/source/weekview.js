// JavaScript Document
// E2cs alpha  0.0.11
// Extjs-Event-Calendar Solution 
// weekview.js
// Author: Carlos Mendez
// Contact: cmendez21@gmail.com   (gmail and gtalk) 

// week view LOG-------------------------------------------------------
// 11-dic-208
//	Changed some issues on Menus for BODY element, added ShowMenuItems:[1,1,1,1,1,1,1,1] so you can allow which menu item appear 
//  Changed some issues on Menus for Each task/Event element, added task_ShowMenuItems:[1,1,1,1,1] so you can allow which menu item appear 
//	BUG - Fixed for Check if other views are still present or not=null and adjust the menu Items for changing view
//	BUG - Fixed when displaying allday task (google style) 
//	Dynamic field modification on Code  very nice this one :) 
//  Added integration to Scheduler view  :)

//	27-Sep-2008
//		Plain style for week view is fully functional now 
// 		fixed some issue with event render on plain style 
//  	Changed style on Week (main) Header 
//		Changed Style on Hour / minute display 
// 		Added headerDayClick property to handle click for change to day view 
//		Added dom trags to more week elements so it can be no cross  handling with other calendar instances 
//		Changed hourFormat default value changed G for H
//		Property alldayTaskTPL previosly was taken the tpl property from the calendar and was not used
//  
// 	Note : the changes on styles were made in the calendar.css file 
//  ------------------------------------------------------------------
//	08-sep-2008 
//  ------------------------------------------------------------------
//	repaired some display and render issues 
//  fix some ID conflicts when two or more calendars are  on the same page  (see //0.0.6 comment on sources) 
//  ------------------------------------------------------------------
// 	01-august-2008 
//	fix for opera event(tasks) display 
//  17-june-2008 
//	1.- first release of week view
//	------------------------------------------------------------------
//	to do 
//	handlers  for context menu on task for days and allday tasks

Ext.ECalendar.weekview = function(config){
	Ext.apply(this,config);
	this.addEvents(
		'dblClickTaskAllDay',
	    'beforeWeekChange',  // 0.0.4
		'afterWeekChange',	 // 0.0.4
		'launchEventList'    //0.0.4 
	);	
	Ext.ECalendar.weekview.superclass.constructor.call(this);
};
Ext.extend(Ext.ECalendar.weekview, Ext.util.Observable, {
	referid:'weekview', //0.0.9
	header:true, 
	headerButtons: true,
	headerFormat: 'W',
	headerShowDates: true, 
	dayformatLabel:  'D j', 
	scrolltoHour: false , 			// 0.0.15  let the ciew scroll to the current hour if any 
	hourFormat: 'G:i', 				// change on 0.0.15  //  according to Ext.Date object    //0.0.7 - beta 0.0.2  changed G for H 
	startTime:  '00:00:00 am',		// format has to be 'H:s:i a'
	endTime:    '11:59:59 pm',		// format has to be 'H:s:i a'	
	style: 		'google',  			// style:   'plain or 'google'
	// alldatTaksMore:   
	//	'event'  will raise an event with the all data available for this 
	//	'window' will create an internal window with the list of the tasks 
	//			 when click an element on the task list will raise an event and close the window
	alldayTaksMore:'window',
	alldayTaskTPL: new Ext.XTemplate(
		'<tpl for="."><div class="ecal-show-basetasktpl-div">Event:{subject}<br>Location:{location}',
		'Starts:{startdate}<br>Ends:{enddate}<br>Description:<br>{description}<div><hr></tpl>'
	),
	alldayTasksMaxView:3,
	alldayTasks:[],
	weekTasks:[],
	store: null, 
	headerDayClick:'none', //'viewday' changes to day view, 'none' do nothing  // 0.0.7  beta 0.0.2 
	currentweek:1,  	   // dynamic change for rendering sets the actual value  
	//tasks settings for render 
	task_format:'d-m-Y H:i:s a',
	task_bgcolor_base:'#E0FFA2',		
	task_showqtip: true, 
	task_width:50, 
	tasksOffset:20,  // for overlapping tasks
	taskelements:0,  // private use for gen a unique id on day tasks  // added on 0.0.4 
	ShowMenuItems:[1,1,1,1,1,1],		//0.0.11  add, go next w , go prev w , chg month , chg day, chg sched 
	task_ShowMenuItems:[1,1,1,1,1],		//0.0.11  add, delete, edit, go next w, go prev w
	moreMenuItems:[],
	task_eventLaunch:'click',			//0.0.11
	taskAdd_timer_dblclick:false, 		//0.0.15 When the user dblclick on the Time display in the body will launch an add event with the date and time selected :) 
	scrolltoHour: false , 				//0.0.15 let the view scroll to the current hour if any 
	allday24HinsideBody:false,			//0.0.15 if the task is all day but it covers only the range from 00:00:00 am to (11:59:59 pm or  day+1 00:00:00 am) it will be rendered on the body of the day instead allday task
	task_clsOver:'',					//0.0.11 on day view was setted up long ago but not implemented, now its implement here also 
	forceTaskFit: false,				//0.0.14 Mayor feature // Force all the vents to fit on the View and the width its changed gradually	
	startDay:1,							//0.0.14 Monday (full week number), Sunday (-1)or Saturday (-2)
	customHTMLinpos:'before',			//0.0.13  Feature Request // When inserting custom HTML you decide the pos  
										//"before"  means that the custom HTML specified will be inserted before anything on the Event body 
										//"after"   means that the custom HTML specified will be inserted after inserting the subject or References (-) or (+)
	headerUseTpl:false,					//0.0.15 new property to adapt the title header customizable 
	//0.0.15
	headerTpl: new Ext.XTemplate('<tpl for=".">{title}-from {initday:this.formatx} to {enday:this.formatx}</tpl>',
	{
		formatx:function(value){
			return value.format('m-d-y');		
		}
	}),
	//0.0.15
	headerData:{	
		title:'Custom header for Week', 
		initday:new Date(),
		enday:new Date()
	},		
	init: function(calendar,dateval){
		this.calx = calendar; 
		this.datetohandle = dateval; 
	},
	refreshView: function(){
		this.render(); 
	},
	render: function(){
		//var myMask = new Ext.LoadMask( this.calx.id , {removeMask:true,msg:e2cs.cal_locale.loadmaskText});
		//myMask.show();	
		this.datetohandle = this.calx.currentdate; 
		var daterange = this.getDatesforWeek(this.datetohandle);
		var updateview = Ext.get(this.calx.body); 
		//0.0.12 Small test for removing child nodes  and have better performance and memory 
		var testrender= updateview.dom.childNodes.length; 
		if (testrender){ for (var i=testrender;i<testrender;i++){ updateview.dom.removeChild(updateview.dom.childNodes[0]);	} }  		
		updateview.update('');			
		var updateview =  Ext.get(this.calx.body);
		var daycntbase =  '<div id="' + this.calx.id + '-main-calendar-header"></div>'; 
		    daycntbase+=  '<div id="' + this.calx.id + '-main-calendar-week-body"></div>';	
		updateview.update(daycntbase); 
		if (this.header){ // header section starts 
			var dt = this.datetohandle; 
			var tmpheader = Ext.get(this.calx.id + '-main-calendar-header');
			var prueba2   = tmpheader; 
			var myheaderwrap  = prueba2.wrap ({ tag: 'div',	 cls: 'x-calendar-weekv-header' ,html:''}); 
			if (this.headerButtons){
				//var prevdclick = myheaderwrap.createChild({ tag: 'div',	 cls: 'x-calendar-week-previous',html:''}); 	
				//var nextdclick = myheaderwrap.createChild({	tag: 'div',	 cls: 'x-calendar-week-next'    ,html:''});
				// 0.0.10 bug fix thanks to PTG
				var prevdclick = myheaderwrap.createChild({id:this.calx.id + '-btn-pw', tag: 'div', cls: 'x-calendar-week-previous',html:''});     
				var nextdclick = myheaderwrap.createChild({id:this.calx.id + '-btn-nw', tag: 'div', cls: 'x-calendar-week-next'    ,html:''});
				prevdclick.dom['qtip']=  e2cs.cal_locale.headerTooltipsWeek.prev; //'prev week';
				prevdclick.addListener('click', function(){ this.onclickprev_week(); }  , this);
				prevdclick.addClassOnOver('x-calendar-week-previous-over');// 0.0.10 bug fix thanks to PTG

				nextdclick.dom['qtip']= e2cs.cal_locale.headerTooltipsWeek.next; //'next week'; 
				nextdclick.addListener('click', function(){ this.onclicknext_week(); }, this);
				nextdclick.addClassOnOver('x-calendar-week-next-over');// 0.0.10 bug fix thanks to PTG	
			} 
			if (this.headerUseTpl){ 
				var htmlinheader = this.headerTpl.apply(this.headerData);
				//var headerdx=myheaderwrap.createChild({ tag: 'div',	 id:  'header',  html:'' + htmlinheader + ''	});	
				var headerdx = myheaderwrap.createChild({ tag: 'div', id: this.calx.id + '-sub-' + 'header',  html:'' +  htmlinheader +''});
			} else {  
				complementtext =''; 
				if (this.headerShowDates){ 
					complementtext = ' <span class="x-calendar-weekv-header-small">' + e2cs.cal_locale.weekheaderlabel_from + daterange[0].format('d/m/Y') + e2cs.cal_locale.weekheaderlabel_to + daterange[1].format('d/m/Y') + '</span>'; 
				} 
				//var headerdx = myheaderwrap.createChild({ tag: 'div', id:'header',  html:'' +  e2cs.cal_locale.weekheaderlabel + dt.format(this.headerFormat) + complementtext  +''});
				// 0.0.14 FIX  according to the new startday property the week can cover 2 different weeks so if this happens then  we 
				// show the range of weeks also in the header 			
				if (daterange[0].format(this.headerFormat)==daterange[1].format(this.headerFormat)){ 
					var hdrweeknumtxt = e2cs.cal_locale.weekheaderlabel + dt.format(this.headerFormat);
				} else { 
					var hdrweeknumtxt = e2cs.cal_locale.weekheaderlabel + daterange[0].format(this.headerFormat) + " - " + daterange[1].format(this.headerFormat); 
				} 
				var headerdx = myheaderwrap.createChild({ tag: 'div', id: this.calx.id + '-sub-' + 'header',  html:'' +  hdrweeknumtxt + complementtext  +''});
			} 
		} 
		// check style to create the container or not 'plain or google
		var tmpdays = Ext.get(this.calx.id + '-main-calendar-week-body');
		var weeklayoutskel = tmpdays.createChild({ tag: 'div',	 id: this.calx.id + '-weekvbody', cls:'x-calendar-weekv-body',html:'' }); //0.0.6
		var daterange = this.getDatesforWeek(this.datetohandle); 		
		
		if (this.style=='plain'){ 
			// plain style  goes on 
			daysintro = this.genDaysHeader(daterange[0]); 
			weeklayoutskel.insertHtml('beforeEnd', daysintro,false);
		} else {  
			// google style starts 
			daysintro = this.genAlldayContainer(daterange[0]);
			weeklayoutskel.insertHtml('beforeEnd', daysintro,false); 
			// sets the container 	
			var mydaybodytmp   = Ext.get(this.calx.id + '-allday1'); 
			var myallcontainer = Ext.get(this.calx.id + '-alldaycontainer'); //0.0.6
			var myallreferh    = Ext.get('alldayrefer'); 
			myallcontainer.setXY(mydaybodytmp.getXY()); 
			myallcontainer.setHeight( mydaybodytmp.getHeight(true)  );   
			ancho = 0 ;
			for (var i=1;i<8;i++){ 	ancho+= Ext.get(this.calx.id + '-allday' + i ).getWidth(false);	}
			if (Ext.isIE){
				ancho+=7; 
			} else { 
				ancho+=5; 
			} 
			myallcontainer.setWidth(ancho,false);	
			// more tasks div creation if it applies to be on the view 
			var moretaskbuttonallday = Ext.get('alldaylistbutton'); 
			var taskstmp = this.getWeekTasks(this.datetohandle,0); 
			if ( myallcontainer.dom.childNodes.length==1 && myallcontainer.dom.childNodes[0].childNodes.length==0){
				moretaskbuttonallday.setDisplayed('none'); 
			} else { 
				if (taskstmp.length>this.alldayTasksMaxView){ 
					moretaskbuttonallday.setDisplayed('block'); 
				} else { 
					moretaskbuttonallday.setDisplayed('none'); 														
				} 
			} 
			moretaskbuttonallday.addClassOnOver('alldaylistover'); 
			moretaskbuttonallday.addListener('click', function(){ this.showMoreTasksList(); } ,this); 
		} 
		
		
		// creates the week body 
		var bodyweekhtml = this.genBody(daterange[0]); 
		weeklayoutskel.insertHtml('beforeEnd', bodyweekhtml ,false); 
		// fix the grids for each day 
		for (var i=1;i<8;i++){ 
			var tmpeachdaybodygrid = Ext.get( this.calx.id +'-day' + i ); 
			tmpeachdaybodygrid.setHeight( Ext.get(this.calx.id +'-wd'+i).getHeight(true) ); //0.0.6
			var containerdaytmp = Ext.get(tmpeachdaybodygrid.dom.childNodes[0]); // 0.0.4 fix 
			containerdaytmp.setHeight(Ext.get(this.calx.id +'-wd'+i).getHeight(false) ); //0.0.6
			if (Ext.isOpera){ 
				containerdaytmp.addListener('mousedown', this.operabuttons_body,this); 
			} else { 
				containerdaytmp.addListener('contextmenu', this.oncontextmenu_bodyday, this, {
					  	stopPropagation:false,
					  	normalized :true,
					  	preventDefault:true	
				});
			}
		}	
		var bodydisp = Ext.get(this.calx.id + '-weekbodydisplay');//0.0.6	
		if (Ext.isIE) { bodydisp.setStyle({position:'relative'}); } //0.0.13 fix for XHTML
		if (this.calx.ownerCt!=undefined){ //0.0.6 fix for ext.component containers such as tab and others and properly draw correctly
			if (this.calx.ownerCt.ctype && this.calx.ownerCt.ctype=="Ext.Component"){ 
				//this.calx.height =  this.calx.ownerCt.height;  
				this.calx.height =  this.calx.ownerCt.getInnerHeight(); //0.0.7  - beta 0.0.2  
			} 
		} 
		if (!this.calx.height || this.calx.height=='undefined'){ 
			//var tmpheight = this.calx.getEl().dom.offsetParent.clientHeight; //+ this.calx.getFrameHeight() ; 
			if (this.calx.getEl().dom.offsetParent!=null) { 
				var tmpheight = this.calx.getEl().dom.offsetParent.clientHeight; //+ this.calx.getFrameHeight() ; //0.0.6
			} else { 
				var tmpheight = 0; 
			} 
		} else{ 
			var tmpheight = this.calx.height; 
		} 		
		if (tmpheight ==0) { tmpheight  = 300; }  // 0.0.13 Fix for some containers  or layouts this is a temporal  height
		styleheaderheight =0; 
		if (this.style=='plain'){ 
			styleheaderheight = Ext.get( this.calx.id + '-allday_w_task').getHeight(true)+8; 
		} else { 
			styleheaderheight = Ext.get( this.calx.id + '-allday_w_task').getHeight(true)+8; 
			styleheaderheight+= Ext.get('alldaylistbutton').getHeight(true) ; 
		}
		if (this.header){tmpheight+=-24;}
		if (this.calx.showCal_tbar){ tmpheight+=-26;} 	
		if (this.calx.header){tmpheight+=-26;} 
		var morehoffst=0; 
		//if (this.calx.showCal_tbar){ var morehoffst=76;  } else { var morehoffst=32; }
		bodydisp.setStyle({height:'' +  (tmpheight - styleheaderheight)-morehoffst + 'px' } );
		bodydisp.setStyle({overflow:'auto'});
		if ( Ext.isIE || Ext.isIE6){ 
			Ext.get(this.calx.id + '-tableweek-layout').setWidth (Ext.get(this.calx.id + '-tableweek-layout').getWidth()-16,false);	//0.0.6
			Ext.get(this.calx.id + '-tableweek-layout').setStyle({position:'relative'}); //0.0.13 fix for XHTML
		} 
		var test = Ext.get(this.calx.id + '-weekbodydisplay').getHeight(true); //0.0.6
		var tableskel = Ext.get(this.calx.id + '-week-skeleton').getHeight(true); //0.0.6 
		
		
		if (tableskel>test){ // scroll is on 	
			if (this.style=='plain'){  // 0.0.7  plain style fixed  for header display and pos 
				var tmpgridlayout = Ext.get(this.calx.id + '-alldaygridbodylayout'); 
				var tmptable = Ext.get(this.calx.id + '-tableallcontainer');
				for (var i=1;i<8;i++){ 
					Ext.get(this.calx.id + '-weekhdrday-' + i).setWidth(Ext.get(this.calx.id + '-wd' + i ).getWidth(false),false); 
				}
				ancho=tmpgridlayout.getWidth(false); 
				if ( Ext.isIE || Ext.isIE6){ 
					tmpgridlayout.setWidth( (tmpgridlayout.getWidth()-17) , false); 			
				} else {
					tmpgridlayout.setWidth( (ancho-19) , false); 	
				} 				
			} else { //google style 
				
				var tmpgridlayout = Ext.get(this.calx.id + '-alldaygridbodylayout'); 
				var tmptable = Ext.get(this.calx.id + '-tableallcontainer'); 
				ancho=0;
				for (var i=1;i<8;i++){ 
					ancho+= Ext.get(this.calx.id + '-allday' + i ).getWidth(false); 
				}
				if ( Ext.isIE ){ 
					ancho+=7;
				} else { 
					ancho+=4;
				} 
				myallcontainer.setWidth(ancho,false);			
				ancho=tmpgridlayout.getWidth(false);
				if ( Ext.isIE || Ext.isIE6){ 
					tmpgridlayout.setWidth( (tmpgridlayout.getWidth()-19) , true); 
					myallcontainer.setWidth (myallcontainer.getWidth()-19,true);				
				} else {
					tmpgridlayout.setWidth( (ancho-18) , false); 
					myallcontainer.setWidth (myallcontainer.getWidth()-18,false);	
				} 
			}
		}	
		if (this.style=='plain'){ 
		} else {
			//fix position of allday tasks
			var moretaskbuttonallday = Ext.get('alldaylistbutton'); 
			if (myallcontainer.dom.childNodes[0].childNodes.length==0 && myallcontainer.dom.childNodes[0].childNodes.length==0){
			} else { 
				if (myallcontainer.dom.childNodes.length<this.alldayTasksMaxView){ 
					allcounterproc = myallcontainer.dom.childNodes.length; 
				} else { 
					allcounterproc = this.alldayTasksMaxView; 
				} 
				for(var i=0; i<allcounterproc; i++){ 					
					//alldaytasktmp = Ext.get(myallcontainer.dom.childNodes[0].childNodes[i]); 
					alldaytasktmp = Ext.get(myallcontainer.dom.childNodes[i]); 
					this.formatallDayTask(alldaytasktmp); // Adjust positions of each task 
					//add listeners		
					if (this.task_eventLaunch!=''){  //0.0.11 change 
						alldaytasktmp.addListener(this.task_eventLaunch, this.onDblclick, this );
					} 
					if (Ext.isOpera){ 
						alldaytasktmp.addListener('mousedown',this.operadaybuttons,this); 
					} else { 
						  alldaytasktmp.addListener('contextmenu', this.oncontextmenu, this, {
							stopPropagation:false,
							normalized :true,
							preventDefault:true	
						});
					} 
				} 
			}
		}
		// updates all the elements (tasks on each day) of weekbody 
		this.snapweek=[]; 
		for (var i=1;i<8;i++){ 
			var toprocess = new Date( daterange[0].add(Date.DAY,( i-1)) ); 
			var tmpdayweek =Ext.get( Ext.get(this.calx.id + '-day' + i ).dom.childNodes[0] ); //0.0.6
			var tmpdayweek_childs = tmpdayweek.dom.childNodes; 
		 	tmpcalc = (this.task_width * tmpdayweek_childs); 
			if (tmpcalc>tmpdayweek.getWidth(false)){ 
				//tmpdayweek.setWidth(tmpcalc);			
			} 
			if 	(tmpdayweek_childs.length==1 && tmpdayweek_childs[0].childNodes.length==0){ 
			} else {			
				var childcount = tmpdayweek_childs.length; 
				for (var j=0;j<childcount;j++){
					var tmpel = Ext.get(tmpdayweek_childs[j]); 
					if (Ext.isOpera){ tmpel.addClass('taskondayopera'); } else {tmpel.addClass('taskonday'); } 
					checkel = tmpel.id.indexOf(this.calx.id + '-ecal-daytask',0); //0.0.6
					if (checkel<0){ 
					} else { 
						if (this.task_eventLaunch!=''){  //0.0.11 change 
							tmpel.addListener(this.task_eventLaunch, this.onDblclickSingleday, this );	
						} 
						if (this.task_clsOver!='') { 
							tmpel.addClassOnOver(this.task_clsOver);						
						} 
						if (Ext.isOpera){
							tmpel.addListener('mousedown',this.operadaybuttons,this); 
						} else { 
							tmpel.addListener('contextmenu', this.oncontextmenu, this, {
								  stopPropagation:false,
								  normalized :true,
								  preventDefault:true
							});
						} 
						this.formatdayTask(toprocess,i,tmpel,j); 
					} 
				}			
			}
		} 
		//0.0.7  Sets a handler on each day's header for change view if set
		if (this.headerDayClick=='viewday'){ 
			var myhdrweekdaysref = Ext.select('td.x-calendar-weekv-header-days',true); 
			myhdrweekdaysref.each(function(el, thisobj, index){
						if (el.id.indexOf(this.calx.id + '-weekhdrday-')>=0){ 				 
								el.addClassOnOver('overwday');						
								el.addListener('click', this.onWeekHeaderdayClick, this);
							} 
					 },
				 this
			);
		} 
		// 0.0.15 new features 
		if (this.taskAdd_timer_dblclick) {
			if (Ext.isIE) { 
				var mytimeTD_elements = Ext.select('td.hour-marker_ie',true); 
			} else { 
				var mytimeTD_elements = Ext.select('td.hour-marker',true); 
			}
			var datetest = this.datetohandle; 
			var tmpcalendarobjinstance= this.calx;
			mytimeTD_elements.each(function(el, thisobj, index){
						if ( el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-weekv-')+1>=1){ 	
									el.addListener('dblclick', function(evx,elx,obx){ 						
										if (elx.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-weekv-')<0 ){ 
											var mydt_element_test= Ext.get(elx).parent().id.replace(tmpcalendarobjinstance.id + '-tdbody-weekv-',''); 
										} else { 
											var mydt_element_test= elx.id.replace(tmpcalendarobjinstance.id + '-tdbody-weekv-',''); 
										} 
										var mytmpdatex= new Date(mydt_element_test); 
										var mytmpdate= new Date(datetest.format('m/d/Y') + ' ' + mytmpdatex.format('G:i'));
										tmpcalendarobjinstance.fireEvent("taskAdd", mytmpdate );
								});	
						} 
					 },
				 this
			);
		}
		//Scroll  to the current Hour if set
		var cntcroll = Ext.get( this.calx.id + '-weekbodydisplay'); 
		cntcroll.dom.scrollTop=0;
		if (this.scrolltoHour){ 
			var sct_top=0; //0.0.15 
			if (Ext.isIE) { var mytimeTD_elements = Ext.select('td.hour-marker_ie',true); } else { var mytimeTD_elements = Ext.select('td.hour-marker',true); 	} 
			mytimeTD_elements.each(function(el, thisobj, index){
						if ( el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-weekv-')+1>=1){ 	
							 var testfmt = this.datetohandle.format('G:i'); 
							 if (testfmt=="00:00" || testfmt=="0:00"){ 
								 testfmt  =new Date().format('G:1'); 
							 } 
							 if (el.id.indexOf(testfmt)+1>=1){ //0.0.15 
								sct_top = Ext.get(el).getY();
								return false; 
							 }
						} 
					 },
				 this
			);
			if (sct_top>0){ 
				sct_top  = sct_top  - cntcroll.getY(); 
				cntcroll.dom.scrollTop=sct_top;		
			} 
		}
		//if (this.calx.showCal_tbar){ var morehoffst=76;  } else { var morehoffst=32; }
		bodydisp.setStyle({height:'' +  (tmpheight - styleheaderheight)-morehoffst + 'px' } );
		// bodydisp.setStyle({overflow:'auto'});
		
		// 0.0.15 gonna adjust the Allday task tds with the width iod the day tds 
		for (var i=0;i<7;i++){
			var test=1;
			if (i>0 ){ test=2; } else { test=0  ; } 
			var myeltmp = Ext.get( this.calx.id + "-allday" + (i+1) ); 
			myeltmp.setWidth(Ext.get( this.calx.id + "-wd"  + (i+1) ).getWidth());
		} 

		// check height and if has scrolbar to fix the container width 
		//myMask.hide();
		//scrolltoHour
	},
	onWeekHeaderdayClick: function (evx,elx,obx){ //0.0.7 
		if  (elx.className.indexOf('x-calendar-weekv-header-days')<0) { return false; } 
		var tmpobj = Ext.get(elx); 
		var fechatoset = tmpobj.getAttributeNS('tag','dayval');
		var tmpnewdate = new Date(fechatoset); 
		if (this.headerDayClick=="viewday"){
			if ( this.calx.fireEvent("beforeChangeView", 'day' , 'week', this.calx)==false ) { 
				return false; 
			} else { 
				this.calx.currentdate= tmpnewdate; 
				this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);
				this.calx.currentView='day'; 	 
				this.calx.viewday.render();
				this.calx.fireEvent("onChangeView", 'day', 'week', this);	
			} 
		} else { 
			return false; 
		} 
	}, 
	onDblclickSingleday:function(evx,elx,objx){
		var tmpdata= Ext.get(elx.id);	
		var datatask = this.getTaskarray(elx); 
		this.calx.fireEvent("taskDblClick",datatask,this,this.calx,'week');	
	},
	onDblclick:function(evx,elx,obx){
		var tmpdata= Ext.get(elx.id);
		var datatask = this.getTaskarray(elx); 
		// 0.0.14 FIX  now launches on the calendar event 
		this.calx.fireEvent("taskDblClick",datatask,this,this.calx,'week'); 
		// Original Code 0.0.12 and before // this.fireEvent("dblClickTaskAllDay",datatask,this,this.calx);					
	},
	operabuttons_body: function (evx,elx,obx){//alert ("boton:" + evx.button); 
		if (Ext.isOpera){ 
			if (evx.button==2){ this.oncontextmenu_bodyday(evx,elx,obx); }
		}
	}, 
	operabuttons: function (evx,elx,obx){//alert ("boton:" + evx.button); 
		if (Ext.isOpera){ 
			if (evx.button==2){ this.oncontextmenu(evx,elx,obx); }
		}
	}, 
	oncontextmenu_bodyday: function(evx,elx,obx){ 
		if (Ext.isOpera){ if (evx.button!=2){ return false; }  }
		if  (elx.id.indexOf("containeronday")<0) { return false; } 
		if (this.ShowMenuItems[0]!=true && this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true && this.ShowMenuItems[3]!=true && this.ShowMenuItems[4]!=true && this.ShowMenuItems[5]!=true){return false;}
		if (Ext.isIE){ 
			//alert ("objeto==" + elx.parentNode.id );
			testxxx=  Ext.get(elx.parentNode); 	//testxxx=  Ext.get( Ext.get(document.all.item("containeronday",1)).dom.parentNode );
			var datetohandle  = testxxx.getAttributeNS('tag','iddate') ;
			//alert ("prueba "  + testxxx.getAttributeNS('tag','iddate') );
			//alert ("fecha a manejar ==" + datetohandle  ); 
		} else {
			var testxxx = elx.parentNode; 
			var datetohandle = elx.parentNode.attributes[1].nodeValue; 
		} 
		evx.stopEvent();
		var tmpdata= Ext.get(elx.id);
		if (this.menu){ this.menu.removeAll();	}
		this.menu = new Ext.menu.Menu({
			shadow: true, 
			items:[{id:'week_ctxbtn_task-add',		iconCls:'x-calendar-day-btnmv_add',			 text: e2cs.cal_locale.contextMenuLabelsDay.taskAdd, 	scope:this},
				   '-',
				   {id:'week_ctxbtn_task-go-nd', 	iconCls: 'x-calendar-week-btnmv_nextweek',   text: e2cs.cal_locale.contextMenuLabelsWeek.next,	 scope:this},
				   {id:'week_ctxbtn_task-go-pd', 	iconCls: 'x-calendar-week-btnmv_prevweek',   text: e2cs.cal_locale.contextMenuLabelsWeek.prev, 	 scope:this},
				   '-',
				   {id:'week_ctxbtn_viewmonth', 	iconCls: 'x-calendar-month-btnmv_viewmonth', text: e2cs.cal_locale.contextMenuLabelsWeek.chgmview, scope:this},
				   {id:'week_ctxbtn_viewday', 	 	iconCls: 'x-calendar-month-btnmv_viewday',	 text: e2cs.cal_locale.contextMenuLabelsWeek.chgdview, scope:this},
				   {id:'week_ctxbtn_viewsched', 	iconCls: 'x-calendar-month-btnmv_viewsched', text: e2cs.cal_locale.contextMenuLabelsWeek.chgsview, scope:this}
			]
		});
		var tmpcalendarobjinstance = this.calx; 
		var mvobjinstance = this; 
		var elementDaybody = elx;		
		// elx.parentNode.id
		this.menu.items.items[0].addListener('click', function(){ 
				//0.0.14 New feature WHEN double click then  Calc the position to set the time Base Hour
				//------------------------------------------------------------------------------------
				//0.0.13  Fix Now when you set the new event launcher from the menu inside the body  
				//it will determine the base hour:00 according to the current coordinate Y inside the body 
				var daterangestowork = mvobjinstance.getDatesforWeek(new Date(datetohandle));
				var testnum = elementDaybody.parentNode.id.replace(tmpcalendarobjinstance.id + '-day' ,''); // sample   test_calx-day3 so its day 3 
				var testnumb = parseInt(testnum)-1; 
				var basedate = daterangestowork[0].add(Date.DAY,testnumb); 
				var calcdate; 
				var tmpYtouse = Ext.get(tmpcalendarobjinstance.id  + '-weekbodydisplay').getY();  // this.calx.id +'-day' + i
				if (Ext.isIE){ 
					var mytimeTD_elements = Ext.select('td.hour-marker_ie',true); 
				} else { 
					var mytimeTD_elements = Ext.select('td.hour-marker',true); 
				} 
				mytimeTD_elements.each(function(el, thisobj, index){
							if ( el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-weekv-')+1>=1){  //'-tdbody-dayv-'	
								 var CYtmp = Ext.get(el).getY(); 
								 var CHtmp = Ext.get(el).getHeight(); 
								 var tmpCurrY  = evx.getPageY(); 
								 if  (	tmpCurrY>=CYtmp && tmpCurrY<=(CYtmp + CHtmp)	) {  //applies for the time 
										if (el.id.indexOf( tmpcalendarobjinstance.id + '-tdbody-weekv-')<0 ){ 
											var mydt_element_test= Ext.get(el).parent().id.replace(tmpcalendarobjinstance.id + '-tdbody-weekv-',''); 
										} else { 
											var mydt_element_test= el.id.replace(tmpcalendarobjinstance.id + '-tdbody-weekv-',''); 
										} 
										var tmpdatex = mydt_element_test.toUpperCase(); 
										if (mvobjinstance.hourFormat =="H" || mvobjinstance.hourFormat =="G") { 
											tmpdatex= tmpdatex.replace ('AM',''); 
											tmpdatex= tmpdatex.replace ('PM',''); 											
										} else if (mvobjinstance.hourFormat =="h" || mvobjinstance.hourFormat =="g") { 
											// do nothing so it can being a valid date 
											var testx=11; 
										} 
										calcdate = new Date(tmpdatex); 
										return false; 
								 } else { 
									 	return true; 
								 } 
							} 
						 },
					 this
				);				
				var rtndate = new Date( basedate.format('m/d/Y') + ' ' + calcdate.format('H:i:s') ); 								
				this.calx.fireEvent("taskAdd", rtndate); 
		}, this); 
		this.menu.items.items[2].addListener('click', function(){ this.onclicknext_week(); }, this);  //next week 		
		this.menu.items.items[3].addListener('click', function(){ this.onclickprev_week(); }, this);  //prev week	
		this.menu.items.items[5].addListener('click', function(){ this.changeCalview( testxxx,this,1); 	}, this); 
		this.menu.items.items[6].addListener('click', function(){ this.changeCalview( testxxx,this,2); 	}, this);
		this.menu.items.items[7].addListener('click', function(){ this.changeCalview( testxxx,this,3); 	}, this);
		//0.0.11 - check visibility on the menu-items according to the new property this.ShowMenuItems
		//ShowMenuItems:[1,1,1,1,1,1],	//0.0.11  add, go next w , go prev w , chg month , chg day, chg sched 
		if (this.ShowMenuItems[0]!=true){	
						this.menu.items.items[0].hidden=true; //add
						this.menu.items.items[1].hidden=true; //separator 
		} 						
		
		if (this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true & this.ShowMenuItems[3]!=true && this.ShowMenuItems[4]!=true && this.ShowMenuItems[5]!=true){ 
						this.menu.items.items[1].hidden=true; //separator 
		} 		
		if (this.ShowMenuItems[1]!=true){	this.menu.items.items[2].hidden=true;		} 
		if (this.ShowMenuItems[2]!=true){	this.menu.items.items[3].hidden=true;		} 	
		if (this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true){
			this.menu.items.items[4].hidden=true;	
		}
		if (this.ShowMenuItems[3]!=true){	this.menu.items.items[5].hidden=true;		} 
		if (this.ShowMenuItems[4]!=true){	this.menu.items.items[6].hidden=true;		} 
		if (this.ShowMenuItems[5]!=true){	this.menu.items.items[7].hidden=true;		}
		
		if (!this.calx.mview){ this.menu.items.items[6].hidden=true; }
		if (!this.calx.dview){ this.menu.items.items[5].hidden=true; }
		if (!this.calx.sview){ this.menu.items.items[7].hidden=true; }
		//this.menu.showAt(evx.xy);		
		this.menu.showAt( [ evx.getPageX(), evx.getPageY() ] ); //0.0.11 
	},
	changeCalview: function(objx, mviewx, typeview){
		if (Ext.isIE){ 
			var refdate= objx.getAttributeNS('tag','iddate') ;
		} else { 
			var refdate= objx.attributes[1].nodeValue;
		} 
		this.calx.currentdate = new Date(refdate); 	
		this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);
		if (typeview==1){
			varview='month'; 
		} else if (typeview==2){
			varview='day'; 
		} else {
			varview='schedule';
		}
		this.calx.changeView(varview);
	},	
	oncontextmenu: function(evx,elx,obx){ // this one is for tasks 
		if (Ext.isOpera){ if (evx.button!=2){ return false; } }
		if (this.task_ShowMenuItems[0]!=true && this.task_ShowMenuItems[1]!=true && this.task_ShowMenuItems[2]!=true && this.task_ShowMenuItems[3]!=true  && this.task_ShowMenuItems[4]!=true && this.moreMenuItems.length<=0){ return false; }
		evx.stopEvent();		
		//0.0.13 FIx for custom HTML inside the TASK object 
		if (  elx.id.indexOf(this.calx.id + '-ecal-daytask-')<0 ) {  // if not found the check the parent 
			if (  elx.id.indexOf(this.calx.id + '-ecal-alldaytask-')<0 ) {  // if not found the check the parent 
				var tmpdata= Ext.get(elx.parentNode.id);			
			} else { 
				var tmpdata= Ext.get(elx.id);		
			} 
		}  else {  // FOund a ELX id 
			var tmpdata= Ext.get(elx.id);		
		}	
		//0.0.14 Fix to set logical conditions for context menu (apply to events only) 		
		var toshowOnCXmenu = this.task_ShowMenuItems;  	// Reference TaskList_ShowMenuItems:[1,1,1],// //0.0.11  ADD, delete, edit
		var newmenuitems   = this.moreMenuItems; 
		var actionsTaskCX=[]; // Custom Menu items to the contextmenu of the task 
		var dataTASKtmp = this.getTaskarray(tmpdata); 
		var testevent =  this.calx.fireEvent("beforeContextMenuTask", "weekview-task",dataTASKtmp,toshowOnCXmenu,actionsTaskCX); 
		if (testevent==false) { //0.0.15 change
			// actionsTaskCX[0]   Will tellus if we abort the context menu
			// actionsTaskCX[1]   Will tell us if we Apply the logic 
			// actionsTaskCx[2]   Will tell us if we replace the Custom MenuItems 
			// actionsTaskCX[3]   Will contain the buttons or menu items to insert
			// actionsTaskCX[4]   Will contain the new logic to Show basic items on the task 
			if 	(actionsTaskCX[0]==false){  //If false we continue 
				if 	(actionsTaskCX[1]==true){  //If true we apply the new items  instead of the set in day view 
					if (actionsTaskCX[2]==true){ 
						var newmenuitems = actionsTaskCX[3];  // new more menu Items
					} 
					var toshowOnCXmenu = actionsTaskCX[4];		// the new showitems rule 
				} else {
					var newmenuitems   = this.moreMenuItems; 					
					var toshowOnCXmenu = this.task_ShowMenuItems; 
				} 
			} else {  //abort operation 
				return false; 
			} 
		} else { // do nothing follow as planned 
			var newmenuitems = this.moreMenuItems; 
		} 		
		//-----------------------------------------------------------------------------------
		//task_ShowMenuItems:[1,1,1,1,1],		//0.0.11  add, delete, edit, go next w, go prev w
		//moreMenuItems:[],
		if (this.menu){ this.menu.removeAll(); }
		this.menu = new Ext.menu.Menu({
			shadow: true, 
			items:[{id:'week_ctxbtn_task-add',		iconCls:'x-calendar-day-btnmv_add',		text: e2cs.cal_locale.contextMenuLabelsDay.taskAdd,    scope:this},
				   {id:'week_ctxbtn_task-delete', 	iconCls: 'x-calendar-day-btnmv_delete',	text: e2cs.cal_locale.contextMenuLabelsDay.taskDelete, scope:this},
				   '-',
				   {id:'week_ctxbtn_task-edit',	iconCls: 'x-calendar-day-btnmv_task', text: e2cs.cal_locale.contextMenuLabelsDay.taskEdit + tmpdata.getAttributeNS('tag','ec_subject'),  scope:this },
				   '-',
				   {id:'week_ctxbtn_task-go-nw', 	iconCls: 'x-calendar-week-btnmv_nextweek',text: e2cs.cal_locale.contextMenuLabelsWeek.next,	 scope:this},
				   {id:'week_ctxbtn_task-go-pw', 	iconCls: 'x-calendar-week-btnmv_prevweek',text: e2cs.cal_locale.contextMenuLabelsWeek.prev,  scope:this}
			]
		});
		if (newmenuitems.length>0) { 
			this.menu.add('-'); 
			for (var i=0; i<newmenuitems.length; i++){
				// var idmenuitem = newmenuitems[i].id;  0.0.4 bug in custom action sending the id the problem was the last id was returned always
				newmenuitems[i].rendered =false;
				// 0.0.14 modification to let the user set buttons with menu attached on the context menu 
				// Sepearators could be used also. Note: only one level its allowed
				if (newmenuitems[i].menu==undefined) {  //just plain button 
					if (newmenuitems[i].ctype=="Ext.menu.Item"){ 
						newmenuitems[i].addListener('click', 
									function(parx , parz){ 
											this.onCustomMenuAction( parx.id, Ext.get(elx),this ); 
									}, this); 
					} else { 
						//Ext.menu.BaseItem // do nothing
					} 
					this.menu.add( newmenuitems[i]);
				} else {	
					for (var xm=0;xm<newmenuitems[i].menu.items.length;xm++){
						newmenuitems[i].menu.items.items[xm].rendered=false;
						if (newmenuitems[i].menu.items.items[xm].ctype=="Ext.menu.Item"){ 
							newmenuitems[i].menu.items.items[xm].addListener('click', 
										function(parx,parz){ 
												this.onCustomMenuAction( parx.id, Ext.get(elx),this ); 
										}, this);
						} else { 
							//Ext.menu.BaseItem  // do nothing 
						}
					}
					this.menu.add(newmenuitems[i]);
				} 
			}
		} 
		this.menu.items.items[0].addListener('click', function(){ this.onActionTask( 1, Ext.get(elx), this );   }, this); 
		this.menu.items.items[1].addListener('click', function(){ this.onActionTask( 2, Ext.get(elx), this ); 	}, this); 
		this.menu.items.items[3].addListener('click', function(){ this.onActionTask( 3, Ext.get(elx), this ); 	}, this); 		
		this.menu.items.items[5].addListener('click', function(){ this.onclicknext_week(); }, this);  //next day		
		this.menu.items.items[6].addListener('click', function(){ this.onclickprev_week(); }, this);  //prev day
		//0.0.11 - check visibility on the menu-items according to the new property this.task_ShowMenuItems
		//task_ShowMenuItems:[1,1,1,1,1],		//0.0.11  add, delete, edit, go next w , go prev w
		if (toshowOnCXmenu[0]!=true){this.menu.items.items[0].hidden=true; }  //ADD
		if (toshowOnCXmenu[1]!=true){this.menu.items.items[1].hidden=true; }  //DELETE
		if (toshowOnCXmenu[0]!=true && toshowOnCXmenu[1]!=true){
			this.menu.items.items[2].hidden=true;  //SEPARATOR 
		}
		if  (toshowOnCXmenu[2]!=true && toshowOnCXmenu[3]!=true && toshowOnCXmenu[4]!=true && newmenuitems.length<=0 ) { 
			this.menu.items.items[2].hidden=true;  //SEPARATOR 
		}		
		if (toshowOnCXmenu[2]!=true){ 
			this.menu.items.items[3].hidden=true; //EDIT  
			this.menu.items.items[4].hidden=true; //SEPARATOR 
		} 
		if (toshowOnCXmenu[3]!=true && toshowOnCXmenu[4]!=true && newmenuitems.length<=0 ) { 
			this.menu.items.items[4].hidden=true; //SEPARATOR 
		} 		
		if (toshowOnCXmenu[3]!=true){
				this.menu.items.items[5].hidden=true; // NEXT WEEK
		} 
		if (toshowOnCXmenu[4]!=true){
				this.menu.items.items[6].hidden=true; //PREVWEEK 
		} 
		if (newmenuitems.length>0) { 
			if (toshowOnCXmenu[3]!=true && toshowOnCXmenu[4]!=true){
				this.menu.items.items[7].hidden=true;  // SEPARATOR 
			}
		} 
		//--------------------------------------------------------------------------
		this.menu.on('hide', this.onContextTaskMenu_Hide, this);
		this.menu.showAt(evx.xy);
	},
	onContextTaskMenu_Hide: function (){
		//nothing happens :(
	},
	onCustomMenuAction: function(MenuId,taskEl,TaskObj){
		var datatask = this.getTaskarray(taskEl); 
		this.calx.fireEvent("customMenuAction", MenuId,'week',datatask,taskEl,this); //0.0.9 fix 
		this.menu.hide(); 
	},	
	onActionTask: function (action, taskEl, TaskObj ){
		var datatask = this.getTaskarray(taskEl); 
		switch(action){
			case 1:  //add	
				if (taskEl.id.indexOf(this.calx.id + "-ecal-alldaytask")>=0){ //0.0.6
					this.calx.fireEvent("taskAdd",this.calx.currentdate);	
				} else { 
					if (Ext.isIE){ 
						testxxx = Ext.get( taskEl.dom.parentNode.parentNode );
						// IE debugging lines  for tests 
						//alert ( "prueba 1 " + testxxx.id );
						//alert ( "prueba 2 " + testxxx.getAttributeNS('tag','iddate') );
						var datewday = new Date(testxxx.getAttributeNS('tag','iddate')); 
					} else { 
						var datewday = new Date(taskEl.dom.parentNode.parentNode.attributes[1].nodeValue); 
					} 
					this.calx.fireEvent("taskAdd",datewday);	
				} 
				break; 
			case 2: // delete
				var check = this.calx.fireEvent("beforeTaskDelete",datatask,this);  
				if (check){ //0.0.15 updated to accept true value and continue 
					if (this.calx.fireEvent("onTaskDelete",datatask)==true){ 
						this.calx.fireEvent("afterTaskDelete",datatask,true);
					} else { 
						this.calx.fireEvent("afterTaskDelete",null,false);
					} 
				} 
				break; 
			case 3: //edit
				var check = this.calx.fireEvent("beforeTaskEdit", datatask, this );  
				if (check){ //0.0.15 updated to accept true value and continue
					if (this.calx.fireEvent("onTaskEdit",datatask)==true){ 
						this.calx.fireEvent("afterTaskEdit",datatask, true);
					} else { 
						this.calx.fireEvent("afterTaskEdit", null , false);
					}	
				}
				break; 			
			default: 
				break; 
		} 
	},	
	getTaskarray: function(TaskElx){  //0.0.15 fix 
		var tmpdata= Ext.get(TaskElx);
		var datatask =[]; 
		datatask[0]=tmpdata.getAttributeNS('tag','id') ; 
		datatask[1]=tmpdata.getAttributeNS('tag','ec_id') ; 		
		datatask[2]=tmpdata.getAttributeNS('tag','ec_subject') ; 
		datatask[3]=tmpdata.getAttributeNS('tag','ec_starts') ; 
		datatask[4]=tmpdata.getAttributeNS('tag','ec_ends') ; 		
		datatask[5]=tmpdata.getAttributeNS('tag','ec_cnt') ; 
		datatask[6]=tmpdata.getAttributeNS('tag','ec_storeindex') ; 
		datatask[7]=tmpdata.getAttributeNS('tag','ec_location') ;
		datatask[8]=tmpdata.getAttributeNS('tag','ec_allday') ;
		datatask[9]=tmpdata.getAttributeNS('tag','ec_isholiday');
		return 	datatask; 	
	},	
	getDatesforWeek:function(Dateval){ 
		// 0.0.10 code correction by PTG
		// 0.0.14 Now we set the start day of the week like google calendar 
		// 0.0.14 Monday (full week number), Sunday (-1)or Saturday (-2)		
		var dw = new Date(Dateval).getDay();
		if (this.startDay==1){ // monday 
			dw = ((dw==0)?6:dw-1); // day of week, monday first
			var initdate = new Date(Dateval.add(Date.DAY,-dw).format('m/d/Y') + ' ' + this.startTime); // monday always
			var enddate  = new Date(Dateval.add(Date.DAY,-dw+6).format('m/d/Y') + ' ' + this.endTime);			
		} else if (this.startDay==0) { // sunday 
			if (dw ==0){ 
				var initdate = new Date(Dateval.add(Date.DAY,0).format('m/d/Y') + ' ' + this.startTime); // sunday always
				var enddate  = new Date(Dateval.add(Date.DAY,6).format('m/d/Y') + ' ' + this.endTime);			
			} else { 
				var initdate = new Date(Dateval.add(Date.DAY,-(dw)).format('m/d/Y') + ' ' + this.startTime); // sunday always
				var enddate  = new Date(initdate.add(Date.DAY,6).format('m/d/Y') + ' ' + this.endTime);			
			} 
		} else {  //saturday 
			if (dw==6){ 
				var initdate = new Date(Dateval.add(Date.DAY,0).format('m/d/Y') + ' ' + this.startTime); // saturday always
				var enddate  = new Date(Dateval.add(Date.DAY,6).format('m/d/Y') + ' ' + this.endTime);			
			} else { 
				var initdate = new Date(Dateval.add(Date.DAY,-(dw+1)).format('m/d/Y') + ' ' + this.startTime); // saturday always
				var enddate  = new Date(initdate.add(Date.DAY,6).format('m/d/Y') + ' ' + this.endTime);			
			} 
		} 	
		return [initdate,enddate];		
	}, 	
	getWeekTasks:function(Dateval,Type){  // get the task for the day return array with tasks.data
		//type==0 all day task for container 
		//type==1 tasks for day especific if the task has more days and its included and does not appear
		//type==2 tasks for day especific if the task has more days and its included and does appear
		var daterange = this.getDatesforWeek(this.datetohandle); 		
		var tmpdaytasks=[];
		switch(Type) {
		  case 0:   // all day tasks                     
		  	var numrecs = this.calx.store.getCount(); 
			var countdone=0; 
			var datexxa=  new Date(Dateval.format('m/d/Y') + ' ' + this.startTime); 
			var datexxb=  new Date(Dateval.format('m/d/Y') + ' ' + this.endTime); 
			var minutesPerDay = this.calx.dateDiff( datexxa,datexxb,e2cs.dateParts.MINUTE); 						
			for (var i=0; i<numrecs; i++){ 
				var testrec = this.calx.store.getAt(i).data; 
				tstdateini =new Date(testrec[this.calx.fieldsRefer.startdate]); //0.0.11
				tstdateend =new Date(testrec[this.calx.fieldsRefer.enddate]);   //0.0.11
				if (testrec[this.calx.fieldsRefer.alldaytask]){ 
					if ( tstdateini.between( daterange[0], daterange[1]) || tstdateend.between(daterange[0],daterange[1]) ){ 
						tmpdaytasks[countdone] = testrec; 
						countdone+=1;
					} 
				} else { 
					// GET comparision on mitues per DAY if GEATER then apply 
					var testminutes = this.calx.dateDiff(tstdateini,tstdateend,e2cs.dateParts.MINUTE); 	
					if (testminutes >= minutesPerDay ){
						if 	(this.allday24HinsideBody==true && testminutes==minutesPerDay ){ 
							//var testhola=1111; //check if the task belong to a single day and inside the range of week  
							if (tstdateini<daterange[0]  && tstdateend>daterange[1]){ 
								var testdiffc = tstdateend.add(Date.SECOND,-1); 
								if (tstdateini.format('m/d/Y')==testdiffc.format('m/d/Y')){	//var testaxaskd=1111; 
								} else { 
									tmpdaytasks[countdone] = testrec; 
									countdone+=1;
								}								
							} else { 
								if ( tstdateini.between( daterange[0], daterange[1]) || tstdateend.between(daterange[0],daterange[1]) ){ 
									var testdiffc = tstdateend.add(Date.SECOND,-1); 
									if (tstdateini.format('m/d/Y')==testdiffc.format('m/d/Y')){	//var testaxaskd=1111; 
									} else { 
										tmpdaytasks[countdone] = testrec; 
										countdone+=1;
									}
								} 
							} 	
						} else { 
							//check between dates 
							if (tstdateini<daterange[0]  && tstdateend>daterange[1]){ 
									tmpdaytasks[countdone] = testrec; 
									countdone+=1;
							} else { 
								// check if falls in dates 
								if ( tstdateini.between( daterange[0], daterange[1]) || tstdateend.between(daterange[0],daterange[1]) ){ 
									tmpdaytasks[countdone] = testrec; 
									countdone+=1;
								} 
							} 
						} 
					}  else { 
						//If its not all day then do nothing 
					} 
				} 
//				var check = this.calx.dateDiff(tstdateini,tstdateend,e2cs.dateParts.DAY); 
//				if (check>=1){ 
//					if (tstdateini<daterange[0]  && tstdateend>daterange[1]){ 
//							tmpdaytasks[countdone] = testrec; 
//							countdone+=1;
//					} else { 
//						// check if falls in dates 
//						if ( tstdateini.between( daterange[0], daterange[1]) || tstdateend .between( daterange[0], daterange[1]) ){ 
//							tmpdaytasks[countdone] = testrec; 
//							countdone+=1;
//						} 
//					} 
//				} 
			} 
			break; 			
		  case 1:  // for google style for an especific day 
		  	var dateinionthisday = new Date( Dateval.format('m/d/Y') + ' ' + this.startTime);
		  	var dateendonthisday = new Date( Dateval.format('m/d/Y') + ' ' + this.endTime  );
		  	var numrecs = this.calx.store.getCount(); 
			var countdone=0; 
			var minutesPerDay = this.calx.dateDiff( dateinionthisday,dateendonthisday,e2cs.dateParts.MINUTE); //0.0.14 			
			for (var i=0; i<numrecs; i++){ 
		  		var testrec = this.calx.store.getAt(i).data; 
		 		tstdateini =new Date(testrec[this.calx.fieldsRefer.startdate]);  	//0.0.11
				tstdateend =new Date(testrec[this.calx.fieldsRefer.enddate]); 	  	//0.0.11				
				//0.0.14  ---------------------------------------------------			
				var testminutes =  this.calx.dateDiff(tstdateini,tstdateend,e2cs.dateParts.MINUTE); 
				if (tstdateini<dateinionthisday && tstdateend>dateendonthisday) {
					// All day task its not consider here 	var testxx=11111; 
				} else if (  tstdateini.format('m/d/Y')==dateinionthisday.format('m/d/Y') && testminutes <minutesPerDay ) { 
					//its in 
					if ( tstdateini.between( dateinionthisday, dateendonthisday) || tstdateend .between( dateinionthisday, dateendonthisday) ){ 
						if (testrec[this.calx.fieldsRefer.alldaytask]!=true){ 
							tmpdaytasks[countdone] = testrec; 
							countdone+=1;
						} 
					} 					
				} else if (  tstdateend.format('m/d/Y')==dateinionthisday.format('m/d/Y') && testminutes <minutesPerDay ) { 
					//its in 
					if ( tstdateini.between( dateinionthisday, dateendonthisday) || tstdateend.between( dateinionthisday, dateendonthisday) ){ 
						if (testrec[this.calx.fieldsRefer.alldaytask]!=true){ 
							tmpdaytasks[countdone] = testrec; 
							countdone+=1;
						} 
					} 					
				} else { 
					// Check if its 24 hours and belong to the day = 
					//this.allday24HinsideBody==true 
					if (tstdateini.format('m/d/Y')==Dateval.format('m/d/Y')){ 
						var testdiffc = tstdateend.add(Date.SECOND,-1); 
						if (tstdateini.format('m/d/Y')==testdiffc.format('m/d/Y')){ 
							var testminutesonthisday = this.calx.dateDiff(tstdateini,tstdateend,e2cs.dateParts.MINUTE); 						
							if (minutesPerDay==testminutesonthisday){ 
								if (this.allday24HinsideBody==true){ 
									tmpdaytasks[countdone] = testrec; 
									countdone+=1;
								} 
							} 
						}
					}
					//var testxx=11111; 
				} 
				// ------------------------------------------------------------------------
				// Original CODE v 0.0.12 and older 
//				var check = this.calx.dateDiff(tstdateini,tstdateend,e2cs.dateParts.DAY); 
//				if (check<1){ 
//					if ( tstdateini.between( dateinionthisday, dateendonthisday) && tstdateend .between( dateinionthisday, dateendonthisday) ){ 
//						tmpdaytasks[countdone] = testrec; 
//						countdone+=1;
//					} 
//				} 
		  	}
			break;                     
		  case 2: // For plain Style - Almost like DAY VIEW 
		  	var dateinionthisday = new Date( Dateval.format('m/d/Y') + ' ' + this.startTime);
		  	var dateendonthisday = new Date( Dateval.format('m/d/Y') + ' ' + this.endTime  );
			var numrecs = this.calx.store.getCount(); 
			var countdone=0; 
			for (var i=0; i<numrecs; i++){ 
		  		var testrec = this.calx.store.getAt(i).data; 
		 		tstdateini =new Date(testrec[this.calx.fieldsRefer.startdate]); //0.0.11
				tstdateend =new Date(testrec[this.calx.fieldsRefer.enddate]); 	//0.0.11
				checkdates 	= this.datetohandle.between( new Date(tstdateini), new Date(tstdateend) ); 
				chkformat 	= this.datetohandle.format('m/d/Y'); 
				test 		= new Date(dateinit); 	
				if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				test 		= new Date(dateend); 	
				if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				var check = this.calx.dateDiff(tstdateini,tstdateend,e2cs.dateParts.DAY); 
				if (check<1){ 
					if ( tstdateini.between( dateinionthisday, dateendonthisday) && tstdateend .between( dateinionthisday, dateendonthisday) ){ 
						tmpdaytasks[countdone] = testrec; 
						countdone+=1;
					} 
				} else { 
					if (check>=1){ 
						if (tstdateini<dateinionthisday  && tstdateend>dateendonthisday){ 
								tmpdaytasks[countdone] = testrec; 
								countdone+=1;
						} else { 
							// check if falls in dates 
							if ( tstdateini.between( dateinionthisday, dateendonthisday) || tstdateend .between( dateinionthisday, dateendonthisday) ){ 
								tmpdaytasks[countdone] = testrec; 
								countdone+=1;
							} 
						} 
					} 
				} 
		  	}
			break;                     
		  default:                     
			tmpdaytasks=[]; 
			break;                    
		}
		return tmpdaytasks; 
	},
	showMoreTasksList:function(){
		taskstmp = this.getWeekTasks(this.datetohandle,0); 
		showdata =[]; 
		for (var i=0;i<taskstmp.length;i++){ 
			showdata[i]= [ 
						  taskstmp[i][this.calx.fieldsRefer.id],
						  taskstmp[i][this.calx.fieldsRefer.subject],
						  taskstmp[i][this.calx.fieldsRefer.description],
						  taskstmp[i][this.calx.fieldsRefer.startdate],
						  taskstmp[i][this.calx.fieldsRefer.enddate],
						  taskstmp[i][this.calx.fieldsRefer.color],
						  taskstmp[i][this.calx.fieldsRefer.location],
						  taskstmp[i][this.calx.fieldsRefer.isHoliday],
						  taskstmp[i][this.calx.fieldsRefer.alldaytask]
			]; 
		} 
		if (this.alldayTaksMore=="event"){ 
			this.fireEvent("launchEventList", showdata[i] );
			return false; 
		} else if (this.alldayTaksMore=="window"){ 
				var reader = new Ext.data.ArrayReader({}, [
				   {name: this.calx.fieldsRefer.id 			, type: 'int'},     
				   {name: this.calx.fieldsRefer.subject 	, type: 'string'},  
				   {name: this.calx.fieldsRefer.description	, type: 'string'},
				   {name: this.calx.fieldsRefer.startdate	, type: 'string'},  
				   {name: this.calx.fieldsRefer.enddate		, type: 'string'},  
				   {name: this.calx.fieldsRefer.color		, type: 'string'},
				   {name: this.calx.fieldsRefer.location	, type: 'string'},
				   {name: this.calx.fieldsRefer.isHoliday	, type: 'boolean'},
				   {name: this.calx.fieldsRefer.alldaytask	, type: 'boolean'}
				   
				]);
				tmpstore= new Ext.data.Store({reader:reader, data:showdata});
				tmppanel = new Ext.Panel({
					id:'ecal-more-task-panel',	header:false,	autoDestroy:true,	autoScroll:true,
					monitorResize:true, 		border:false,	autoWidth:false,	autoHeight:false,
					items: new Ext.DataView({
						loadingText:e2cs.cal_locale.win_tasks_loading,
						store:tmpstore,
						tpl: this.alldayTaskTPL,  //0.0.7 
						autoWidth :true, 
						autoHeight:true,
						overClass:'',
						itemSelector:'',
						emptyText: e2cs.cal_locale.win_tasks_empty
					})
				});
				var ecalwinshowmore = new Ext.Window({
					id: 'ecal-win-moretasks', 	name: 'ecal-win-moretasks',	title: e2cs.cal_locale.win_week_zoomlabel,
					width:450, 		height:300, 	closeAction:'close', 	resizable:true,		resizeHandles:'all', 
					hideBorders:true, 		maximizable:true,		plain:true,		modal:true, layout:'fit',
					iconCls:'x-calendar-more-tasks-win',
					items:[tmppanel] 											 
				});
				ecalwinshowmore.show(); 
		} 
	}, 
	//private -----------------------------------------------------------------------
	formatdayTask: function(dateval,numday,ExtEl,indexElperDay){ 
		// 0.0.14 -------------------------------------------------------------------
		if (this.style=='plain'){ 
			var totaltasksinday = this.getWeekTasks(dateval,2); 
		} else { 
			var totaltasksinday = this.getWeekTasks(dateval,1); 			
		}
		var totaltasks =totaltasksinday.length; 		
		//-------------------------------------------------------------------
		var container   =  Ext.get(this.calx.id + '-day' + numday); 
		var m_starttime =  dateval.format('m/d/Y ') + this.startTime ; 
		var m_endtime   =  dateval.format('m/d/Y ') + this.endTime   ; 
		this.totalhours =  this.calx.dateDiff(new Date(m_starttime),new Date(m_endtime),e2cs.dateParts.HOUR); 
		// check if the task hour is Ok 
		var inittimetask = this.checkTasktime( ExtEl.getAttributeNS('tag','ec_starts') ); 
		var endtimetask  = this.checkTasktime( ExtEl.getAttributeNS('tag','ec_ends') ); 
		var diffstartinipos = this.calx.dateDiff( new Date(m_starttime), new Date(inittimetask),e2cs.dateParts.MINUTE); 
		if (diffstartinipos<0 ){
			initpos = 0; 
			flagstarttasttext = e2cs.cal_locale.task_LessDaysFromTask; // sample'(-)<br>'; 
		} else {
			initpos = diffstartinipos; 
			flagstarttasttext = ''; 
		}
		var diffendpos = this.calx.dateDiff(new Date(m_endtime), new Date(endtimetask),e2cs.dateParts.MINUTE); 
		if (diffendpos>0){
			endpos = (this.totalhours + 1) * 60; 
			endpos = Math.abs(initpos - endpos); 
			flagendtasttext = e2cs.cal_locale.task_MoreDaysFromTask; // sample '<br>(+)'; 
	    } else { 
			var tmpdate = new Date(inittimetask); 
			var dtstartday =  new Date(  dateval.format('m/d/Y') + ' ' + this.startTime ); 
			if  (tmpdate<dtstartday) { 
				endpos = this.calx.dateDiff( new Date(m_starttime), new Date(endtimetask) ,e2cs.dateParts.MINUTE); 
			}  else { 
				endpos = this.calx.dateDiff( new Date(inittimetask), new Date(endtimetask) ,e2cs.dateParts.MINUTE); 
			} 
			if (endpos==(this.totalhours * 60) ) { 
				endpos = endpos; //  -76; 
			} else if (endpos>(this.totalhours * 60) ) { 
				endpos =(this.totalhours * 60); 
			} 
			flagendtasttext = ''; 
		} 	
		//ExtEl.setTop('' + initpos + 'px');  // css

		ExtEl.setHeight( endpos,false); 
		
		if (this.forceTaskFit) {
			var ancho = 98 / totaltasks ; 
			ExtEl.setStyle({width :'' +  ancho + '%' } );	
			ExtEl.setStyle({left:'' + (ancho * indexElperDay) + '%'}); 
		} else {
			ExtEl.setWidth( this.task_width,false); 
			if (Ext.isOpera) {
				var testwxopera = (indexElperDay +1) * this.task_width;
				if  (( (indexElperDay + 1) * this.task_width)>container.getWidth(false)){ 
					ExtEl.setStyle('display','none'); 
				}
				if (  (indexElperDay + 1)>1 ){ 
					ExtEl.setLeft('0px'); // css	
				} 
			} else { 
				ExtEl.setLeft('' + (indexElperDay * this.task_width)  + 'px'); // css
			} 			
		} 
		
		if (Ext.isOpera){
			ExtEl.setY(container.getY() + initpos); // fix for moredays task and normal tasks		
			ExtEl.setStyle({top:''+ initpos + 'px' } );
			ExtEl.setStyle("float", 'left');
		} else { 
			ExtEl.setY(container.getY() + initpos); // fix for moredays task and normal tasks		
		}
		if(Ext.isIE){
			ExtEl.setStyle('z-index' ,'2000'); 
		} else { 
			ExtEl.setStyle('z-index' ,'auto'); 		
		} 	
		//add listeners 	//dragdrop not implemented on this view 
	},
	checkTasktime: function(taskvalue) { 
		if (taskvalue instanceof Date){ 
			var tochecktmpdt = taskvalue.format('m/d/Y G:i');
		} else { 
			var tochecktmpdt = taskvalue; 
		} 
		var test = tochecktmpdt.indexOf(":", 0); 
		if (test<=0){
			taskvaluefix = tochecktmpdt + ' ' + this.startTime; 
		} else { 
			taskvaluefix = tochecktmpdt;  // add the time 
		}
		return taskvaluefix ; 
// 0.0.15 - OLD code 
//		var test = taskvalue.indexOf(":", 0); 
//		if (test<=0){
//			taskvaluefix = taskvalue + ' ' + this.startTime; 
//		} else { 
//			taskvaluefix = taskvalue ; 
//		}
//		return taskvaluefix ; 
	},
	getstartdayelements:function(range,datedt){
		var check = 0; 
		 for (var i=0;i<7;i++){
			var checkdt = range[0].add(Date.DAY,i); 
			if (checkdt.format('m/d/Y') ==datedt.format('m/d/Y')){ 
				check= i; 
				break; 
			} 
	  	 } 
		check+=1;  // our count of day elemets td is base =1 
		return check; 
	},
	formatallDayTask:function(ExtEl){ 
		var daterange  = this.getDatesforWeek(this.datetohandle); 				
		var initdateEl = new Date( ExtEl.getAttributeNS('tag','ec_starts') ); 
		var enddateEl  = new Date( ExtEl.getAttributeNS('tag','ec_ends') ); 		
		var diffElDays = this.calx.dateDiff(initdateEl,enddateEl,e2cs.dateParts.DAY); 
		if (diffElDays >7){ diffElDays =7; 	}
		var checkdate = new Date(initdateEl.format('m/d/Y ') + this.startTime ); 
		initdaystart  = this.calx.dateDiff(daterange[0],checkdate,e2cs.dateParts.DAY);  
		if (initdaystart<0){ 
			diffElDays = this.calx.dateDiff(daterange[0],enddateEl,e2cs.dateParts.DAY); 
			if (diffElDays >7){ diffElDays = 7; } 
			initdaystart=0; 
		} 
		var myallcontainer = Ext.get(this.calx.id + '-alldaycontainer');  //container of tasks //0.0.6
		newposx = 0 ;
		var tmpinitcountwx = this.getstartdayelements(daterange,initdateEl); 
		initdaystart+=tmpinitcountwx; 
		for (var i=1;i<tmpinitcountwx;i++){
			if (i>7) { break;} 
			newposx+= Ext.get(this.calx.id + '-allday' + (i+1)).getWidth(true); 			
		}
		if (Ext.isIE) { 
			ExtEl.setX( myallcontainer.getX() + newposx);
			//ExtEl.setX(Ext.get(this.calx.id + '-allday' + tmpinitcountwx).getX() );
		} else { 
			//newposx+=-i;
			//ExtEl.setX( myallcontainer.getX() + newposx + 2 );
			ExtEl.setX(Ext.get(this.calx.id + '-allday' + tmpinitcountwx).getX() ); 
		} 
		ancho=0; 	
		if (enddateEl>daterange[1]){ 
				//ExtEl.setWidth( Ext.get(this.calx.id + '-alldaycontainer').getWidth(false) - newposx,false); //0.0.6
				var countdays=0;
				var welstoget = this.getAnchoalldaytoUse(initdateEl,enddateEl);
				var tmpinitcountwx = this.getstartdayelements(daterange,initdateEl); 
				welstoget+=tmpinitcountwx; 
				for (var i=tmpinitcountwx;i<welstoget;i++){
					if (i>7 ) { break; 	} 
					ancho+= Ext.get(this.calx.id + '-allday' + (i) ).getWidth(false); 
					countdays+=1;
				}
				if (Ext.isIE) { countdays=-1; } 
				ExtEl.setWidth(ancho + (countdays-1),false);
		} else {
			var countdays=0;
			if (diffElDays<=1){
					var datexx1 = new Date(initdateEl.format('m/d/Y G:i:s')); 
					var datexx2 = new Date(enddateEl.format('m/d/Y G:i:s'));
					var testdiff = new Date(datexx2).add(Date.SECOND,-1);
					if ( initdateEl.format('m/d/Y')==testdiff.format('m/d/Y')  ){  //are from the same day only 1 
						ancho+= Ext.get(this.calx.id + '-allday1').getWidth(false); 
					} else if (initdateEl.format('m/d/Y')!=enddateEl.format('m/d/Y')){ 
						var welstoget = this.getAnchoalldaytoUse(initdateEl,enddateEl);
						var tmpinitcountwx = this.getstartdayelements(daterange,initdateEl); 
						welstoget+=tmpinitcountwx; 
						for (var i=tmpinitcountwx;i<welstoget;i++){
							if (i>7 ) { break; } 
							ancho+= Ext.get(this.calx.id + '-allday' + (i) ).getWidth(false); 
							countdays+=1; 
						}
					}				
			} else {
				var welstoget = this.getAnchoalldaytoUse(initdateEl,enddateEl);
				var tmpinitcountwx = this.getstartdayelements(daterange,initdateEl); 
				welstoget+=tmpinitcountwx; 
				var countdays=0;
				for (var i=tmpinitcountwx;i<welstoget;i++){
					if (i>7 ) { break; 	} 
					ancho+= Ext.get(this.calx.id + '-allday' + (i) ).getWidth(false); 
					countdays+=1; 
				}
			} 
			//ancho+=i; 
			if (Ext.isIE) { countdays=countdays*-1-1; } 
			ExtEl.setWidth(ancho+(countdays-1),false);
		}
	}, 
	getAnchoalldaytoUse: function (DateX,DateZ){ // Private USE 
		var daterange  = this.getDatesforWeek(this.datetohandle); count=0; countxx=0; 
		var micampocompara = DateZ.format('m/d/Y'); 
		if  (DateX<=daterange[0] ){ var datetoinit=daterange[0]; } else { var datetoinit=DateX; } 
		while (countxx<99999){  //Dont think someone will set an event of more than 99999 days  so its ok 
			testdata = new Date(datetoinit).add(Date.DAY,count);
			varprueba   = testdata.format('m/d/Y'); 
			var compara = micampocompara; 
			count+=1;			 
			if (varprueba == compara ){ break; 	} 
			countxx+=1;
		} 
		return count; 	
	},	
	onclickprev_week: function(){ // 0.0.15 fix
		var newdate = this.datetohandle.add(Date.DAY,+ (-7)); 
		var check = this.fireEvent("beforeWeekChange", this.datetohandle, newdate); 
		if (check){ 
			this.datetohandle = newdate; 
			this.calx.currentdate = newdate; 
			this.render();
			this.fireEvent("afterWeekChange", newdate); 	
		} 	
	}, 
	onclicknext_week: function(){ // 0.0.15 fix
		var newdate = this.datetohandle.add(Date.DAY,+ (+7));
		var check = this.fireEvent("beforeWeekChange", this.datetohandle, newdate); 
		if (check){ 
			this.datetohandle = newdate; 
			this.calx.currentdate = newdate; 		
			this.render();
			this.fireEvent("afterWeekChange", newdate);
		}
	}, 
//	genHeader:function(dateval){ // Not in use  :(   code deprecated 
//		var daterange = this.getDatesforWeek(this.datetohandle); 
//		var dt = new Date(dateval);
//		Date.monthNames = e2cs.cal_locale.monthtitles; 
//		Date.dayNames   = e2cs.cal_locale.daytitles; 
//		var myheader    =  '<div class="x-calendar-weekv-header" style="width:' + (this.calx.width - 10) + 'px;">';
//		if (this.headerButtons){
//		    myheader += '<div class="x-calendar-week-previous"></div>';
//		    myheader += '<div class="x-calendar-week-next"></div>'; 
//		} 
//		complementtext =''; 
//		if (this.headerShowDates){ 
//			complementtext = ' ' + e2cs.cal_locale.weekheaderlabel_from + daterange[0].format('d/m/Y') + e2cs.cal_locale.weekheaderlabel_to + daterange[1].format('d/m/Y'); 
//		} 
//	    myheader += '<div id="header">' + e2cs.cal_locale.weekheaderlabel + dt.format(this.headerFormat) + complementtext  + '</div>';		
//		//myheader += '<div id="header">' + e2cs.cal_locale.weekheaderlabel + dt.format(this.headerFormat) + complementtext  + '</div>';
//		myheader += '<div id="' + this.calx.id + '-week-sub-' + 'header">' + e2cs.cal_locale.weekheaderlabel + dt.format(this.headerFormat) + complementtext  + '</div>';
//		myheader += '</div>';
//		return myheader; 		
//	},
	genDaysHeader:function(datestart){  // only for plain style 
		// just in case user dont want the all day container and only plain view of days 
		var htmlheader='';
		htmlheader='<div id="' + this.calx.id + '-allday_w_task" class="allday_w_task">'; //0.0.6 
	    htmlheader+='<div id="' + this.calx.id +  '-alldaygridbodylayout" class="alldaygridbody">'; 
	 	htmlheader+='<table width="100%" border="1" cellpadding="0" cellspacing="1" bordercolor="#004E9B" bgcolor="#004E9B"><tr>';
		htmlheader+='<td width="50"><table width="50" border="0" align="center" cellpadding="0" cellspacing="0">'; 
        htmlheader+='<tr><td width="50" class="allday-marker" id="alldayrefer" ><div class="taskallday-layoutbase">&nbsp;</div>'; 
        htmlheader+='</td></tr></table></td>'; 
		for (var i=0; i<7;i++){ 
			var daylabel = datestart.add(Date.DAY,i).format(this.dayformatLabel); 
			var validtd = datestart.add(Date.DAY,i).format('m/d/Y');
			htmlheader+='<td valign="top"  class="x-calendar-weekv-header-days" dayval="' + validtd + '" id="' + this.calx.id + '-weekhdrday-' + (i + 1) + '">' +  daylabel + '</td>'; 
		} 
        htmlheader+='</tr></table></div></div>';
		return htmlheader; 
	},
	genAlldayContainer:function(datestart){  // for google calendar style (container with task with +1 day long) 
		var htmlcontainer='';
		htmlcontainer+='<div id="' + this.calx.id + '-alldaycontainer" class="allday-container">'; //to handle //0.0.6
		var taskstmp = this.getWeekTasks(this.datetohandle,0); 
		if (taskstmp.length==0){ 
			htmlcontainer+='&nbsp;'; 
		}else { 
			if (taskstmp.length<=this.alldayTasksMaxView){ 
				tasktoshow=taskstmp.length;  
			}  else { 
				tasktoshow=this.alldayTasksMaxView; 
			} 
			for (var j=0; j<tasktoshow; j++){ 
				//sample 
				var fch_starts = new Date(taskstmp[j][this.calx.fieldsRefer.startdate]); //0.0.11
				var fch_ends   = new Date(taskstmp[j][this.calx.fieldsRefer.enddate]);   //0.0.11
				var tmpdescription = taskstmp[j][this.calx.fieldsRefer.description];
				
				if (tmpdescription.length>this.calx.tipmaxLength){ 
					var tmpdescriptionx = tmpdescription.substring(0,this.calx.tipmaxLength) + '...'; 
				} else { 
					var tmpdescriptionx = tmpdescription;  
				} 
				var datatip = {starxl:   e2cs.cal_locale.task_qtip_starts,
						   	   startval: fch_starts.format(this.task_format),
						       endxl:    e2cs.cal_locale.task_qtip_ends, 
						       endval:   fch_ends.format(this.task_format),
						       details:  tmpdescriptionx,
							   location: 	taskstmp[j][this.calx.fieldsRefer.location],
							   alldaytask: 	taskstmp[j][this.calx.fieldsRefer.alldaytask],
							   isHoliday:	taskstmp[j][this.calx.fieldsRefer.isHoliday]
							   }; //0.0.11	   
				var newqtip = this.calx.tplTaskTip.apply(datatip);				
				//0.0.6 id on div 
				htmlcontainer+= '<div id="' + this.calx.id + '-ecal-alldaytask-' + j + '" class="taskallday-taskbase"  style="background-color:' + taskstmp[j][this.calx.fieldsRefer.color] +  '"'; //0.0.11
				htmlcontainer+= 'ext:qtitle="' + taskstmp[j][this.calx.fieldsRefer.subject] + '" ext:qtip="' + newqtip + '"'; 	//0.0.11
				//changed on 0.0.4
				//changed on 0.0.11
				htmlcontainer+= 'ec_id="' + taskstmp[j][this.calx.fieldsRefer.id]   + '" ec_starts="' + taskstmp[j][this.calx.fieldsRefer.startdate] + '"'; //0.0.11
				htmlcontainer+= 'ec_ends="' + taskstmp[j][this.calx.fieldsRefer.enddate] + '" ec_subject="' + taskstmp[j][this.calx.fieldsRefer.subject] + '"';//0.0.11
				htmlcontainer+= 'ec_cnt="' + taskstmp[j][this.calx.fieldsRefer.description] + '" ec_storeindex="' + j + '" '; 
				htmlcontainer+= 'ec_location="' +  taskstmp[j][this.calx.fieldsRefer.location] +'" ';  //0.0.15 change
				htmlcontainer+= 'ec_allday="' + taskstmp[j][this.calx.fieldsRefer.alldaytask] + '" ';  //0.0.15 change
				htmlcontainer+= 'ec_isholiday="' + taskstmp[j][this.calx.fieldsRefer.isHoliday] + '">';  //0.0.15 change
				htmlcontainer+= taskstmp[j][this.calx.fieldsRefer.subject] + '</div>';
				//0.0.11
				//to be processed in render function 
			}
		} 
		htmlcontainer+='</div>'; 
		htmlcontainer+='<div id="' + this.calx.id + '-allday_w_task" class="allday_w_task">'; //0.0.6
		htmlcontainer+='<div id="' + this.calx.id + '-alldaygridbodylayout" class="alldaygridbody">';
		//htmlcontainer+='<table width="100%" border="0" cellpadding="0" cellspacing="1" bordercolor="#004E9B" bgcolor="#004E9B"><tr>';		
		htmlcontainer+='<table id="' + this.calx.id + '-tableallcontainer" width="100%" border="0" ';
		htmlcontainer+='cellpadding="0" cellspacing="1" bordercolor="#004E9B" bgcolor="#004E9B"><tr>';
		if (Ext.isIE){ 
			var anchostr = '51'; 
		} else { 
			var anchostr = '51'; 		
		} 
		htmlcontainer+='<td class="" width="50">&nbsp;</td>';
		for (var i=0; i<7;i++){ 
			var daylabel = datestart.add(Date.DAY,i).format(this.dayformatLabel);
			var validtd = datestart.add(Date.DAY,i).format('m/d/Y');
			htmlcontainer+='<td valign="top"  class="x-calendar-weekv-header-days" dayval="' + validtd + '" id="' + this.calx.id + '-weekhdrday-' + (i + 1) + '">' + daylabel + '</td>'; 
			//htmlcontainer+='<td valign="top"  class="x-calendar-weekv-header-days" id="' + this.calx.id + '-weekhdrday-' + (i + 1) + '">' + daylabel + '</td>'; 
		} 
		htmlcontainer+='</tr><tr><td>'; 
		htmlcontainer+='<table width="' + anchostr + '" border="0" align="center" cellpadding="0" cellspacing="0">';
        htmlcontainer+='<tr><td width="50" class="allday-marker" id="alldayrefer" >';  //to handle
		if (taskstmp.length){ // just to set the height for the tasks
			if (taskstmp.length<=this.alldayTasksMaxView){ 
				tasktoshow=taskstmp.length;  
			}  else { 
				tasktoshow=this.alldayTasksMaxView; 
			} 
			for (var i=0; i<tasktoshow;i++){ 
				htmlcontainer+='<div class="taskallday-layoutbase">&nbsp;</div>'; 			
			} 			
		} else {  // minimum if empty 
			htmlcontainer+='<div class="taskallday-layoutbase">&nbsp;</div>'; 
			htmlcontainer+='<div class="taskallday-layoutbase">&nbsp;</div>'; 
		} 
		htmlcontainer+='</td></tr></table></td>';
		for (var i=0; i<7;i++){
			todaytmp = new Date(); 
			gendatetd = datestart.add(Date.DAY,i); 
			var daylabel = gendatetd.format(this.dayformatLabel); 
			if (i==0){ 
				htmlcontainer+='<td width="14%" bgcolor="#FFFFFF" valign="top" class="weekstartday" id="' + this.calx.id + '-allday' + (i + 1) + '"><div>&nbsp;</div></td>'; 
			} else if (i==6){
				htmlcontainer+='<td width="14%" bgcolor="#FFFFFF" valign="top" class="weekendday" id="' + this.calx.id + '-allday' + (i + 1) + '"><div>&nbsp;</div></td>'; 
			} else { 
			 	htmlcontainer+='<td width="14%" bgcolor="#FFFFFF" valign="top" class="weekmidday" id="' + this.calx.id + '-allday' + (i + 1) + '"><div>&nbsp;</div></td>'; 
			} 
		} 
		htmlcontainer+='</tr></table></div></div>'; 
		htmlcontainer+='<div id="alldaylistbutton" class="x-calendar-weekv-header-alldaylist">'; //to handle
   		htmlcontainer+= e2cs.cal_locale.alldayTasksMaxLabel + ' </div>'; 
		return htmlcontainer; 
	},
	genBody: function(datestart){
		var dt = new Date(datestart);
		var inittime  = new Date(dt.format('m/d/Y') + ' ' + this.startTime); 
		var endtime   = new Date(dt.format('m/d/Y') + ' ' + this.endTime); 		
		this.diffhrs  = this.calx.dateDiff(inittime,endtime,e2cs.dateParts.HOUR);
		var dviewbody ='<div id="' + this.calx.id + '-weekbodydisplay" class="weekbodydisplay">'; //0.0.6
		var wtdisp=''; //fix for IE6 and IE7 -----------------------------------------
		if ( Ext.isIE || Ext.isIE6){  
			mydatacomp = ' style="position:relative;" ';  //0.0.13 fix for XHTML 
			wtdisp = '97';  
		} else { 	
			mydatacomp = '';  //0.0.13 fix for XHTML 
			wtdisp = '100'; 
		}
		wtdisp = '100'; 
		//---------------------------------
		dviewbody+='<div id="' + this.calx.id + '-tableweek-layout">'; //0.0.6	
	    dviewbody+='<table id="' + this.calx.id + '-week-skeleton" width="' + wtdisp + '%" border="0" cellspacing="1" cellpadding="0"' + mydatacomp + '>'; //0.0.6 //0.0.13 fix for XHTML 
		dviewbody+='<tr><td width="50"><table width="50" border="0" align="center" cellpadding="0" cellspacing="0">';
		for (var  i=0; i<this.diffhrs; i++){ 
			// dviewbody +='<tr><td class="hour-marker">'+  inittime.add(Date.HOUR, (i) ).format( this.hourFormat + ':i a') + '</td></tr>'; 
			// 0.0.14 Fix for new feature 
			tmpdatetohandleontd = dt.format('m/d/Y');
			tmpdatetohandleontd+= ' ' + inittime.add(Date.HOUR, (i)).format('G'); // this.hourFormat); 
			tmpdatetohandleontd+= ':' + inittime.add(Date.HOUR,(i)).format('i'); 
			if ( Ext.isIE  ) { 
				var mymarker = 'hour-marker_ie'; 
			} else { 
				var mymarker = 'hour-marker'; 
			} 
			dviewbody +='<tr><td id="' + this.calx.id + '-tdbody-weekv-' + tmpdatetohandleontd + '" class="' + mymarker + '">';
			dviewbody +='<span>'+ inittime.add(Date.HOUR, (i) ).format(this.hourFormat) + '</span></td></tr>';		
//			dviewbody +='<span>'+ inittime.add(Date.HOUR, (i) ).format(this.hourFormat) + '</span>'; 
//			if (Ext.isIE){ //0.0.12 CSS correction	
//				dviewbody +='<span class="minute_ie">';
//			} else { 
//				dviewbody +='<span class="minute">';
//			} 
//			dviewbody +=inittime.add(Date.HOUR,(i)).format('i a') + '</span>';
			
//			dviewbody +='<tr><td class="hour-marker"><span>'+ inittime.add(Date.HOUR, (i) ).format( this.hourFormat) + '</span>'; //0.0.7 
//			dviewbody +='<span class="minute">' + inittime.add(Date.HOUR, (i) ).format('i a') + '</span></td></tr>'; 	
		} 
        dviewbody+='</table></td>'; 
		for (var i=0; i<7;i++){
			gendatetddiv = datestart.add(Date.DAY,i); 
			if (i==0){ 
				dviewbody+='<td width="14%" valign="top" class="weekstartday" id="' + this.calx.id + '-wd' + (i+1)+'">';  //0.0.6
			} else if (i==6){
				dviewbody+='<td width="14%" valign="top" class="weekendday" id="' + this.calx.id + '-wd' + (i+1)+'">'; //0.0.6
			} else { 
				dviewbody+='<td width="14%" valign="top" class="weekmidday" id="' + this.calx.id + '-wd' + (i + 1) + '">'; //0.0.6
			} 
			var tdydate = new Date();
			if (gendatetddiv.format('m/d/Y')==tdydate.format('m/d/Y')){ 
				dviewbody+='<div id="' + this.calx.id + '-day' + (i+1)+ '" iddate="' +  gendatetddiv.format('m/d/Y')+ '" class="currentday"' + mydatacomp + '>';//0.0.6 //0.0.13 fix for XHTML 
			} else { 
				dviewbody+='<div id="' + this.calx.id + '-day' + (i+1)+ '" iddate="' +  gendatetddiv.format('m/d/Y')+ '" class="basegridweek"' + mydatacomp + '>';//0.0.6 //0.0.13 fix for XHTML 
			}
						
			if (this.style=='plain'){ 
				var tasksinday = this.getWeekTasks(gendatetddiv,2); 
			} else { 
				var tasksinday = this.getWeekTasks(gendatetddiv,1); 
			}
						
			if (tasksinday.length==0){ 
				dviewbody+='<div id="containeronday" class="containeronday"' + mydatacomp + '>';  //0.0.13 fix for XHTML 
				dviewbody+='&nbsp;'; 
				dviewbody+='</div>'; 
			} else { 
				dviewbody+='<div id="containeronday" class="containeronday"' + mydatacomp +'>';  //0.0.13 fix for XHTML 			
				for (var j=0; j<tasksinday.length;j++){
					var fch_starts = new Date(tasksinday[j][this.calx.fieldsRefer.startdate]); //0.0.11
					var fch_ends   = new Date(tasksinday[j][this.calx.fieldsRefer.enddate]); //0.0.11
					// creates the task html with properties on render function will be processed for drag drop and resizable 
					var qtiptext =''; 
					if (this.task_showqtip){ 
						// added on 0.0.4 
						var tmpdescription = tasksinday[j][this.calx.fieldsRefer.description];
						if (tmpdescription.length>this.calx.tipmaxLength){ 
							var tmpdescriptionx = tmpdescription.substring(0,this.calx.tipmaxLength) + '...'; 
						} else { 
							var tmpdescriptionx = tmpdescription; 
						} 
						var datatip = {
							   starxl:   e2cs.cal_locale.task_qtip_starts,
						   	   startval: fch_starts.format(this.task_format),
						       endxl:    e2cs.cal_locale.task_qtip_ends, 
						       endval:   fch_ends.format(this.task_format),
						       details:  tmpdescriptionx, //tasksinday[j][this.calx.fieldsRefer.description]
							   location: 	tasksinday[j][this.calx.fieldsRefer.location],
							   alldaytask: 	tasksinday[j][this.calx.fieldsRefer.alldaytask],
							   isHoliday:	tasksinday[j][this.calx.fieldsRefer.isHoliday]
						};		//0.0.11	   
						var newqtip = this.calx.tplTaskTip.apply(datatip);
						qtiptext= 'ext:qtitle="' + tasksinday[j][this.calx.fieldsRefer.subject] + '" ext:qtip="' +  newqtip + '"';  //0.0.11	
					} 
					var colorbackgr =''; 
					if (tasksinday[j][this.calx.fieldsRefer.color]){ 				//0.0.11
						colorbackgr=tasksinday[j][this.calx.fieldsRefer.color];   	//0.0.11
					} else {
						colorbackgr	= this.task_bgcolor_base; 
					} 
//					if (Ext.isOpera){
//						dviewbody+='<div id="eventowner">'; 	
//					} 
					// class="taskonday"
					if (this.calx.fieldsRefer.html!='') { 
						var htmldatatowrite = tasksinday[j][this.calx.fieldsRefer.html];
						if (htmldatatowrite ==null || htmldatatowrite ==undefined){ 
							var Bfhtmlins = ''; var Afhtmlins = ''; 
						} else { 
							if (this.customHTMLinpos=='before'){ 
								var Bfhtmlins = htmldatatowrite + " " ; 	var Afhtmlins = ''; 
							} else if  (this.customHTMLinpos=='after'){ 
								var Bfhtmlins = ''; 				var Afhtmlins = htmldatatowrite +  " ";
							} else { 
								var Bfhtmlins = ''; 				var Afhtmlins = ''; 
							} 
						} 
					} else { 
						var Bfhtmlins = ''; var Afhtmlins = ''; 
					} 
					dviewbody+= '<div id="' + this.calx.id + '-ecal-daytask-' + this.taskelements + '" style="background-color:' + colorbackgr +  '" '; //0.0.6
					//dviewbody+= '<div id="ecal-daytask-' + this.taskelements + '" style="background-color:' + colorbackgr +  '" ';  bug 0.0.4  					
					dviewbody+= qtiptext; 
					dviewbody+= 'ec_id="' +    tasksinday[j][this.calx.fieldsRefer.id]   + '" ec_starts="' + tasksinday[j][this.calx.fieldsRefer.startdate] + '"';  //0.0.11
					dviewbody+= 'ec_ends="' +  tasksinday[j][this.calx.fieldsRefer.enddate] + '" ec_subject="' + tasksinday[j][this.calx.fieldsRefer.subject] + '"';//0.0.11
					dviewbody+= 'ec_cnt="' +   tasksinday[j][this.calx.fieldsRefer.description] + '" ec_storeindex="' + j + '" '; 
					dviewbody+= 'ec_location="' +  tasksinday[j][this.calx.fieldsRefer.location] +'" ';  //0.0.15 change
					dviewbody+= 'ec_allday="' + tasksinday[j][this.calx.fieldsRefer.alldaytask] + '" ';  //0.0.15 change
					dviewbody+= 'ec_isholiday="' + tasksinday[j][this.calx.fieldsRefer.isHoliday] + '">';  //0.0.15 change
					dviewbody+= Bfhtmlins + tasksinday[j][this.calx.fieldsRefer.subject] + Afhtmlins + '</div>';//0.0.11
//					sample : <div class="xxtarea" id="xxtarea2" style="background-color:#FF9999">Prueba de Tarea 2 chihuahuarifachido</div>
//					if (Ext.isOpera){
//						dviewbody+='</div>'; 
//					} 
					this.taskelements+=1; 
				} 
				dviewbody+='</div>'; 
			}
			dviewbody+='</div></td>'; 
		} 
		dviewbody+='</tr></table></div></div>'; 
		return dviewbody; 
	}
	

});