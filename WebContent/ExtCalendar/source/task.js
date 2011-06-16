// JavaScript Document
// E2cs alpha 0.0.7
// Extjs-Event-Calendar Solution 
// task.js
// Author: Carlos Mendez
// --------------------------------------------------------------
// Tasks for Day view  ------------------------------------------
// --------------------------------------------------------------
//	27-Sep-2008
//	Minor fixes cause of bugs with element's ID's
// --------------------------------------------------------------
// 04-08-08
// Changes for display on opera 
// Xtemplate object added for Qtip format  
// --------------------------------------------------------------
// Note: this will not work on week view, the beheavior is different
// --------------------------------------------------------------

Ext.ECalendar.daytask = function(config){
	Ext.apply(this,config);
	Ext.ECalendar.daytask.superclass.constructor.call(this);
};
Ext.extend(Ext.ECalendar.daytask, Ext.util.Observable, { 
	previndex:0,
	createdelementno:0,
	editable:true, 
	parentview:null, 											//dayview object
	baseBody:null,   											//ext element already created  that contains the tasks in day view 
	datehandle:new Date(),  									//date to handle 
	showQtip:true,												//Show Qtips on tasks
	tasksOffset: 5, 	
	task_id:0,
	task_index:0,
	task_subject:'',		
	task_starts:'',
	task_ends:'',
	task_description:'', 
	task_location:'', 											//0.0.15
	task_isholiday:0,											//0.0.15
	task_isallday:0,											//0.0.15
	task_clsOver:'', 
	task_increment:5,
	task_width:100, //base Task width 
	forceTaskFit: false,										//0.0.14 
	totalTasksonView:0,											//0.0.14
	customHtml:'',												//0.0.13  Feature request  // so it can include custom HTML inside the Task/Event body 
	customHTMLinpos: 'before',									//0.0.13  companion porperty of customHtml Where to insert the HTML 
	bgcolor:'#E0FFA2',			  								//base color
	task_format:'d-m-Y H:i:s a', 								//base format on Tasks (qtips) 
	moreMenuItems:[],											// Menu items  objects for custom actions 
	contextMenuLabels: e2cs.cal_locale.contextMenuLabelsDay,  	// Labels for  Base Menu items
	task_useBxStyle: false,										// 0.0.15 (will create border color for the task so it can be noticed the separation
	task_useBxcolor: '#225588',									// 0.0.15  companion property for task_useBxStyle
	// added on 0.0.4 
	tplqTip: new Ext.XTemplate( '<tpl for=".">{starxl}{startval}<br>{endxl}{endval}<hr color="#003366" noshade>{details}</tpl>' ),
	ShowMenuItems:[1,1,1,1,1],  //0.0.11 ADD, DELETE, EDIT, NEXT day, PREV DAY 
	evenLaunch:'dblclick', 
	init: function(calendar,dayview){ 
		this.calx = calendar; 
		this.vday = dayview; 
	},
	render:function(){
		var m_starttime =  this.calx.currentdate.format('m/d/Y ') + this.vday.startTime ; 
		var m_endtime =    this.calx.currentdate.format('m/d/Y ') + this.vday.endTime   ; 			
		this.totalhours =  this.calx.dateDiff(new Date(m_starttime),new Date(m_endtime),e2cs.dateParts.HOUR); 
		// check if the task hour is Ok 
		var inittimetask  = this.checkTasktime(this.task_starts); 
		var endtimetask   = this.checkTasktime(this.task_ends); 
		var checkbetwdate = this.calx.currentdate.between( new Date(m_starttime), new Date(m_endtime) ); 		
		//posicion inicial de la tarea 
		var diffstartinipos = this.calx.dateDiff( new Date(m_starttime), new Date(inittimetask),e2cs.dateParts.MINUTE); 
		if (diffstartinipos<0 ){
			initpos = 0; 
			flagstarttasttext = e2cs.cal_locale.task_LessDaysFromTask; // sample'(-)<br>'; 
		} else {
			initpos = diffstartinipos; 
			flagstarttasttext = ''; 
		}
		var diffendpos = this.calx.dateDiff(new Date(m_endtime), new Date(endtimetask),e2cs.dateParts.MINUTE); 		
		var testdiff = new Date(endtimetask).add(Date.SECOND,-1); 
		var diffposxb = this.calx.dateDiff(testdiff,new Date(m_endtime),e2cs.dateParts.SECOND);
		if (diffendpos>0 && diffposxb!=0 ){ 
			endpos = (this.totalhours) * 60; //endpos = (this.totalhours + 1) * 60; 
			endpos = Math.abs(initpos - endpos); 
			flagendtasttext = e2cs.cal_locale.task_MoreDaysFromTask; // sample '<br>(+)'; 
	    } else { 
			var tmpdate = new Date(inittimetask); 
			var dtstartday =  new Date(  this.calx.currentdate.format('m/d/Y') + ' ' + this.vday.startTime ); 
			if  (tmpdate<dtstartday) { 
				endpos = this.calx.dateDiff( new Date(m_starttime), new Date(endtimetask) ,e2cs.dateParts.MINUTE); 
			}  else { 
				endpos = this.calx.dateDiff( new Date(inittimetask), new Date(endtimetask) ,e2cs.dateParts.MINUTE); 
			} 
			//if (endpos==(this.totalhours * 60) ) { endpos = endpos -76; }  0.0.4 bad behavior
			flagendtasttext = ''; 
		} 
		//0.0.13 Feature request code for custom HTML inside the event / task 
		
		
		if (this.customHtml ==null || this.customHtml ==undefined){ 
			var Bfhtmlins = ''; var Afhtmlins = ''; 
		} else { 
			if (this.customHTMLinpos=='before'){ 
				var Bfhtmlins =  this.customHtml; 
				var Afhtmlins = ''; 
			} else if  (this.customHTMLinpos=='after'){ 
				var Bfhtmlins = ''; 
				var Afhtmlins = this.customHtml; 
			} else { 
				var Bfhtmlins = ''; 
				var Afhtmlins = ''; 
			} 
		} 
		this.task_index = (this.vday.tasks.length); 
		if (this.forceTaskFit) {
			this.taskobject = this.baseBody.createChild({ tag: 'div',	 cls: 'task',	html:Bfhtmlins + flagstarttasttext + this.task_subject  + flagendtasttext + Afhtmlins});			
		} else { 
			this.taskobject = this.baseBody.createChild({ tag: 'div',	 cls: 'task',	html:Bfhtmlins + flagstarttasttext + this.task_subject  + flagendtasttext + Afhtmlins});
		} 
		this.taskobject.dom.setAttribute('id', this.calx.id + '-ecaltask-' 	+  this.task_index + '');
		this.taskobject.dom.setAttribute('ec_id', '' 		+  this.task_id + '');
		this.taskobject.dom.setAttribute('ec_starts', '' 	+  inittimetask + '');
		this.taskobject.dom.setAttribute('ec_ends', '' 	 	+  endtimetask + '');
		this.taskobject.dom.setAttribute('ec_subject', '' 	+  this.task_subject + '');
		this.taskobject.dom.setAttribute('ec_cnt', '' 		+  this.task_description + '');
		this.taskobject.dom.setAttribute('ec_storeindex', ''+  this.task_index + '');
		this.taskobject.dom.setAttribute('ec_location'	, ''+  this.task_location + '');
		this.taskobject.dom.setAttribute('ec_allday'	, ''+  this.task_isholiday + '');
		this.taskobject.dom.setAttribute('ec_isholiday'	, ''+  this.task_isallday + '');
		if (this.forceTaskFit) {
			var ancho = 98 / this.totalTasksonView ; 
			//this.taskobject.setY ({top:'' + initpos + 'px' } );
			if (this.task_useBxStyle){
				this.taskobject.setStyle({border:'1px solid ' + this.task_useBxcolor + '' } );
				
				if (Ext.isIE){
					this.taskobject.setStyle({height:'' + (endpos) + 'px' } ); //0.0.15  the border on ie does not affect the height	
				} else { 
					this.taskobject.setStyle({height:'' + (endpos-2) + 'px' } ); //0.0.15  the border expands the width and heigth
				}
				this.taskobject.setStyle({width :'' + (ancho) + '%' } );	 
			} else { 
				this.taskobject.setStyle({height:'' + (endpos) + 'px' } ); // no need here 
				this.taskobject.setStyle({width :'' + (ancho) + '%' } );	
			} 
			//this.taskobject.setStyle({left  :'' + ( ancho * this.task_index ) + '%' } );	
		} else { 
			this.taskobject.setStyle({top:'' + initpos + 'px' } );		
			if (this.task_useBxStyle){
				this.taskobject.setStyle({border:'1px solid ' + this.task_useBxcolor + '' } ); //0.0.15 set the border 
				if (Ext.isIE){
					this.taskobject.setStyle({height:'' + (endpos) + 'px' } ); 		 //0.0.15  the borders on ie does not affect   the width and heigth
					this.taskobject.setStyle({width :'' + (this.task_width) + 'px' } );//0.0.15
				} else { 
					this.taskobject.setStyle({height:'' + (endpos-2) + 'px' } ); 		 //0.0.15  the border expands the width and heigth
					this.taskobject.setStyle({width :'' + (this.task_width-2) + 'px' } );//0.0.15  the border expands the width and heigth
				} 
			
			
			} else { 
				this.taskobject.setStyle({height:'' + (endpos) + 'px' } );
				this.taskobject.setStyle({width :'' + (this.task_width) + 'px' } );
			} 
			if (this.tasksOffset=='auto'){  //havent been in use now it does 0.0.15 
				if (this.task_index<=1){
					var anchoposx = 0; 
				}else{
					tmpoffset = this.task_width; 
					anchoposx= 0; //var anchoposx = Ext.get('ecaltask-' + (this.task_index-1)).getX() + tmpoffset;	
					for (var x=0;x<=(this.vday.tasks.length-1);x++){ 
						if (x!=0){ anchoposx+= Ext.get(this.calx.id + '-ecaltask-' + (x)).getWidth(false);	}
					}
				} 
			} else {  //is number
				var anchoposx = 0; 
				if (this.task_index<=1){
					var tmpoffset = 0;
				} else { 
					tmpoffset = this.tasksOffset; 
					//var anchoposx = Ext.get('ecaltask-' + (this.task_index-1)).getX() + tmpoffset;		
						this.taskobject.setStyle('margin-left' ,  (tmpoffset) + 'px');
				} 
			} 
			//this.taskobject.setX(this.baseBody.getX() + anchoposx);
			newancho=0; 
			for (var x=0;x<=(this.vday.tasks.length);x++){ 
				if (x!=0){	newancho+= Ext.get(this.calx.id + '-ecaltask-' + (x)).getWidth(false);	}
			}
			if (  newancho >this.baseBody.getWidth(false) ){ 
				Ext.get(this.calx.id + '-daybody').setWidth(newancho); 
				Ext.get('tdbaseday').setWidth(newancho); 
				//Ext.get('tableallday').getWidth(false); 
				//Ext.get('tdbaseday').setWidth(this.taskobject.getX() + this.taskobject.getWidth(false) ); 
				//Ext.get('daybody'); 
				//this.baseBody.setWidth( this.taskobject.getX() + this.taskobject.getWidth(false) ); 
			}			
			if (Ext.isOpera) { 	
				/*fix for Opera 9x	*/	
			} else { 
				//this.taskobject.setX(this.baseBody.getX() + anchoposx);
			} 	
		} 
		
		this.taskobject.setY(this.baseBody.getY() + initpos); // fix for moredays task and normal tasks		
		if (this.bgcolor){ 
			this.taskobject.setStyle('background-color' ,'' + this.bgcolor + ''); 
		} else { 
			this.taskobject.setStyle('background-color' ,'#99CC99'); 
		} 
		if(Ext.isIE){ // bug fix for IE6 didnt show taks cause they ewent at the bottom and also the base day element its at the top  :(  weird IE stuff 
			this.taskobject.setStyle('z-index' ,'2000'); 
		}else{
			this.taskobject.setStyle('z-index' ,'auto');
		}
		if (this.showQtip){ 
			var tmpdate = new Date(inittimetask);  			
			var startlabel = tmpdate.format(this.task_format); 
				tmpdate = new Date(endtimetask);            
			var endlabel =   tmpdate.format(this.task_format); 
			this.taskobject.dom.qtitle= this.task_subject;	
			if (this.task_description==''){ var desctmp = '&nbsp;<br/>&nbsp;'; 	}  else {var desctmp = this.task_description;  } 
			// 0.0.4 new feature Qtip template 	
			var datatip = {starxl:   e2cs.cal_locale.task_qtip_starts,
						   startval: startlabel,
						   endxl:    e2cs.cal_locale.task_qtip_ends, 
						   endval:   endlabel,
						   details:  desctmp,
						   location: this.task_location
						   };
			//this.taskobject.dom.qtip  = e2cs.cal_locale.task_qtip_starts + startlabel + "<br>" + e2cs.cal_locale.task_qtip_ends + endlabel + '<br>' + this.task_description ; 
			this.taskobject.dom.qtip = this.tplqTip.apply(datatip);
//			tplqTip: new Ext.XTemplate( 
//				'<tpl for=".">{starxl}:{startval}<br>{endxl}:{endval}<hr color="#003366" noshade>{details}</tpl>'
//		    ),			
		}
		//0.0.11 task_clsOver implemented
		if (this.task_clsOver!=''){ this.taskobject.addClassOnOver(this.task_clsOver); }
		//0.0.11 changed so you can decide wheter click or dobleclick or nothing for the task object 
		//this.taskobject.addListener('dblclick', this.onDblclick, this );
		this.taskobject.addListener(this.evenLaunch, this.onDblclick, this );		
		if (Ext.isOpera){ 
				this.taskobject.addListener('mousedown',this.operabuttons,this); 
		} else { 
				this.taskobject.addListener('contextmenu', 
						this.oncontextmenu, this, {
							   stopPropagation:true,
							   normalized :true,
							   preventDefault:true
				} );
		} 
		if (initpos==0 && endpos>(this.totalhours * 60)) { //0.0.15 fix 
				//no resizable cause its all day task or more :P
				//fix for all day example 12/12/2009 00:00 to 12/13/2009 00:00 its all day but can be resizable :) 		
		}  else { //here comes the trouble :P 
			if (this.editable){ 
				if (flagendtasttext==''){ 
					if (Ext.isIE){ var checkie_pinned = true; } else { 	var checkie_pinned = false; } 
					var snap = new Ext.Resizable(this.calx.id + '-ecaltask-' + this.task_index + '', {
						pinned:checkie_pinned,
						width:this.task_width,
						handles: 's',
						heightIncrement:this.task_increment,
						minHeight: 15,
						maxHeight: ((this.totalhours * 60) - initpos),
						dynamic: true,
						draggable : false 
					});
					var tmpbody = this.baseBody; 						
					var tmpvday = this.vday;
					var tmptask = this;    			
					var tmpcalendar = this.calx;
					snap.on({
						'resize':{
							fn: function( objthis, width, height, evtObj){ 
								var datatask = tmptask.getTaskarray(objthis.el); 
								var check = tmpcalendar.fireEvent("beforeTaskMove", datatask, tmptask, tmpvday, tmpcalendar);
								if (check){ 
									//0.0.15 updated to accept true value and continue 
									// calc new position for - start time and end time  and updates Task's tags 
									tmptask.applyChange(objthis.el);  
									var newdatatask= tmptask.getTaskarray(objthis.el);  //with updates 
									tmpcalendar.fireEvent("TaskMoved", newdatatask, tmptask, tmpvday, null);// afterChange fires
								} 
							} 
							, scope:this	
						}
					}) ; 
					// if it has moredays (+) or (-) then drag does not apply
					if (flagstarttasttext=='' && flagendtasttext == ''){  
								var taskdrag  = new Ext.dd.DDProxy(this.calx.id + '-ecaltask-' + this.task_index + '','task-group',{xTicks : 0,	yTicks : 5});	
								// needed this vars cause in the endrag this i cant change it  :( 
								var tmpbody = this.baseBody; 	
								var tmpvday = this.vday;
								var tmptask = this;    			
								var tmpcalendar = this.calx;
								// --------------------------------------------------------------------
								taskdrag.startDrag = function(){
									  this.constrainTo( tmpbody.id );
									  this.setXConstraint(0,0,0); 
									  var dragEl = Ext.get(this.getDragEl());
									  var el = Ext.get(this.getEl());
									  dragEl.applyStyles({border:'','z-index':2000});
									  dragEl.update(el.dom.innerHTML);
									  dragEl.addClass('task-drag' + ' dd-proxy');		  
								};
								taskdrag.endDrag = function(){
										var dragEl = Ext.get(this.getDragEl());
										var el = Ext.get(this.getEl());
										var datatask = tmptask.getTaskarray(this.id); 
										// fire event before taskchange
										var check = tmpcalendar.fireEvent("beforeTaskMove", datatask, tmptask, tmpvday,tmpcalendar); 
										if (check){ //0.0.15 updated to accept true value and continue 
											el.setY(dragEl.getY()); // x never changes 
											tmptask.applyChange(this);  // calc new position for - start time and end time  and updates Task's tags 
											var newdatatask= tmptask.getTaskarray(this.id);  //with updates 
											// afterChange fires
											tmpcalendar.fireEvent("TaskMoved", newdatatask, tmptask, tmpvday,this); 
										} else { 
											// restore normal postion if canceled
											// cause nothing is done to update the element 
											//  to restore normal postion if canceled (beta)
											//	tmptask.resetChange(this);  
											//	** optional function no implementation yet 
										} 	
								};
					} 
				} 
			} 
		} 
	},
	operabuttons: function (evx,elx,obx){//alert ("boton:" + evx.button); 
			if (Ext.isOpera){ if (evx.button==2){ this.oncontextmenu(evx,elx,obx); }  
		}
	}, 
	oncontextmenu: function (evx,elx,obx){
		if (Ext.isOpera){ if (evx.button!=2){ return false; } }
		if (this.ShowMenuItems[0]!=true && this.ShowMenuItems[1]!=true && this.ShowMenuItems[2]!=true && this.ShowMenuItems[3]!=true  && this.ShowMenuItems[4]!=true && this.moreMenuItems.length<=0){ return false; }
		evx.stopEvent();		
		//0.0.13 FIx for custom HTML inside the TASK object 
		if (  elx.id.indexOf(this.calx.id + '-ecaltask-')<0 ) {  // if not found the check the parent 
//			if  (Ext.isIE){ 
//				var tmpdata= Ext.get(elx.dom.parentNode.id);	
//			} else { 
				var tmpdata= Ext.get(elx.parentNode.id);			
//			} 
		}  else {  // FOund a ELX id 
			var tmpdata= Ext.get(elx.id);		
		}	
		var dataTASKtmp = this.getTaskarray(tmpdata); 
		//Send the new event to make logical sense to the contextmenu options 
		var newmenuitems   = this.vday.moreMenuItems; 	
		var toshowOnCXmenu = this.ShowMenuItems; 
		var actionsTaskCX=[]; 
		var testevent =  this.calx.fireEvent("beforeContextMenuTask", "dayview-task",dataTASKtmp,toshowOnCXmenu,actionsTaskCX); 
		if (testevent==false) {//0.0.15 change 
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
					var newmenuitems   = this.vday.moreMenuItems; 					
					var toshowOnCXmenu = this.ShowMenuItems; 
				} 
			} else {  //abort operation 
				return false; 
			} 
		} else { 
			// do nothing follow as planned 
			var newmenuitems = this.vday.moreMenuItems; 
		} 
	//---------------------------------------------------------------------------
		//var tmpdata= Ext.get(elx.id);
		if (this.menu){ this.menu.removeAll();	}
		this.menu = new Ext.menu.Menu({
			allowOtherMenus : true,
			shadow: false, 
			items:[{id: 'day_ctxbtn_task-add',		iconCls:'x-calendar-day-btnmv_add',		text: this.contextMenuLabels.taskAdd, 	scope:this},
				   {id: 'month_ctxbtn_task-delete', iconCls: 'x-calendar-day-btnmv_delete',	text: this.contextMenuLabels.taskDelete,scope:this},
				   '-',
				   {id:'month_ctxbtn_task-edit',	iconCls: 'x-calendar-day-btnmv_task',	text: this.contextMenuLabels.taskEdit + tmpdata.getAttributeNS('tag','ec_subject'),		scope:this	},
				   '-',
				   {id:'month_ctxbtn_task-go-nd', 	iconCls: 'x-calendar-day-btnmv_nextday',text: this.contextMenuLabels.NextDay,	 scope:this},
				   {id:'month_ctxbtn_task-go-pd', 	iconCls: 'x-calendar-day-btnmv_prevday',text: this.contextMenuLabels.PreviousDay,scope:this}
			]
		});
		if (newmenuitems.length>0) {
			this.menu.add('-'); 
//			for (var i=0; i<newmenuitems.length; i++){
//				// var idmenuitem = this.moreMenuItems[i].id;  0.0.4 bug in custom action sending the id the problem was the last id was returned always				
//				newmenuitems[i].rendered =false; 
//				newmenuitems[i].addListener('click', 
//							function(parx,parz){ 
//									this.onCustomMenuAction(parx.id,Ext.get(elx),this ); //this.onCustomMenuAction( idmenuitem , Ext.get(elx), this ); 0.0.4 bug 
//							}, this); 
//				this.menu.add( newmenuitems[i]);					
//			}
			for (var i=0; i<newmenuitems.length; i++){
				// var idmenuitem = newmenuitems[i].id;  0.0.4 bug in custom action sending the id the problem was the last id was returned always
				newmenuitems[i].rendered =false;
				// 0.0.14 modification to let the user set buttons with menu attached on the context menu 
				// Sepearators could be used also. Note: only one level its allowed
				if (newmenuitems[i].menu==undefined) {  //just plain button 
					newmenuitems[i].rendered =false;
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
					newmenuitems[i].menu.rendered =false;
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
		this.menu.items.items[0].addListener('click', function(){ this.onActionTask( 1, Ext.get(elx), this ); 	}, this); 
		this.menu.items.items[1].addListener('click', function(){ this.onActionTask( 2, Ext.get(elx), this ); 	}, this);
		//[2] Sep 
		this.menu.items.items[3].addListener('click', function(){ this.onActionTask( 3, Ext.get(elx), this ); 	}, this); 		
		//[4] Sep
		this.menu.items.items[5].addListener('click', function(){ this.vday.onclicknext_day(); }, this);  //next day
		this.menu.items.items[6].addListener('click', function(){ this.vday.onclickprev_day(); }, this);  //prev day	
		//0.0.11 - check visibility on the menu-items according to the new property 
		//ShowMenuItems:[1,1,1,1,1],  //0.0.11 ADD, DELETE, EDIT, NEXT day, PREV DAY
		if (toshowOnCXmenu[0]!=true){this.menu.items.items[0].hidden=true; } // ADD
		if (toshowOnCXmenu[1]!=true){this.menu.items.items[1].hidden=true; } // DELETE 
		if (toshowOnCXmenu[0]!=true && toshowOnCXmenu[1]!=true){	this.menu.items.items[2].hidden=true;  } //SEPARATOR 1
		if ( toshowOnCXmenu[2]!=true && toshowOnCXmenu[3]!=true & toshowOnCXmenu[4]!=true & newmenuitems.length<=0){
			this.menu.items.items[2].hidden=true; //SEPARATOR 1
		} 
		if (toshowOnCXmenu[2]!=true){ 
				this.menu.items.items[3].hidden=true;  //EDIT 
				this.menu.items.items[4].hidden=true;  //SEPARATOR 2					
		} 
		if  (toshowOnCXmenu[3]!=true && toshowOnCXmenu[4]!=true & newmenuitems.length<=0){  // if no followinf menus appear 
			this.menu.items.items[4].hidden=true;  //SEPARATOR 2					
		} 
		if (toshowOnCXmenu[3]!=true){
				this.menu.items.items[5].hidden=true; // NEXT day
		} 
		if (toshowOnCXmenu[4]!=true){
				this.menu.items.items[6].hidden=true; // PREV DAY
		} 
		if (newmenuitems.length>0) { 
			if (toshowOnCXmenu[3]!=true && toshowOnCXmenu[4]!=true){
				this.menu.items.items[7].hidden=true; //SEPARATOR 3
			}
		} 
		//--------------------------------------------------------------------------
		this.menu.on('hide', this.onContextTaskMenuHide, this);
		this.menu.showAt(evx.xy);
	}, 
	onCustomMenuAction: function(MenuId,taskEl,TaskObj){
		var datatask = this.getTaskarray(taskEl); 
		this.calx.fireEvent("customMenuAction", MenuId,'day',datatask,taskEl, this.vday); 
		this.menu.hide(); 
	},
	// private use 
	applyChange: function (TaskEl){
		//recalcs position and Start time and End time  if its from the same date also calcs the new position
		var m_starttime =  this.calx.currentdate.format('m/d/Y ') + this.vday.startTime; 
		var m_endtime =    this.calx.currentdate.format('m/d/Y ') + this.vday.endTime; 			
		var tmpEl =  Ext.get(TaskEl.id); 
		var newposstart =  Math.abs(   tmpEl.getTop() - Ext.get(this.baseBody).getY() ); 
		var newposend   = tmpEl.getHeight(); 
		var newdateTaskstart = new Date(m_starttime).add(Date.MINUTE,newposstart); 
		var newdateTaskEnds  = newdateTaskstart.add(Date.MINUTE,newposend);
		//universal format for dates (in this control)		
		tmpEl.dom.setAttribute('ec_starts', '' 	+  newdateTaskstart.format('m/d/Y H:i:s a') + '');  
		tmpEl.dom.setAttribute('ec_ends'  , '' 	+  newdateTaskEnds.format('m/d/Y H:i:s a')  + '');
		if (this.showQtip){ 		
			var startlabel = newdateTaskstart.format(this.task_format);            
			var endlabel =   newdateTaskEnds.format(this.task_format); 
			//tmpEl.dom.qtitle= this.task_subject;
			tmpEl.dom.qtip  = e2cs.cal_locale.task_qtip_starts + startlabel + "<br>" + e2cs.cal_locale.task_qtip_ends + endlabel + '<br>' + this.task_description ; 
		} 		
	},
	onActionTask: function (action, taskEl, TaskObj ){
		var datatask = this.getTaskarray(taskEl); 
		switch(action){
			case 1:  //add				
				this.calx.fireEvent("taskAdd",this.calx.currentdate);	
				break; 
			case 2: // delete
				var check = this.calx.fireEvent("beforeTaskDelete", datatask,this.vday );  
				if (check){ //0.0.15 updated to accept true value and continue  
					if (this.calx.fireEvent("onTaskDelete",datatask)==true){ 
						this.calx.fireEvent("afterTaskDelete",datatask,true);
					} else { 
						this.calx.fireEvent("afterTaskDelete",null,false);
					} 
				} 
				break; 
			case 3: //edit
				var check = this.calx.fireEvent("beforeTaskEdit",datatask,this.vday);  
				if (check){ // 0.0.4  - code still missing 
					//0.0.15 updated to accept true value and continue
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
	onContextTaskMenuHide: function (){ /* nothing happens :( */ },
	onDblclick: function(evx,elx,obx){
		if (  elx.id.indexOf(this.calx.id + '-ecaltask-')<0 ) {  // if not found the check the parent 
//			if  (Ext.isIE){ 
//				var tmpdata= Ext.get(elx.dom.parentNode.id);	
//			} else { 
				var tmpdata= Ext.get(elx.parentNode.id);			
//			} 
		}  else {  // FOund a ELX id 
			var tmpdata= Ext.get(elx.id);		
		}
		//var tmpdata= Ext.get(elx.id);
		var datatask = this.getTaskarray(tmpdata); 
		this.calx.fireEvent("taskDblClick",datatask,this.vday,this.calx,'day');
	},
	getTaskarray: function(TaskElx){ 
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
	},
	checkTasktime: function(taskvalue) { 
		if (taskvalue instanceof Date){ 
			var tochecktmpdt = taskvalue.format('m/d/Y G:i');
		} else { 
			var tochecktmpdt = taskvalue; 
		} 
		var test = tochecktmpdt.indexOf(":", 0); 
		if (test<=0){
			taskvaluefix = tochecktmpdt + ' ' + this.vday.startTime; 
		} else { 
			taskvaluefix = tochecktmpdt;  // add the time 
		}
		return taskvaluefix ; 
	}

}); 