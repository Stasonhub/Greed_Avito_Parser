Ext.onReady(function() {
	Ext.view.Table.prototype.renderColumnSizer = function(out) {
		var columns = this.getGridColumns(),
			len = columns.length,
			i,
			column,
			width;

		for (i = 0; i < len; i++) {
			column = columns[i];
			width = column.hidden ? 0 : (column.lastBox ? column.lastBox.width : Ext.grid.header.Container.prototype.defaultWidth);
			out.push('<colgroup role="presentation"><col role="presentation" class="', columns[i].getCellId(), '" style="width:' + width + 'px"></col></colgroup>');
		}
	};

	Ext.view.Table.prototype.cellTpl = [
		'<td class="{tdCls}" {tdAttr} {[Ext.aria ? "id=\\"" + Ext.id() + "\\"" : ""]} {ariaCellAttr}>',
		'<div {unselectableAttr} class="' + Ext.baseCSSPrefix + 'grid-cell-inner {innerCls}" ',
		'style="text-align:{align};<tpl if="style">{style}</tpl>" {ariaCellInnerAttr}>{value}</div>',
		'</td>', { priority: 0 }
	];

	Ext.form.Labelable.prototype.labelableRenderTpl.length = 0;
	Ext.each([
		'<tr role="presentation" id="{id}-inputRow" <tpl if="inFormLayout">id="{id}"</tpl> class="{inputRowCls}">',
		'<tpl if="labelOnLeft">',
		'<td role="presentation" id="{id}-labelCell" style="{labelCellStyle}" {labelCellAttrs}>',
		'{beforeLabelTpl}',
		'<label id="{id}-labelEl" {labelAttrTpl}',
		'<tpl if="inputId && !(boxLabel && !fieldLabel)"> for="{inputId}"</tpl>',
		' class="{labelCls}"',
		'<tpl if="labelStyle"> style="{labelStyle}"</tpl>',
		' unselectable="on"',
		'>',
		'{beforeLabelTextTpl}',
		'<tpl if="fieldLabel">{fieldLabel}',
		'<tpl if="labelSeparator">',
		'<span role="separator">{labelSeparator}</span>',
		'</tpl>',
		'</tpl>',
		'{afterLabelTextTpl}',
		'</label>',
		'{afterLabelTpl}',
		'</td>',
		'</tpl>',
		'<td role="presentation" class="{baseBodyCls} {fieldBodyCls} {extraFieldBodyCls}" id="{id}-bodyEl" colspan="{bodyColspan}">',
		'{beforeBodyEl}',
		'<tpl if="labelAlign==\'top\'">',
		'{beforeLabelTpl}',
		'<div role="presentation" id="{id}-labelCell" style="{labelCellStyle}">',
		'<label id="{id}-labelEl" {labelAttrTpl}<tpl if="inputId"> for="{inputId}"</tpl> class="{labelCls}"',
		'<tpl if="labelStyle"> style="{labelStyle}"</tpl>',
		' unselectable="on"',
		'>',
		'{beforeLabelTextTpl}',
		'<tpl if="fieldLabel">{fieldLabel}',
		'<tpl if="labelSeparator">',
		'<span role="separator">{labelSeparator}</span>',
		'</tpl>',
		'</tpl>',
		'{afterLabelTextTpl}',
		'</label>',
		'</div>',
		'{afterLabelTpl}',
		'</tpl>',
		'{beforeSubTpl}',
		'{[values.$comp.getSubTplMarkup(values)]}',
		'{afterSubTpl}',
		'<tpl if="msgTarget===\'side\'">',
		'	{afterBodyEl}',
		'	</td>',
		'	<td role="presentation" id="{id}-sideErrorCell" vAlign="{[values.labelAlign===\'top\' && !values.hideLabel ? \'bottom\' : \'middle\']}" style="{[values.autoFitErrors ? \'display:none\' : \'\']}" width="{errorIconWidth}">',
		'		<div role="alert" aria-live="polite" id="{id}-errorEl" class="{errorMsgCls}" style="display:none"></div>',
		'	</td>',
		'<tpl elseif="msgTarget==\'under\'">',
		'	<div role="alert" aria-live="polite" id="{id}-errorEl" class="{errorMsgClass}" colspan="2" style="display:none"></div>',
		'	{afterBodyEl}',
		'	</td>',
		'<tpl else>',
		'	</td>',
		'</tpl>',
		'</tr>',
		{ disableFormats: true }
	], function(s) { Ext.form.Labelable.prototype.labelableRenderTpl.push(s); });

	//Ext.layout.container.Form.prototype.padRow = '<tr role="presentation"><td class="' + Ext.baseCSSPrefix + 'form-item-pad" colspan="3" role="presentation"><td></td></tr>';
});