var clock = {
	time: 0,
	date: 0, 
	month: 0,
	day: ''
};




console.log('loaded: gadget.js');

var font;
var color;
var opacity;
// var negativeVerticalMargin;
// var negativeHorizontalMargin;

var toTime;
var toDate;
var toMonth;
var toDay;

var targetWidth;
var targetHeight;

function init() {
	console.log('[init]');

	System.Gadget.settingsUI = 'settings.html';
	System.Gadget.onSettingsClosed = function() {
		readSettings();
		createTextObjects();
		refresh(false);
	};

	readSettings();
	createTextObjects();
	refresh(true);
}

function readSettings() {
	console.log('[readSettings]');

	font = System.Gadget.Settings.readString('font') || 'Arial';
	color = System.Gadget.Settings.readString('color') || 'white';
	opacity = System.Gadget.Settings.read('opacity') || 30;
	scale = System.Gadget.Settings.read('scale') || 1;
	// negativeVerticalMargin = System.Gadget.Settings.read('negativeVerticalMargin') || 0;
	// negativeHorizontalMargin = System.Gadget.Settings.read('negativeHorizontalMargin') || 0;

	console.log('    font: '+font);
	console.log('    color: '+color);
	console.log('    opacity: '+opacity);
}

function createTextObjects() {
	console.log('[createTextObjects]');

	var bg = document.getElementById('bg');
	bg.removeObjects();

	// 0's are dummy chars for initial text object alignment
	toTime = bg.addTextObject('00:00 AM', font, 105 * scale, color, 0, 0);

	//we really don't want to be changing the width of the gadget because of clock time
	//because gadgets are anchored on the desktop by the left side, and the content is right-aligned

	targetWidth = document.getElementsByTagName('body')[0].style.width = toTime.width;
	targetHeight = document.getElementsByTagName('body')[0].style.height = toTime.top + toTime.height;
}

function refresh(autoreload) {
	console.log('[refresh]');

	console.log('    font: '+font);
	console.log('    color: '+color);
	console.log('    opacity: '+opacity);


	var currentTime = System.Time.getLocalTime(System.Time.currentTimeZone);
	var currentDate = new Date(Date.parse(currentTime));

	var hours = currentDate.getHours();
	var meridiem = hours >= 12 ? ' PM' : ' AM';
	if(hours == 0) {
		hours = 12;
	}

	var minutes = currentDate.getMinutes();
	minutes = ((minutes < 10) ? ':0' : ':') + minutes;


	toTime.value = hours > 12 ? (hours-12) + minutes + meridiem : hours + minutes + meridiem;
	toTime.font = font;
	toTime.color = color;
	toTime.opacity = opacity;

	toTime.left = targetWidth - toTime.width;
	toTime.top = 0;	

	if (autoreload) {
		setTimeout(function() { refresh(true); }, 60*1000);
	}
}
