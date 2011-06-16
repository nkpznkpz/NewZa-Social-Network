Ext.onReady(function(){
	Ext.get('loading').remove();
    Ext.get('loading-mask').fadeOut({remove:true});
    Ext.get(document.body).fadeIn();		
});