// JavaScript Document
// E2cs alpha  0.0.11
// Extjs-Event-Calendar Solution 
// monthview.js
// Author: Carlos Mendez
// Contact: cmendez21@gmail.com  (gmail and gtalk) 

//  Month view LOG ---------------------------------------------------------------------------------------
//  Works fine on firefox 2.0, 3.0, ie6, ie7, chrome, chrome may have some css issues as safari  too 
//  ------------------------------------------------------------------------------------------------------
//  10-Dic-2008  0.0.11
//	Changed some issues on Menus for Each day element, added ShowMenuItems:[1,1,1,1,1,1,1,1] so you can allow which menu item appear 
//	Changed some issues on List Items (tasks) added TaskList_ShowMenuItems:[1,1,1],  		 so you can allow which menu item appear 
//  Added TaskList_launchEventOn: STRING   click or dblclick  or Null and No cation taken 
//	Dynamic field modification on Code  very nice this one :) 
//	BUG - Fixed for Check if other views are still present or not=null and adjust the menu Items for changing view
//  BUG - Fixed  on cunstom Menu Items when click anyone it was passing the Id of the last custom Menu ITEM 
//  Added integration to Scheduler view  :) 
//  Misssing DTS dates correction YET :(											
											
//	27-Sep-2008
//  Changed style on Week (main) Header 
//	Changed Style on Hour / minute display 
//  
// 	Note : the changes on styles were made in the calendar.css file 
//  ------------------------------------------------------------------
//	08-sep-2008 
//  ------------------------------------------------------------------
//	repaired some display and render issues 
//  fix some ID conflicts when two or more calendars are  on the same page  (see //0.0.6 comment on sources) 
//  ------------------------------------------------------------------
//	17-june-2008
//  ------------------------------------------------------------------
//	1.- dayAction property  was added 'window' so if you click on a day it appear a window with the tasks on this day 
//	check Calendar tplTaskZoom  property to set the template for displaying the tasks

//	2.- 'beforeMonthChange' and  'afterMonthChange' events  so you can query the data on the 
//	store by PHP, asp or others yo set the records on this month 

//  3.- (standalone mode) display mode refactored to get the more exact height even it's still passisng about 1 to 6 pixels of height  :( 
//  4.- (fit mode) if its contained n other components like layout, pnel so on (fit) it displays right and adjust to the height  fine 
//  ------------------------------------------------------------------
//  10-June-2008
//  ------------------------------------------------------------------
//  localized in lang file see locale dir for files 
//  no more need to set these properties 
//  :) 
//	headerTooltips: { prev: 'Previous month..', next: 'Next Month' }, 
//	contextMenuLabels: { task: "Add new task for", chgwview: "Change to week view...", chgdview: "Change to day view..."},
//	labelforTasksinMonth: 'Tasks in day:', 
// ------------------------------------------------------------------

