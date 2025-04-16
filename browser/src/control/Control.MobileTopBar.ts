/* -*- js-indent-level: 8 -*- */
/*
 * Copyright the Collabora Online contributors.
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/*
 * JSDialog.MobileTopBar - component of top bar on mobile
 */

class MobileTopBar extends JSDialog.Toolbar {
	constructor(map: any) {
		super(map, 'toolbar-up');

		map.on('zoomend', this.onZoomEnd, this);
		app.events.on('updatepermission', this.onUpdatePermission.bind(this));
		map.on('commandstatechanged', this.onCommandStateChanged, this);
	}
	_generateZoomItems() {
		return [
			{ id: 'zoom20', text: '20', scale: 1},
			{ id: 'zoom25', text: '25', scale: 2},
			{ id: 'zoom30', text: '30', scale: 3},
			{ id: 'zoom35', text: '35', scale: 4},
			{ id: 'zoom40', text: '40', scale: 5},
			{ id: 'zoom50', text: '50', scale: 6},
			{ id: 'zoom60', text: '60', scale: 7},
			{ id: 'zoom70', text: '70', scale: 8},
			{ id: 'zoom85', text: '85', scale: 9},
			{ id: 'zoom100', text: '100', scale: 10},
			{ id: 'zoom120', text: '120', scale: 11},
			{ id: 'zoom150', text: '150', scale: 12},
			{ id: 'zoom170', text: '170', scale: 13},
			{ id: 'zoom200', text: '200', scale: 14},
			{ id: 'zoom235', text: '235', scale: 15},
			{ id: 'zoom280', text: '280', scale: 16},
			{ id: 'zoom335', text: '335', scale: 17},
			{ id: 'zoom400', text: '400', scale: 18},
		];
	}	
	onZoomEnd() {
		var zoomPercent = 100;
		var zoomSelected = null;
		switch (this.map.getZoom()) {
			case 1:  zoomPercent =  20; zoomSelected = 'zoom20'; break;  // 0.2102
			case 2:  zoomPercent =  25; zoomSelected = 'zoom25'; break;  // 0.2500
			case 3:  zoomPercent =  30; zoomSelected = 'zoom30'; break;  // 0.2973
			case 4:  zoomPercent =  35; zoomSelected = 'zoom35'; break;  // 0.3535
			case 5:  zoomPercent =  40; zoomSelected = 'zoom40'; break;  // 0.4204
			case 6:  zoomPercent =  50; zoomSelected = 'zoom50'; break;  // 0.5
			case 7:  zoomPercent =  60; zoomSelected = 'zoom60'; break;  // 0.5946
			case 8:  zoomPercent =  70; zoomSelected = 'zoom70'; break;  // 0.7071
			case 9:  zoomPercent =  85; zoomSelected = 'zoom85'; break;  // 0.8409
			case 10: zoomPercent = 100; zoomSelected = 'zoom100'; break; // 1
			case 11: zoomPercent = 120; zoomSelected = 'zoom120'; break; // 1.1892
			// Why do we call this 150% even if it is actually closer to 140%
			case 12: zoomPercent = 150; zoomSelected = 'zoom150'; break; // 1.4142
			case 13: zoomPercent = 170; zoomSelected = 'zoom170'; break; // 1.6818
			case 14: zoomPercent = 200; zoomSelected = 'zoom200'; break; // 2
			case 15: zoomPercent = 235; zoomSelected = 'zoom235'; break; // 2.3784
			case 16: zoomPercent = 280; zoomSelected = 'zoom280'; break; // 2.8284
			case 17: zoomPercent = 335; zoomSelected = 'zoom335'; break; // 3.3636
			case 18: zoomPercent = 400; zoomSelected = 'zoom400'; break; // 4
			default:
				var zoomRatio = this.map.getZoomScale(this.map.getZoom(), this.map.options.zoom);
				zoomPercent = Math.round(zoomRatio * 100);
			break;
		}

		this.builder.updateWidget(this.parentContainer,
			{
				id: 'zoom',
				type: 'menubutton',
				text: '' + zoomPercent,
				selected: zoomSelected,
				menu: this._generateZoomItems(),
				image: false
			});
	}	
	callback(objectType: any, eventType: any, object: any, data: any, builder: any) { 
		if (object.id === 'zoom') {
			var selected = this._generateZoomItems().filter((item) => { return item.id === data; });
			if (selected.length)
				this.map.setZoom(selected[0].scale, null, true /* animate? */);
			return;
		}
		if (data === 'zoomin') {  app.dispatcher.actionsMap.zoomin(); return;}  
		if (data === 'zoomout') {  app.dispatcher.actionsMap.zoomout(); return;}  
		if (data === 'zoomreset') {
			// var newSize = this.map.getSize();
			// var widthTwips = newSize.x * this.map._docLayer._tileWidthTwips / this.map._docLayer._tileSize;
			// var ratio = widthTwips / this.map._docLayer._docWidthTwips;
			// var zoom = this.map.getScaleZoom(ratio, 10);
			// zoom = Math.min(10, Math.max(.1, zoom));
			// if (zoom > 1)
            //     zoom = Math.floor(zoom);
			var zoom = this.map._initZoom || 10;
			this.map.setZoom(zoom, null, true /* animate? */);
			return;
		}

		this.builder._defaultCallbackHandler(objectType, eventType, object, data, builder);
	}
	private getToolItems() {
		if (this.docType == 'text') {
			return [
				{type: 'toolitem', id: 'signstatus', command: '.uno:Signature', w2icon: '', text: _UNO('.uno:Signature'), visible: false},
				{type: 'toolitem',  id: 'undo', text: _UNO('.uno:Undo'), command: '.uno:Undo', enabled: false},
				{type: 'toolitem',  id: 'redo', text: _UNO('.uno:Redo'), command: '.uno:Redo', enabled: false},
				{type: 'customtoolitem',  id: 'prev', command: 'prev', text: _UNO('.uno:PageUp', 'text'), pressAndHold: true},
				{type: 'customtoolitem',  id: 'next', command: 'next', text: _UNO('.uno:PageDown', 'text'), pressAndHold: true},
				{type: 'separator', id: 'prevnextbreak', orientation: 'vertical'},
				{text: _UNO('.uno:ZoomPlus', 'text'), id: 'zoomin', command: 'zoomin', type: 'toolitem' },
				{type: 'menubutton', id: 'zoom', text: '100', selected: 'zoom100', menu: this._generateZoomItems(), image: false},
				{text: _UNO('.uno:ZoomMinus', 'text'), id: 'zoomout', command: 'zoomout', type: 'toolitem', },{type: 'separator', orientation: 'vertical'},
				{text: _('Reset zoom'), id: 'zoomreset', command: 'zoomreset', type: 'toolitem' },
				{type: 'spacer', id: 'before-permissionmode'},
				this._generateHtmlItem('permissionmode'),
				{type: 'spacer', id: 'after-permissionmode'},
				{type: 'customtoolitem',  id: 'mobile_wizard', command: 'mobile_wizard'},
				{type: 'customtoolitem',  id: 'insertion_mobile_wizard', command: 'insertion_mobile_wizard'},
				{type: 'customtoolitem',  id: 'comment_wizard', command: 'comment_wizard', w2icon: 'viewcomments'},
				{type: 'menubutton', id: 'userlist:UsersListMenu', visible: false},
			];
		} else if (this.docType == 'spreadsheet') {
			return [
				{type: 'toolitem', id: 'signstatus', command: '.uno:Signature', w2icon: '', text: _UNO('.uno:Signature'), visible: false},
				{type: 'toolitem',  id: 'undo', text: _UNO('.uno:Undo'), command: '.uno:Undo', enabled: false},
				{type: 'toolitem',  id: 'redo', text: _UNO('.uno:Redo'), command: '.uno:Redo', enabled: false},
				{type: 'customtoolitem', visible: false, id: 'acceptformula', command: 'acceptformula', text: _('Accept')},
				{type: 'customtoolitem', visible: false, id: 'cancelformula', command: 'cancelformula', text: _('Cancel') },
				{type: 'customtoolitem',  id: 'prev', command: 'prev', text: _UNO('.uno:PageUp', 'text'), pressAndHold: true},
				{type: 'customtoolitem',  id: 'next', command: 'next', text: _UNO('.uno:PageDown', 'text'), pressAndHold: true},
				{type: 'separator', id: 'prevnextbreak', orientation: 'vertical'},
				{text: _UNO('.uno:ZoomPlus', 'text'), id: 'zoomin', command: 'zoomin', type: 'toolitem' },
				{type: 'menubutton', id: 'zoom', text: '100', selected: 'zoom100', menu: this._generateZoomItems(), image: false },
				{text: _UNO('.uno:ZoomMinus', 'text'), id: 'zoomout', command: 'zoomout', type: 'toolitem', }, {type: 'separator', orientation: 'vertical'},
				{text: _('Reset zoom'), id: 'zoomreset', command: 'zoomreset', type: 'toolitem' },
				{type: 'spacer', id: 'before-PermissionMode'},
				this._generateHtmlItem('permissionmode'),
				{type: 'spacer', id: 'after-PermissionMode'},
				{type: 'customtoolitem',  id: 'mobile_wizard', command: 'mobile_wizard'},
				{type: 'customtoolitem',  id: 'insertion_mobile_wizard', command: 'insertion_mobile_wizard'},
				{type: 'customtoolitem',  id: 'comment_wizard', command: 'comment_wizard', w2icon: 'viewcomments'},
				{type: 'menubutton', id: 'userlist:UsersListMenu', visible: false},
			];
		} else if (this.docType == 'presentation') {
			return [
				{type: 'toolitem', id: 'signstatus', command: '.uno:Signature', w2icon: '', text: _UNO('.uno:Signature'), visible: false},
				{type: 'toolitem',  id: 'undo', text: _UNO('.uno:Undo'), command: '.uno:Undo', enabled: false},
				{type: 'toolitem',  id: 'redo', text: _UNO('.uno:Redo'), command: '.uno:Redo', enabled: false},
				{type: 'customtoolitem',  id: 'prev', command: 'prev', text: _UNO('.uno:PageUp', 'text'), pressAndHold: true},
				{type: 'customtoolitem',  id: 'next', command: 'next', text: _UNO('.uno:PageDown', 'text'), pressAndHold: true},
				{type: 'separator', id: 'prevnextbreak', orientation: 'vertical'},
				{text: _UNO('.uno:ZoomPlus', 'text'), id: 'zoomin', command: 'zoomin', type: 'toolitem' },
				{type: 'menubutton', id: 'zoom', text: '100', selected: 'zoom100', menu: this._generateZoomItems(), image: false},
				{text: _UNO('.uno:ZoomMinus', 'text'), id: 'zoomout', command: 'zoomout', type: 'toolitem', },{type: 'separator', orientation: 'vertical'},
				{text: _('Reset zoom'), id: 'zoomreset', command: 'zoomreset', type: 'toolitem' },
				{type: 'spacer', id: 'before-permissionmode'},
				this._generateHtmlItem('permissionmode'),
				{type: 'spacer', id: 'after-permissionmode'},
				{type: 'customtoolitem',  id: 'mobile_wizard', command: 'mobile_wizard'},
				{type: 'customtoolitem',  id: 'insertion_mobile_wizard', command: 'insertion_mobile_wizard'},
				{type: 'customtoolitem',  id: 'comment_wizard', command: 'comment_wizard', w2icon: 'viewcomments'},
				{type: 'customtoolitem', id: 'fullscreen-' + this.docType, text: _UNO('.uno:FullScreen', this.docType)},
				{type: 'menubutton', id: 'userlist:UsersListMenu', visible: false},
			];
		} else if (this.docType == 'drawing') {
			return [
				{type: 'toolitem', id: 'signstatus', command: '.uno:Signature', w2icon: '', text: _UNO('.uno:Signature'), visible: false},
				{type: 'toolitem',  id: 'undo', text: _UNO('.uno:Undo'), command: '.uno:Undo', enabled: false},
				{type: 'toolitem',  id: 'redo', text: _UNO('.uno:Redo'), command: '.uno:Redo', enabled: false},
				{type: 'customtoolitem',  id: 'prev', command: 'prev', text: _UNO('.uno:PageUp', 'text'), pressAndHold: true},
				{type: 'customtoolitem',  id: 'next', command: 'next', text: _UNO('.uno:PageDown', 'text'), pressAndHold: true},
				{type: 'separator', id: 'prevnextbreak', orientation: 'vertical'},
				{text: _UNO('.uno:ZoomPlus', 'text'), id: 'zoomin', command: 'zoomin', type: 'toolitem' },
				{type: 'menubutton', id: 'zoom', text: '100', selected: 'zoom100', menu: this._generateZoomItems(), image: false},
				{text: _UNO('.uno:ZoomMinus', 'text'), id: 'zoomout', command: 'zoomout', type: 'toolitem', },{type: 'separator', orientation: 'vertical'},
				{text: _('Reset zoom'), id: 'zoomreset', command: 'zoomreset', type: 'toolitem' },
				{type: 'spacer', id: 'before-PermissionMode'},
				this._generateHtmlItem('permissionmode'),
				{type: 'spacer', id: 'after-PermissionMode'},
				{type: 'customtoolitem',  id: 'mobile_wizard', command: 'mobile_wizard'},
				{type: 'customtoolitem',  id: 'insertion_mobile_wizard', command: 'insertion_mobile_wizard'},
				{type: 'customtoolitem',  id: 'comment_wizard', command: 'comment_wizard', w2icon: 'viewcomments'},
				{type: 'menubutton', id: 'userlist:UsersListMenu', visible: false},
			];
		}
	}

