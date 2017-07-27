window.GreedAvitoParserLib = {
	ver: '1.0.0',

	urlRun: 'https://m.avito.ru/',
	urlExtCss: 'https://docs.sencha.com/extjs/4.2.2/extjs-build/resources/ext-theme-{0}/ext-theme-{0}-all.css',

	arrExtCssPrefix: ['classic', 'access', 'neptune', 'gray'],
	indxExtCssPrefix: 0,

	loadScript: function(src, callBack) {
		var script = document.createElement('script');
		script.src = src;
		script.onload = callBack;
		document.head.appendChild(script);
	},

	loadLink: function(href, callBack) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = href;
		link.onload = callBack;
		document.head.appendChild(link);
	},

	beforeShow: function (callBack) {
		var me = this;
		if (location.href.indexOf(me.urlRun) !== -1) {
			//if (location.href === me.urlRun) {
			Ext.Loader.setConfig({ enabled: true });

			me.loadLink(Ext.String.format(me.urlExtCss, me.arrExtCssPrefix[me.indxExtCssPrefix]), function() {
				console.log('Greed Avito Parser Load !');
				Ext.onReady(callBack);
			});
		}
	},

	prefixDataKey: 'Greed_',

	saveData: function(key, data, isJson) {
		if (isJson || isJson === undefined) data = JSON.stringify(data);
		return localStorage[this.prefixDataKey + key] = data;
	},

	loadData: function(key, def, isJson) {
		var res = localStorage[this.prefixDataKey + key];
		if (res && (isJson || isJson === undefined)) res = JSON.parse(res);
		return res || def;
	},

	ajaxRequest: function(params) {
		Ext.Ajax.request({
			url: params.url,
			params: params.data,
			type: params.type || 'POST',
			success: function(result) {
				//console.log(arguments);
				params.success && params.success.apply(this, [result]);
				params.callback && params.callback.apply(this, arguments);
			},
			failure: function() {
				//console.log(arguments);
				params.error && params.error.apply(this, arguments);
				params.callback && params.callback.apply(this, arguments);
			}
		});
	},

	removeScriptInText: function(text) {
		var i0 = text.indexOf('<script');
		if (i0 !== -1) {
			var i1 = text.indexOf('</script');
			i1 = text.indexOf('>', i1) + 1;
			var remStr = text.substr(i0, i1 - i0);
			text = this.removeScriptInText(text.replace(remStr, ''));
		}
		return text;
	},

	clearResultText: function(text) {
		var i = text.indexOf('<body') + 1;
		i = text.indexOf('>', i) + 1;

		return this.clearVip(this.removeScriptInText(text.substr(i, text.indexOf('</body') - i)));
	},

	clearVip: function(text) { return text.replace(text.substr(text.indexOf('<h2 class="items-vip-header">VIP-объявления</h2>'), text.length), ''); },

	frstParseItems: function(text) {
		var res = [],
			i0 = text.indexOf('<article');

		while (i0 !== -1) {
			var i1 = text.indexOf('</article', i0);
			i1 = text.indexOf('>', i1) + 1;
			res.push(text.substr(i0, i1 - i0));
			i0 = text.indexOf('<article', i1);
		}

		return res;
	},

	subParse: function(text, key0, key1) {
		var i0 = text.indexOf(key0);
		if (i0 === -1) return '';
		i0 += key0.length;
		return text.substr(i0, text.indexOf(key1, i0) - i0);
	},

	parseItems: function(items) {
		var me = this,
			res = [];
		Ext.each(items, function(item) {
			res.push({
				id: me.subParse(item, 'data-item-id="', '"'),
				img: me.subParse(item, 'background-image: url(//', ');'),
				header: me.subParse(item, '<span class="header-text">', '</span>'),
				price: me.subParse(item, '<span class="item-price-value">', '</span>'),
				date: me.subParse(item, '<div class="info-date info-text">', '</div>'),
				metro: me.subParse(item, '<span class="info-text info-metro-district">', '</span>'),
				url: me.subParse(item, '<a href="', '"')
			});
		});
		return res;
	},

	filterPremium: function(items) {
		Ext.each(items, function(item, i) { if (item.indexOf('data-item-highlight="1"') !== -1) items.splice(i, 1); }, undefined, true);
		return items;
	},

	filterByRule: function(rule, items, callback) { callback(items); },

	scan: function(callback) {
		var me = this;

		me.ajaxRequest({
			url: location.href,
			type: 'POST',
			success: function(res) { callback(me.parseItems(me.filterPremium(me.frstParseItems(me.clearResultText(res.responseText))))); },
			error: function() { callback([]); }
		});
	},

	runScan: function(rec, callback) {
		GreedAvitoParserLib.scan(function(items) {
			GreedAvitoParserLib.filterByRule(rec.get('value'), items, function() {
				GreedAvitoParserUi.getListWindow().loadData(items);
				callback && callback();
			});
		});
	},

	removePost: function(sels) {
		var me = this,
			key = 'remPosts',
			remPosts = me.loadData(key, []);
		Ext.each(sels, function(rec) { remPosts.push(rec.get('id')); });
		me.saveData(key, remPosts);
	},

	getContent: function (rec) {
		var me = this;
		/*var ifw = Ext.create('Ext.window.Window', {
			html: '<iframe src="' + rec.get('url') + '" width="100%" height="100%" frameborder="0"></iframe>'
		}).show();
		return;*/
		me.ajaxRequest({
			url: rec.get('url'),
			type: 'GET',
			success: function (res) { console.log(res.responseText); },
			error: function () { /*callback([]);*/ }
		});
	}
};

//window._ = undefined;