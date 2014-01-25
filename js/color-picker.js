/*
Based on Jonathan Abbott's Flip Calendar gadget
http://vistagadgets.spaces.live.com/
*/

console.log('loaded: color-picker.js');

var colorPicker = {
	fillYield: 50,	// Yield back to IE every X ms

	colortypeIndex: 135,
	currentColor: 'white',
	selectingColor: -1,

	init: function() {
		console.log('[init]');

		// System.Gadget.onSettingsClosing = this.settingsClosing;

		this.currentColor = System.Gadget.Settings.readString('color') || this.currentColor;

		// divColortype.innerText = this.currentColor;
		divColortype.innerHTML = '<span style="color='+this.currentColor+'; font-family:Wingdings; font-size:16px;">l</span>'+this.currentColor;
		divColortype.style.fontSize = '16px';

		//remove focus from the 1st checkbox
		document.body.focus();
		
		//read the colors from the registry and build the table
		this.buildList(this.readColors());

		// setColor(currentColor, 0);
		tdColors.rows(this.colortypeIndex).className = 'menuItemSelected';
	},

	settingsClosing: function(event) {
		console.log('[settingsClosing]');
		
		if (event.closeAction == event.Action.commit) {
			System.Gadget.Settings.writeString('color', divColortype.innerText.substr(1));
		}
		// event.cancel = false;
	},

	readColors: function() {
		console.log('[readColors]');

		var sNames = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkturquoise', 'darkslategray', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];

		return sNames;
	},

	buildList: function(listItems) {
		console.log('[buildList]');

		var counter = new Date();

		while (listItems.length > 0 && (new Date())-counter<this.fillYield) {
			var colorName = listItems[0];
			// console.log('Using color: '+colorName);

			var tRow = tdColors.insertRow(tdColors.rows.length);
			tRow.className = 'menuItem';
			
			var tCell = tRow.insertCell(0);
			// tCell.innerText = colorName;
			tCell.innerHTML = '<span style="color='+colorName+'; font-family:Wingdings; font-size:16px;">l</span>'+colorName;
			// tCell.style.color = colorName;
			//divColortype.style.color = colorName;

			if (colorName == this.currentColor) {
				this.colortypeIndex = tdColors.rows.length - 1;
				// tRow.className = 'menuItemSelected';
			}

			listItems.shift();
		}

		//possible, but unhelpful, as it makes the selected color hard to read
		// divColortype.style.color = this.currentColor;

		if (listItems.length > 0) {
			var context = this;
			setTimeout(function() { context.buildList(listItems); }, 20);
		}
	},

	showColorMenu: function(id, x, y) {
		console.log('[showColorMenu]');

		if (id == -1) {
			if (colorMenu.style.display != 'none') {
				id = this.selectingColor;
			} else {
				return;
			}
		}
			
		colorMenu.style.display = (colorMenu.style.display == 'none') ? 'inline' : 'none';

		if (colorMenu.style.display == 'none') {
			console.log('[showColorMenu] hidden');

			switch (this.selectingColor) {
				case 0:
					colorDropPNG.src = 'images/dropmenu.png';
					break;
			}
			this.selectingColor = -1;
		} else {
			console.log('[showColorMenu] displayed '+id+' @ x:'+x+', y:'+y);

			colorMenu.style.top = y;
			colorMenu.style.left = x;
			this.selectingColor = id;
			
			// console.log(tdColors.rows(colortypeIndex).className);
			// console.log(id);

			switch (id) {
				case 0:
					colorMenu.scrollTop = tdColors.rows(this.colortypeIndex).offsetTop - 65;
					tdColors.rows(this.colortypeIndex).className = 'menuItemSelected';
					break;
			}

			// console.log(tdColors.rows(colortypeIndex).className);
		}
	},

	setColor: function(index, viaKey) {
		console.log('[setColor] '+index+', '+viaKey);

		var sColor = tdColors.rows(index).cells(0).innerText.substr(1);

		var selecting = (viaKey != null) ? viaKey : this.selectingColor;
		switch (selecting) {
			case 0:
				// divColortype.style.color = sColor;
				divColortype.innerHTML = '<span style="color='+sColor+'; font-family:Wingdings; font-size:16px;">l</span>'+sColor;
				tdColors.rows(this.colortypeIndex).className = 'menuItem';
				this.colortypeIndex = index;
				tdColors.rows(this.colortypeIndex).className = 'menuItemSelected';
				break;
		}

		// adjust the scrollbar if needed
		if (colorMenu.scrollTop > tdColors.rows(index).offsetTop) {
			colorMenu.scrollTop = tdColors.rows(index).offsetTop;
		}

		if (colorMenu.scrollTop < tdColors.rows(index).offsetTop+tdColors.rows(index).offsetHeight-150) {
			colorMenu.scrollTop = tdColors.rows(index).offsetTop+tdColors.rows(index).offsetHeight-150;
		}
	},

	keyPress: function(i) {
		console.log('[keyPress]');

		switch (event.keyCode)
		{
			case 40:	//down arrow
				if (i == 0) {
					if (this.colortypeIndex < tdColors.rows.length-1) {
						this.setColor(this.colortypeIndex+1, i);
					}
				}
				break;
			case 38:	//up arrow
				if (i == 0) {
					if (this.colortypeIndex > 0) {
						this.setColor(this.colortypeIndex-1, i);
					}
				}
				break;
			case 36:	//home
				this.setColor(0, i);
				break;
			case 35:	//end
				this.setColor(tdColors.rows.length - 1, i);
				break;
		}
	},

	mouseOver: function(mouseEntered, id) {
		// console.log('[mouseOver]');

		var selected = (this.selectingColor == 0) ? this.colortypeIndex : 0;

		if (mouseEntered) {
			id.className = (id.rowIndex == selected) ? 'menuItemHoverSelected' : 'menuItemHover';
		} else {
			id.className = (id.rowIndex == selected) ? 'menuItemSelected' : 'menuItem';
		}
	}
}
