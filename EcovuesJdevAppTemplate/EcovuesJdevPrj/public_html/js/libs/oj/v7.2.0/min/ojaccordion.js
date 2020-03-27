/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(["ojs/ojcore","jquery","ojs/ojlogger","ojs/ojcomponentcore","ojs/ojcollapsible"],function(e,t,i){"use strict";var o={properties:{expanded:{type:"Array<string>|Array<number>|Array<Object>",writeback:!0},multiple:{type:"boolean",value:!1},translations:{type:"object",value:{}}},methods:{refresh:{},setProperty:{},getProperty:{},setProperties:{},getNodeBySubId:{},getSubIdByNode:{}},events:{ojBeforeExpand:{},ojExpand:{},ojBeforeCollapse:{},ojCollapse:{}},extension:{}};e.__registerWidget("oj.ojAccordion",t.oj.baseComponent,{widgetEventPrefix:"oj",options:{multiple:!1,expanded:null,beforeExpand:null,expand:null,beforeCollapse:null,collapse:null},_ComponentCreate:function(){this._super(),this.element.addClass("oj-accordion oj-component").attr("role","group"),this.options.expanded=this._expandedIndexToId(this.options.expanded),this._refresh()},_NotifyContextMenuGesture:function(e,t,i){this._OpenContextMenu(t,i,{launcher:this.element.find(".oj-collapsible-header-icon").first()})},_destroy:function(){this.element.removeClass("oj-accordion oj-component").removeAttr("role"),this.element.children().removeClass("oj-accordion-collapsible"),this.element.children(".oj-accordion-created").removeClass("oj-accordion-created").ojCollapsible("destroy")},_setOption:function(e,t,i){if("multiple"===e)!t&&this.options.multiple&&this.element.children(".oj-expanded").first().siblings(".oj-collapsible").ojCollapsible("collapse",!1);else if("expanded"===e)return void this._setExpandedOption(t);this._super(e,t,i)},refresh:function(){this._super(),this._refresh()},_refresh:function(){this._makeCollapsible(),this._internalSetExpanded=!0,this._setExpandedOption(this.options.expanded),this._internalSetExpanded=!1,this._setupEvents()},_makeCollapsible:function(){this.collapsibles=this.element.children().not("oj-menu"),this._IsCustomElement()?(this.element.children("oj-collapsible").each(function(e,t){t.setAttribute("expand-area","header")}),this.collapsibles.not("oj-collapsible").ojCollapsible({expandArea:"header"}).addClass("oj-accordion-created").attr("data-oj-internal","")):(this.element.children(":oj-collapsible").each(function(){t(this).ojCollapsible("option","expandArea","header")}),this.collapsibles.not(":oj-ojCollapsible").ojCollapsible({expandArea:"header"}).addClass("oj-accordion-created").attr("data-oj-internal","")),this.collapsibles.addClass("oj-accordion-collapsible")},_setupEvents:function(){var e;e=this._IsCustomElement()?{keydown:this._keydown,ojBeforeExpand:this._beforeExpandHandler,ojExpand:this._expandHandler,ojBeforeCollapse:this._beforeCollapseHandler,ojCollapse:this._collapseHandler}:{keydown:this._keydown,ojbeforeexpand:this._beforeExpandHandler,ojexpand:this._expandHandler,ojbeforecollapse:this._beforeCollapseHandler,ojcollapse:this._collapseHandler},this._off(this.collapsibles),this._on(this.collapsibles,e)},_keydown:function(e){if(!e.altKey&&!e.ctrlKey&&(t(e.target).hasClass("oj-collapsible-header")||t(e.target).hasClass("oj-collapsible-header-icon"))){var i=t.ui.keyCode,o=this.collapsibles.not(".oj-disabled"),n=o.length,l=t(e.target).closest(".oj-collapsible"),a=o.index(l),s=!1;if(a>=0)switch(e.keyCode){case i.RIGHT:case i.DOWN:s=o[(a+1)%n];break;case i.LEFT:case i.UP:s=o[(a-1+n)%n];break;case i.HOME:s=o[0];break;case i.END:s=o[n-1]}s&&(l&&t(l).trigger("ojfocusout"),t(s).trigger("ojfocus"),e.preventDefault())}},_findTargetSiblings:function(e){if(!this.options.multiple){var i=t(e.target).closest(".oj-collapsible");if(i.parent().is(":oj-ojAccordion"))return i.siblings(".oj-collapsible.oj-expanded").map(function(){return t(this).data("oj-ojCollapsible")})}return t()},_beforeExpandHandler:function(e,i){if(!this._isTargetMyCollapsible(e))return!0;var o;this._expandTarget=t(e.target);var n=null;if(this._findTargetSiblings(e).each(function(){var t={header:(n=this.element).find(".oj-collapsible-header"),content:n.find(".oj-collapsible-content")};return(o=this._trigger("beforeCollapse",e,t))||(this._expandTarget=null),o}),!this.options.multiple){var l=this._initEventData(n,this._expandTarget);o=this._trigger("beforeExpand",e,l)}var a=this;return o&&this._findTargetSiblings(e).each(function(){this.collapse(!1,e,i),a._collapsedCollapsible=this.widget()}),o},_expandHandler:function(e,i){var o=null;if(this._collapsedCollapsible&&(o=this._collapsedCollapsible,this._collapsedCollapsible=null),this._isTargetMyCollapsible(e)&&!this._duringSetExpandedOption){var n,l=this;this._findTargetSiblings(e).each(function(){this.collapse(!1,e,i),n=l._initEventData(this.element,t(e.target))}),n||(n=l._initEventData(o,t(e.target))),this.options.multiple||this._trigger("expand",e,n),this._updateExpanded(),this._expandTarget=null}},_beforeCollapseHandler:function(e,t){var i=t;return!(this._isTargetMyCollapsible(e)&&!this.options.multiple)||(!i&&e.originalEvent instanceof CustomEvent&&(i=e.originalEvent.detail),this._trigger("beforeCollapse",e,this._initCollapseEventData(e,i)))},_collapseHandler:function(e,t){var i=t;if(!this._duringSetExpandedOption&&this._isTargetMyCollapsible(e)){!i&&e.originalEvent instanceof CustomEvent&&(i=e.originalEvent.detail);var o=this._initCollapseEventData(e,i);this.options.multiple||this._trigger("collapse",e,o),this._updateExpanded()}},_initEventData:function(e,t){return{fromCollapsible:e,toCollapsible:t}},_initCollapseEventData:function(e,i){var o;return i.toCollapsible?o=i:e.originalEvent&&e.originalEvent.target&&(o=this._initEventData(t(e.target),this._expandTarget)),!o&&this._expandTarget&&(o=this._initEventData(t(e.target),this._expandTarget)),o},_isTargetMyCollapsible:function(e){return t(e.target).is(this.collapsibles)},_updateExpanded:function(){var i,o,n=[];this.collapsibles.each(function(e){("oj-collapsible"===this.tagName.toLowerCase()?this.expanded:t(this).ojCollapsible("option","expanded"))&&(o={},(i=t(this).attr("id"))&&(o.id=i),o.index=e,n.push(o))}),this.options.expanded&&e.Object._compareArrayIdIndexObject(n,this.options.expanded)||this.option("expanded",n,{_context:{internalSet:!0,writeback:!0}})},_expandedIndexToId:function(e){if(Array.isArray(e)){for(var i,o=[],n=[],l=0;l<e.length;l++){var a=e[l];"number"==typeof a||"string"==typeof a?n.push(a):"number"==typeof a.index?n.push(a.index):"string"==typeof a.id&&n.push(a.id)}return this.element.children().each(function(e){(i=t(this).attr("id"))?-1===n.indexOf(i)&&-1===n.indexOf(e)||o.push({id:i,index:e}):-1!==n.indexOf(e)&&o.push({index:e})}),!this.options.multiple&&o.length>1&&(o=[o[o.length-1]]),o}return null},_setExpandedOption:function(e){var o=e;if(this._internalSetExpanded||(o=this._expandedIndexToId(o)),o){var n,l,a,s,r=this,d=0;this.collapsibles.each(function(e){n=t(this),l=n.attr("id"),a=!1,(s=o[d])&&(l?l===s.id&&(a=!0):e===s.index&&(a=!0),a&&(d+=1));var p="oj-collapsible"===this.tagName.toLowerCase();(p?this.expanded:n.ojCollapsible("option","expanded"))!==a&&(i.warn("JET Accordion: override collapsible "+e+" expanded setting"),r._duringSetExpandedOption=!0,p?this.expanded=a:n.ojCollapsible("option","expanded",a),r._duringSetExpandedOption=!1)})}this._updateExpanded()},getNodeBySubId:function(e){if(null==e)return this.element?this.element[0]:null;var i=e.subId,o=e.index;if("number"!=typeof o||o<0||o>=this.collapsibles.length)return null;var n=this.collapsibles[o];switch(i){case"oj-accordion-content":i="oj-collapsible-content";break;case"oj-accordion-header":i="oj-collapsible-header";break;case"oj-accordion-disclosure":case"oj-accordion-header-icon":i="oj-collapsible-disclosure";break;case"oj-accordion-collapsible":return n;default:return null}return t(n).ojCollapsible("getNodeBySubId",{subId:i})},getSubIdByNode:function(e){for(var i=-1,o=e;o&&-1===(i=Array.prototype.indexOf.call(this.collapsibles,o));)o=o.parentElement;var n=null;if(-1!==i){var l=t(this.collapsibles[i]).ojCollapsible("getSubIdByNode",e);switch((l=l||{}).subId){case"oj-collapsible-content":n="oj-accordion-content";break;case"oj-collapsible-header":n="oj-accordion-header";break;case"oj-collapsible-disclosure":case"oj-collapsible-header-icon":n="oj-accordion-disclosure";break;default:n="oj-accordion-collapsible"}}return n?{subId:n,index:i}:null},_CompareOptionValues:function(t,i,o){return"expanded"===t?e.Object.compareValues(i,o):this._super(t,i,o)}}),o.extension._WIDGET_NAME="ojAccordion",o.extension._TRACK_CHILDREN="nearestCustomElement",e.CustomElementBridge.register("oj-accordion",{metadata:o})});