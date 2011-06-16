$(document).ready(
		function()
		{
			$('#dock').Fisheye(
				{
					maxWidth: 10,
					items: 'a',
					itemsText: 'span',
					container: '.dock-container',
					itemWidth: 60,
					proximity: 50,
					halign : 'center',
					valign: 'bottom',
					alignment : 'left'
				}
			);
		}		
	);