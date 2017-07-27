var GreedAvitoParserUi = {
	getRulesFields: function() { return ['name', 'value', 'on', 'act']; },
	getRulesColumns: function() {
		return [
			{ text: 'Наименование', dataIndex: 'name', width: 200 },
			{ text: 'Условие поиска', dataIndex: 'value', width: 200 },
			{ xtype: 'checkcolumn', text: 'Включен', dataIndex: 'on', width: 100 }
		];
	},
	getRulesTBar: function() {
		var me = this;
		return [
			Ext.create('Ext.Button', {
				iconCls: 'x_btn_new',
				tooltip: 'Создать',
				tooltipType: 'title',
				handler: function() { me.editRule(); }
			}),
			Ext.create('Ext.Button', {
				iconCls: 'x_btn_copy',
				tooltip: 'Создать подобную',
				tooltipType: 'title',
				handler: function() {
					var rec = me.ruleGrid.getSelectionModel().getSelection()[0];
					if (rec) me.editRule(rec, 1);
				}
			}),
			Ext.create('Ext.Button', {
				iconCls: 'x_btn_edit',
				tooltip: 'Редактировать',
				tooltipType: 'title',
				handler: function() {
					var rec = me.ruleGrid.getSelectionModel().getSelection()[0];
					if (rec) me.editRule(rec);
				}
			}),
			Ext.create('Ext.Button', {
				iconCls: 'x_btn_delete',
				tooltip: 'Удалить',
				tooltipType: 'title',
				handler: function() {
					var rec = me.ruleGrid.getSelectionModel().getSelection()[0];
					if (rec) {
						Ext.MessageBox.show({
							title: 'Удаление',
							msg: 'Удалить ?',
							buttons: Ext.MessageBox.YESNO,
							fn: function(bid) { if (bid === 'yes') me.ruleStore.remove(rec); },
							icon: Ext.MessageBox.QUESTION
						});
					}
				}
			}),
			'-',
			Ext.create('Ext.Button', {
				iconCls: 'x_btn_search',
				tooltip: 'Поиск',
				tooltipType: 'title',
				handler: function() {
					var rec = me.ruleGrid.getSelectionModel().getSelection()[0];
					if (rec) {
						me.ruleGrid.setLoading(true);
						GreedAvitoParserLib.scan(rec.get('value'), function(items) {
							me.ruleGrid.setLoading(false);
							me.createListWindow(items, rec.get('name'));
						});
					}
				}
			}),
			'-',
			Ext.create('Ext.Button', {
				iconCls: 'x_btn_save',
				tooltip: 'Сохранить',
				tooltipType: 'title',
				handler: function() {}
			}),
			Ext.create('Ext.Button', {
				iconCls: 'x_btn_open',
				tooltip: 'Загрузить',
				tooltipType: 'title',
				handler: function() {}
			})
		];
	},
	createRulesGrid: function() {
		var me = this;
		return me.ruleGrid = Ext.create('Ext.grid.Panel', {
			autoScroll: true,
			autoRender: true,
			tbar: me.getRulesTBar(),
			flex: 1,
			border: 0,
			store: me.ruleStore = Ext.create('Ext.data.Store', {
				getData: function(fn, isJson) {
					var result = [];
					this.each(function(rec) {
						var d = rec.getData();
						if (Ext.isFunction(fn)) d = fn(d, rec);
						if (d) result.push(d);
					});
					if (isJson) result = JSON.stringify(result);
					return result;
				},
				fields: me.getRulesFields(),
				data: GreedAvitoParserLib.loadData('rules', []),
				proxy: 'memory'
			}),
			columns: me.getRulesColumns(),
			columnLines: true,
			listeners: { itemdblclick: function(th, rec) { GreedAvitoParserLib.runScan(rec); } },
			//viewConfig: { getRowClass: function (rec) { return me.getRowClass(rec); } }
		});
	},
	createMainWidow: function() {
		var me = this,
			profileKey = 'mainParam',
			profile = GreedAvitoParserLib.loadData(profileKey, {});
		return Ext.create('Ext.window.Window', {
			x: profile.x || 0,
			y: profile.y || 0,
			minHeight: 200,
			minWidth: 200,
			modal: true,
			height: profile.h || 200,
			width: profile.w || 515,
			maximized: profile.m,
			maximizable: true,
			title: 'Greed Avito Parser',
			layout: { type: 'vbox', align: 'stretch' },
			items: [me.createRulesGrid()],
			listeners: {
				move: {
					fn: function(th, x, y) {
						profile.x = x;
						profile.y = y;
						GreedAvitoParserLib.saveData(profileKey, profile);
					},
					buffer: 250
				},
				resize: {
					fn: function(th, w, h) {
						profile.m = th.maximized;
						if (!profile.m) {
							profile.w = w;
							profile.h = h;
						}
						GreedAvitoParserLib.saveData(profileKey, profile);
					},
					buffer: 250
				}
			},
			buttons: [
				Ext.create('Ext.Button', {
					text: 'Run',
					handler: function() { GreedAvitoParser.run(); }
				}),
				Ext.create('Ext.Button', {
					text: 'Stop',
					handler: function() { GreedAvitoParser.stop(); }
				})
			]
		});
	},

	editRule: function(rec, copy) { return this.createRuleWindow(rec, copy); },
	createRuleItems: function() {
		var labelWidth = 150;
		return {
			name: Ext.create('Ext.form.field.Text', { fieldLabel: 'Наименование', labelWidth: labelWidth }),
			value: Ext.create('Ext.form.field.Text', { fieldLabel: 'Условие поиска', labelWidth: labelWidth }),
			on: Ext.create('Ext.form.field.Checkbox', { fieldLabel: 'Включен', labelWidth: labelWidth })
		};
	},
	createRuleWindow: function(rec, copy) {
		var me = this,
			profileKey = 'ruleParam',
			profile = GreedAvitoParserLib.loadData(profileKey, {}),
			itemsCfg = me.createRuleItems(),
			itemsKeys = ['name', 'value', 'on'],
			items = [];

		Ext.each(itemsKeys, function(key) {
			if (rec) itemsCfg[key].setValue(rec.get(key));
			items.push(itemsCfg[key]);
		});

		var res = Ext.create('Ext.window.Window', {
			x: profile.x || 0,
			y: profile.y || 0,
			height: profile.h || 210,
			width: profile.w || 400,
			maximized: profile.m,
			minHeight: 100,
			minWidth: 300,
			autoShow: true,
			maximizable: true,
			title: rec && !copy ? 'Редактирование' : 'Создание',
			iconCls: rec && !copy ? 'x_btn_edit' : 'x_btn_new',
			save: function() {
				if (!rec || copy) {
					me.ruleGrid.getSelectionModel().select(rec = me.ruleStore.add({})[0]);
					res.setTitle('Редактирование');
					res.setIconCls('x_btn_edit');
					copy = 0;
				}
				Ext.each(itemsKeys, function(key) { rec.set(key, itemsCfg[key].getValue()); });

				GreedAvitoParserLib.saveData('rules', me.ruleStore.getData());
			},
			tbar: [
				Ext.create('Ext.Button', {
					tooltip: 'Сохранить',
					tooltipType: 'title',
					iconCls: 'x_btn_save',
					handler: function() { res.save(); }
				}),
				Ext.create('Ext.Button', {
					tooltip: 'Выйти',
					tooltipType: 'title',
					iconCls: 'x_btn_exit',
					handler: function() { res.close(); }
				})
			],
			layout: { type: 'vbox', align: 'stretch' },
			items: Ext.create('Ext.panel.Panel', {
				layout: { type: 'vbox', align: 'stretch' },
				bodyPadding: 10,
				flex: 1,
				items: items
			}),
			listeners: {
				move: {
					fn: function(th, x, y) {
						profile.x = x;
						profile.y = y;
						GreedAvitoParserLib.saveData(profileKey, profile);
					},
					buffer: 250
				},
				resize: {
					fn: function(th, w, h) {
						profile.m = th.maximized;
						if (!profile.m) {
							profile.w = w;
							profile.h = h;
						}
						GreedAvitoParserLib.saveData(profileKey, profile);
					},
					buffer: 250
				}
			}
		});
		return res;
	},

	getListFields: function() { return ['id', 'img', 'header', 'price', 'date', 'metro', 'url']; },
	getListColumns: function() {
		return [
			{ text: 'Наименование', dataIndex: 'header', width: 300 },
			{ text: 'Дата', dataIndex: 'date', width: 100 },
			{ text: 'Цена', dataIndex: 'price' },
			{ text: 'Местоположение', dataIndex: 'metro' }
		];
	},
	getListTBar: function(grid) {
		var me = this;
		return {
			xtype: 'toolbar',
			dock: 'top',
			items: [
				Ext.create('Ext.Button', {
					tooltip: 'Debug',
					tooltipType: 'title',
					text: 'Debug',
					handler: function() {
						var rec = grid.getSelectionModel().getSelection()[0];
						if (rec) {
							GreedAvitoParserLib.getContent(rec);
						}
					}
				}),
				Ext.create('Ext.Button', {
					iconCls: 'x_btn_delete',
					text: 'Удалить',
					tooltip: 'Удалить',
					tooltipType: 'title',
					handler: function() {
						var sels = grid.getSelectionModel().getSelection();
						if (sels.length) {
							Ext.MessageBox.show({
								title: 'Удалить',
								msg: 'Вы уверены ?',
								buttons: Ext.MessageBox.YESNO,
								fn: function(bid) { if (bid === 'yes') GreedAvitoParserLib.removePost(sels); },
								icon: Ext.MessageBox.QUESTION
							});
						}
					}
				})
			]
		};
	},
	createListGrid: function() {
		var me = this,
			res = Ext.create('Ext.grid.Panel', {
				autoScroll: true,
				autoRender: true,
				flex: 1,
				border: 0,
				selModel: Ext.create('Ext.selection.RowModel', { mode: 'MULTI' }),
				store: me._ListStore = Ext.create('Ext.data.Store', { fields: me.getListFields(), data: [], proxy: 'memory' }),
				columns: me.getListColumns(),
				columnLines: true,
				listeners: { itemdblclick: function(th, rec) { window.open(rec.get('url')); } },
			});

		res.addDocked(me.getListTBar(res));

		return res;
	},

	getListWindow: function() {
		var me = this;
		if (!me._ListWindow) me._ListWindow = me.createListWindow();
		return me._ListWindow;
	},

	createListWindow: function() {
		var me = this,
			profileKey = 'listParam',
			profile = GreedAvitoParserLib.loadData(profileKey, {});

		return Ext.create('Ext.window.Window', {
			x: profile.x || 0,
			y: profile.y || 0,
			minHeight: 200,
			minWidth: 200,
			height: profile.h || 200,
			width: profile.w || 515,
			maximized: profile.m,
			maximizable: true,
			autoShow: true,
			title: 'Greed Scan List',
			layout: { type: 'vbox', align: 'stretch' },
			items: [me._ListGrid = me.createListGrid()],
			loadData: function(data) { me._ListStore.loadData(data, false); },
			listeners: {
				close: function() { delete me._ListWindow; },
				move: {
					fn: function(th, x, y) {
						profile.x = x;
						profile.y = y;
						GreedAvitoParserLib.saveData(profileKey, profile);
					},
					buffer: 250
				},
				resize: {
					fn: function(th, w, h) {
						profile.m = th.maximized;
						if (!profile.m) {
							profile.w = w;
							profile.h = h;
						}
						GreedAvitoParserLib.saveData(profileKey, profile);
					},
					buffer: 250
				}
			}
		});
	}
};