	create() {
		const items = this.getToolItems();
		this.builder.build(this.parentContainer, items);
	}

	onUpdatePermission(e: any) {
		const toolbarButtons: string[] = ['undo', 'redo', 'mobile_wizard', 'insertion_mobile_wizard', 'comment_wizard'];
		if (e.detail.perm === 'edit') {
			toolbarButtons.forEach((id) => {
				this.showItem(id, true);
			});
			this.showItem('PermissionMode', false);
		} else {
			toolbarButtons.forEach((id) => {
				this.showItem(id, false);
			});
			this.showItem('comment_wizard', false);
			if ($('#mobile-edit-button').is(':hidden')) {
				this.showItem('PermissionMode', true);
			}
		}
	}

	onCommandStateChanged(e: any) {
		const commandName: string = e.commandName;
		const state: string = e.state;

		if (this.map.isEditMode() && (state === 'enabled' || state === 'disabled')) {
			const id: string = (window as any).unoCmdToToolbarId(commandName);

			if (state === 'enabled') {
				this.enableItem(id, true);
			} else {
				//this.uncheck(id);
				this.enableItem(id, false);
			}
		}
	}

	_generateHtmlItem(id: string) {
		const isReadOnlyMode: boolean = app.map ? app.isReadOnly() : true;
		const canUserWrite: boolean = !app.isReadOnly();

		return {
			type: 'container',
			id: id + '-container',
			children: [
				{type: 'htmlcontent', id: id, htmlId: id, text: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp', isReadOnlyMode: isReadOnlyMode, canUserWrite: canUserWrite, visible: false},
				{type: 'spacer', id: id + '-break'}
			],
			vertical: false,
		};
	}
}

JSDialog.MobileTopBar = function (map: any) {
	return new MobileTopBar(map);
};
