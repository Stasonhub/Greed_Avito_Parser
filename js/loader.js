var loadJsList = function(source, pos, callBack) {
	    if (pos >= source.length) {
		    if (callBack) callBack();
		    return;
	    }

	    loadJs(source[pos], function() { loadJsList(source, pos + 1, callBack); });
    },
	loadJs = function(url, callBack) { loadScript(chrome.extension.getURL(url), callBack); },
	loadScript = function(src, callBack) {
		var script = document.createElement('script');
		script.src = src;
		script.onload = callBack;
		document.head.appendChild(script);
	},

	loadCssList = function(source, pos, callBack) {
		if (pos >= source.length) {
			if (callBack) callBack();
			return;
		}

		loadCss(source[pos], function() { loadCssList(source, pos + 1, callBack); });
	},
	loadCss = function(url, callBack) { loadLink(chrome.extension.getURL(url), callBack); },
	loadLink = function(href, callBack) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = href;
		link.onload = callBack;
		document.head.appendChild(link);
	};

loadCssList(['css/all.css'], 0, function() { loadJsList(['js/ext-all.js', 'js/fix-ext-use-strict.js', 'js/lib.js', 'js/ui.js', 'js/run.js'], 0); });