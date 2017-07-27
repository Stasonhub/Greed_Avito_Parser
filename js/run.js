var GreedAvitoParser = {
	show: function() { GreedAvitoParserLib.beforeShow(function() { GreedAvitoParserUi.createMainWidow().show(); }); },
	run: function() {
		var me = this;
		me.isStop = false;
		me.runNext();
	},
	runNext: function() {
		var me = this,
			items = GreedAvitoParserUi.ruleGrid.store.data.items;
		if (me.isStop) return;
		if (me.actIndx !== undefined) items[me.actIndx].set('act', false);
		me.actIndx = ((me.actIndx || 0) + 1) % items.length;
		var rec = items[me.actIndx];
		while (!rec.get('on')) {
			me.actIndx = (me.actIndx + 1) % items.length;
			rec = items[me.actIndx];
		}
		rec.set('act', true);
		/*console.log('runNext');
		console.log(me.actIndx);
		console.log(items[me.actIndx]);*/
		GreedAvitoParserLib.runScan(items[me.actIndx], function() { setTimeout(function() { me.runNext(); }, 1000); });
	},
	stop: function() { this.isStop = true; }
};

//GreedAvitoParser.show();