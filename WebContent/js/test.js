var url="theme/";
function createStyleSheet(id, name) {
	if (!Ext.get("css_" + id)) {
		var element = document.createElement("link");
		element.setAttribute("href", url + "/" + name);
		element.setAttribute("rel", 'alternate stylesheet');
		element.setAttribute("type", 'text/css');
		element.setAttribute("title", 'css_' + id);
		element.setAttribute("id", 'css_' + id);
		Ext.get("alt_css").appendChild(element);
		setActiveStyleSheet("css_" + id);
	} else {
		setActiveStyleSheet("css_" + id);
	}
}
