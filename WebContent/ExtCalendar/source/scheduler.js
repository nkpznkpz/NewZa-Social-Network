// JavaScript Document
// E2cs alpha  0.0.10
// Extjs-Event-Calendar Solution 
// Scheduler.js
// Author: Carlos Mendez
// Contact: cmendez21@gmail.com   (gmail and gtalk) 
// 22-JAN-2009
										   
// Fixed Rendering Issues on FF3 and IE6, IE7  
// cause the task and body of the biew was not rendenring properly 
// and then some issues beteweens CCs3 Support

// Context Menu's Order arrangement so it will keep consistency with other views 
// NOTE the arrangement its on display but not on the properties  to hide, show menu items 

// also some fixes to avoid errors on changin views when the view is null or non existent 

// 03-Dic-2008
// First Version of this view 
Ext.namespace('e2cs.schedviews');
e2cs.schedviews.subView ={ Day:  0,  Week: 1,  Month: 2, TwoMonths: 3,  Quarter: 4};
e2cs.schedviews.Units   ={ Hours:0,  Days: 1,  Weeks: 2};
Ext.ECalendar.scheduleview = function(config){
	Ext.apply(this,config);
	this.addEvents(
		'headerClick',
		'beforePeriodChange',
		'afterPeriodChange'
		//'listItemSendData',  //0.0.14 removed / deprecated for consistency pourposes
	);	
	Ext.ECalendar.scheduleview.superclass.constructor.call(this);
};
Ext.extend(Ext.ECalendar.scheduleview, Ext.util.Observable, {
	referid:'schedule',
	header: true,
	headerFormat:'M-Y',
	headerButtons: true,
	headerAction:'gotoview',
	periodSelector:false,
	blankzonebg:'#6C90B4',
	blankHTML:'',
	listItems: { 
		headerTitle:"Events on the period", 		
		periodFormats:{ 
			Day:		'l - d - F  - Y', 
			DayScheduler_format: 'd', 
			hourFormat: 'h:i a', 				 
			startTime:  '7:00:00 am',		// format has to be 'h:s:i a'
			endTime:    '10:00:00 pm',		// format has to be 'h:s:i a'
			WeekTPL:  	'<tpl for=".">'   +  e2cs.cal_locale.scheduler_headerListStrings.week + ' {numweek} ' + e2cs.cal_locale.scheduler_headerListStrings.start + '{datestart} ' + e2cs.cal_locale.scheduler_headerListStrings.end + ' {dateend}</tpl>',  
			WeekFormat:	'W',
			DatesFormat:'d/m/Y',
			Month:  	'M-Y', 
			TwoMonthsTPL:'<tpl for=".">' +  e2cs.cal_locale.scheduler_headerListStrings.period + ' {numperiod} ' + e2cs.cal_locale.scheduler_headerListStrings.start + ' {datestart} ' + e2cs.cal_locale.scheduler_headerListStrings.end + ' {dateend}</tpl>',
			QuarterTPL:  '<tpl for=".">' +  e2cs.cal_locale.scheduler_headerListStrings.period + ' {numperiod} ' + e2cs.cal_locale.scheduler_headerListStrings.start + ' {datestart} ' + e2cs.cal_locale.scheduler_headerListStrings.end + ' {dateend}</tpl>'
		},	
		useStoreColor:false, 
		descriptionWidth:250,
		parentLists:false, //to expand collapse Parent Items if false all tasks shown as parent
		launchEventOn:'click',
		editableEvents:false, // If true a context menu will appear 
		moreMenuItems:[],
		ShowMenuItems:[1,1,1,1,1,1,1,1],// ADD, EDIT, DELETE, GO NEXT PERIOD , GO PREV PERIOD, Chg Month, Chg Week, CHG Day
		taskdd_ShowMenuItems:[1,1,1],    // ADD, EDIT, DELETE
		taskdd_BaseColor:'#ffffff',	
		taskdd_clsOver:'',
		taskdd_showqtip:true,
		taskdd_shownames:true
	},
	listbody:{
		periodType:e2cs.schedviews.subView.Month, // e2cs.schedviews.subView ={ Day:  0,  Week: 1,  Month: 2, TwoMonths: 3,  Quarter: 4};
		headerUnit:e2cs.schedviews.Units.Days, 	  // e2cs.schedviews.Units   ={ Hours:0,  Days: 1,  Weeks: 2};
		headerUnitWidth:25 
	},
	contextMenuLabels: e2cs.cal_locale.contextMenuLabelsSchedule,
	thisview:null,
	init:function(calendar,dateval){
		this.calx = calendar; 
		this.datetohandle = dateval; 
		// Validate possible combinations For displaying  on the scheduler header body 
		if (this.listbody.periodType>=1 || this.listbody.periodType<=4){ 
			if (this.listbody.headerUnit==0) { //For everything else cant' apply hours 
				this.listbody.headerUnit=1; 
			} 
		} 
		if (this.listbody.periodType==1 || this.listbody.periodType==2){  // Month and week cant apply Week units 
			if (this.listbody.headerUnit!=1) { //For everything else can weeks 
				this.listbody.headerUnit=1; 
			} 
		} 
		if (this.listbody.periodType==0 && this.listbody.headerUnit!=0){ this.listbody.headerUnit=0; } //For days cann appply only hours 
	},
	refreshView: function(){
		this.render(); 
	}, 
	render: function (){ 
		var myMask = new Ext.LoadMask( this.calx.id , {removeMask:true,msg:e2cs.cal_locale.loadmaskText});
		myMask.show();	
		this.datetohandle = this.calx.currentdate;
		var updateview = Ext.get(this.calx.body); 
		//0.0.12 Small test for removing child nodes  and have better performance and memory 
		var testrender= updateview.dom.childNodes.length; 
		if (testrender){ 
			for (var i=testrender;i<testrender;i++){
				updateview.dom.removeChild(updateview.dom.childNodes[0]);
			} 
		} 
		updateview.update(''); 
		//Create the main header for this view 
		var viewbase =   '<div id="' + this.calx.id + '-main-calendar-header"></div>'; 
		    viewbase+=   '<div id="' + this.calx.id + '-main-calendar-sched-body"></div>';	
		updateview.update(viewbase);
		if (this.header){
			var tmpheader 	  = Ext.get(this.calx.id + '-main-calendar-header');
			var myheaderwrap  = tmpheader.wrap ({ tag:'div', cls: 'x-calendar-sched-header',	html:''	}); 
			if (this.headerButtons){
				var nextclick = myheaderwrap.createChild({id:this.calx.id + '-btn-nm', tag: 'div', cls: 'x-calendar-sched-next',	 html:'' }); 
				var prevclick = myheaderwrap.createChild({id:this.calx.id + '-btn-pm', tag: 'div', cls: 'x-calendar-sched-previous', html:'' }); 

				prevclick.dom['qtip']= e2cs.cal_locale.headerTooltipsScheduler.prev;
				prevclick.addListener('click', this.onclickprev_period, this);
				
				prevclick.addClassOnOver('x-calendar-sched-previous-over');
				nextclick.dom['qtip']= e2cs.cal_locale.headerTooltipsScheduler.next;
				
				nextclick.addListener('click', this.onclicknext_period, this);
				nextclick.addClassOnOver('x-calendar-sched-next-over');	
			}
			var legenddisplayheader = this.getHeaderLabel(); 
			var headerx =   myheaderwrap.createChild({  tag: 'div',	 id: 'header',  html:'' + legenddisplayheader + ''	});
		} 
		//Creates the header fo the Scheduler according to the parameters 	
		this.numelements = 0; 
		var misecondheader = this.genSchedbodyHeader(); 
		var mycontentSched = Ext.get(this.calx.id +'-main-calendar-sched-body');
		// Get the data to fix the width and height  of some elements 
		if (this.calx.ownerCt!=undefined){ //0.0.6 fix for ext.component containers such as tab and others and properly draw correctly
			if (this.calx.ownerCt.ctype && this.calx.ownerCt.ctype=="Ext.Component"){ 
				this.calx.height =  this.calx.ownerCt.getInnerHeight(); //0.0.7  - beta 0.0.2 //this.calx.height =  this.calx.ownerCt.height;  
				//this.calx.width  =  this.calx.ownerCt.getInnerWidth(); //0.0.7  - beta 0.0.2 //this.calx.height =  this.calx.ownerCt.height;  				
			} 
		} 		
		anchoCalendar = Ext.get(this.calx.body).getWidth();//anchoCalendar = tmpheader.getWidth(true); 
		if (Ext.isIE){ /* 0.0.12 */ 	mycontentSched.setWidth( anchoCalendar,false);	} 
		if (this.calx.border){ anchoCalendar+=(-2); } 
		anchotable2cntheaders = anchoCalendar -this.listItems.descriptionWidth; 
		countxvalwidth = (this.listbody.headerUnitWidth * this.numelements); 
		var Dataapplytofix = { 
			TABLEXXW1:anchoCalendar,
			TDXXVAL2: anchotable2cntheaders,
			TDXXVAL3: countxvalwidth
		}; 
		var tmptplheadercontentssched= new Ext.XTemplate('<tpl for=".">' + misecondheader + '</tpl>'); 
		var torenderinbody = tmptplheadercontentssched.applyTemplate(Dataapplytofix); 	
		var myheaderinbody_sched = mycontentSched.wrap ({ tag:'div', cls:'x-calendar-sched-body-header',html:torenderinbody });
		Ext.get(this.calx.id + '-container_header_sched_base').setStyle('background-color', this.blankzonebg );	
		
		if (Ext.isIE){  //0.0.12 fix 
			myheaderinbody_sched.setStyle('overflow', 'hidden' );	
			myheaderinbody_sched.setWidth( anchoCalendar,false);	
			this.refercolmns = Ext.select('div.sched_hdrbody_vals_IE',true); 
		} else { 
			this.refercolmns = Ext.select('div.sched_hdrbody_vals',true); 
		} 
		
		this.refercolmns.each(function(el, thisobj, index){
				if (el.id.indexOf(this.calx.id + '-tdsched_valcols-')+1>=1){
						if (Ext.isIE){ //0.0.12 fix 
							el.addClassOnOver('sched_hdrbody_valsover_IE');
						} else {
							el.addClassOnOver('sched_hdrbody_valsover');
						} 
						el.addListener('click', this.onclick_myheadersvalues, this);
				} 
			},this
		);
		//Get the number of tasks in to show if none a special screen appears according if the user is allowed to ADD tasks 
		var mytasks = this.getTasksforPeriod(); 
		if (mytasks.length>0){  // Creates the body of the List contents  
			var mystrcontents = this.genShedContentList(mytasks);
			var Dataapplytofix_b = { 
				ANCHO1TOTAL:  countxvalwidth + this.listItems.descriptionWidth ,
				ANCHOREFLIST: this.listItems.descriptionWidth,
				anchocolgrids:countxvalwidth,
				TOPcontenedorTASKS:100 //this is a temporal value cause needs fix after HTML insert
			}; 
			var tmptplcontents_body_sched= new Ext.XTemplate('<tpl for=".">' + mystrcontents + '</tpl>'); 
			var torenderinbody_b = tmptplcontents_body_sched.applyTemplate(Dataapplytofix_b); 	
			mycontentSched.insertHtml('beforeEnd',torenderinbody_b,false); 
			if (this.calx.ownerCt!=undefined){ //fix for ext.component containers such as tab and others and properly draw correctly
				var todeletespace = 0; 
				if (this.calx.header){ todeletespace+=27;} 
				if (this.calx.showCal_tbar){ todeletespace+=26; } 
				if (this.header){todeletespace+=47; }		
				var totalhx =  this.calx.ownerCt.getInnerHeight()- todeletespace; 
				//(Ext.get(this.calx.body).getHeight()-todeletespace)
				Ext.get(this.calx.id + '-body-sched-container-list').setStyle('height', totalhx  + 'px');
			} else { 
				if (this.header){ 
					Ext.get(this.calx.id + '-body-sched-container-list').setStyle('height', (Ext.get(this.calx.body).getHeight()-47) + 'px');
				} else { 
					Ext.get(this.calx.id + '-body-sched-container-list').setStyle('height', (Ext.get(this.calx.body).getHeight()-23) + 'px');			
				} 
			}
			if (Ext.isIE){  //0.0.12 fix 
				Ext.get(this.calx.id + '-body-sched-container-list').setWidth( anchoCalendar,false);	
				Ext.get(this.calx.id + '-body-sched-container-list').setStyle('overflow', 'auto' );	
			}
			Ext.get(this.calx.id + '-body-sched-container-list').setStyle('background-color', this.blankzonebg );				
			//Ext.get(this.calx.id + '-body-sched-container-list').setStyle('width', (anchoCalendar) + 'px' );	
			//Ext.get(this.calx.id + '-body-sched-container-list').setStyle('overflow', 'auto' );	
			Ext.get(this.calx.id + 'body-sched-insider').setStyle('height',(Ext.get(this.calx.id + '-skeleton_sched').getHeight() + 1)  + 'px');
			Ext.get(this.calx.id + 'body-sched-insider').setStyle('width', (countxvalwidth + this.listItems.descriptionWidth)   + 'px');	
			Ext.get(this.calx.id + 'body-sched-insider').setStyle('background-color', '#FFFFFF' );				
			
			myscrollelement = Ext.get(this.calx.id + '-body-sched-container-list'); 
			mycalendartmp = this.calx; 
			myscrollelement.on("scroll",function(){ 
						var test= this.dom.scrollLeft;
						Ext.get(mycalendartmp.id +'-subcontainer_sched_headers').setStyle('margin-left', "-" + test + 'px'); 				
						//Ext.get(mycalendartmp.id +'-container-tablehdr-sched-bdy-submain').setStyle('margin-left', "-" + test + 'px'); 		
					},myscrollelement 
			);
			var nh_TOPcontenedorTasks = Ext.get(this.calx.id + '-skeleton_sched').getHeight(); 
			var taskcontainerDD = Ext.get(this.calx.id + '-taskdd-container'); 
			taskcontainerDD.setStyle('top','-' +  nh_TOPcontenedorTasks + 'px');
			taskcontainerDD.setStyle('height', nh_TOPcontenedorTasks + 'px');
			// For each task / event add  handlers 
			this.refertasks = Ext.select('div.sched_lisItem_div',true); 
			this.refertasks.each(function(el, thisobj, index){
					if (el.id.indexOf(this.calx.id + '-eventno-')+1>=1){					 
							el.addClassOnOver('sched_listItem_mouseOver');	
							if (this.listItems.launchEventOn!=''){ 
								el.addListener(this.listItems.launchEventOn, this.onclick_listItems, this);
							} 
							if (this.listItems.editableEvents){ // Menu Config Listener the List items Here 
								if (Ext.isOpera){ 
									el.addListener('mousedown',this.operabuttons_for_listItem,this); 
								} else { 
									el.addListener('contextmenu',this.oncontextmenu_for_lisItem, 
										this,{
										   stopPropagation:true,
										   normalized :true,
										   preventDefault:true
									});
								} 
							} 
					} 
				},this
			);			
			//Once adjusted the task container we introduce the Tasks inside to taskcontainerDD
			myddcontainer= Ext.get(this.calx.id + '-taskdd-container'); 
			//myddcontainer.setStyle('background-color', '#FFDF96' );
			this.createTasksDD(mytasks,myddcontainer);
			// var test=11; 
			// more to do 		
		}  else { // special screen  // functions ok  
			notaskhtml = this.genShedNoContentScreen(); 
			mycontentSched.insertHtml('beforeEnd',notaskhtml,false); 
			if (this.header){ 
				Ext.get(this.calx.id + '-body-sched-no-task-screen').setStyle('height', (Ext.get(this.calx.body).getHeight()-46) + 'px');
			} else { 
				Ext.get(this.calx.id + '-body-sched-no-task-screen').setStyle('height', (Ext.get(this.calx.body).getHeight()-23) + 'px');			
			} 	
			Ext.get(this.calx.id + '-body-sched-no-task-screen').setStyle('background-color', this.blankzonebg );
			var tmp_element = Ext.DomQuery.selectNode('div[id=' + this.calx.id + '_addevent_element_screen]'); 
			if (tmp_element!=undefined){ // it existsss :) 
				Ext.get(tmp_element.id).addListener('click',this.neweventlaunch,this); 
			} 
		} 
		// Creates the body of the tasks 
		myMask.hide(); 
	},
	operabuttons_for_listItem: function(evx,elx,obx){
		if (evx.button==2){ this.oncontextmenu_for_lisItem(evx,elx,obx); }  
	},
	operabuttons_for_taskdd: function(evx,elx,obx){
		if (evx.button==2){ this.oncontextmenu_for_taskdd(evx,elx,obx); }  
	},
	oncontextmenu_for_lisItem: function(evx,elx,obx){
		if (elx.id.indexOf(this.calx.id + '-eventno-')+1>=1){ } else { 	return false;  } 
		evx.stopEvent();
		if (this.menu_listItem){ this.menu_listItem.removeAll();}
		// we need the reference of the task store rec id 
		var strtaskvalue = elx.id.replace(this.calx.id + '-eventno-',''); 
		var taskvalue = parseInt(strtaskvalue); 
		var dataobj   = this.calx.store.getById(taskvalue).data;
		// Begin with the permissions if allowed on this.listItems.ShowMenuItems 
		//ShowMenuItems:[1,1,1,1,1,1,1,1],// ADD, EDIT, DELETE, GO NEXT PERIOD , GO PREV PERIOD, Chg Month, Chg Week, CHG Day
		tmpmenuobjs=[]; 
		if (this.listItems.ShowMenuItems[0]){  // ADD
			buttonx1= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-Add',iconCls:'x-calendar-sched-btnmv_add',	text: e2cs.cal_locale.contextMenuLabelsSchedule.taskAdd 
			});
			buttonx1.addListener('click', function(){ this.neweventlaunch() ; } , this); 
			tmpmenuobjs.push(buttonx1); 
		} 
		if (this.listItems.ShowMenuItems[2]){  // DELETE
			buttonx3= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-Delete',
					iconCls:'x-calendar-sched-btnmv_delete',
					text: e2cs.cal_locale.contextMenuLabelsSchedule.taskDelete + ' ' + taskvalue + ' ' 
			});
			buttonx3.addListener('click', function(){
						var datatask = this.getTaskarray(dataobj); 		
						var check = this.calx.fireEvent("beforeTaskDelete",datatask,this.vday );  
						if (check){ //0.0.15 updated to accept true value and continue 
							if (this.calx.fireEvent("onTaskDelete",datatask)==true){ 
								this.calx.fireEvent("afterTaskDelete",datatask,true);
							} else { 
								this.calx.fireEvent("afterTaskDelete",null,false);
							} 
						} 		
			}, this); 
			tmpmenuobjs.push(buttonx3); 
		} 		
		if (this.listItems.ShowMenuItems[1]){  // EDIT
			buttonx2= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-Edit',iconCls:'x-calendar-sched-btnmv_edit',text: e2cs.cal_locale.contextMenuLabelsSchedule.taskEdit + ' ' + taskvalue + ' ' 
			});
			buttonx2.addListener('click', function(){ 
						var datatask = this.getTaskarray(dataobj); 						   
						var check = this.calx.fireEvent("beforeTaskEdit",datatask,this.vday);  
						if (check){ //0.0.15 updated to accept true value and continue
							if (this.calx.fireEvent("onTaskEdit",datatask)==true){ 
								this.calx.fireEvent("afterTaskEdit",datatask,true);
							} else { 
								this.calx.fireEvent("afterTaskEdit",null,false);
							}	
						}
			} , this); 
			tmpmenuobjs.push(buttonx2); 
		} 

		if (this.listItems.ShowMenuItems[0] || this.listItems.ShowMenuItems[1] || this.listItems.ShowMenuItems[2]) { 
			button_sep_one = new Ext.menu.Separator({}); 
			tmpmenuobjs.push(button_sep_one ); 	
		} 
		if (this.listItems.ShowMenuItems[3]){//GO NEXT PERIOD
			buttonx4= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-gnp',iconCls:'x-calendar-sched-btnmv_nextperiod',text: e2cs.cal_locale.contextMenuLabelsSchedule.NextPeriod
			});
			buttonx4.addListener('click', this.onclicknext_period , this); 
			tmpmenuobjs.push(buttonx4); 
		}			
		if (this.listItems.ShowMenuItems[4]){//GO PREV PERIOD
			buttonx5= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-gpp',iconCls:'x-calendar-sched-btnmv_prevperiod',	text: e2cs.cal_locale.contextMenuLabelsSchedule.PreviousPeriod
			});
			buttonx5.addListener('click', this.onclickprev_period , this); 
			tmpmenuobjs.push(buttonx5); 
		}		
		if (this.listItems.ShowMenuItems[3] || this.listItems.ShowMenuItems[4] ) { 
			button_sep_two = new Ext.menu.Separator({}); 
			tmpmenuobjs.push(button_sep_two); 	
		} 
		//check if the change view menus are gonna aapear if not then remove the separator :P 
		if (this.listItems.ShowMenuItems[5] && this.listItems.ShowMenuItems[6] && this.listItems.ShowMenuItems[7]){ } else { 
			if (this.listItems.ShowMenuItems[3] && this.listItems.ShowMenuItems[4] ){ 
			} else {
				if (this.listItems.ShowMenuItems[0]  && this.listItems.ShowMenuItems[1]  && this.listItems.ShowMenuItems[2]) { 
				} else { 
					tmpmenuobjs.pop(); 
				} 
			} 
		}
		if (this.listItems.ShowMenuItems[5]){//Chg Month
			buttonx6= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-chgm',iconCls:'x-calendar-sched-btnmv_viewmonth',text: e2cs.cal_locale.contextMenuLabelsSchedule.chgmview
			});
			buttonx6.addListener('click', function(){ this.changeCalview(0); } , this); 
			tmpmenuobjs.push(buttonx6); 
		}
		if (this.listItems.ShowMenuItems[6]){//Chg Week
			buttonx6= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-chgw',iconCls:'x-calendar-sched-btnmv_viewweek',text: e2cs.cal_locale.contextMenuLabelsSchedule.chgwview
			});
			buttonx6.addListener('click', function(){ this.changeCalview(1); } , this); 
			tmpmenuobjs.push(buttonx6); 
		}
		if (this.listItems.ShowMenuItems[7]){//Chg day
			buttonx7= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-chgd',iconCls:'x-calendar-sched-btnmv_viewday',text: e2cs.cal_locale.contextMenuLabelsSchedule.chgdview
			});
			buttonx7.addListener('click', function(){ this.changeCalview(2); } , this); 
			tmpmenuobjs.push(buttonx7); 
		}
		if (  (this.listItems.ShowMenuItems[5] || this.listItems.ShowMenuItems[6] || this.listItems.ShowMenuItems[7]) && this.listItems.moreMenuItems.length>0)  { 
			button_sep_three = new Ext.menu.Separator({}); 
			tmpmenuobjs.push(button_sep_three);  	
		}
		//custom menu objects 
		if (this.listItems.moreMenuItems.length>0) { 
			for (var i=0; i< this.listItems.moreMenuItems.length; i++){
				var idmenuitem = this.listItems.moreMenuItems[i].id; 
				this.listItems.moreMenuItems[i].rendered =false; 
				this.listItems.moreMenuItems[i].addListener('click', 
							function(parx){ 
							   this.onCustomMenuAction(parx.id,Ext.get(elx)); 							
							}, this); 
				tmpmenuobjs.push(this.listItems.moreMenuItems[i]);//this.menu.add( this.listItems.moreMenuItems[i]);
			}
		}
		this.menu_listItem = new Ext.menu.Menu({id: this.calx.id + '-contextmenu-listItem-sel',shadow: true,items:[] });
		var countdataitems= tmpmenuobjs.length; 
		for (var i=0;i<countdataitems;i++){ this.menu_listItem.add(tmpmenuobjs[i]);	} 
		this.menu_listItem.on('hide', this.onContextHide, this);
		this.menu_listItem.showAt( [ evx.getPageX(), evx.getPageY() ]);
	},
	oncontextmenu_for_taskdd:function(evx,elx,obx){
		if (elx.id.indexOf(this.calx.id + '-shced-taskdd-')+1>=1){ } else { 	return false;  } 
		if ( this.listItems.taskdd_ShowMenuItems[0]==false && this.listItems.taskdd_ShowMenuItems[1]==false && this.listItems.taskdd_ShowMenuItems[2]==false && this.listItems.moreMenuItems.length>0) { 
			return false;
		} 
		evx.stopEvent();
		if (this.taskmenu_listItem){ this.taskmenu_listItem.removeAll();}
		// we need the reference of the task store rec id 
		var strtaskvalue = elx.id.replace(this.calx.id + '-shced-taskdd-',''); 
		var taskvalue = parseInt(strtaskvalue); 
		var dataobj   = this.calx.store.getById(taskvalue).data; 
		var datatask  = this.getTaskarray(dataobj);
		var tmpmenuobjs=[]; 
		var toshowOnCXmenu = this.listItems.taskdd_ShowMenuItems; 
		var actionsTaskCX=[]; // Custom Menu items to the contextmenu of the task  
		var newmenuitems   = this.listItems.moreMenuItems; 
		var testevent =  this.calx.fireEvent("beforeContextMenuTask", "schedule-task",datatask,toshowOnCXmenu,actionsTaskCX); 
		if (testevent==false) {  //0.0.15 change
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
					var newmenuitems   = this.listItems.moreMenuItems; 					
					var toshowOnCXmenu = this.listItems.taskdd_ShowMenuItems; 
				} 
			} else {  //abort operation 
				return false; 
			} 
		} else { // do nothing follow as planned 
			var newmenuitems = this.listItems.moreMenuItems; 
		}
		// Begin with the permissions if allowed on this.listItems.taskdd_ShowMenuItems 
		// taskdd_ShowMenuItems[1,1,1]  // ADD, EDIT, DELETE

		if (toshowOnCXmenu[0]){  // ADD
			buttonx1= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-Add',iconCls:'x-calendar-sched-btnmv_add',	text: e2cs.cal_locale.contextMenuLabelsSchedule.taskAdd 
			});
			buttonx1.addListener('click', function(){ this.neweventlaunch() ;} , this); 
			tmpmenuobjs.push(buttonx1); 
		} 
		if (toshowOnCXmenu[2]){  // DELETE
			buttonx3= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-Delete',
					iconCls:'x-calendar-sched-btnmv_delete',
					text: e2cs.cal_locale.contextMenuLabelsSchedule.taskDelete + ' ' + taskvalue + ' ' 
			});
			buttonx3.addListener('click', function(){
						var datatask = this.getTaskarray(dataobj); 		
						var check = this.calx.fireEvent("beforeTaskDelete",datatask,this.vday );  
						if (check){ //0.0.15 updated to accept true value and continue 
							if (this.calx.fireEvent("onTaskDelete",datatask)==true){ 
								this.calx.fireEvent("afterTaskDelete",datatask,true);
							} else { 
								this.calx.fireEvent("afterTaskDelete",null,false);
							} 
						} 		
			}, this); 
			tmpmenuobjs.push(buttonx3); 
		}		
		
		if (toshowOnCXmenu[1]){  // EDIT
			buttonx2= new Ext.menu.Item({ 
					id:this.calx.id + '-listItem-mnuitem-Edit',iconCls:'x-calendar-sched-btnmv_edit',
					text: e2cs.cal_locale.contextMenuLabelsSchedule.taskEdit + ' ' + taskvalue + ' ' 
			});
			buttonx2.addListener('click', function(){ 
						var datatask = this.getTaskarray(dataobj); 						   
						var check = this.calx.fireEvent("beforeTaskEdit",datatask,this.vday);  
						if (check){ //0.0.15 updated to accept true value and continue
							if (this.calx.fireEvent("onTaskEdit",datatask)==true){ 
								this.calx.fireEvent("afterTaskEdit",datatask,true);
							} else { 
								this.calx.fireEvent("afterTaskEdit",null,false);
							}	
						}
			} , this); 
			tmpmenuobjs.push(buttonx2); 
		} 
		if ( (toshowOnCXmenu[0] || toshowOnCXmenu[1] || toshowOnCXmenu[2]) && newmenuitems.length>0) { 
			button_sep_one = new Ext.menu.Separator({}); 
			tmpmenuobjs.push(button_sep_one ); 	
		}
		//custom menu objects 
