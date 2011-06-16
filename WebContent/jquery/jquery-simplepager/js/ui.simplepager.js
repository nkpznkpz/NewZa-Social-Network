/*
 * jQuery UI Simplepager 1.0
 *
 * Copyright (c) 2009 Ian Tyndall 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://ianty.com/simplePager
 *
 * Depends:
 *	ui.core.js
 *	ui.draggable.js - // REMOVE DEPENDENCY: $(element).simplepager('option','dragOpts',false)
 *
*/
(function($) { // hide the namespace

$.widget("ui.simplepager", {
    _init: function() {
        this.close();
        this.currentPage = this.options.startPage;
        this._doOpts();
        this._setLinkDisplay(this.options.startPage);
    },
    _doOpts : function(){
        if (this.options.totalRecords > 0) {
            this._setTotalPages();
            if (!this.contentSet) {
                this._setContent();
                this._doObservers();        
            }
            this._setCurrent();
        }
        if (this.options.draggable && !this.element.hasClass('ui-draggable')) {
            var pgEl = this.element;
            var dragOpts = $.extend({
                handle: pgEl.attr('id'),
                iframeFix: true,
                stop: function(){ pgEl.find('.ui-pager-current').focus(); } 
            }, this.options.dragOpts || {});
            this.element.draggable(dragOpts);
        }
        if (this.options.autoOpen == true) {
            this.open();
        }
    },
    _doObservers : function() {
        if (this.contentSet == false) { return; }
        var pg   = this;
        $.each(['first','end','prev','next'],function(i){
            var page = this.toString();
            pg.element.find('.ui-icon-seek-' + page).click(function(e){
                pg._switchPage(e,page);
            });
            if (i <= 1) {
                pg.element.find('.ui-icon-seek-' + page).hover(
                    function() { $(this).addClass('ui-state-hover'); },
	    		    function() { $(this).removeClass('ui-state-hover'); }
		        );
            }
        });
        this.element.find('.ui-pager-current').click(
                function(){ $(this).select(); }
        ).keypress(
                function(e) {
                    c = e.which ? e.which : e.keyCode;
                    if (c == 13) {
                        $(this).addClass('ui-state-highlight');
                        pg._switchPage(e,$(this).val());
                        $(this).removeClass('ui-state-highlight');                        
                    }
                }
        );
        this.element.find('.ui-pager-content').hover(
            function() { $(this).addClass('ui-state-hover'); },
			function() { $(this).removeClass('ui-state-hover'); }
		);
    },
    _generateHTML : function() {
        html = '<div class="ui-pager-first ui-corner-all"><span title="First" class="ui-corner-all ui-icon ui-icon-seek-first">First</span></div>';
        html += '<div class="ui-pager-content ui-widget-content ui-state-default ui-corner-all"><div class="ui-pager-before"><span title="Prev" class="ui-icon ui-icon-seek-prev">Prev</span></div>';
        html += '<input class="ui-pager-current" size="2" /><div class="ui-pager-after"><span title="Next" class="ui-icon ui-icon-seek-next">Next</span></div></div>';
        html += '<div class="ui-pager-last ui-corner-all"><span title="Last" class="ui-corner-all ui-icon ui-icon-seek-end">End</span></div>';
        return html;
    },
    _setData: function(key,value) {
        var sp = this;
		$.widget.prototype._setData.apply(this, arguments);
        if (key == 'totalRecords' || key == 'perPage' || key == 'startPage') {
            sp.reset();
        }
    },
    _setTotalPages : function() {
        this.totalPages = Math.ceil(this.options.totalRecords / this.options.perPage);
    },
    _setContent : function() {
        $(this.element).addClass('ui-pager ui-widget ui-widget-header ui-helper-clearfix ui-corner-all').empty().append(this._generateHTML());
        this.contentSet = true;
    },
    _setLinkDisplay : function(page) {
        var pg   = this;
        $.each(['first','prev','end','next'],function(i){
            var pgInd = (i > 1) ? (page == pg.totalPages) : (page == pg.options.startPage);
            pg.element.find('.ui-icon-seek-' + this)[pgInd ? 'addClass' : 'removeClass']('ui-state-disabled');
        });
    },
    _decipherPage: function(page) {
        var reqPage = 0;
        switch(page) {
            case 'next':
                reqPage = parseInt(this.currentPage) + 1;
            break;
            case 'prev':
                reqPage = parseInt(this.currentPage) - 1;
            break;
            case 'first':
                reqPage = this.options.startPage;
            break;
            case 'end':
                reqPage = this.totalPages;
            break;
            default:
                if(!isNaN(page)) { reqPage = page; }
        }
        return reqPage;        
    },
    _switchPage : function(event,page) {
        var reqPage = this._decipherPage(page);
        if ((reqPage > 0) && (reqPage <= this.totalPages)) {
            this._setLinkDisplay(reqPage);
            this._setCurrent(reqPage);
            this._trigger('switchPage', event, reqPage);
        }
    },
    _setCurrent : function() {
        var curr = (arguments.length > 0) ? arguments[0] : this.currentPage;
        this.element.find('.ui-pager-current').val(curr).focus();
        this.currentPage = curr;
    },
    current : function(){
        if (arguments.length == 1) {
            var reqPage = this._decipherPage(arguments[0]);
            this._setLinkDisplay(reqPage);
            this._setCurrent(reqPage);
        }
        return this.currentPage;
    },
    close : function() {
        this.element.hide();
        return this;
    },
    open : function() {
        this.element.show();
        return this;
    },
    reset : function() {
        this.currentPage = this.options.startPage;
        this._doOpts();
        return this;
    }
});

$.extend($.ui.simplepager, {
    version: "1.7.2",
    defaults: {
        autoOpen: true,
        startPage: 1,
        perPage: 25,
        totalRecords: 0,
        draggable: true,
        dragOpts: {}
    },
    totalPages: 0,
    currentPage: false,
    contentSet: false
});

})(jQuery);
