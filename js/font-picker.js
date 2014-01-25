/*
Based on Jonathan Abbott's Flip Calendar gadget
http://vistagadgets.spaces.live.com/
*/

console.log('loaded: font-picker.js');

var fontPicker = {
	supportedFontTypes: ' (truetype) ',
	fontsToSkip: ':Bookshelf Symbol 7:'+':MS Outlook:'+':MS Reference Specialty:'+':MT Extra:'+':Symbol:'+':Webdings:'+':Wingdings:'+':Wingdings 2:'+':Wingdings 3:',

	fillYield: 50,	// Yield back to IE every X ms

	fontSizer: null,
	fonttypeIndex: 0,
	currentFont: System.Gadget.document.parentWindow.font,
	selectingFont: -1,

	init: function() {
		console.log('[init]');

		// System.Gadget.onSettingsClosing = this.settingsClosing;

		divFonttype.style.fontFamily = divFonttype.innerText = this.currentFont;
		divFonttype.style.fontSize = '16px';

		this.fontSizer = document.createElement('<g:background />').addTextObject(this.currentFont, this.currentFont, 16, 'black', 0, 0);

		//remove focus from the 1st checkbox
		document.body.focus();
		
		//read the fonts from the registry and build the table
		this.buildList(this.readFonts());

		// setFont(currentFont, 0);
		// console.log(tdFonts);
		// console.log(this.fonttypeIndex);
		tdFonts.rows(this.fonttypeIndex).className = 'menuItemSelected';
	},

	settingsClosing: function(event) {
		console.log('[settingsClosing]');
		
		if (event.closeAction == event.Action.commit) {
			System.Gadget.Settings.writeString('font', divFonttype.innerText);
		}
		// event.cancel = false;
	},

	readFonts: function() {
		console.log('[readFonts]');

		var HKLM = 2147483650;
		var rPath = 'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts\\';

		// connect to the registry
		var oSwbem = new ActiveXObject('WbemScripting.SwbemLocator');
		var oSvc = oSwbem.ConnectServer(null, 'root\\default');
		var oReg = oSvc.Get('StdRegProv');

		// enumerate the values 
		var oMethod = oReg.Methods_.Item('EnumValues');
		var oInParam = oMethod.InParameters.SpawnInstance_();
		oInParam.hDefKey = HKLM;
		oInParam.sSubKeyName = rPath;
		var oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

		// get the values into an array
		var sNames = oOutParam.sNames.toArray();

		// sort it
		sNames.sort();

		return sNames;
	},

	buildList: function(listItems) {
		console.log('[buildList]');

		// try{
			var counter = new Date();

			while (listItems.length > 0 && (new Date())-counter<this.fillYield) {
				// is the font one we can use
				var fontType = ' ' + listItems[0].substring(listItems[0].lastIndexOf('(')).toLowerCase() + ' ';
				var fontName = listItems[0].substring(0, listItems[0].length - fontType.length + 1);

				if(this.supportedFontTypes.indexOf(fontType) > -1 && this.fontsToSkip.indexOf(':' + fontName + ':') == -1) {
					//check the height, to see if it's a font we can use
					this.fontSizer.font = this.fontSizer.value = fontName;
					this.fontSizer.height = 0;

					if (this.fontSizer.height != 0) {
						// console.log('Using font: '+fontName);

						var tRow = tdFonts.insertRow(tdFonts.rows.length);
						tRow.className = 'menuItem';
						
						var tCell = tRow.insertCell(0);
						tCell.innerText = fontName;
						tCell.style.fontFamily = fontName;
						tCell.style.fontSize = divFonttype.style.fontSize;

						if (fontName == this.currentFont) {
							this.fonttypeIndex = tdFonts.rows.length - 1;
							// tRow.className = 'menuItemSelected';
						}

					} else {
						// console.log('Cant use font: '+fontName);
					}
				}
				listItems.shift();
			}

			if (listItems.length > 0) {
				var context = this;
				setTimeout(function() { context.buildList(listItems); }, 20);
			}
		// } catch(err) {
			// console.log('buildList: '+err.name+' - '+err.message);
		// }
	},

	showFontMenu: function(id, x, y) {
		console.log('[showFontMenu]');

		if (id == -1) {
			if (fontMenu.style.display != 'none') {
				id = this.selectingFont;
			} else {
				return;
			}
		}
			
		fontMenu.style.display = (fontMenu.style.display == 'none') ? 'inline' : 'none';

		if (fontMenu.style.display == 'none') {
			console.log('[showFontMenu] hidden');

			switch (this.selectingFont) {
				case 0:
					fontDropPNG.src = 'images/dropmenu.png';
					break;
			}
			this.selectingFont = -1;
		} else {
			console.log('[showFontMenu] displayed');

			fontMenu.style.top = y;
			fontMenu.style.left = x;
			this.selectingFont = id;
			
			// console.log(tdFonts.rows(fonttypeIndex).className);
			// console.log(id);

			switch (id) {
				case 0:
					fontMenu.scrollTop = tdFonts.rows(this.fonttypeIndex).offsetTop - 65;
					tdFonts.rows(this.fonttypeIndex).className = 'menuItemSelected';
					break;
			}

			// console.log(tdFonts.rows(fonttypeIndex).className);
		}
	},

	setFont: function(index, viaKey) {
		console.log('[setFont] '+index+', '+viaKey);

		var sFont = tdFonts.rows(index).cells(0).innerText;

		var selecting = (viaKey != null) ? viaKey : this.selectingFont;
		switch (selecting) {
			case 0:
				divFonttype.style.fontFamily = sFont;
				divFonttype.innerText = sFont;
				tdFonts.rows(this.fonttypeIndex).className = 'menuItem';
				this.fonttypeIndex = index;
				tdFonts.rows(this.fonttypeIndex).className = 'menuItemSelected';
				break;
		}

		// adjust the scrollbar if needed
		if (fontMenu.scrollTop > tdFonts.rows(index).offsetTop) {
			fontMenu.scrollTop = tdFonts.rows(index).offsetTop;
		}

		if (fontMenu.scrollTop < tdFonts.rows(index).offsetTop+tdFonts.rows(index).offsetHeight-150) {
			fontMenu.scrollTop = tdFonts.rows(index).offsetTop+tdFonts.rows(index).offsetHeight-150;
		}
	},

	setFontStyle: function(i) {
		console.log('[setFontStyle]');

		switch (i) {
			case 0:
				divFonttype.style.fontWeight = divFonttypeBold.checked ? 'bold' : '';
				divFonttype.style.fontStyle = divFonttypeItalic.checked ? 'italic' : '';
				break;
		}
	},

	keyPress: function(i) {
		console.log('[keyPress]');

		switch (event.keyCode)
		{
			case 40:	//down arrow
				if (i == 0) {
					if (this.fonttypeIndex < tdFonts.rows.length-1) {
						this.setFont(this.fonttypeIndex+1, i);
					}
				}
				break;
			case 38:	//up arrow
				if (i == 0) {
					if (this.fonttypeIndex > 0) {
						this.setFont(this.fonttypeIndex-1, i);
					}
				}
				break;
			case 36:	//home
				this.setFont(0, i);
				break;
			case 35:	//end
				this.setFont(tdFonts.rows.length - 1, i);
				break;
		}
	},

	mouseOver: function(mouseEntered, id) {
		// console.log('[mouseOver]');

		var selected = (this.selectingFont == 0) ? this.fonttypeIndex : 0;

		if (mouseEntered) {
			id.className = (id.rowIndex == selected) ? 'menuItemHoverSelected' : 'menuItemHover';
		} else {
			id.className = (id.rowIndex == selected) ? 'menuItemSelected' : 'menuItem';
		}
	}
}