Ext.ECalendar.monthview = function(config){
	Ext.apply(this,config);
	this.addEvents(	'dayClick',	'beforeMonthChange',	'afterMonthChange'	);	
	Ext.ECalendar.monthview.superclass.constructor.call(this);
};
Ext.extend(Ext.ECalendar.monthview, Ext.util.Observable, {
	referid:'monthview', //0.0.9
	header:true,
	headerUseTpl:false,		//0.0.15 new property to adapt the title header customizable 
	//0.0.15
	headerTpl: new Ext.XTemplate('<tpl for=".">{title}-{datetouse:this.formatx}</tpl>',
	{
		formatx:function(value){
			var test=11;
			return value.format('M-Y');		
		}
	}),
	//0.0.15
	headerData:{	
		title:'Custom header for Month', 
		datetouse:new Date()
	},
	headerFormat:'M-Y',
	headerButtons: true,
	moreMenuItems:[],  
	// useFit:false,// not used for the moment 
	// ------------------------------------------------------
	// dayAction:	// 'viewday' (set the view in the calendar for that day)   // 'event'	 (raise Event dayClick)  // 'window'	 (shows a window with a list of day's tasks if theres any...) //	none or null   (do nothing )
	dayAction:'viewday',
	// tasks properties for month view  ---------------------
	showTaskcount: true, 
	showTaskList: false, //0.0.9 ----------------------------
	showNumTasks: 5, 	  
	task_format:'d-m-Y H:i:s a',		
//	0.0.14 	 deprecated TaskList_tplqTip because for consistency use in all views the calendar object property tplTaskTip
//	TaskList_tplqTip: new Ext.XTemplate( 
//		'<tpl for=".">{starxl}{startval}<br>{endxl}{endval}<hr color=\'#003366\' noshade>{details}</tpl>'
//	),	
	TaskList_launchEventOn:'click', //0.0.11 
	contextMenuLabels: e2cs.cal_locale.contextMenuLabelsDay,
	ShowMenuItems:[1,1,1,1,1,1],    //0.0.11  ADD, nextmonth, prevmonth, chg Week , CHG Day, chg Sched,
	TaskList_ShowMenuItems:[1,1,1], //0.0.11  ADD, delete, edit
	TaskList_moreMenuItems:[],		// Cutom Menu items to the contextmenu of the task 
	taskStyle:'margin-top: 10px;',  //0.0.9
	startDay:0, 					//0.0.8 added on similar to date picker and starts ont he selected day 
	thisview:null,
	init: function(calendar,dateval){;
		this.calx = calendar; this.datetohandle = dateval; 		
	},
	render: function (){ 
		if (this.calx.loadMask){
			//var myMask = new Ext.LoadMask( this.calx.id , {removeMask:true,msg:e2cs.cal_locale.loadmaskText});
			var myMask = new Ext.LoadMask( this.calx.id,{removeMask:true,msg:this.calx.customMaskText});			
			myMask.show();
		} 
		//0.0.9 small verification on showTaskcount vs showTaskList priority its always to showTaskcount and doesnt interfer on both sides 
		this.showTaskcount==true?this.showTaskList=false:this.showTaskList=this.showTaskList; 
		// header section 
		var dt= new Date(this.calx.currentdate); 
		Date.monthNames = e2cs.cal_locale.monthtitles; 
		Date.dayNames   = e2cs.cal_locale.daytitles; 		
		if (this.header){	
			var tmpheader = this.genHeader(this.datetohandle); 	
		}
		var updateview = Ext.get(this.calx.body); 
		//0.0.12 Small test for removing child nodes 
		var testrender= updateview.dom.childNodes.length; 
		if (testrender){ 
			for (var i=testrender;i<testrender;i++){ 
				updateview.dom.removeChild(updateview.dom.childNodes[0]);
			} 
		} 		
		updateview.update(''); 
		var monthbase =   '<div id="' + this.calx.id + '-main-calendar-header"></div>'; 
		    monthbase +=  '<div id="' + this.calx.id + '-main-calendar-month-body"></div>';	
		updateview.update(monthbase);
		if (this.header){
			var tmpheader = Ext.get(this.calx.id + '-main-calendar-header');
			var prueba2 = tmpheader; 
			var myheaderwrap  = prueba2.wrap ({ tag:'div', cls: 'x-calendar-month-header',	html:''	}); 
			if (this.headerButtons){
				var prevclick = myheaderwrap.createChild({id:this.calx.id + '-btn-pm', tag: 'div', cls: 'x-calendar-month-previous', html:'' }); //0.0.6 added ID	// 0.0.10 Bug fix Thanks to PTG 
				var nextclick = myheaderwrap.createChild({id:this.calx.id + '-btn-nm', tag: 'div', cls: 'x-calendar-month-next',	 html:''	}); //0.0.6 added ID // 0.0.10 Bug fix Thanks to PTG 
				prevclick.dom['qtip']= e2cs.cal_locale.headerTooltipsMonth.prev;
				prevclick.addListener('click', this.onclickprev_month, this);
				prevclick.addClassOnOver('x-calendar-month-previous-over');
				nextclick.dom['qtip']= e2cs.cal_locale.headerTooltipsMonth.next;
				nextclick.addListener('click', this.onclicknext_month, this);
				nextclick.addClassOnOver('x-calendar-month-next-over');	
			}
			if (this.headerUseTpl){ 
				var htmlinheader = this.headerTpl.apply(this.headerData);
				var headerx =   myheaderwrap.createChild({  tag: 'div',	 id: 'header',  html:'' + htmlinheader + ''	});
			} else { 
				var headerx =   myheaderwrap.createChild({  tag: 'div',	 id: 'header',  html:'' + dt.format(this.headerFormat) + ''	});
			}
		} 
		// creates thebody of the month --------------------------------------------
		var tmpdays = Ext.get(this.calx.id + '-main-calendar-month-body');
		var day_hdrtext = this.genDaysHeader(); 
		var days_text   = this.genBody(dt,{styletasks:this.taskStyle});  
		var myheaderdayswrap = tmpdays.wrap({tag:'div',	cls:'x-calendar-month-days',html:''}); 	
		var mydays = myheaderdayswrap.createChild({ 
			tag:'div',  id: this.calx.id + '-calendar-view-month', cls:'header-days' , 
			html:' <table id="' + this.calx.id + '-month_skel" width="100%" border="0" cellspacing="0" cellpadding="0"><tr class="skel_hdrdays" id="' + this.calx.id + '-skel_hdrdays">' + day_hdrtext + '</tr>' +  days_text + '</table>'
		}); 
		Ext.get(this.calx.id + '-skel_hdrdays').setHeight(17);
		if (Ext.isIE){ 
			var numrowsbodyskel = mydays.dom.childNodes[0].childNodes[0].rows.length-1 ; 
		} else { 
			var numrowsbodyskel = mydays.dom.childNodes[1].childNodes[0].rows.length-1 ; 
		} 	
		if (this.calx.ownerCt!=undefined){ //0.0.6 fix for ext.component containers such as tab and others and properly draw correctly
			if (this.calx.ownerCt.ctype && this.calx.ownerCt.ctype=="Ext.Component"){ //this.calx.height =  this.calx.ownerCt.height;  
				this.calx.height =  this.calx.ownerCt.getInnerHeight(); //0.0.7  - beta 0.0.2 
			} 
		}
		if (!this.calx.height || this.calx.height=='undefined'){ 
			if (this.calx.getEl().dom.offsetParent!=null) { 
				var tmpheight = this.calx.getEl().dom.offsetParent.clientHeight; //+ this.calx.getFrameHeight() ; //0.0.13 FIX for some containers 
			} else { 
				var tmpheight = 0; 
			} 
			//var tmpheight = this.calx.getEl().dom.offsetParent.clientHeight ; // + this.calx.getFrameHeight() ; //0.0.6
			if (tmpheight ==0) { tmpheight  = 300; }  // 0.0.13 Fix for some containers  or layouts  this is a temporal  height
			if (this.header){tmpheight+=-27;}
			if (this.calx.showCal_tbar){ tmpheight+=-27;  } 	
			if (this.calx.header){tmpheight+=-22;} 
			tmpheight+=-16;
			var morehoffst = 0; 
			//if (this.calx.showCal_tbar){ var morehoffst=76;  } else { var morehoffst=24; }
			Ext.get( this.calx.id + '-month_skel').setStyle({height:'' +  tmpheight-morehoffst + 'px' } );
			//valtosethtmp = Math.round(  (tmpheight-morehoffst-( Ext.get(this.calx.id + '-skel_hdrdays').getHeight(false) + (-1) ) )/numrowsbodyskel ) ; 			
			valtosethtmp = Math.round(  (tmpheight) / numrowsbodyskel ) ; 			
			valtosethtmp+=-3;
		} else{
			var tmpheight=0; 
			if (this.header){tmpheight+=-27;}
			if (this.calx.showCal_tbar){ tmpheight+=-27;  } 	
			if (this.calx.header){tmpheight+=-22;} 
			tmpheight+=-16;
			tmpheight+=this.calx.height; //-myheaderwrap.getHeight(true);
			if (this.calx.showCal_tbar){ var morehoffst=77;  } else { var morehoffst=24; }
			valtosethtmp = Math.round((tmpheight)/numrowsbodyskel ) ; 
			valtosethtmp+=-3;
		} 
		Ext.get(this.calx.id + '-month_skel').setHeight(tmpheight);		
		newsize  = tmpheight ; 
		valtosethtmp = Math.round( newsize/numrowsbodyskel ); 
		var mydays = Ext.select('td.daybody',true); 
		mydays.each(function(el, thisobj, index){
					var xtest = el; 
					if  (xtest.id == undefined || xtest==null){ var testdx = el.dom.id; } else { var testdx = el.id; } 					
					if ( testdx.indexOf('m-td-' + this.calx.id + '-')>=0){ 	//0.0.6 fix only those td's on the calendar (month view) 					 
							var myobjtowork = Ext.get(testdx);
							myobjtowork.setStyle({height:'' +  valtosethtmp + 'px' } );
							myobjtowork.addClassOnOver('daybody-over');						
							if (Ext.isOpera){ 
									myobjtowork.addListener('mousedown',this.operabuttons,this); 
							} else { 
									myobjtowork.addListener('click', this.onhandler_day, this);
									myobjtowork.addListener('contextmenu', 
										this.oncontextmenu, 
										this,{
										   stopPropagation:true,
										   normalized :true,
										   preventDefault:true
									});
							} 
					} 
				 },
			 this
		);	
		//0.0.9
		if (this.showTaskcount==false && this.showTaskList==true ) { //it has task lists on each day if applied 
			// fix the height of tasks_list elements if needed 
			var mydivlists = Ext.select('div.tasks_list',true);
			mydivlists.each(function(el,thisobj,index){
					if  ((el.id.indexOf(this.calx.id) + 1)>0){  // 0.0.10 bug reported by frank_ash
						element_id = el.id; 
						//testtdobjref = element_id.replace(/test_calendar-tasklist-/,'');  bug 
						testtdobjref = element_id.replace(this.calx.id + "-tasklist-",''); 
						objtd = Ext.get('m-td-' + this.calx.id + '-' + testtdobjref); 
						objtdtd ={top:objtd.getTop(), heigth:objtd.getHeight()}; 
						tmprefdata = 0; 
						tmprefdata = Ext.get(element_id).getTop()  - objtdtd.top ; 
						tmprefdata = tmprefdata+4 ; 
						var newHxx = 0; 
						newHxx =objtdtd.heigth - tmprefdata ; 
						Ext.get(element_id).setHeight(newHxx);
					} 
				 },this
			); 
			//assign  event handlers for each task-list-item 			
			var mylist_items = Ext.select('div.tasks_list_item',true);
			mylist_items.each(function(el,thisobj,index){
					if  ((el.id.indexOf(this.calx.id) + 1)>0){  // 0.0.10 bug reported by frank_ash
						test=11; 
						el.addClassOnOver('task_list_item_over');
						if (this.TaskList_launchEventOn!=''){  //0.0.11 if property not set then  no event attached to element 
							el.addListener(this.TaskList_launchEventOn,this.onDblClick_tasklistitem,this);
						} 
						if (Ext.isOpera){ 
								el.addListener('mousedown',this.operataskitembuttons,this); 
						} else { 
								el.addListener('contextmenu',this.oncontextmenuTaskitem, this, {stopPropagation:true,normalized :true,preventDefault:true	} );
						}
					} 
				 },this
			); 
		}
		if (this.calx.loadMask){
			myMask.hide();
		} 
	},
	// public function on month view 
	refreshView: function(){ this.render(); },
	ZoomDay: function (DateToZoom){ // Creates a window with a custom TPL for day view
		var dtx = new Date(DateToZoom); 
		var counttasks= this.calx.store.getCount();
		if ( counttasks>0 ){ 
			var count_in_day=0; taskstmp=[];
			for (var itask=0; itask<counttasks ; itask++){
				var testrec = this.calx.store.getAt(itask).data; 
				dateinit 	= this.calx.store.getAt(itask).data[this.calx.fieldsRefer.startdate];  //0.0.11dynamic fields
				dateend 	= this.calx.store.getAt(itask).data[this.calx.fieldsRefer.enddate];    //0.0.11dynamic fields
				checkdates 	= dtx.between( new Date(dateinit), new Date(dateend) ); 
				chkformat 	= dtx.format('m/d/Y'); 
				test = new Date(dateinit); if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				test = new Date(dateend);  if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				if (checkdates){taskstmp[count_in_day] = testrec; 	count_in_day+=1; } 
			} 
			if (count_in_day<=0){ return false;	} 
		} else { 
			return false; 
		}	
		showdata =[]; 
		for (var i=0;i<taskstmp.length;i++){ //0.0.11 dynamic fields 
			showdata[i]= [ 
					taskstmp[i][this.calx.fieldsRefer.id], 
					taskstmp[i][this.calx.fieldsRefer.subject],
					taskstmp[i][this.calx.fieldsRefer.description], 
					taskstmp[i][this.calx.fieldsRefer.startdate],	  
					taskstmp[i][this.calx.fieldsRefer.enddate],  
					taskstmp[i][this.calx.fieldsRefer.color], 
			]; 
		} 
		var reader = new Ext.data.ArrayReader({}, [
		   {name: this.calx.fieldsRefer.id 			, type: 'int'},     
		   {name: this.calx.fieldsRefer.subject 	, type: 'string'},  
		   {name: this.calx.fieldsRefer.description	, type: 'string'},
		   {name: this.calx.fieldsRefer.startdate	, type: 'string'},  
		   {name: this.calx.fieldsRefer.enddate		, type: 'string'},  
		   {name: this.calx.fieldsRefer.color		, type: 'string'}
		]);
		tmpstore= new Ext.data.Store({reader: reader, data:showdata});
		tmppanel = new Ext.Panel({
			id:'ecal-more-task-panel',header:false, autoDestroy:true,autoScroll:true,monitorResize:true, border:false,autoWidth:false, autoHeight:false,
			items: new Ext.DataView({
				loadingText: e2cs.cal_locale.win_tasks_loading, store:tmpstore, tpl: this.calx.tplTaskZoom,	autoWidth :true, autoHeight:true,
				overClass:'',	itemSelector:'', emptyText: e2cs.cal_locale.win_tasks_empty
			})
		});
		var ecalwinshowmore = new Ext.Window({
			id: 'ecal-win-moretasks', name: 'ecal-win-moretasks', title: e2cs.cal_locale.win_month_zoomlabel +  ' ' + dtx.format(e2cs.cal_locale.win_tasks_format),
			width:450, 	height:300, closeAction:'close', resizable:true,resizeHandles:'all', hideBorders:true, maximizable:true, plain:true,
			modal:true, layout:'fit',iconCls:'x-calendar-more-tasks-win',items:[tmppanel] 											 
		});
		ecalwinshowmore.show(); 
		return true; 
	},
	// ---------------------------------------------------------------------------------
	// private functions  --------------------------------------------------------------
	// ---------------------------------------------------------------------------------
	operabuttons: function (evx,elx,obx){//alert ("boton:" + evx.button); 
		if (Ext.isOpera){ 
			if (evx.button==0){ this.onhandler_day(evx,elx,obx); }  
			if (evx.button==2){ this.oncontextmenu(evx,elx,obx); }  
		}
	}, 
	oncontextmenu: function (evx,elx,obx){//alert (evx.browserEvent.type); 
		if (Ext.isOpera){ if (evx.button!=2){ return false; } }
		if (elx.className=="tasks_list_item" || elx.className=="tasks_list_item task_list_item_over" || elx.className.indexOf("task_list_item_over")>0 ){ return false;} 
		//0.0.11 Avoid to show menu cause no permission is set and also no custom Menus also 
		if (this.ShowMenuItems[0]!=true && this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true && this.ShowMenuItems[3]!=true && this.ShowMenuItems[4]!=true && this.ShowMenuItems[5]!=true && this.moreMenuItems.length<=0){return false;}
		evx.stopEvent();
		if (elx.className=='noday' || elx.className=='today' || elx.className=='monthday') { 
			//var refdate = new Date(elx.id);// 0.0.6 fix 
			var refdate = new Date(elx.id.substring(this.calx.id.length + 1) );
		} else if (elx.className=='tasks' ){ 
			//var refdate = new Date(elx.parentNode.firstChild.id); // 0.0.6
			var refdate = new Date(elx.parentNode.firstChild.id.substring(this.calx.id.length + 1) ); 
		} else if (elx.id.indexOf('-tasklist-') >0 ) { 
			tmpdata =  elx.id.replace(this.calx.id + "-tasklist-",'');
			var refdate =  new Date(tmpdata + "" ); 			  
		} else { 
			//var refdate = new Date(elx.firstChild.id); //0.0.6
			var refdate = new Date( elx.firstChild.id.substring(this.calx.id.length + 1) ); 
		}			
		if (this.menu){ 
			this.menu.removeAll() ;
		}
		this.menu = new Ext.menu.Menu({
			id: this.calx.id + '-contextmenu-month', //0.0.6 modified ID 
			shadow: true, 
			items:[{
				id: this.calx.id + '-month_ctxbtn_task', //0.0.6 modified ID
				iconCls:'x-calendar-month-btnmv_task',
				text: e2cs.cal_locale.contextMenuLabelsMonth.task + ' (' + refdate.format(this.calx.dateformat) + ')',scope:this
			},'-',{  // added on alpha 0.0.4
				id: this.calx.id + '-month_ctxbtn_nextmonth',  //0.0.6 modified ID
				iconCls: 'x-calendar-month-btnmv_nextmth',	 text: e2cs.cal_locale.contextMenuLabelsMonth.gonextmonth,scope:this
			},{ // added on alpha 0.0.4
				id: this.calx.id + '-month_ctxbtn_prevmonth', //0.0.6 modified ID
				iconCls: 'x-calendar-month-btnmv_prevmth',	 text: e2cs.cal_locale.contextMenuLabelsMonth.goprevmonth,scope:this
			},'-',{
				id: this.calx.id + '-month_ctxbtn_viewweek', //0.0.6 modified ID
				iconCls: 'x-calendar-month-btnmv_viewweek',	 text: e2cs.cal_locale.contextMenuLabelsMonth.chgwview,scope:this
			},{
				id: this.calx.id + '-month_ctxbtn_viewday',  //0.0.6 modified ID
				iconCls: 'x-calendar-month-btnmv_viewday',	 text: e2cs.cal_locale.contextMenuLabelsMonth.chgdview,scope:this
			},{
				id: this.calx.id + '-month_ctxbtn_viewsched', //0.0.11
				iconCls: 'x-calendar-month-btnmv_viewsched', text: e2cs.cal_locale.contextMenuLabelsMonth.chgsview,scope:this
			}]
		});
		if (this.moreMenuItems.length>0) { 
			this.menu.add('-'); 
			for (var i=0; i< this.moreMenuItems.length; i++){
				var idmenuitem = this.moreMenuItems[i].id; 
				this.moreMenuItems[i].rendered =false; 
				this.moreMenuItems[i].addListener('click', 
							function(parx){ 
							   //this.onCustomMenuAction(idmenuitem, Ext.get(elx),this); //0.0.11 - bug fix dfor passed ID 
   							   this.onCustomMenuAction(parx.id, Ext.get(elx),this); 
							}, this); 
				this.menu.add( this.moreMenuItems[i]);
			}
		}
		this.menu.items.items[0].addListener('click', function(){ this.onTaskAdd( Ext.get(elx),this) ; 	} , this); 
		this.menu.items.items[2].addListener('click', function(){ this.onclicknext_month(); }, this); // added on alpha 0.0.4                
		this.menu.items.items[3].addListener('click', function(){ this.onclickprev_month();    }, this); // added on alpha 0.0.4                
		this.menu.items.items[5].addListener('click', function(){ this.changeCalview(Ext.get(elx),this,1);     }, this); 
		this.menu.items.items[6].addListener('click', function(){ this.changeCalview(Ext.get(elx),this,2);     }, this);			
		this.menu.items.items[7].addListener('click', function(){ this.changeCalview(Ext.get(elx),this,3);     }, this);
		//0.0.11 - check visibility on the menu-items according to the new property 
		//ShowMenuItems:[1,1,1,1,1,1],//   //0.0.11  ADD, nextmonth, prevmonth, chg Week , CHG Day, chg Sched,
		if (this.ShowMenuItems[0]!=true){	
						this.menu.items.items[0].hidden=true; //ADD
						this.menu.items.items[1].hidden=true; //SEPARATOR 	
		} 				
		if (this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true && this.ShowMenuItems[3]!=true && this.ShowMenuItems[4]!=true && this.ShowMenuItems[5]!=true){
					this.menu.items.items[1].hidden=true; //SEPARATOR 	
		} 
		if (this.ShowMenuItems[1]!=true){	this.menu.items.items[2].hidden=true;		}  //NEXt month 
		if (this.ShowMenuItems[2]!=true){	this.menu.items.items[3].hidden=true;		}  //Prev Month 	
		if (this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true){
			this.menu.items.items[4].hidden=true;	
		}
		if (this.ShowMenuItems[3]!=true){	this.menu.items.items[5].hidden=true;		} 
		if (this.ShowMenuItems[4]!=true){	this.menu.items.items[6].hidden=true;		} 
		if (this.ShowMenuItems[5]!=true){	this.menu.items.items[7].hidden=true;		} 
		if (this.ShowMenuItems[3]==false && this.ShowMenuItems[4]==false && this.ShowMenuItems[5]==false){
				if (this.moreMenuItems.length>0) { this.menu.items.items[8].hidden=true; } 
		} 		
		// check the existence of view objects  0.0.11 
		if (!this.calx.dview){ this.menu.items.items[6].hidden=true; }
		if (!this.calx.wview){ this.menu.items.items[5].hidden=true; }
		if (!this.calx.sview){ this.menu.items.items[7].hidden=true; }
		if  (this.menu.items.items[5].hidden && this.menu.items.items[6].hidden && this.menu.items.items[7].hidden ){ 
			if (this.moreMenuItems.length>0) { this.menu.items.items[8].hidden=true; } 
		} 
		// ----------------------------
		this.menu.on('hide', this.onContextHide, this);
		this.menu.showAt( [ evx.getPageX(), evx.getPageY() ] );//this.menu.showAt( Ext.get(elx).getXY());	
	}, 
	onCustomMenuAction: function(MenuId,MonthEl,TaskObj){
		var datatask =[]; 		
		var tmpobj  = Ext.get(MonthEl); 
		if (MonthEl.dom.className=='noday' || MonthEl.dom.className=='today' || MonthEl.dom.className=='monthday') { 
			//datatask[0] = Ext.get(MonthEl).dom.id        //id  (date) of the selected day in month view
			datatask[0] = Ext.get(MonthEl).dom.id.substring(this.calx.id.length + 1);//0.0.6
			datatask[1] = Ext.get(MonthEl).getAttributeNS('tag','class'); // class name of selected date 
		} else if (MonthEl.dom.className=='tasks' ){ 
			//datatask[0] = Ext.get(MonthEl).dom.parentNode.firstChild.id //id  (date) of the selected day in month view		
			datatask[0] = Ext.get(MonthEl).dom.parentNode.firstChild.id.substring(this.calx.id.length + 1); //0.0.6
			datatask[1] = Ext.get( MonthEl.dom.parentNode.firstChild ).getAttributeNS('tag','class');
		} else { 
			//datatask[0] = Ext.get(MonthEl).dom.firstChild.id //id  (date) of the selected day in month view
			datatask[0] = Ext.get(MonthEl).dom.firstChild.id.substring(this.calx.id.length + 1);//0.0.6
			datatask[1] = Ext.get( MonthEl.dom.firstChild ).getAttributeNS('tag','class');    // class name of selected date 
		}  
		this.calx.fireEvent("customMenuAction", MenuId, 'month', datatask, MonthEl, this); 
	},	
	changeCalview: function(objx, mviewx, typeview){
		if (objx.dom.className=='noday' || objx.dom.className=='today' || objx.dom.className=='monthday') { 
			//var refdate= new Date(objx.id); //0.0.6
			var refdate= new Date(objx.id.substring(this.calx.id.length + 1) );
		} else if (objx.dom.className=='tasks' ){ 
			//var refdate = new Date(objx.dom.parentNode.firstChild.id); //0.0.6
			var refdate = new Date(objx.dom.parentNode.firstChild.id.substring(this.calx.id.length + 1) );
		} else { 
			//var refdate= new Date(objx.dom.firstChild.id); //0.0.6
			var refdate= new Date(objx.dom.firstChild.id.substring(this.calx.id.length + 1) );
		} 
		if (typeview==1){
			varview='week'; 
		} else if(typeview==2){   //0.0.11
			varview='day'; 
		} else { //0.0.11
			varview='schedule'; 
		}
		this.calx.changeView(varview);
	},
	onTaskAdd: function(objx, mviewx){
		if (objx.dom.className=='noday' || objx.dom.className=='today' || objx.dom.className=='monthday') { 
			//var refdate= new Date(objx.id); //0.0.6
			var refdate= new Date(objx.id.substring(this.calx.id.length + 1) );
		} else if (objx.dom.className=='tasks' ){ 
			//var refdate = new Date(objx.dom.parentNode.firstChild.id);  //0.0.6
			var refdate = new Date(objx.dom.parentNode.firstChild.id.substring(this.calx.id.length + 1) );
		} else if (objx.dom.className=="tasks_list_item" || objx.dom.className=="tasks_list_item task_list_item_over" || objx.dom.className.indexOf("task_list_item_over")>0 ){
			//tmpdata =  elx.id.replace(/test_calendar-tasklist-/,''); bug 
			tmpdata =  objx.id.replace(this.calx.id + "-tasklist-",'');
			refdate =  new Date(tmpdata + "" ); 
		} else if (objx.dom.className=="tasks_list"){ // to check beheavior 
			tmpdata =  objx.id.replace(this.calx.id + "-tasklist-",'');
			var refdate =  new Date(tmpdata + "" ); 
		} else if (objx.dom.className=="daybody"){ // to check beheavior 
			//0.0.11 bug fix it was taking the current date 
			tmpdata =  objx.id.replace("m-td-" + this.calx.id + "-",'');//m-td-test_calx-11/11/2008	
			refdate =  new Date(tmpdata + "" ); 
			//var refdate= new Date(this.calx.currentdate);//prev code			
		} else { 
			//var refdate= new Date(objx.dom.firstChild.id); // 0.0.6
			var refdate= new Date(objx.dom.firstChild.id.substring(this.calx.id.length + 1) );
		} 
		this.calx.fireEvent("taskAdd", refdate);	
	},
	onContextHide: function(){ 		/*do nothing*/	},	
	operataskitembuttons: function (evx,elx,obx){	// 0.0.9 
		if (Ext.isOpera){ 
				// if (evx.button==2){ this.oncontext_taskitem_menu(evx,elx,obx); }  
				// For the moment do nothing cause it raise an error i cant fix  :( cause "this" object its not recognized when launching a function  
				// So i repeat 	oncontextmenuTaskitem function code in her and it works (OO) its weird 																		   
				evx.stopEvent();
				var tmpdata= Ext.get(elx.id);
				//0.0.14 Fix to set logical conditions for context menu (apply to events only) 		
				var toshowOnCXmenu = this.TaskList_ShowMenuItems;  	// Reference TaskList_ShowMenuItems:[1,1,1],// //0.0.11  ADD, delete, edit
				var newmenuitems   = this.TaskList_moreMenuItems; 
				var actionsTaskCX=[]; // Custom Menu items to the contextmenu of the task 
				var dataTASKtmp = this.getTaskarray(tmpdata); 
				var testevent =  this.calx.fireEvent("beforeContextMenuTask", "monthview-task",dataTASKtmp,toshowOnCXmenu,actionsTaskCX); 
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
							var newmenuitems   = this.TaskList_moreMenuItems; 					
							var toshowOnCXmenu = this.TaskList_ShowMenuItems; 
						} 
					} else {  //abort operation 
						return false; 
					} 
				} else { // do nothing follow as planned 
					var newmenuitems = this.TaskList_moreMenuItems; 
				} 
				//--------------------------------------------------------------------
				//var dateobjtoref = elx.id.replace(/test_calendar-tasklist-/,'');
				var dateobjtoref  =  elx.id.replace(this.calx.id + "-tasklist-",'');
				if (this.taskitem_menu){ 
					this.taskitem_menu.removeAll() ; 
				}
				this.taskitem_menu = new Ext.menu.Menu({
					ignoreParentClicks:true,								   
					shadow: false, 
					items:[{id:'month_tskitem_btn_task-add',	iconCls:'x-calendar-day-btnmv_add',		text: this.contextMenuLabels.taskAdd, 	scope:this},
						   {id:'month_tskitem_btn_task-delete', iconCls: 'x-calendar-day-btnmv_delete',	text: this.contextMenuLabels.taskDelete,scope:this},
						   '-',
						   {id:'month_tskitem_btn_task-edit',	iconCls: 'x-calendar-day-btnmv_task',	text: this.contextMenuLabels.taskEdit + tmpdata.getAttributeNS('tag','ec_subject'),scope:this	}
					]
				});
//				if (newmenuitems.length>0) { 
//					this.taskitem_menu.add('-'); 
//					for (var i=0; i<newmenuitems.length; i++){
//						newmenuitems[i].rendered =false; 
//						newmenuitems[i].addListener('click', 
//									function(parx , parz){ 
//										this.onCustomMenuAction_TaskItem(parx.id, Ext.get(elx), this );
//									}, this); 
//						this.taskitem_menu.add( newmenuitems[i]);
//					}
//				}
				if (newmenuitems.length>0) { 
					this.taskitem_menu.add('-'); 
					for (var i=0; i<newmenuitems.length; i++){
						// var idmenuitem = newmenuitems[i].id;  0.0.4 bug in custom action sending the id the problem was the last id was returned always
						newmenuitems[i].rendered =false;
						// 0.0.14 modification to let the user set buttons with menu attached on the context menu 
						// Sepearators could be used also. Note: only one level its allowed
						if (newmenuitems[i].menu==undefined) {  //just plain button 
							if (newmenuitems[i].ctype=="Ext.menu.Item"){ 
								newmenuitems[i].rendered=false;
								newmenuitems[i].addListener('click', 
											function(parx , parz){ 
													this.onCustomMenuAction_TaskItem(parx.id, Ext.get(elx),this ); 
											}, this); 
							} else { 
								//Ext.menu.BaseItem // do nothing
								var test=11;
							} 
							this.taskitem_menu.add( newmenuitems[i]);
						} else {
							newmenuitems[i].menu.rendered=false; 
							for (var xm=0;xm<newmenuitems[i].menu.items.length;xm++){
								newmenuitems[i].menu.items.items[xm].rendered=false;
								if (newmenuitems[i].menu.items.items[xm].ctype=="Ext.menu.Item"){ 
									newmenuitems[i].menu.items.items[xm].addListener('click', 
												function(parx,parz){ 
														this.onCustomMenuAction_TaskItem( parx.id, Ext.get(elx),this ); 
												}, this);
								} else { 
									//Ext.menu.BaseItem  // do nothing 
								}
							}
							this.taskitem_menu.add(newmenuitems[i]);
						} 
					}
				}				
				this.taskitem_menu.items.items[0].addListener('click', function(){ this.onActionTask( 1, Ext.get(elx), this ); 	}, this); 
				this.taskitem_menu.items.items[1].addListener('click', function(){ this.onActionTask( 2, Ext.get(elx), this ); 	}, this); 
				this.taskitem_menu.items.items[3].addListener('click', function(){ this.onActionTask( 3, Ext.get(elx), this ); 	}, this); 
				//0.0.11 Chek visibility according to new permision on
				//TaskList_ShowMenuItems:[1,1,1],// //0.0.11  ADD, delete, edit
				if (toshowOnCXmenu[0]!=true){ this.taskitem_menu.items.items[0].hidden=true; } 
				if (toshowOnCXmenu[1]!=true){ this.taskitem_menu.items.items[1].hidden=true; } 
				if (toshowOnCXmenu[0]!=true && toshowOnCXmenu[1]!=true){ 
					this.taskitem_menu.items.items[2].hidden=true;
				} 
				if (toshowOnCXmenu[2]!=true){ this.taskitem_menu.items.items[3].hidden=true; } 
				//---------------------------------------------------------------
				this.taskitem_menu.on('hide', this.onContextHide_Taskitem, this);
				this.taskitem_menu.showAt(evx.xy);																   																   
		}
	},
	onDblClick_tasklistitem: function(evx,elx,obx){ // 0.0.9 
		//test=elx.id.indexOf('test_calendar-mtask-item-')+1;  bug 
		test=elx.id.indexOf( this.calx.id + '-mtask-item-')+1;
		if (test){ 
			var datatask = this.getTaskarray(elx); 
			this.calx.fireEvent("taskDblClick",datatask,this,this.calx,'month'); //launch new event on the month object 
		} 
	},
	oncontextmenuTaskitem:function(evx,elx,obx){	// 0.0.9		
		if (Ext.isOpera){ if (evx.button!=2){ return false; } }
		evx.stopEvent();
		//0.0.11 Avoid display menu cause all menus are set to hidden on /TaskList_ShowMenuItems:[1,1,1],// //0.0.11  ADD, delete, edit
		if (this.TaskList_ShowMenuItems[0]!=true && this.TaskList_ShowMenuItems[1]!=true && this.TaskList_ShowMenuItems[2]!=true && this.TaskList_moreMenuItems.length<=0 ){ 
			return false;
		} 
		var tmpdata= Ext.get(elx.id);//0.0.14 Fix to set logical conditions for context menu (apply to events only) 		
		var toshowOnCXmenu = this.TaskList_ShowMenuItems;  	// Reference TaskList_ShowMenuItems:[1,1,1],// //0.0.11  ADD, delete, edit
		var newmenuitems   = this.TaskList_moreMenuItems; 
		var actionsTaskCX=[]; // Custom Menu items to the contextmenu of the task 
		var dataTASKtmp = this.getTaskarray(tmpdata); 
		var testevent =  this.calx.fireEvent("beforeContextMenuTask", "monthview-task",dataTASKtmp,toshowOnCXmenu,actionsTaskCX); 
		if (testevent==false) { //0.0.15 change
			// actionsTaskCX[0]   Will tellus if we abort the context menu
			// actionsTaskCX[1]   Will tell us if we Apply the logic 
			// actionsTaskCx[2]   Will tell us if we replace the Custom MenuItems 
			// actionsTaskCX[3]   Will contain the buttons or menu items to insert
			// actionsTaskCX[4]   Will contain the new logic to Show basic items on the task 
			if 	(actionsTaskCX[0]==false){  //If false we continue 
				if 	(actionsTaskCX[1]==true){  //If true we apply the new items  instead of the set in day view 
					if (actionsTaskCX[2]==true){ var newmenuitems = actionsTaskCX[3]; }// new more menu Items
					var toshowOnCXmenu = actionsTaskCX[4];		// the new showitems rule 
				} else {
					var newmenuitems   = this.TaskList_moreMenuItems; 					
					var toshowOnCXmenu = this.TaskList_ShowMenuItems; 
				} 
			} else {  //abort operation 
				return false; 
			} 
		} else { // do nothing follow as planned 
			var newmenuitems = this.TaskList_moreMenuItems; 
		}
		//--------------------------------------------------------------------
		//var dateobjtoref = elx.id.replace(/test_calendar-tasklist-/,''); bug 
		var dateobjtoref = elx.id.replace(this.calx.id + "-tasklist-",'');
		if (this.taskitem_menu){ 
			this.taskitem_menu.removeAll(); 
		}
		this.taskitem_menu = new Ext.menu.Menu({
			//id: this.calx.id + 'month_ctxmenu',
			allowOtherMenus:true,  
			shadow: true, 
			items:[{id:'month_tskitem_btn_task-add',	iconCls:'x-calendar-day-btnmv_add',		text: this.contextMenuLabels.taskAdd, 	scope:this},
				   {id:'month_tskitem_btn_task-delete', iconCls: 'x-calendar-day-btnmv_delete',	text: this.contextMenuLabels.taskDelete,scope:this},
				   '-',
				   {id:'month_tskitem_btn_task-edit',	iconCls: 'x-calendar-day-btnmv_task',	text: this.contextMenuLabels.taskEdit + tmpdata.getAttributeNS('tag','ec_subject'),scope:this}
			]
		});
//		if (newmenuitems.length>0) { 
//			this.taskitem_menu.add('-'); 
//			for (var i=0; i<newmenuitems.length; i++){
//				newmenuitems[i].rendered =false; 
//				newmenuitems[i].addListener('click', 
//							function(parx , parz){ 
//								this.onCustomMenuAction_TaskItem(parx.id, Ext.get(elx), this );
//							}, this); 
//				this.taskitem_menu.add( newmenuitems[i]);
//			}
//		}
		if (newmenuitems.length>0) { 
			this.taskitem_menu.add('-'); 
			for (var i=0; i<newmenuitems.length; i++){
				// var idmenuitem = newmenuitems[i].id;  0.0.4 bug in custom action sending the id the problem was the last id was returned always
				newmenuitems[i].rendered =false;
				// 0.0.14 modification to let the user set buttons with menu attached on the context menu,Sepearators could be used also. Note: only one level its allowed
				if (newmenuitems[i].menu==undefined) {  //just plain button 
					newmenuitems[i].rendered =false;
					if (newmenuitems[i].ctype=="Ext.menu.Item"){ 
						newmenuitems[i].rendered =false;
						newmenuitems[i].addListener('click', 
									function(parx , parz){ 
											this.onCustomMenuAction_TaskItem(parx.id, Ext.get(elx),this ); 
									}, this); 
					} else { 
						//Ext.menu.BaseItem // do nothing
					} 
					this.taskitem_menu.add( newmenuitems[i]);
				} else {
					this.taskitem_menu.addMenuItem({
						iconCls:newmenuitems[i].iconCls,
						text:newmenuitems[i].text, 
						menu:newmenuitems[i].menu
					});
					for (var xm=0;xm<newmenuitems[i].menu.items.length;xm++){
						newmenuitems[i].menu.items.items[xm].rendered=false;
						if (newmenuitems[i].menu.items.items[xm].ctype=="Ext.menu.Item"){ 
							newmenuitems[i].menu.items.items[xm].addListener('click', 
										function(parx,parz){ 
												this.onCustomMenuAction_TaskItem( parx.id, Ext.get(elx),this ); 
										}, this);
						} else { //Ext.menu.BaseItem  
								 // do nothing 
						}
					}
					
					
				} 
			}
		}
		this.taskitem_menu.items.items[0].addListener('click', function(){ this.onActionTask( 1, Ext.get(elx), this ); 	}, this); 
		this.taskitem_menu.items.items[1].addListener('click', function(){ this.onActionTask( 2, Ext.get(elx), this ); 	}, this); 
		this.taskitem_menu.items.items[3].addListener('click', function(){ this.onActionTask( 3, Ext.get(elx), this ); 	}, this); 		
		//0.0.11 Chek visibility according to new permision on
		//TaskList_ShowMenuItems:[1,1,1],// //0.0.11  ADD, delete, edit
		if (toshowOnCXmenu[0]!=true){  	this.taskitem_menu.items.items[0].hidden=true; /*ADD*/ } 
		if (toshowOnCXmenu[1]!=true){ 	this.taskitem_menu.items.items[1].hidden=true; /*DELETE */ } 
		if (toshowOnCXmenu[0]!=true && toshowOnCXmenu[1]!=true){ this.taskitem_menu.items.items[2].hidden=true; /*SEPARATOR */	} 
		if (toshowOnCXmenu[2]!=true){ 	
			this.taskitem_menu.items.items[3].hidden=true;  //EDIT 
			if (newmenuitems.length>0){ 
				this.taskitem_menu.items.items[4].hidden=true; 		
			} 
		}			
// 		Original CODE ------------------------------------------------------------------------------
//		if (this.TaskList_ShowMenuItems[0]!=true){ this.taskitem_menu.items.items[0].hidden=true; } 
//		if (this.TaskList_ShowMenuItems[1]!=true){ this.taskitem_menu.items.items[1].hidden=true; } 
//		if (this.TaskList_ShowMenuItems[0]!=true && this.TaskList_ShowMenuItems[1]!=true){ 
//			this.taskitem_menu.items.items[2].hidden=true;
//		} 
//		if (this.TaskList_ShowMenuItems[2]!=true){ 	
//			this.taskitem_menu.items.items[3].hidden=true; 
//			if (this.TaskList_moreMenuItems.length>0){ 
//				this.taskitem_menu.items.items[4].hidden=true; 		
//			} 
//		} 
// 		--------------------------------------------------------------------------------------------				
		this.taskitem_menu.on('hide', this.onContextHide_Taskitem, this);
		this.taskitem_menu.showAt(evx.xy);
	}, 
	onActionTask: function (action, taskEl, TaskObj ){ //0.0.9 
		this.taskitem_menu.hide();	
		var datatask = this.getTaskarray(taskEl); 
		switch(action){
			case 1:  //add	
				//var dateobjtoref = taskEl.id.replace(/test_calendar-mtask-item-/,'');
				if (taskEl.id.indexOf('-mtask-item-')>0){ 
					var dateobjtoref  =  taskEl.id.replace(this.calx.id + "-mtask-item-",'');	
				} else if (taskEl.id.indexOf('-tasklist-')>0){ 
					var dateobjtoref  =  taskEl.id.replace(this.calx.id + "-tasklist-",'');	
				}				
				dateobjtoref = dateobjtoref.substr(0,10);
				var eventdate = new Date(dateobjtoref);
				this.calx.fireEvent("taskAdd",eventdate);	
				break; 
			case 2: // delete
				var check = this.calx.fireEvent("beforeTaskDelete", datatask, this);  
				if (check){ //0.0.15 updated to accept true value and continue 
					if (this.calx.fireEvent("onTaskDelete",datatask)==true){ 
						this.calx.fireEvent("afterTaskDelete",datatask,true);
					} else { 
						this.calx.fireEvent("afterTaskDelete",null,false);
					} 
				} 
				break; 
			case 3: //edit
				var check = this.calx.fireEvent("beforeTaskEdit",datatask,this);  
				if (check){ //0.0.15 updated to accept true value and continue
					if (this.calx.fireEvent("onTaskEdit",datatask)==true){ 
						this.calx.fireEvent("afterTaskEdit",datatask,true);
					} else { 
						this.calx.fireEvent("afterTaskEdit",null,false);
					}	
				}
				break; 			
			default: 
				break; 
		} 
	},	
	onCustomMenuAction_TaskItem:function(MenuId,taskEl,TaskObj){ 
		var datatask = this.getTaskarray(taskEl); 
		this.calx.fireEvent("customMenuAction", MenuId,'month',datatask,taskEl,this); 
		this.taskitem_menu.hide(); 
	},
	onContextHide_Taskitem: function(menuItem){
		/*do nothing*/
// 		sample code for testing 
//		alert (menuItem);
//		alert ("hola borolas");
//		for (var i=0; i<menuItem.items.length; i++){
//			if 	(menuItem.items.items[i].menu==undefined){ 
//			} else { 
//				menuItem.items.items[i].menu.removeAll(); 
//				menuItem.items.items[i].menu.destroy(); 
//			} 
//		} 
//		menuItem.destroy(); 
	},		
	onhandler_day: function (evx,elx,obx){
		if (elx.className=="noday" || elx.className=="today" || elx.className=="monthday") { 
			//var dateparam = new Date(elx.id);   // 0.0.6 fix 
			var dateparam = new Date( elx.id.substring(this.calx.id.length + 1) );
		} else if (elx.className=="tasks" ){ 
			//var dateparam = new Date(elx.parentNode.firstChild.id); 
			var dateparam = new Date( elx.parentNode.firstChild.id.substring(this.calx.id.length + 1) ); 
		} else if (elx.className=="tasks_list_item" || elx.className=="tasks_list" || elx.className=="tasks_list_item task_list_item_over" || elx.className.indexOf("task_list_item_over")>0 ){
			 var tmp=11; 		// do nothing  :( cause doesnt matter for this item 
		} else { 
			//var dateparam = new Date(elx.firstChild.id); 
			var dateparam = new Date( elx.firstChild.id.substring(this.calx.id.length + 1) ); 
		} 
		if (elx.className=="tasks_list_item" || elx.className=="tasks_list" || elx.className=="tasks_list_item task_list_item_over"  || elx.className.indexOf("task_list_item_over")>0 ){ 
			var tmp=11; // do nothing  :( cause doesnt matter for this item 
		}  else { 
			if (this.dayAction=="viewday"){
				//0.0.11  Bug fix because not receving the event 
				if ( this.calx.fireEvent("beforeChangeView", 'day' , this.calx.currentView, this.calx)==false ) { 
					return false; 
				} else { 
					this.calx.currentdate= dateparam; 
					this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);
					this.calx.currentView='day'; 	 
					this.calx.viewday.render();
					this.calx.fireEvent("onChangeView", 'day', 'month', this);
				} 
			} 
			if (this.dayAction=="event"){  this.fireEvent("dayClick", dateparam ,this, this.calx); }
			if (this.dayAction=='window'){ this.ZoomDay(dateparam); } 
		} 
	}, 
	onclickprev_month: function (){
		var changemonthdate = this.calx.currentdate.add(Date.MONTH,-1);
		var check = this.fireEvent("beforeMonthChange", this.calx.currentdate , changemonthdate); 
		if (check){ 
			this.calx.currentdate = changemonthdate; 
			this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);
			this.render();
			this.fireEvent("afterMonthChange", changemonthdate);
		} 
	},
	onclicknext_month: function (){
		var changemonthdate = this.calx.currentdate.add(Date.MONTH,1); 
		var check = this.fireEvent("beforeMonthChange", this.calx.currentdate , changemonthdate); 
		if (check){
			this.calx.currentdate = changemonthdate; 
			this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);
			this.render();
			this.fireEvent("afterMonthChange", changemonthdate);
		}
	}, 
	// ------------------------------------------------------------------------------------
	//construction functions  -------------------------------------------------------------
	// ------------------------------------------------------------------------------------	
	genHeader: function(dateval){
		var dt = new Date(dateval);
		Date.monthNames = e2cs.cal_locale.monthtitles; 
		var myheader = '<div class="x-calendar-month-header" style="width:' + (this.calx.width - 10) + 'px;">';
		myheader += '<div id="header">' + dt.format(this.headerFormat)  + '</div>'; 
		if (this.headerButtons){ //0.0.4 bug 
	    	myheader += '<div class="x-calendar-month-previous"></div>';
		    myheader += '<div class="x-calendar-month-next"></div>'; 
		} 
		myheader+= "</div>";
		return myheader; 
	},
	genDaysHeader: function() {
		var day_hdrtext = ""; 
		for (var i=0; i <e2cs.cal_locale.daytitles.length ; i++){ 
			//day_hdrtext+= '<td width="14%"><div class="dayheader">' + e2cs.cal_locale.daytitles[i] + '</div></td>';
			//0.0.8 fix for new property startDay :) 
			var d = this.startDay+i;
            if(d > 6){ d = d-7; }
			day_hdrtext+= '<td width="14%"><div class="dayheader">' + e2cs.cal_locale.daytitles[d] + '</div></td>';
		}
		return day_hdrtext;
	},
	getDateRangeOfMonth: function(dateval){ 
		//0.0.15 new function to return the daterange as a tool search on data (stores, server side and so on )
		// it's almost the same logic usedn on genbody function 
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
	genBody: function(dateval,configdata){ 
		var dt= new Date(dateval); 
		//var initday = dt.getFirstDayOfMonth();
		var initday = dt.getFirstDayOfMonth()-this.startDay;//0.0.8
		var daysgen = dt.getDaysInMonth(); 
		var irowtmp = 0; 
		// compensate for leap year
 	    if (dt.getMonth()==1) { // February only!
		  	if(( dt.getFullYear() % 4 == 0 && dt.getFullYear() % 100 != 0) || dt.getFullYear() % 400 == 0){
		  		daysgen = 29;
			}
	  	}		
		var mybody='<tr>';
		if (initday<0){ initday = 7	+ (initday)	;  } // fix BUG 05/11/2008 ---- 0.0.8 
		if (initday!=0){ 
			for(var iday=(initday); iday>0; iday--){
				writedt= new Date( (dateval.getMonth()+ 1)  + '/1/' + dateval.getFullYear()).add(Date.DAY,(iday  * -1 )); 
				mybody+='<td valign="top" id="m-td-' + this.calx.id + '-' + writedt.format('m/d/Y') + '" class="daybody">';
				mybody+='<div class="noday" id="' + this.calx.id + '-' + writedt.format('m/d/Y') + '">' +  writedt.format('j-M') + '</div>';
				// nice bug fix we missed the previous day of the previous month :( sorry  0.0.11 
				if (this.showTaskcount){ // get the count of task for each day
						tmptasks = this.getCountTask(writedt, this.calx.store); 
						if (tmptasks>0 ){ 
							mybody+='<div class="tasks" style="' + configdata.styletasks + '">' + e2cs.cal_locale.labelforTasksinMonth + ' (' + tmptasks + ')</div>'; 
						} 
				}  
				// 0.0.9 added 	--- task list items 			
				else { 
					if (this.showTaskList) { 
							var taskitems= this.getTaskList(writedt, this.calx.store); 
							if (taskitems!=''){	
								mybody+='<div class="tasks_list" id="' +  this.calx.id + '-tasklist-' + writedt.format('m/d/Y') + '" style="height:5px;' + configdata.styletasks + '">';
								mybody+=taskitems; 
								mybody+='</div>'; 	
							} 
					} 
				}
				mybody+='</td>'; 
			} 
		} 		
		icount = initday; 
		irowtmp   = 1; 
		startmonthdate = new Date( dt.format('m') + '/01/' + dt.format('Y') ); 
		for (var imonth=0; imonth<daysgen; imonth++){ 
			if (icount>=7){ 
				icount=0; 
				mybody+='</tr><tr>';
				irowtmp+=1;
			} 
			var datecreate= new Date(startmonthdate).add(Date.DAY, imonth); 
			if (datecreate.format('m/d/Y')==dt.format('m/d/Y') ){ 
				mybody+='<td valign="top" id="m-td-' + this.calx.id + '-' + datecreate.format('m/d/Y') + '" class="daybody" height="10px">'; 
				mybody+='<div class="today" id="'  + this.calx.id + '-' + datecreate.format('m/d/Y') + '">' +  datecreate.format('j') +   '</div>'; 
				if (this.showTaskcount){ // get the count of task for each day
						tmptasks = this.getCountTask(datecreate, this.calx.store); 
						if (tmptasks>0 ){ 
							mybody+='<div class="tasks" style="' + configdata.styletasks + '">' + e2cs.cal_locale.labelforTasksinMonth + ' (' + tmptasks + ')</div>'; 
						} 
				}  
				// 0.0.9 added 	--- task list items 			
				else { 
					if (this.showTaskList) { 
							var taskitems= this.getTaskList(datecreate, this.calx.store); 
							if (taskitems!=''){	
								mybody+='<div class="tasks_list" id="' +  this.calx.id + '-tasklist-' + datecreate.format('m/d/Y') + '" style="height:5px;' + configdata.styletasks + '">';
								mybody+=taskitems; 
								mybody+='</div>'; 	
							} 
					} 
				}
				mybody+='</td>'; 		
			} else { 
				mybody+='<td valign="top" id="m-td-' + this.calx.id + '-' + datecreate.format('m/d/Y') + '" class="daybody" height="10px">';
				mybody+='<div class="monthday" id="' + this.calx.id + '-' + datecreate.format('m/d/Y') + '">' +  datecreate.format('j') +   '</div>'; 					
				if (this.showTaskcount){ // get the count of task for each day
						tmptasks = this.getCountTask(datecreate, this.calx.store); 
						if (tmptasks>0 ){ 
							mybody+='<div class="tasks" style="' + configdata.styletasks + '">' + e2cs.cal_locale.labelforTasksinMonth + ' (' + tmptasks + ')</div>'; 
						} 
				} 
				// 0.0.9 added 	--- task list items 			
				else { 
					if (this.showTaskList) { 
							var taskitems= this.getTaskList(datecreate, this.calx.store); 
							if (taskitems!=''){	
								mybody+='<div class="tasks_list" id="' +  this.calx.id + '-tasklist-' + datecreate.format('m/d/Y') + '" style="height:5px;' + configdata.styletasks + '">';
								mybody+=taskitems; 
								mybody+='</div>'; 	
							} 
					} 
				}
				mybody+='</td>'; 		
			} 
			icount+=1; 
		}
		if (icount<7 ){ 
			var datatmp =0;
			for (var iday=icount; iday<7; iday++){
				datatmp=datatmp+1;  		
				var datenew = new Date(datecreate).add(Date.DAY,datatmp); 
				mybody+='<td valign="top"   id="m-td-' + this.calx.id + '-' + datenew.format('m/d/Y') + '" class="daybody" height="10px">';
				mybody+='<div class="noday" id="' + this.calx.id + '-' + datenew.format('m/d/Y') + '">' +  datenew.format('j-M') +   '</div>'; 					
				if (this.showTaskcount){ // get the count of task for each day
						//tmptasks = this.getCountTask(datecreate, this.calx.store); // bug 0.0.5
						tmptasks = this.getCountTask(datenew, this.calx.store); 
						if (tmptasks>0 ){ 
							mybody+='<div class="tasks" style="' + configdata.styletasks + '">' + e2cs.cal_locale.labelforTasksinMonth + ' (' + tmptasks + ')</div>'; 
						} 
				} // 0.0.9 added 	--- task list items 
				else { 
					if (this.showTaskList) { 
							var taskitems= this.getTaskList(datenew, this.calx.store); 
							if (taskitems!=''){							
								mybody+='<div class="tasks_list" id="' +  this.calx.id + '-tasklist-' + datenew.format('m/d/Y') + '" style="height:5px;' + configdata.styletasks + '">';
								mybody+=taskitems; 
								mybody+='</div>'; 				
							} 
					} 
				} 			
				mybody+='</td>'; 
			} 
		} 
		mybody+='</tr>'; 
		return mybody; 
	},
	getCountTask:function(dtx,storex){
		var counttasks= storex.getCount();
		if ( counttasks>0 ){ 
			var count_in_day=0; 
			for (var itask=0; itask<counttasks ; itask++){
				dateinit = storex.getAt(itask).data[this.calx.fieldsRefer.startdate];//0.0.11dynamic fields  
				dateend =  storex.getAt(itask).data[this.calx.fieldsRefer.enddate]; //0.0.11dynamic fields
				checkdates = dtx.between( new Date(dateinit), new Date(dateend) ); 
				chkformat =  dtx.format('m/d/Y'); 
				test = new Date(dateinit); if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				test = new Date(dateend);  if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				var initxx = new Date(dateinit); var endxx = new Date(dateend); 
			    if (initxx <dtx && endxx>dtx){ checkdates=true; } 				
				if (checkdates){ 
					count_in_day+=1; 
				} 
			} 
			return count_in_day;
		} else { 
			return 0; 
		} 
	},
	getTaskList:function(dtx,storex){ //0.0.9  to create a task list on each day on month view :) 
		var daystoreturn = ""; 
		var counttasks= storex.getCount();
		if ( counttasks>0 ){ 
			var count_in_day=0; 
			for (var itask=0; itask<counttasks ; itask++){
				dateinit = storex.getAt(itask).data[this.calx.fieldsRefer.startdate];  //0.0.11dynamic fields
				dateend =  storex.getAt(itask).data[this.calx.fieldsRefer.enddate]; //0.0.11dynamic fields
				checkdates = dtx.between( new Date(dateinit), new Date(dateend) ); 
				chkformat =  dtx.format('m/d/Y'); 
				test = new Date(dateinit); if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				test = new Date(dateend);  if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
				var initxx = new Date(dateinit); var endxx = new Date(dateend); 
			    if (initxx <dtx && endxx>dtx){ checkdates=true; } 				
				if (checkdates){ 
					if (count_in_day<this.showNumTasks){
						//'<tpl for=".">{starxl}{startval}<br>{endxl}{endval}<hr color="#003366" noshade>{details}</tpl>'
						var tmpdate = new Date(storex.getAt(itask).data[this.calx.fieldsRefer.startdate]);//0.0.11dynamic fields			
						var startlabel = tmpdate.format(this.task_format); 	
						tmpdateb = new Date(storex.getAt(itask).data[this.calx.fieldsRefer.enddate]);//0.0.11dynamic fields
						var endlabel = tmpdateb.format(this.task_format); 
						
						var tmpdescription = storex.getAt(itask).data[this.calx.fieldsRefer.description];
						if (tmpdescription.length>this.calx.tipmaxLength){ 
							var tmpdescriptionx = tmpdescription.substring(0,this.calx.tipmaxLength) + '...'; 
						}
						
						daystoreturn+='<div class="tasks_list_item"';
						daystoreturn+='style="background-color:' + storex.getAt(itask).data[this.calx.fieldsRefer.color] + '" ';  //0.0.11dynamic fields
						daystoreturn+='id="' + this.calx.id + '-mtask-item-' + chkformat + '-' + storex.getAt(itask).data[this.calx.fieldsRefer.id] + '" ';//0.0.11dynamic fields
						daystoreturn+='ec_id="' + storex.getAt(itask).data[this.calx.fieldsRefer.id] + '" ';//0.0.11dynamic fields
						daystoreturn+='ec_starts="' + startlabel + '" ';
						daystoreturn+='ec_ends="' + endlabel + '" ';
						//daystoreturn+='ec_subject="' + storex.getAt(itask).data.subject + '" ';
						daystoreturn+='ec_subject="' + storex.getAt(itask).data[this.calx.fieldsRefer.subject] + '" ';//0.0.11dynamic fields
						//daystoreturn+='ec_cnt="' + storex.getAt(itask).data.description + '" ';
						daystoreturn+='ec_cnt="' + tmpdescriptionx + '" ';//0.0.11dynamic fields
						daystoreturn+='ec_storeindex="' + itask + '" ';
						daystoreturn+='ec_location="' + storex.getAt(itask).data[this.calx.fieldsRefer.location] + '" ';
						daystoreturn+='ec_allday="' + storex.getAt(itask).data[this.calx.fieldsRefer.alldaytask] + '" ';
						daystoreturn+='ec_isholiday="' + storex.getAt(itask).data[this.calx.fieldsRefer.isHoliday] + '" ';
						//daystoreturn+=' ext:qtitle="' + storex.getAt(itask).data.subject + '" ';
						daystoreturn+=' ext:qtitle="' + storex.getAt(itask).data[this.calx.fieldsRefer.subject] + '" ';//0.0.11dynamic fields
						var datatip = {
						   starxl:   e2cs.cal_locale.task_qtip_starts,
						   startval: startlabel,
						   endxl:    e2cs.cal_locale.task_qtip_ends, 
						   endval:   endlabel,
						   //details:  storex.getAt(itask).data.description,  color:storex.getAt(itask).data.color //0.0.11 dynamic fields 
						   details:  tmpdescriptionx,			 // 0.0.15 change storex.getAt(itask).data[this.calx.fieldsRefer.description],  
						   color:	 storex.getAt(itask).data[this.calx.fieldsRefer.color],
						   location: storex.getAt(itask).data[this.calx.fieldsRefer.location]
						};
						
						//var mylist_itemTip = this.TaskList_tplqTip.apply(datatip); 
						//	0.0.14 	 deprecated TaskList_tplqTip because for consistency use in all views the calendar object property tplTaskTip
						var mylist_itemTip =  this.calx.tplTaskTip.apply(datatip); 						
						daystoreturn+='ext:qtip="' + mylist_itemTip + '">';
						daystoreturn+=storex.getAt(itask).data[this.calx.fieldsRefer.subject] + '</div>'; // 0.0.12 BUG fix
						count_in_day+=1;
					}
				} 
			} 
			return daystoreturn;
		} else { 
			return 0; 
		} 
	},
	getTaskarray: function(TaskElx){  //0.0.9 for gett the data on the task in task list items 
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
		datatask[9]=tmpdata.getAttributeNS('tag','ec_isholiday') ;		
		return 	datatask; 	
	} 
});