//		if (newmenuitems.length>0) { 
//			for (var i=0; i< newmenuitems.length; i++){
//				var idmenuitem = newmenuitems[i].id; 
//				newmenuitems[i].rendered =false; 
//				newmenuitems[i].addListener('click', 
//							function(parx){ 
//							   this.onCustomMenuAction(parx.id,Ext.get(elx)); 
//							}, this); 
//				tmpmenuobjs.push(newmenuitems[i]);//this.menu.add( this.listItems.moreMenuItems[i]);
//			}
//		}
		if (newmenuitems.length>0) { 
			//this.menu.add('-'); 
			for (var i=0; i<newmenuitems.length; i++){
				// var idmenuitem = newmenuitems[i].id;  0.0.4 bug in custom action sending the id the problem was the last id was returned always
				newmenuitems[i].rendered =false;
				// 0.0.14 modification to let the user set buttons with menu attached on the context menu 
				// Sepearators could be used also. Note: only one level its allowed
				if (newmenuitems[i].menu==undefined) {  //just plain button 
					if (newmenuitems[i].ctype=="Ext.menu.Item"){ 
						newmenuitems[i].addListener('click', 
									function(parx , parz){ 
											this.onCustomMenuAction( parx.id, Ext.get(elx) ); 
									}, this); 
					} else { 
						//Ext.menu.BaseItem // do nothing
					} 
					tmpmenuobjs.push( newmenuitems[i]);
				} else {	
					for (var xm=0;xm<newmenuitems[i].menu.items.length;xm++){
						newmenuitems[i].menu.items.items[xm].rendered=false;
						if (newmenuitems[i].menu.items.items[xm].ctype=="Ext.menu.Item"){ 
							newmenuitems[i].menu.items.items[xm].addListener('click', 
										function(parx,parz){ 
												this.onCustomMenuAction( parx.id, Ext.get(elx) ); 
										}, this);
						} else { 
							//Ext.menu.BaseItem  // do nothing 
						}
					}
					tmpmenuobjs.push(newmenuitems[i]);
				} 
			}
		} 		
		//-------------------------------------------------------------------	
		this.taskmenu_listItem = new Ext.menu.Menu({id: this.calx.id + '-contextmenu-listItem-taskdd-sel',shadow: true,items:[] });
		var countdataitems= tmpmenuobjs.length; 
		for (var i=0;i<countdataitems;i++){ 
			this.taskmenu_listItem.add(tmpmenuobjs[i]); 
		} 
		this.taskmenu_listItem.on('hide', this.onContextHide, this);
		this.taskmenu_listItem.showAt( [ evx.getPageX(), evx.getPageY() ]);		
	},
	onContextHide: function(){ /*do nothing  */	},	
	onCustomMenuAction: function(menuID,Elementx){
		if (Elementx.id.indexOf(this.calx.id + '-eventno-')+1>=1){ 
			var strtaskvalue = Elementx.id.replace(this.calx.id + '-eventno-',''); 
			var taskvalue = parseInt(strtaskvalue); 
			var dataobj   = this.getTaskarray(this.calx.store.getById(taskvalue).data); 
			this.calx.fireEvent("customMenuAction", menuID, 'scheduler', dataobj, Elementx, this); 
		}
		// section for list itemtask- taskDD
		if (Elementx.id.indexOf(this.calx.id + '-shced-taskdd-')+1>=1){ 
			var strtaskvalue = Elementx.id.replace(this.calx.id + '-shced-taskdd-',''); 
			var taskvalue = parseInt(strtaskvalue); 
			var dataobj   = this.getTaskarray(this.calx.store.getById(taskvalue).data); 
			this.calx.fireEvent("customMenuAction", menuID, 'scheduler', dataobj, Elementx, this); 
		} 
		this.taskmenu_listItem.hide(); 
	}, 
	onclick_myheadersvalues:function(evx,elx,obx){
		if ( elx.id.indexOf('hour-') + 1 >0){ // Hour Unit values - part 
			//myDatatoGen_temp+='id="hour-' + this.calx.id + '-tdsched_valcols-' + i + '-' + valueidtmp + '" ';
			var mydatetohandle = elx.id.replace('hour-' + this.calx.id + '-tdsched_valcols-',''); 
			mydatetohandle = mydatetohandle.substr(mydatetohandle.indexOf('-')+1);
			if (this.headerAction=='gotoview'){ 
				if (this.calx.viewday!=null || this.calx.viewday!=undefined){ // if the view is null or the calendar doesnt handle that view 
					if ( this.calx.fireEvent("beforeChangeView", 'day' , 'schedule', this.calx)==false ) { 
						return false; 
					} else { 
						this.calx.currentdate= new Date(mydatetohandle); 
						this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);
						this.calx.currentView='day'; 	 
						this.calx.viewday.render();
						this.calx.fireEvent("onChangeView", 'day', 'schedule', this);
					} 
				} 
			} else {  //launch event 
				mydatetohandledt = new Date(mydatetohandle); 
				if (this.headerAction=="event"){  this.fireEvent("headerClick","hour",mydatetohandledt,this,this.calx); }
			} 
		} 
		if ( elx.id.indexOf('days-') + 1 >0){ // Day Unit values - part 
			var mydatetohandle = elx.id.replace('days-' + this.calx.id + '-tdsched_valcols-',''); 
			if (this.headerAction=='gotoview'){ 
				if (this.calx.viewday!=null || this.calx.viewday!=undefined){ // if the view is null or the calendar doesnt handle that view 			
					if ( this.calx.fireEvent("beforeChangeView", 'day' , 'schedule', this.calx)==false ) { 
						return false; 
					} else { 
						this.calx.currentdate= new Date(mydatetohandle); 
						this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);
						this.calx.currentView='day'; 	 
						this.calx.viewday.render();
						this.calx.fireEvent("onChangeView", 'day', 'schedule', this);
					}
				} 
			} else {  //launch event 
				mydatetohandledt = new Date(mydatetohandle); 
				if (this.headerAction=="event"){  this.fireEvent("headerClick","day",mydatetohandledt ,this,this.calx); }
			} 
		}
		if (elx.id.indexOf('weeks-') + 1 >0){ // Week Unit values - part 
			//Get the WEEK num so the codes retreive the range and set the date on the first date of the range and changes to that week view 
			var myweektohandle = elx.id.replace('weeks-' + this.calx.id + '-tdsched_valcols-',''); 
			var myvaluesonweek = this.calx.getDateRangeOfWeek(myweektohandle); 
			if (this.headerAction=='gotoview'){ 
				if (this.calx.viewweek!=null || this.calx.viewweek!=undefined){ // if the view is null or the calendar doesnt handle that view 			
					if ( this.calx.fireEvent("beforeChangeView", 'week' , 'schedule', this.calx)==false ) { 
						return false; 	
					} else { 
						this.calx.currentdate= new Date(myvaluesonweek[0]); 
						this.calx.currentView='week'; 	 
						this.calx.viewweek.render(); 
						this.calx.fireEvent("onChangeView", 'week', 'schedule', this);
					} 
				} 
			} else { //launch event 
				if (this.headerAction=="event"){  this.fireEvent("headerClick","week",myvaluesonweek,this,this.calx); }
			} 
		} 
	},
	onclick_listItems: function(evx,elx,obx){
		var strtaskvalue = elx.id.replace(this.calx.id + '-eventno-',''); 
		var taskvalue = parseInt(strtaskvalue); 
		var dataobj   = this.calx.store.getById(taskvalue).data;
		//this.fireEvent("listItemSendData",taskvalue,dataobj); //0.0.14 removed / deprecated for consistency pourposes
		var datatask=this.getTaskarray(dataobj);
		this.calx.fireEvent("taskDblClick",datatask,this,this.calx,'schedule');	
	},
	onclick_taskItems: function(evx,elx,obx){
		var strtaskvalue = elx.id.replace(this.calx.id + '-shced-taskdd-',''); 
		var taskvalue = parseInt(strtaskvalue); 
		var dataobj   = this.calx.store.getById(taskvalue).data;
		//this.fireEvent("listItemSendData",taskvalue,dataobj); //0.0.14 removed / deprecated for consistency pourposes	
		var datatask=this.getTaskarray(dataobj);
		this.calx.fireEvent("taskDblClick",datatask,this,this.calx,'schedule');	
	},
	neweventlaunch: function(){
		refdate=new Date(this.calx.currentdate);
		this.calx.fireEvent("taskAdd", refdate);
	},
	changeCalview:function(typeview){
		if (typeview==0){ 	
			varview='month'; 
		} else if (typeview==1){	
			varview='week'; 
		} else { varview='day'; 
		} 
		this.calx.changeView(varview);
	},
	onclickprev_period: function (){	
		refdate=new Date(this.calx.currentdate);
		var testcase = this.listbody.periodType;
		if  (testcase<0 || testcase>4){ testcase=2; }  
		switch(testcase){
			case 0: //Day 
				var changedaydate = refdate.add(Date.DAY,-1); 
				var check = this.fireEvent("beforePeriodChange",0, refdate, changedaydate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	} 
					this.calx.currentdate = changedaydate; 		
					this.datetohandle = changedaydate; 
					this.render();	
					myMask.hide();
					this.fireEvent("afterPeriodChange",0,changedaydate);
				}			
				break;
			case 1: //Week (54)
				var strcurrentweek = refdate.format("W"); 
				var currentweek = parseInt(strcurrentweek)-1; 
				var myolddates = this.calx.getDateRangeOfWeek(parseInt(strcurrentweek));	
			    var mynewdates = this.calx.getDateRangeOfWeek(currentweek);	
				var check = this.fireEvent("beforePeriodChange", 1, myolddates, mynewdates); 		
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(mynewdates[0]);	}
					this.calx.currentdate = mynewdates[0]; 
					this.render();
					this.fireEvent("afterPeriodChange",1,mynewdates);
				} 
				break;
			case 2: //Month(12)
				var changemonthdate = refdate.add(Date.MONTH,-1);
				var check = this.fireEvent("beforePeriodChange", 2, refdate , changemonthdate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	}
					this.calx.currentdate = changemonthdate; 
					this.render();
					this.fireEvent("afterPeriodChange",2,changemonthdate);
				} 
				break;
			case 3: //Bi monthly  (6) same as month but -2 
				var changemonthdate = refdate.add(Date.MONTH,-2);
				var check = this.fireEvent("beforePeriodChange",3, refdate , changemonthdate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	}
					this.calx.currentdate = changemonthdate; 
					this.render();
					this.fireEvent("afterPeriodChange",3,changemonthdate);
				} 
				break;
			case 4: //Quarter	  (4) same as month but -3 
				var changemonthdate = refdate.add(Date.MONTH,-3);
				var check = this.fireEvent("beforePeriodChange",4, refdate , changemonthdate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	}
					this.calx.currentdate = changemonthdate; 
					this.render();
					this.fireEvent("afterPeriodChange",4,changemonthdate);
				} 
				break;	
		}
	},
	onclicknext_period: function (){	
		refdate=new Date(this.calx.currentdate);
		var testcase = this.listbody.periodType;
		if  (testcase<0 || testcase>4){ testcase=2; }  
		switch(testcase){
			case 0: //Day 
				var changedaydate = refdate.add(Date.DAY,+1); 
				var check = this.fireEvent("beforePeriodChange",0, refdate, changedaydate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	} 
					this.calx.currentdate = changedaydate; 		
					this.datetohandle = changedaydate; 
					this.render();			
					this.fireEvent("afterPeriodChange",0,changedaydate);
				}			
				break;
			case 1: //Week (54)
				var strcurrentweek = refdate.format("W"); 
				var currentweek = parseInt(strcurrentweek)+1; 
				var myolddates = this.calx.getDateRangeOfWeek(parseInt(strcurrentweek));	
			    var mynewdates = this.calx.getDateRangeOfWeek(currentweek);	
				var check = this.fireEvent("beforePeriodChange", 1, myolddates, mynewdates); 		
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(mynewdates[0]);	}
					this.calx.currentdate = mynewdates[0]; 
					this.render();
					this.fireEvent("afterPeriodChange",1,mynewdates);
				} 
				break;
			case 2: //Month(12)
				var changemonthdate = refdate.add(Date.MONTH,+1);
				var check = this.fireEvent("beforePeriodChange", 2, refdate , changemonthdate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	}
					this.calx.currentdate = changemonthdate; 
					this.render();
					this.fireEvent("afterPeriodChange",2,changemonthdate);
				} 
				break;
			case 3: //Bi monthly  (6) same as month but -2 
				var changemonthdate = refdate.add(Date.MONTH,+2);
				var check = this.fireEvent("beforePeriodChange",3, refdate , changemonthdate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	}
					this.calx.currentdate = changemonthdate; 
					this.render();
					this.fireEvent("afterPeriodChange",3,changemonthdate);
				} 
				break;
			case 4: //Quarter	  (4) same as month but -3 
				var changemonthdate = refdate.add(Date.MONTH,+3);
				var check = this.fireEvent("beforePeriodChange",4, refdate , changemonthdate); 
				if (check){ 
					if (this.dateSelector){ this.calx.selector_dateMenu.picker.setValue(this.calx.currentdate);	}
					this.calx.currentdate = changemonthdate; 
					this.render();
					this.fireEvent("afterPeriodChange",4,changemonthdate);
				} 
				break;	
		}	
	}, 
	// --------------------------------------------------------
	// Private use 
	// --------------------------------------------------------
	getDatesforWeek:function(Dateval){ 
		var dw = new Date(Dateval).getDay();
		dw = ((dw==0)?6:dw-1); // day of week, monday first
		var initdate = new Date(Dateval.add(Date.DAY, -dw).format('m/d/Y') + ' ' + this.listItems.periodFormats.startTime); // monday always
		var enddate  = new Date(Dateval.add(Date.DAY, -dw+6).format('m/d/Y') + ' ' + this.listItems.periodFormats.endTime);
		return [initdate,enddate];		
	},	
	getDatesforBimonth: function (DateVal){ 
		var dw = new Date(DateVal);
		var currentmonth = dw.getMonth(); 
		var bimestre = (Math.floor(currentmonth/2) + 1); 
		var nummonthInitbim =   (bimestre * 2)-1; 
		var nummonthEndbim = (bimestre * 2); 
		datestarts = new Date( nummonthInitbim  + "/01/" + dw.getUTCFullYear() + ' ' + this.listItems.periodFormats.startTime );
		tmpdate = new Date( nummonthEndbim  + "/01/" + dw.getUTCFullYear()  );
		tmplastday = tmpdate.getLastDateOfMonth(); 
		dateends   = new Date( nummonthEndbim   + "/" + tmplastday.getUTCDate() + "/" + dw.getUTCFullYear() + ' ' +  this.listItems.periodFormats.endTime );
		return [datestarts,dateends];
	},
	getDatesForQuarter: function(DateVal){
		var dw = new Date(DateVal);
		var currentmonth = dw.getMonth(); 
		var quarter = Math.floor(currentmonth / 3) + 1;
		var nummonthInitQ = (quarter * 3)-2; 
		var nummonthEndQ  = (quarter * 3); 
		datestarts = new Date( nummonthInitQ  + "/01/" + dw.getUTCFullYear() + ' ' + this.listItems.periodFormats.startTime );
		tmpdate = new Date( nummonthEndQ  + "/01/" + dw.getUTCFullYear() );
		tmplastday = tmpdate .getLastDateOfMonth(); 
		dateends   = new Date( nummonthEndQ   + "/" + tmplastday.getUTCDate() + "/" + dw.getUTCFullYear() + ' ' +  this.listItems.periodFormats.endTime ); // +  this.listItems.periodFormats.endTime  );
		return [datestarts,dateends];
	},
	getTaskarray: function(dataobj){  //custom re-arrange so on the events with datatask can match the format
		var datatask =[]; 
		datatask[0]=dataobj[this.calx.fieldsRefer.id]; //.recid; 
		datatask[1]=dataobj[this.calx.fieldsRefer.id]; //.recid;
		datatask[2]=dataobj[this.calx.fieldsRefer.subject]; //.subject; 
		datatask[3]=dataobj[this.calx.fieldsRefer.startdate]; //.startdate ; 
		datatask[4]=dataobj[this.calx.fieldsRefer.enddate]; //.enddate ;
		datatask[5]=dataobj[this.calx.fieldsRefer.description]; //.description ;
		datatask[6]=this.calx.store.indexOfId(dataobj[this.calx.fieldsRefer.id]);
		datatask[7]=dataobj[this.calx.fieldsRefer.location];
		datatask[8]=dataobj[this.calx.fieldsRefer.alldaytask];
		datatask[9]=dataobj[this.calx.fieldsRefer.isHoliday];
		return 	datatask; 	
	},	
	//---------------------------------------------------------
	getHeaderLabel: function(){ 
		var datexreturn=''; 
		var testcase = this.listbody.periodType;
		if  (testcase<0 || testcase>4){ testcase=2; }  
		var dt= new Date(this.calx.currentdate); 
		switch(testcase){
			case 0: //Day 		  (365) 
				datexreturn = dt.format(this.listItems.periodFormats.Day);
				break;
			case 1: //Week 		  (54)
				var numWeek   = dt.format(this.listItems.periodFormats.WeekFormat);
				var rangedate = this.getDatesforWeek(dt);
				var datatoApply = { 
					numweek: numWeek,
					datestart: rangedate[0].format(this.listItems.periodFormats.DatesFormat),
					dateend:   rangedate[1].format(this.listItems.periodFormats.DatesFormat)
				};
				var mytpldates = new Ext.XTemplate(this.listItems.periodFormats.WeekTPL); 
				datexreturn = mytpldates.apply(datatoApply);
				break;
			case 2: //Month  	  (12)
				datexreturn = dt.format(this.listItems.periodFormats.Month);
				break;
			case 3: //Bi monthly  (6)
				var dw = new Date(dt); 	
				var currentmonth = dw.getMonth(); 
				var bimestre = (Math.floor(currentmonth/2) + 1); 				
				var rangedate  = this.getDatesforBimonth(dt);
				var datatoApply = { 
					numperiod: bimestre,
					datestart: rangedate[0].format(this.listItems.periodFormats.DatesFormat),
					dateend:   rangedate[1].format(this.listItems.periodFormats.DatesFormat)
				};
				var mytpldates = new Ext.XTemplate(this.listItems.periodFormats.TwoMonthsTPL); 
				datexreturn = mytpldates.apply(datatoApply);
				break;
			case 4: //Quarter	  (4)
				var dw = new Date(dt); 
				var currentmonth = dw.getMonth(); 
				var quarter = Math.floor(currentmonth / 3) + 1;
				var rangedate  = this.getDatesForQuarter(dt);
				var datatoApply = { 
					numperiod: quarter,
					datestart: rangedate[0].format(this.listItems.periodFormats.DatesFormat),
					dateend:   rangedate[1].format(this.listItems.periodFormats.DatesFormat)
				};
				var mytpldates = new Ext.XTemplate(this.listItems.periodFormats.QuarterTPL); 
				datexreturn = mytpldates.apply(datatoApply);
				break;
		} 
		return  datexreturn; 
	},
	createTasksDD: function(TasksIndexes,DDContainer){
		var dt = new Date(this.calx.currentdate);	
		var cuenta = TasksIndexes.length; 	
		var pos=[]; 
		for (var i= 0; i<cuenta; i++){  
					if (this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.color]){ 
						colortask = this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.color]; 	
					} else { 
						colortask = this.listItems.taskdd_BaseColor; 
					}
					// First create create the element inside the container, next we will set the properties 
					var labeltaskdd = ''; 
					if (this.listItems.taskdd_shownames ){ 
						labeltaskdd = this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.subject];  			
					} else { 
						labeltaskdd = '&nbsp;'
					} 
					var mydiv_elementHTML = '<div id="' + this.calx.id + '-shced-taskdd-' + this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.id] ; 
						mydiv_elementHTML+= '" class="sched_taskdd_base" style="background-color:' + colortask;
						if (Ext.isIE){
							mydiv_elementHTML+= ';height:21px;'; 	
						} 
						mydiv_elementHTML+= '">'; 
						mydiv_elementHTML+= labeltaskdd; 
						mydiv_elementHTML+= '</div>'; 
					var mynewElement = DDContainer.insertHtml('beforeEnd',mydiv_elementHTML,true); 
					if (this.listItems.taskdd_showqtip){
							var tmpdate = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.startdate]);	
							var startlabel = tmpdate.format(this.listItems.periodFormats.DatesFormat + ' ' + this.listItems.periodFormats.hourFormat); 
								tmpdate = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.enddate]) ;
							var endlabel   = tmpdate.format(this.listItems.periodFormats.DatesFormat + ' ' + this.listItems.periodFormats.hourFormat); 
							mynewElement.dom.qtitle= this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.subject];
							
							
							if (this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.description]==''){ 
								var desctmp = '&nbsp;<br/>&nbsp;'; 	
							}  else {
								var desctmp = this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.description];  
							} 
							if (desctmp.length>this.calx.tipmaxLength){ 
								var desctmpx = desctmp.substring(0,this.calx.tipmaxLength) + '...'; 
							} else { 
								var desctmpx = desctmp;
							} 
							var datatip = {starxl:   e2cs.cal_locale.task_qtip_starts,
										   startval: startlabel,
										   endxl:    e2cs.cal_locale.task_qtip_ends, 
										   endval:   endlabel,
										   details:  desctmpx,
										   location: this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.location]
										   };
							mynewElement.dom.qtip =  this.calx.tplTaskTip.apply(datatip);
					}
					// calc the position of each the DIV element
					//  --------------------------------------------------------------------------------------------------
					switch (this.listbody.headerUnit){ 
						case 0: // Hours
							var refdt_ini   = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.startdate]);
							var refstr_ini  = dt.format('m/d/Y') + ' ' + this.listItems.periodFormats.startTime; // date to handle with the starting hour fo display
							var dt_ini 		= new Date(refstr_ini); 
							if (refdt_ini<=dt_ini){ 
								pos[0]=0; 
							} else {  
									mydiff_a = this.calx.dateDiff(dt_ini,refdt_ini,e2cs.dateParts.MINUTE); 
									if (mydiff_a <=0 ){ 
										pos[0]=0;
									} else { 
										pos[0] = ((this.listbody.headerUnitWidth * mydiff_a) / 60);
									}
							}
							var refdt_end   = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.enddate]);
							var refstr_end  = dt.format('m/d/Y') + ' ' + this.listItems.periodFormats.endTime;
							var dt_end 		= new Date(refstr_end); 
							if (refdt_end>=dt_end){ 
								pos[1]=(DDContainer.getWidth(false) - pos[0]); 
							} else {
									mydiff_b = this.calx.dateDiff(refdt_ini,refdt_end,e2cs.dateParts.MINUTE); 
									mydiff_allday = this.calx.dateDiff(dt_ini,dt_end,e2cs.dateParts.MINUTE); 
									if (mydiff_b >= mydiff_allday){
										pos[1]=(DDContainer.getWidth(false) - pos[0]); 
									} else { 
										pos[1] = ((this.listbody.headerUnitWidth * mydiff_b) / 60);
									} 
							} 
							// position calcs ends 
							break; 
						case 1: // Days 
							//get the range of dates to set a init point and end point 
							if (this.listbody.periodType==1){ //week 
								var rangedates = this.getDatesforWeek(dt); 
							} else if (this.listbody.periodType==2){ //Month 
								var firstday   =  new Date(dt.format('m') +  "/01/"  + dt.format('Y') + ' ' + this.listItems.periodFormats.startTime ) ;
								var lastday    =  dt.getLastDateOfMonth();
								var lastdaydt  =  new Date(lastday.format('m/d/') + dt.format('Y') + ' ' + this.listItems.periodFormats.endTime ) ;
								var rangedates = [firstday,lastdaydt]; 					
							} else if (this.listbody.periodType==3){ //BI-Month 
								var rangedates = this.getDatesforBimonth(dt);
							} else if (this.listbody.periodType==4){ //Quarter 
								var rangedates = this.getDatesForQuarter(dt);
							}
							var refdt_ini = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.startdate]);
							mydiff_a = this.calx.dateDiff(rangedates[0],refdt_ini,e2cs.dateParts.DAY); 
							if (mydiff_a <=0){ 
								pos[0]=0;
							} else { 
								if (parseInt(refdt_ini.format('j'))== mydiff_a) { 
									pos[0] = ((this.listbody.headerUnitWidth * (mydiff_a +1) ));
								} else { 
									if (rangedates[0].add(Date.HOUR,(i)).format("m/d/Y") ==  refdt_ini.format("m/d/Y") ){ 
										pos[0] = ((this.listbody.headerUnitWidth * mydiff_a +1));
									} else { 
										pos[0] = ((this.listbody.headerUnitWidth * (mydiff_a) ));
									} 
								} 
							} 
							var refdt_end   = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.enddate]);
							mydiff_b = this.calx.dateDiff(refdt_ini,refdt_end,e2cs.dateParts.DAY);	// cause its cero based  
							mydiff_c = this.calx.dateDiff(rangedates[0],refdt_end,e2cs.dateParts.DAY); // cause its cero based  	
							mydiff_allperiod = this.calx.dateDiff(rangedates[1],refdt_end,e2cs.dateParts.DAY); 
							if (mydiff_allperiod>=0){ 
								pos[1]=(DDContainer.getWidth(false) - pos[0]); 
							} else { 
								if (mydiff_a<0 ){ 
									if ((this.listbody.headerUnitWidth * mydiff_c)  > DDContainer.getWidth(false) ) { 
										pos[1]=	 DDContainer.getWidth(false); 
									} else { 
										if (parseInt(refdt_end.format('j'))== mydiff_c){ 
											pos[1] = ((this.listbody.headerUnitWidth * mydiff_c ));									
										} else { 
											pos[1] = this.listbody.headerUnitWidth * (mydiff_c + 1);									
										} 
									}
								} else { 
									var mydiff_touse=0; 
									if (mydiff_b==0){ 
										mydiff_touse=mydiff_b + 1; 
									}  else  { 
										if  (refdt_ini.format('m/d') == refdt_end.format('m/d')) { 
											mydiff_touse = 1; 
										} else { 
											if (mydiff_b>0){ 
												mydiff_touse= mydiff_b + 1;
											} 
										} 
									} 
									pos[1] = ((this.listbody.headerUnitWidth * mydiff_touse));
								} 
							} 						
							break;
						case 2: //weeks
							//get the range of dates to set a init point and end point 
							if (this.listbody.periodType==2){ //Month 
								var firstday   =  new Date(dt.format('m') +  "/01/"  + dt.format('Y') + ' ' + this.listItems.periodFormats.startTime ) ;
								var lastday    =  dt.getLastDateOfMonth();
								var lastdaydt  =  new Date(lastday.format('m/d/') + dt.format('Y') + ' ' + this.listItems.periodFormats.endTime ) ;
								var rangedates = [firstday,lastdaydt]; 					
							} else if (this.listbody.periodType==3){ //BI-Month 
								var rangedates = this.getDatesforBimonth(dt);
							} else if (this.listbody.periodType==4){ //Quarter 
								var rangedates = this.getDatesForQuarter(dt);
							}
							var weekinit = parseInt(rangedates[0].format('W')); 
							var weekend  = parseInt(rangedates[1].format('W')); 
							//have to match Indeed 
							if (weekend != (this.lastweekofPeriod_tmp)) { 
								weekend  = this.lastweekofPeriod_tmp; 
							} 
							var refdt_ini = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.startdate]);
							var refweek_ini = parseInt(refdt_ini.format('W')); 
							if  (refweek_ini<weekinit){ 
								pos[0]=0;
							} else {
								var testcalc =(refweek_ini-weekinit); 
								pos[0]= (this.listbody.headerUnitWidth * testcalc);
							} 		
							var refdt_end   = new Date(this.calx.store.getAt(TasksIndexes[i]).data[this.calx.fieldsRefer.enddate]); //end date
							var refweek_end = parseInt(refdt_end.format('W')); 
							if  (refweek_ini== refweek_end){
								pos[1] = this.listbody.headerUnitWidth; 
							} else if (refweek_end>weekend){
								pos[1]=DDContainer.getWidth(false); 								
							} else { 
								pos[1]= this.listbody.headerUnitWidth * (  	(refweek_end - refweek_ini) + 1) ; 
							} 
							break;
					}
					if (Ext.isGecko3 || Ext.isSafari || Ext.isIE ){ pos[0]+=-1; } //0.0.12 FIX for FF3  and chrome 
					mynewElement.setX( Ext.get(this.calx.id + '-taskdd-container').getLeft() + pos[0]   ); 					
					if (Ext.isIE){ 
						mynewElement.setWidth(pos[1] + 1); //mynewElement.setStyle('width',(pos[1] + 1) + 'px');  //cause of the border-left on the style 					
					} else { 
						mynewElement.setStyle('width',(pos[1] -1) + 'px');  //cause of the border-left on the style 
					} 
					if (this.listItems.taskdd_clsOver!=''){ // set overcls if apply 
						mynewElement.addClassOnOver( this.listItems.taskdd_clsOver ); 
					} 
					if (this.listItems.launchEventOn!=''){ // set launchevent if apply 
						mynewElement.addListener(this.listItems.launchEventOn, this.onclick_taskItems, this);
					} 
					// set the handlers for event and also the context menu :)
					if (this.listItems.editableEvents){ // Menu Config Listener the List items Here 
						if (Ext.isOpera){ 
							mynewElement.addListener('mousedown',this.operabuttons_for_taskdd,this); 
						} else { 
							mynewElement.addListener('contextmenu',this.oncontextmenu_for_taskdd, 
								this,{
								   stopPropagation:true,
								   normalized :true,
								   preventDefault:true
							});
						} 
					}					
					// set DD does not apply  for the moment (future versions maybe, we are still evaluating )
					// this need cause mainly we create scheduler for User for reference if the task should be reacomodated then 
					// edit task / event and redraw view  :)
		} 
	}, 
	genSchedbodyHeader: function () {	
		var myDatatoGen_temp=''; 
		if (Ext.isSafari){ myDatatoGen = ''; } else { myDatatoGen = '<div id="' + this.calx.id + '-container-tablehdr-sched-bdy-submain">'; } 
		// to fix Width later 
		myDatatoGen+= '<table id="' + this.calx.id + '-table-hdr-sched-body" width="{TABLEXXW1}" border="0" cellpadding="0" cellspacing="0"><tr>'; 
	    myDatatoGen+= '<td width="' + this.listItems.descriptionWidth + '" valign="top">'; 
		if (Ext.isIE6 || Ext.isIE7){  //  apply to IE all version  0.0.12 
			myDatatoGen+= '<div class="scheduler_header_eventslist_IE" style="width:' + this.listItems.descriptionWidth + ';"><div class="sched_tab2_IE">' +  this.listItems.headerTitle + '</div></div></td>';			
		} else { 
			myDatatoGen+= '<div class="scheduler_header_eventslist" style="width:' + this.listItems.descriptionWidth + ';"><div class="sched_tab2"><div class="sched_tab1">' +  this.listItems.headerTitle + '</div></div></div></td>';
		}
		myDatatoGen+= '<td width="{TDXXVAL2}">'; // TO fix Later  
		if (Ext.isSafari){ // Fix for Google chrome and safari  ( mmm Quite ODD :(  ) 
			myDatatoGen+= '<div id="' + this.calx.id + '-container_header_sched_base" style="width:{TDXXVAL2}px; overflow:hidden; overflow-x:hidden; overflow-y:auto;">'; 	
		} else if (Ext.isGecko3){ 
			myDatatoGen+= '<div id="' + this.calx.id + '-container_header_sched_base" style="width:{TDXXVAL2}px; overflow:hidden;">'; 	
		} else { 
			myDatatoGen+= '<div id="' + this.calx.id + '-container_header_sched_base" style="width:100%; overflow:hidden;">'; 
		} 
			myDatatoGen+= '<div id="' + this.calx.id + '-subcontainer_sched_headers" style="width:{TDXXVAL3}px;">'; 
				myDatatoGen+='<table id="' + this.calx.id + '-table-hdr-sched-units' + '" width="{TDXXVAL3}" border="0" cellspacing="0" cellpadding="0">'; 

				if (Ext.isIE){
					myDatatoGen+='<tr id="' + this.calx.id + '-scheduler_row_headers"  class="sched_dayheader_base" style="height:20px;">'; 
				} else { 
					myDatatoGen+='<tr id="' + this.calx.id + '-scheduler_row_headers"  class="sched_dayheader_base">'; 
				} 
				if (this.listbody.headerUnit<0 ||this.listbody.headerUnit>2  ){ this.listbody.headerUnit=1;} 
				switch (this.listbody.headerUnit){ 
					case 0: // Hours 
						if (this.listbody.headerUnitWidth<70 ){	this.listbody.headerUnitWidth=70; } /*small fix for the correct width on Hor display if needed */
						myDatatoGen_temp=''; 
						var dt= new Date(this.calx.currentdate);
						var inittime = new Date(dt.format('m/d/Y') + ' ' + this.listItems.periodFormats.startTime); 
						var endtime  = new Date(dt.format('m/d/Y') + ' ' + this.listItems.periodFormats.endTime); 	
						this.diffhrs  = this.calx.dateDiff(inittime,endtime,e2cs.dateParts.HOUR); 
						for (var  i=0; i<=this.diffhrs; i++){ 
							var valuedatetmp=inittime.add(Date.HOUR,(i)).format(this.listItems.periodFormats.DatesFormat);
							var valueidtmp  =inittime.add(Date.HOUR,(i)).format('m/d/Y h:i:s');
							myDatatoGen_temp+='<td width="' + this.listbody.headerUnitWidth + '" class="tdshx">'; 
							if (Ext.isIE){ 
								myDatatoGen_temp+='<div class="sched_hdrbody_vals_IE" ';
							} else { 
								myDatatoGen_temp+='<div class="sched_hdrbody_vals" ';
							} 
							myDatatoGen_temp+='id="hour-' + this.calx.id + '-tdsched_valcols-' + i + '-' + valueidtmp + '" ';
							myDatatoGen_temp+='ext:qtitle="' + inittime.add(Date.HOUR,(i)).format(this.listItems.periodFormats.hourFormat); 
							myDatatoGen_temp+='" ext:qtip="' + inittime.add(Date.HOUR,(i)).format(this.listItems.periodFormats.DatesFormat) + '"'; 
							myDatatoGen_temp+='>' +  inittime.add(Date.HOUR,(i)).format( this.listItems.periodFormats.hourFormat) + '</div></td>'; 
						} 
						this.numelements= i; 
						break; 
					case 1: // Days 
						var dt= new Date(this.calx.currentdate); 
						if (this.listbody.periodType==1){ //week 
							var rangedates = this.getDatesforWeek(dt); 
						} else if (this.listbody.periodType==2){ //Month 
							var firstday   =  new Date(dt.format('m') +  "/01/"  + dt.format('Y') ) ;
							var lastday    =  dt.getLastDateOfMonth();
							var rangedates = [firstday,lastday]; 					
						} else if (this.listbody.periodType==3){ //BI-Month 
							var rangedates = this.getDatesforBimonth(dt);
						} else if (this.listbody.periodType==4){ //Quarter 
							var rangedates = this.getDatesForQuarter(dt);
						} else { // The same as AS month 
							var firstday   =  new Date(dt.format('m') +  "/01/"  + dt.format('Y') ) ;
							var lastday    =  new dt.getLastDateOfMonth();
							var rangedates = [firstday,lastday]; 
						} 
						var diffdays  =  this.calx.dateDiff(rangedates[0],rangedates[1],e2cs.dateParts.DAY); 
						inittime = rangedates[0]; 
						if (this.listbody.periodType==1){ diffdays+=0; } //week
						if (this.listbody.periodType==2){ diffdays+=1; } //week
						myDatatoGen_temp='';
						for (var i=0; i<diffdays; i++){ 
								var valuetodisp =inittime.add(Date.DAY,(i)).format( this.listItems.periodFormats.DayScheduler_format);  
								var valuedatetmp=inittime.add(Date.DAY,(i)).format(this.listItems.periodFormats.DatesFormat);
								var valueidtmp=inittime.add(Date.DAY,(i)).format('m/d/Y');
								myDatatoGen_temp+='<td width="' + this.listbody.headerUnitWidth + '" class="tdshx">'; 
								myDatatoGen_temp+='<div class="sched_hdrbody_vals" ';
								myDatatoGen_temp+='id="days-' + this.calx.id + '-tdsched_valcols-' + valueidtmp + '" ';
								myDatatoGen_temp+='ext:qtitle="' + e2cs.cal_locale.scheduler_headerListStrings.Day + " " + valuetodisp; 
								myDatatoGen_temp+='" ext:qtip="' + valuedatetmp + '"'; 
								myDatatoGen_temp+='>' +  valuetodisp + '</div></td>'; 
						} 
						this.numelements=i; 
						break; 
					case 2: // Weeks Only apply  BI month and Quarters 	
						var dt= new Date(this.calx.currentdate); 
						if (this.listbody.periodType==3){ //BI-Month 
							var rangedates = this.getDatesforBimonth(dt);
						} else if (this.listbody.periodType==4){ //Quarter 
							var rangedates = this.getDatesForQuarter(dt);
						} 
						diffweeks = this.calx.dateDiff(rangedates[0],rangedates[1],e2cs.dateParts.WEEK); 
						initWeek = rangedates[0].format('W'); 
						numinitWeek= parseInt(initWeek); 
						Totalweekstoloop = ( numinitWeek + diffweeks);  
						if (this.listbody.periodType==3){ //bi month 
							Totalweekstoloop=Totalweekstoloop+2; 
						} else { //quarter
							Totalweekstoloop=Totalweekstoloop+1; 
						} 
						myDatatoGen_temp=''; 	
						for (var i=numinitWeek;i<Totalweekstoloop; i++){ 						
								var mycustomrangeonweek = this.calx.getDateRangeOfWeek(i);
								var valuetodisp  = i;  
								//var valordatetmp =  inittime.add(Date.DAY,(i)).format(this.listItems.periodFormats.DatesFormat); 
								myDatatoGen_temp+='<td width="' + this.listbody.headerUnitWidth + '" class="tdshx">'; 
								myDatatoGen_temp+='<div id="weeks-' + this.calx.id + '-tdsched_valcols-' + valuetodisp + '" class="sched_hdrbody_vals" style="width:' + this.listbody.headerUnitWidth + 'px;" ';
								myDatatoGen_temp+='ext:qtitle="' + e2cs.cal_locale.scheduler_headerListStrings.week + " " + valuetodisp; 
								myDatatoGen_temp+='" ext:qtip="' + e2cs.cal_locale.scheduler_headerListStrings.week + " " + valuetodisp;
								myDatatoGen_temp+=' ' + e2cs.cal_locale.scheduler_period_from_to.starts + ' ' + mycustomrangeonweek[0].format(this.listItems.periodFormats.DatesFormat); 
								myDatatoGen_temp+=' ' + e2cs.cal_locale.scheduler_period_from_to.ends   + ' ' + mycustomrangeonweek[1].format(this.listItems.periodFormats.DatesFormat); 
								myDatatoGen_temp+='"'; 
								myDatatoGen_temp+='>' +  valuetodisp + '</div></td>'; 
								this.lastweekofPeriod_tmp = valuetodisp; // internal use , do not touch this property 
						} 
						if (this.listbody.periodType==3){ //bi month 
							this.numelements=diffweeks+2; 
						} else { //quarter
							this.numelements=diffweeks+1; 
						} 
						break; 
				} 
		myDatatoGen+=myDatatoGen_temp; 
		myDatatoGen+='</tr></table></div></div></td></tr></table>'; 
		if (Ext.isSafari){ 	} else { myDatatoGen+='</div>'; } 
		return myDatatoGen; 
	},
	genShedContentList: function(Task_indexes) { 
		var mydatareturn = '';
		mydatareturn+= '<div id="' + this.calx.id + '-body-sched-container-list" class="sched_container_body">'; 
	    	mydatareturn+= '<div id="' + this.calx.id + 'body-sched-insider" class="sched_container_insider">'; 
				mydatareturn+= '<table id="' + this.calx.id + '-skeleton_sched" width="{ANCHO1TOTAL}" border="0" cellspacing="0" cellpadding="0">';
				var cuenta = Task_indexes.length; 
				for (var i= 0; i< cuenta; i++){ 
					var bguseit = ''; //"background-color:"; 
					if (this.listItems.useStoreColor){ 
						bguseit= 'style="background-color:' +  this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.color] + ';"'; 
					} else { 
						bguseit= ''; 
					} 
					mydatareturn+= '<tr id="'  + this.calx.id + '-tr-list-event-' +  this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.id] + '">'; 
					if (this.listItems.parentLists){ 
						if (this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.parent]){//si tiene pariente hay q checar q esten en orden para desplegado //
							mydatareturn+= '<td width="{ANCHOREFLIST}" class="sched_listItem sched_childItem"><div id="' + this.calx.id  + '-eventno-' +  this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.id] + '" class="sched_lisItem_div" ' + bguseit + '>' + this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.subject] + '</div></td>'; 
						} else { 
							mydatareturn+= '<td width="{ANCHOREFLIST}" class="sched_listItem sched_parentItem"><div id="' + this.calx.id + '-eventno-' +  this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.id] + '" class="sched_lisItem_div"' + bguseit + '>' + this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.subject] + '</div></td>'; 
						}
					} else {
						mydatareturn+= '<td width="{ANCHOREFLIST}" class="sched_listItem sched_parentItem"><div id="' + this.calx.id + '-eventno-' +  this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.id] + '" class="sched_lisItem_div"' + bguseit + '>' + this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.subject] + '</div></td>'; 
					} 
					mydatareturn+= '<td>'; 
						mydatareturn+= '<table width="{anchocolgrids}" border="0" cellspacing="0" cellpadding="0"><tr><td>'; 
						mydatareturn+= '<div id="' + this.calx.id + '-container_sched_rec-' +  this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.id] +'" style="width:100%;">';
							mydatareturn+='<div id="' + this.calx.id + '-subcontainer_sched_rec-' + this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.id] + '" style="width:{anchocolgrids}px;">'; 
								mydatareturn+='<table width="{anchocolgrids}" border="0" cellspacing="0" cellpadding="0">'; 
                      			mydatareturn+='<tr id="' + this.calx.id + '-scheduler_row_grid-' + this.calx.store.getAt(Task_indexes[i]).data[this.calx.fieldsRefer.id] + '" class="sched_linetask' + this.listbody.headerUnitWidth + '">'; 
								var cuentaelements = this.numelements; 
								if (this.listbody.headerUnit==2){ 
									if (this.listbody.periodType==3){ //bi month 
										cuentaelements+=2;
									} else { //quarter
										cuentaelements+=1;
									} 	
								} 
                        		for (var colsJ=0; colsJ<cuentaelements; colsJ++){ 
									mydatareturn+= '<td width="' + this.listbody.headerUnitWidth + '" class="tdshx_grid"><div style="height:20px;">&nbsp;</div></td>'; 
								} 
								mydatareturn+='</tr></table>'; 
							mydatareturn+='</div>';
						mydatareturn+='</div>';
						mydatareturn+='</td></tr></table>';
					mydatareturn+='</td>'; 
		            mydatareturn+='</tr>'; 
				} 
        		mydatareturn+='</table>';
				mydatareturn+='<div id="' + this.calx.id + '-taskdd-container" style="left:{ANCHOREFLIST}px; top:-{TOPcontenedorTASKS}px;width:{anchocolgrids}px;height:{TOPcontenedorTASKS}px;position:relative;float:inherit;clear:both;overflow:hidden;">'; 	
                mydatareturn+='{TASKSTODISPLAY}'; 
				mydatareturn+='</div>';
		    mydatareturn+='</div>';
		 mydatareturn+='</div>';
		 return mydatareturn; 
	},
	genShedNoContentScreen: function(){
		var mydatareturn = ""; 
		mydatareturn+='<div id="' + this.calx.id + '-body-sched-no-task-screen' + '">';
		if (this.blankHTML!=''){
			var dataidelement={ 
				calx:this.calx.id,
				sched_addevent_id:this.calx.id + '_addevent_element_screen'
			};
			var nocontentTPL = new Ext.XTemplate('<tpl for=".">' + this.blankHTML + '</tpl>'); 
			mydatareturn+= nocontentTPL.applyTemplate(dataidelement); 
		} else { 
			mydatareturn+=e2cs.cal_locale.scheduler_noeventsonview; 
		} 
		mydatareturn+='</div>'; 		
		return mydatareturn; 
	},
	getTasksforPeriod: function (){
		var datexreturn=''; 	
		var testcase = this.listbody.periodType	;	
		var dt= new Date(this.calx.currentdate); 
		var tasks=[];  
		switch(testcase){
			case 0: //Day(365 days on the year) OK 
				datexreturn = dt.format(this.listItems.periodFormats.Day);
				var inittime = new Date(dt.format('m/d/Y') + ' ' + this.listItems.periodFormats.startTime); 
				var endtime  = new Date(dt.format('m/d/Y') + ' ' + this.listItems.periodFormats.endTime); 
				//Get the indexes on the store and saves them in var IndexTasks
				var tasks=[]; var countdone=0;  counttasks = this.calx.store.getCount(); 
				for (var i=0; i<counttasks; i++){ 
					var testrec 	= this.calx.store.getAt(i).data; 
					testdateinit 	= this.calx.store.getAt(i).data[this.calx.fieldsRefer.startdate];  
					testdateend 	= this.calx.store.getAt(i).data[this.calx.fieldsRefer.enddate]; 
					checkdates 		= this.datetohandle.between( new Date(testdateinit), new Date(testdateend) ); 
					chkformat 		= this.datetohandle.format('m/d/Y'); 
					test 			= new Date(testdateinit); 	
					if (test.format('m/d/Y')==chkformat){  checkdates =true; } 
					test 			= new Date(testdateend); 	
					if (test.format('m/d/Y')==chkformat){  checkdates =true; } 			
					if (checkdates){ 
						tasks[countdone]=i; 
						countdone+=1; 
					} 
				}
				break;
			case 1: //Week(54)
				var rangedate = this.getDatesforWeek(dt);
				firstdayofweek = rangedate[0];
				lastdayofweek  = rangedate[1];
				var tasks=[]; 
				var countdone=0;  
				counttasks = this.calx.store.getCount(); 
				for (var i=0; i<counttasks; i++){ 
					dateinit = new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.startdate]);  
					dateend =  new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.enddate]); 
					checkdates_a = dateinit.between(firstdayofweek, lastdayofweek );
					checkdates_b = dateend.between(firstdayofweek, lastdayofweek );
					if (dateinit.format('W')==firstdayofweek.format('W') || dateinit.format('W')==lastdayofweek.format('W')) { checkdates_a=true; } 
					if (dateend.format('W') ==firstdayofweek.format('W') || dateend.format('W') ==lastdayofweek.format('W'))  { checkdates_b=true; } 
					if (dateinit<firstdayofweek && dateend>lastdayofweek){  checkdates_a=true; checkdates_b=true; } 
					if (checkdates_a || checkdates_b){ 
						tasks[countdone]=i; 
						countdone+=1; 
					} 
				}
				break;
			case 2: //Month (12) - OK 
				firstdayofmonth = new Date( dt.format('m') + '/01/' + dt.format('Y') ); 
				lastdaytmp = dt.getLastDateOfMonth();
				lastdayofmonth  = new Date( dt.format('m') + '/' + lastdaytmp.format('d') + '/' + dt.format('Y') ); 
				var tasks=[]; 
				var countdone=0;  
				counttasks = this.calx.store.getCount(); 
				for (var i=0; i<counttasks; i++){ 
					dateinit = new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.startdate]);  
					dateend =  new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.enddate]); 
					checkdates_a = dateinit.between(firstdayofmonth, lastdayofmonth );
					checkdates_b = dateend.between(firstdayofmonth, lastdayofmonth );
					if (  dateinit.format('m')==firstdayofmonth.format('m') || dateinit.format('m')==lastdayofmonth.format('m')  ) { checkdates_a=true; } 
					if (  dateend.format('m')==firstdayofmonth.format('m')  || dateend.format('m')==lastdayofmonth.format('m')  )  { checkdates_b=true; } 					
					var tmpmonthini =  dateinit.getMonth() + 1;
					var tmpmonthend =  dateend.getMonth() + 1 ;
					var currmonth   =  dt.getMonth() + 1 ;
					if  (tmpmonthini<currmonth && tmpmonthend>currmonth){ checkdates_a=true; checkdates_b=true; } 
					if  (dateinit<firstdayofmonth && dateend>lastdayofmonth){  checkdates_a=true; checkdates_b=true; } 
					if (checkdates_a || checkdates_b){ 
						tasks[countdone]=i; 
						countdone+=1; 
					} 
				}
				break;
			case 3: //Bi monthly  (6)
				var dw = new Date(dt); 	
				var currentmonth = dw.getMonth(); 
				var bimestre = (Math.floor(currentmonth/2) + 1); 				
				var rangedate  = this.getDatesforBimonth(dt);
				firstdayofbim = rangedate[0]; 
				lastdayofbim  = rangedate[1]; 
				var tasks=[]; 
				var countdone=0;  
				counttasks = this.calx.store.getCount(); 
				for (var i=0; i<counttasks; i++){ 
					dateinit = new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.startdate]);  
					dateend =  new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.enddate]); 
					checkdates_a = dateinit.between(firstdayofbim, lastdayofbim );
					checkdates_b = dateend.between(firstdayofbim, lastdayofbim );
					if (  dateinit.format('m')==firstdayofbim.format('m') || dateinit.format('m')==lastdayofbim.format('m')  ) { checkdates_a=true; } 
					if (  dateend.format('m')==firstdayofbim.format('m')  || dateend.format('m')==lastdayofbim.format('m')   ) { checkdates_b=true; } 					
					var tmpmonthini =  dateinit.getMonth() + 1;
					var tmpmonthend =  dateend.getMonth() + 1 ;
					var currmonth   =  dt.getMonth() + 1 ;
					if  (tmpmonthini<currmonth && tmpmonthend>currmonth){ checkdates_a=true; checkdates_b=true; } 
					if  (dateinit<firstdayofbim && dateend>lastdayofbim){  checkdates_a=true; checkdates_b=true; } 
					if (checkdates_a || checkdates_b){ 
						tasks[countdone]=i; 
						countdone+=1; 
					} 
				}
				break;
			case 4: //Quarter	  (4)
				var dw = new Date(dt); 
				var currentmonth = dw.getMonth(); 
				var quarter = Math.floor(currentmonth / 3) + 1;
				var rangedate  = this.getDatesForQuarter(dt);
				firstdayofqua = rangedate[0]; 
				lastdayofqua  = rangedate[1]; 
				var tasks=[]; 
				var countdone=0;  
				counttasks = this.calx.store.getCount(); 
				for (var i=0; i<counttasks; i++){ 
					dateinit = new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.startdate]);  
					dateend =  new Date(this.calx.store.getAt(i).data[this.calx.fieldsRefer.enddate]); 
					checkdates_a = dateinit.between(firstdayofqua, lastdayofqua);
					checkdates_b = dateend.between(firstdayofqua, lastdayofqua);
					if (  dateinit.format('m')==firstdayofqua.format('m') || dateinit.format('m')==firstdayofqua.format('m')  ) { checkdates_a=true; } 
					if (  dateend.format('m')==lastdayofqua.format('m')   || dateend.format('m')==lastdayofqua.format('m')    ) { checkdates_b=true; } 					
					var tmpmonthini =  dateinit.getMonth() + 1;
					var tmpmonthend =  dateend.getMonth() + 1 ;
					var currmonth   =  dt.getMonth() + 1 ;
					if  (tmpmonthini<currmonth && tmpmonthend>currmonth){   checkdates_a=true; checkdates_b=true; }
					if  (dateinit<firstdayofqua && dateend>lastdayofqua){   checkdates_a=true; checkdates_b=true; } 
					if  (dateinit>=firstdayofqua && dateend<lastdayofqua){  checkdates_a=true; checkdates_b=true; } 
					if  (dateinit>=firstdayofqua && dateend<lastdayofqua){  checkdates_a=true; checkdates_b=true; } 
					if (checkdates_a || checkdates_b){ 
						tasks[countdone]=i; 
						countdone+=1; 
					} 
				}
				break;
			default: 
				datexreturn = dt.format(this.headerFormat);
				break; 
		} 	
		return tasks; 
	} 
});