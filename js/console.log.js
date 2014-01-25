if(!window.console) {
	//no console, create console.log and send it to system debug
	window.console = { };

	console.log = function(msg) {
		System.Debug.outputString('['+window.location+'] '+msg);
	}

	console.log('console.log is now set up');
} else {
	console.log('[console.log.js] window already has a console object');
}

window.onerror = function(msg, url, line) {
	console.log('Error: '+msg+' @ '+line+' in '+url);
}
