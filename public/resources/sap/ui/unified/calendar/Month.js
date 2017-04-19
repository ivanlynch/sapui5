/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/core/delegate/ItemNavigation','sap/ui/model/type/Date','sap/ui/unified/calendar/CalendarUtils','sap/ui/core/date/UniversalDate','sap/ui/unified/library'],function(q,C,L,I,D,a,U,l){"use strict";var M=C.extend("sap.ui.unified.calendar.Month",{metadata:{library:"sap.ui.unified",properties:{date:{type:"object",group:"Data"},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},showHeader:{type:"boolean",group:"Appearance",defaultValue:false},firstDayOfWeek:{type:"int",group:"Appearance",defaultValue:-1},nonWorkingDays:{type:"int[]",group:"Appearance",defaultValue:null},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},disabledDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"disabledDate"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},focus:{parameters:{date:{type:"object"},otherMonth:{type:"boolean"},restoreOldDate:{type:"boolean"}}}}}});M.prototype.init=function(){var s=sap.ui.getCore().getConfiguration().getCalendarType();this.setProperty("primaryCalendarType",s);this.setProperty("secondaryCalendarType",s);this._oFormatYyyymmdd=sap.ui.core.format.DateFormat.getInstance({pattern:"yyyyMMdd",calendarType:sap.ui.core.CalendarType.Gregorian});this._oFormatLong=sap.ui.core.format.DateFormat.getInstance({style:"long",calendarType:s});this._mouseMoveProxy=q.proxy(this._handleMouseMove,this);this._iColumns=7;};M.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}if(this._sInvalidateMonth){q.sap.clearDelayedCall(this._sInvalidateMonth);}};M.prototype.onAfterRendering=function(){_.call(this);m.call(this);};M.prototype.onsapfocusleave=function(E){if(!E.relatedControlId||!q.sap.containsOrEquals(this.getDomRef(),sap.ui.getCore().byId(E.relatedControlId).getFocusDomRef())){if(this._bMouseMove){this._unbindMousemove(true);var s=g.call(this,this._getDate());if(!s&&this._oMoveSelectedDate){g.call(this,this._oMoveSelectedDate);}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;k.call(this);}if(this._bMousedownChange){this._bMousedownChange=false;k.call(this);}}};M.prototype.invalidate=function(o){if(!this._bDateRangeChanged&&(!o||!(o instanceof sap.ui.unified.DateRange))){C.prototype.invalidate.apply(this,arguments);}else if(this.getDomRef()&&!this._sInvalidateMonth){if(this._bInvalidateSync){n.call(this);}else{this._sInvalidateMonth=q.sap.delayedCall(0,this,n,[this]);}}};M.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var r=this.removeAllAggregation("selectedDates");return r;};M.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var o=this.destroyAggregation("selectedDates");return o;};M.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var r=this.removeAllAggregation("specialDates");return r;};M.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var o=this.destroyAggregation("specialDates");return o;};M.prototype.removeAllDisabledDates=function(){this._bDateRangeChanged=true;var r=this.removeAllAggregation("disabledDates");return r;};M.prototype.destroyDisabledDates=function(){this._bDateRangeChanged=true;var o=this.destroyAggregation("disabledDates");return o;};M.prototype.setDate=function(o){e.call(this,o,false);return this;};M.prototype._setDate=function(o){var i=a._createLocalDate(o);this.setProperty("date",i,true);this._oUTCDate=o;};M.prototype._getDate=function(){if(!this._oUTCDate){this._oUTCDate=a._createUniversalUTCDate(new Date(),this.getPrimaryCalendarType());}return this._oUTCDate;};M.prototype.displayDate=function(o){e.call(this,o,true);return this;};M.prototype.setPrimaryCalendarType=function(s){this.setProperty("primaryCalendarType",s);this._oFormatLong=sap.ui.core.format.DateFormat.getInstance({style:"long",calendarType:s});if(this._oUTCDate){this._oUTCDate=U.getInstance(this._oUTCDate.getJSDate(),s);}return this;};M.prototype._newUniversalDate=function(o){var J;if((o instanceof U)){J=new Date(o.getJSDate().getTime());}else{J=new Date(o.getTime());}return U.getInstance(J,this.getPrimaryCalendarType());};M.prototype.setSecondaryCalendarType=function(s){this._bSecondaryCalendarTypeSet=true;this.setProperty("secondaryCalendarType",s);this.invalidate();this._oFormatSecondaryLong=sap.ui.core.format.DateFormat.getInstance({style:"long",calendarType:s});return this;};M.prototype._getSecondaryCalendarType=function(){var s;if(this._bSecondaryCalendarTypeSet){s=this.getSecondaryCalendarType();var p=this.getPrimaryCalendarType();if(s==p){s=undefined;}}return s;};M.prototype._getLocale=function(){var p=this.getParent();if(p&&p.getLocale){return p.getLocale();}else if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};M.prototype._getLocaleData=function(){var p=this.getParent();if(p&&p._getLocaleData){return p._getLocaleData();}else if(!this._oLocaleData){var s=this._getLocale();var o=new sap.ui.core.Locale(s);this._oLocaleData=L.getInstance(o);}return this._oLocaleData;};M.prototype._getFormatLong=function(){var s=this._getLocale();if(this._oFormatLong.oLocale.toString()!=s){var o=new sap.ui.core.Locale(s);this._oFormatLong=sap.ui.core.format.DateFormat.getInstance({style:"long",calendarType:this.getPrimaryCalendarType()},o);if(this._oFormatSecondaryLong){this._oFormatSecondaryLong=sap.ui.core.format.DateFormat.getInstance({style:"long",calendarType:this._getSecondaryCalendarType()},o);}}return this._oFormatLong;};M.prototype.getIntervalSelection=function(){var p=this.getParent();if(p&&p.getIntervalSelection){return p.getIntervalSelection();}else{return this.getProperty("intervalSelection");}};M.prototype.getSingleSelection=function(){var p=this.getParent();if(p&&p.getSingleSelection){return p.getSingleSelection();}else{return this.getProperty("singleSelection");}};M.prototype.getSelectedDates=function(){var p=this.getParent();if(p&&p.getSelectedDates){return p.getSelectedDates();}else{return this.getAggregation("selectedDates",[]);}};M.prototype.getSpecialDates=function(){var p=this.getParent();if(p&&p.getSpecialDates){return p.getSpecialDates();}else{return this.getAggregation("specialDates",[]);}};M.prototype.getDisabledDates=function(){var p=this.getParent();if(p&&p.getDisabledDates){return p.getDisabledDates();}else{return this.getAggregation("disabledDates",[]);}};M.prototype._getShowHeader=function(){var p=this.getParent();if(p&&p._getShowMonthHeader){return p._getShowMonthHeader();}else{return this.getProperty("showHeader");}};M.prototype.getAriaLabelledBy=function(){var p=this.getParent();if(p&&p.getAriaLabelledBy){return p.getAriaLabelledBy();}else{return this.getAssociation("ariaLabelledBy",[]);}};M.prototype.getLegend=function(){var p=this.getParent();if(p&&p.getLegend){return p.getLegend();}else{return this.getAssociation("ariaLabelledBy",[]);}};M.prototype._getFirstDayOfWeek=function(){var p=this.getParent();var F=0;if(p&&p.getFirstDayOfWeek){F=p.getFirstDayOfWeek();}else{F=this.getProperty("firstDayOfWeek");}if(F<0||F>6){var o=this._getLocaleData();F=o.getFirstDayOfWeek();}return F;};M.prototype._getNonWorkingDays=function(){var p=this.getParent();var N;if(p&&p.getNonWorkingDays){N=p.getNonWorkingDays();}else{N=this.getProperty("nonWorkingDays");}if(N&&!q.isArray(N)){N=[];}return N;};M.prototype._checkDateSelected=function(o){if(!(o instanceof U)){throw new Error("Date must be a UniversalDate object "+this);}var s=0;var S=this.getSelectedDates();var t=o.getTime();var p=this.getPrimaryCalendarType();for(var i=0;i<S.length;i++){var r=S[i];var u=r.getStartDate();var v=0;if(u){u=a._createUniversalUTCDate(u,p);v=u.getTime();}var E=r.getEndDate();var w=0;if(E){E=a._createUniversalUTCDate(E,p);w=E.getTime();}if(t==v&&!E){s=1;break;}else if(t==v&&E){s=2;if(E&&t==w){s=5;}break;}else if(E&&t==w){s=3;break;}else if(E&&t>v&&t<w){s=4;break;}if(this.getSingleSelection()){break;}}return s;};M.prototype._getDateType=function(o){if(!(o instanceof U)){throw new Error("Date must be a UniversalDate object "+this);}var t;var s=this.getSpecialDates();var T=o.getTime();var p=this.getPrimaryCalendarType();for(var i=0;i<s.length;i++){var r=s[i];var S=r.getStartDate();var u=0;if(S){S=a._createUniversalUTCDate(S,p);u=S.getTime();}var E=r.getEndDate();var v=0;if(E){E=a._createUniversalUTCDate(E,p);v=E.getTime();}if((T==u&&!E)||(T>=u&&T<=v)){t={type:r.getType(),tooltip:r.getTooltip_AsString()};break;}}return t;};M.prototype._checkDateEnabled=function(o){if(!(o instanceof U)){throw new Error("Date must be a UniversalDate object "+this);}var E=true;var p=this.getDisabledDates();var t=o.getTime();var s=this.getPrimaryCalendarType();var P=this.getParent();if(P&&P._oMinDate&&P._oMaxDate){if(t<P._oMinDate.getTime()||t>P._oMaxDate.getTime()){return false;}}for(var i=0;i<p.length;i++){var r=p[i];var S=r.getStartDate();var u=0;if(S){S=a._createUniversalUTCDate(S,s);u=S.getTime();}var v=r.getEndDate();var w=0;if(v){v=a._createUniversalUTCDate(v,s);w=v.getTime();}if(v){if(t>u&&t<w){E=false;break;}}else if(t==u){E=false;break;}}return E;};M.prototype.setWidth=function(w){this.setProperty("width",w,true);if(this.getDomRef()){w=this.getWidth();this.$().css("width",w);}return this;};M.prototype._handleMouseMove=function(E){if(!this.$().is(":visible")){this._unbindMousemove(true);}var t=q(E.target);if(t.hasClass("sapUiCalItemText")){t=t.parent();}if(this._sLastTargetId&&this._sLastTargetId==t.attr("id")){return;}this._sLastTargetId=t.attr("id");if(t.hasClass("sapUiCalItem")){var o=this._getDate();if(!q.sap.containsOrEquals(this.getDomRef(),E.target)){var s=this.getSelectedDates();if(s.length>0&&this.getSingleSelection()){var S=s[0].getStartDate();if(S){S=a._createUniversalUTCDate(S,this.getPrimaryCalendarType());}var i=this._newUniversalDate(this._oFormatYyyymmdd.parse(t.attr("data-sap-day"),true));if(i.getTime()>=S.getTime()){h.call(this,S,i);}else{h.call(this,i,S);}}}else{var F=this._newUniversalDate(this._oFormatYyyymmdd.parse(t.attr("data-sap-day"),true));if(F.getTime()!=o.getTime()){if(t.hasClass("sapUiCalItemOtherMonth")){this.fireFocus({date:a._createLocalDate(F),otherMonth:true});}else{this._setDate(F);var p=g.call(this,F,true);if(p){this._oMoveSelectedDate=this._newUniversalDate(F);}this._bMoveChange=true;}}}}};M.prototype.onmouseup=function(E){if(this._bMouseMove){this._unbindMousemove(true);var F=this._getDate();var o=this._oItemNavigation.getItemDomRefs();for(var i=0;i<o.length;i++){var $=q(o[i]);if(!$.hasClass("sapUiCalItemOtherMonth")){if($.attr("data-sap-day")==this._oFormatYyyymmdd.format(F.getJSDate(),true)){$.focus();break;}}}if(this._bMoveChange){var s=g.call(this,F);if(!s&&this._oMoveSelectedDate){g.call(this,this._oMoveSelectedDate);}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;k.call(this);}}if(this._bMousedownChange){this._bMousedownChange=false;k.call(this);}};M.prototype.onsapselect=function(E){var s=g.call(this,this._getDate());if(s){k.call(this);}E.stopPropagation();E.preventDefault();};M.prototype.onsapselectmodifiers=function(E){this.onsapselect(E);};M.prototype.onsappageupmodifiers=function(E){var F=this._newUniversalDate(this._getDate());var y=F.getUTCFullYear();if(E.metaKey||E.ctrlKey){F.setUTCFullYear(y-10);}else{F.setUTCFullYear(y-1);}this.fireFocus({date:a._createLocalDate(F),otherMonth:true});E.preventDefault();};M.prototype.onsappagedownmodifiers=function(E){var F=this._newUniversalDate(this._getDate());var y=F.getUTCFullYear();if(E.metaKey||E.ctrlKey){F.setUTCFullYear(y+10);}else{F.setUTCFullYear(y+1);}this.fireFocus({date:a._createLocalDate(F),otherMonth:true});E.preventDefault();};M.prototype._updateSelection=function(){var s=this.getSelectedDates();if(s.length>0){var i=this.getPrimaryCalendarType();var S=s.map(function(o){var p=o.getStartDate();if(p){return a._createUniversalUTCDate(p,i);}});var E=s[0].getEndDate();if(E){E=a._createUniversalUTCDate(E,i);}h.call(this,S,E);}};M.prototype._bindMousemove=function(F){q(window.document).bind('mousemove',this._mouseMoveProxy);this._bMouseMove=true;if(F){this.fireEvent("_bindMousemove");}};M.prototype._unbindMousemove=function(F){q(window.document).unbind('mousemove',this._mouseMoveProxy);this._bMouseMove=undefined;this._sLastTargetId=undefined;if(F){this.fireEvent("_unbindMousemove");}};M.prototype.onThemeChanged=function(){if(this._bNoThemeChange){return;}this._bNamesLengthChecked=undefined;this._bLongWeekDays=undefined;var w=this.$().find(".sapUiCalWH");var o=this._getLocaleData();var s=this._getFirstWeekDay();var p=o.getDaysStandAlone("abbreviated",this.getPrimaryCalendarType());for(var i=0;i<w.length;i++){var W=w[i];q(W).text(p[(i+s)%7]);}m.call(this);};M.prototype._handleBorderReached=function(o){var E=o.getParameter("event");var i=0;var O=this._getDate();var F=this._newUniversalDate(O);if(E.type){switch(E.type){case"sapnext":case"sapnextmodifiers":if(E.keyCode==q.sap.KeyCodes.ARROW_DOWN){F.setUTCDate(F.getUTCDate()+7);}else{F.setUTCDate(F.getUTCDate()+1);}break;case"sapprevious":case"sappreviousmodifiers":if(E.keyCode==q.sap.KeyCodes.ARROW_UP){F.setUTCDate(F.getUTCDate()-7);}else{F.setUTCDate(F.getUTCDate()-1);}break;case"sappagedown":i=F.getUTCMonth()+1;F.setUTCMonth(i);if(i%12!=F.getUTCMonth()){while(i!=F.getUTCMonth()){F.setUTCDate(F.getUTCDate()-1);}}break;case"sappageup":i=F.getUTCMonth()-1;F.setUTCMonth(i);if(i<0){i=11;}if(i!=F.getUTCMonth()){while(i!=F.getUTCMonth()){F.setUTCDate(F.getUTCDate()-1);}}break;default:break;}this.fireFocus({date:a._createLocalDate(F),otherMonth:true});}};M.prototype.checkDateFocusable=function(o){if(!(o instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}var i=this._getDate();var u=a._createUniversalUTCDate(o,this.getPrimaryCalendarType());if(u.getUTCFullYear()==i.getUTCFullYear()&&u.getUTCMonth()==i.getUTCMonth()){return true;}else{return false;}};M.prototype._renderHeader=function(){if(this._getShowHeader()){var o=this._getDate();var i=this._getLocaleData();var p=i.getMonthsStandAlone("wide",this.getPrimaryCalendarType());this.$("Head").text(p[o.getUTCMonth()]);}};M.prototype._getFirstWeekDay=function(){return this._getFirstDayOfWeek();};M.prototype._isMonthNameLong=function(w){var i;var W;for(i=0;i<w.length;i++){W=w[i];if(Math.abs(W.clientWidth-W.scrollWidth)>1){return true;}}return false;};function _(){var o=this._getDate();var y=this._oFormatYyyymmdd.format(o.getJSDate(),true);var p=0;var r=this.$("days").get(0);var s=this.$("days").find(".sapUiCalItem");for(var i=0;i<s.length;i++){var $=q(s[i]);if($.attr("data-sap-day")===y){p=i;break;}}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.attachEvent(I.Events.AfterFocus,b,this);this._oItemNavigation.attachEvent(I.Events.FocusAgain,c,this);this._oItemNavigation.attachEvent(I.Events.BorderReached,this._handleBorderReached,this);this.addDelegate(this._oItemNavigation);if(this._iColumns>1){this._oItemNavigation.setHomeEndColumnMode(true,true);}this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(this._iColumns,true);}this._oItemNavigation.setRootDomRef(r);this._oItemNavigation.setItemDomRefs(s);this._oItemNavigation.setFocusedIndex(p);this._oItemNavigation.setPageSize(s.length);}function b(o){var p=o.getParameter("index");var E=o.getParameter("event");if(!E){return;}var O=this._getDate();var F=this._newUniversalDate(O);var r=false;var s=true;var t=this._oItemNavigation.getItemDomRefs();var i=0;var $=q(t[p]);var u;if($.hasClass("sapUiCalItemOtherMonth")){if(E.type=="saphomemodifiers"&&(E.metaKey||E.ctrlKey)){F.setUTCDate(1);this._focusDate(F);}else if(E.type=="sapendmodifiers"&&(E.metaKey||E.ctrlKey)){for(i=t.length-1;i>0;i--){u=q(t[i]);if(!u.hasClass("sapUiCalItemOtherMonth")){F=this._newUniversalDate(this._oFormatYyyymmdd.parse(u.attr("data-sap-day"),true));break;}}this._focusDate(F);}else{r=true;F=this._newUniversalDate(this._oFormatYyyymmdd.parse($.attr("data-sap-day"),true));if(!F){F=this._newUniversalDate(O);}this._focusDate(O);if(E.type=="mousedown"||(this._sTouchstartYyyyMMdd&&E.type=="focusin"&&this._sTouchstartYyyyMMdd==$.attr("data-sap-day"))){s=false;this.fireFocus({date:a._createLocalDate(O),otherMonth:false,restoreOldDate:true});}if(E.originalEvent&&E.originalEvent.type=="touchstart"){this._sTouchstartYyyyMMdd=$.attr("data-sap-day");}else{this._sTouchstartYyyyMMdd=undefined;}}}else{if(q(E.target).hasClass("sapUiCalWeekNum")){this._focusDate(F);}else{F=this._newUniversalDate(this._oFormatYyyymmdd.parse($.attr("data-sap-day"),true));this._setDate(F);}this._sTouchstartYyyyMMdd=undefined;}if(E.type=="mousedown"&&this.getIntervalSelection()){this._sLastTargetId=$.attr("id");}if(s){this.fireFocus({date:a._createLocalDate(F),otherMonth:r});}if(E.type=="mousedown"){d.call(this,E,F,p);}}function c(o){var i=o.getParameter("index");var E=o.getParameter("event");if(!E){return;}if(E.type=="mousedown"){var F=this._getDate();if(this.getIntervalSelection()){var p=this._oItemNavigation.getItemDomRefs();this._sLastTargetId=p[i].id;}d.call(this,E,F,i);}}function d(E,F,i){if(E.button){return;}var s=g.call(this,F);if(s){this._bMousedownChange=true;}if(this._bMouseMove){this._unbindMousemove(true);this._bMoveChange=false;this._oMoveSelectedDate=undefined;}else if(s&&this.getIntervalSelection()&&this.$().is(":visible")){this._bindMousemove(true);this._oMoveSelectedDate=this._newUniversalDate(F);}E.preventDefault();E.setMark("cancelAutoClose");}function e(o,N){if(!(o instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}var y=o.getFullYear();if(y<1||y>9999){throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); "+this);}var F=true;if(!q.sap.equal(this.getDate(),o)){var u=a._createUniversalUTCDate(o,this.getPrimaryCalendarType());F=this.checkDateFocusable(o);this.setProperty("date",o,true);this._oUTCDate=u;}if(this.getDomRef()){if(F){this._focusDate(this._oUTCDate,true,N);}else{f.call(this,N);}}}M.prototype._focusDate=function(o,N,p){if(!N){this.setDate(a._createLocalDate(new Date(o.getTime())));}var y=this._oFormatYyyymmdd.format(o.getJSDate(),true);var r=this._oItemNavigation.getItemDomRefs();var $;for(var i=0;i<r.length;i++){$=q(r[i]);if($.attr("data-sap-day")==y){if(document.activeElement!=r[i]){if(p){this._oItemNavigation.setFocusedIndex(i);}else{this._oItemNavigation.focusItem(i);}}break;}}};function f(N){var o=this.getRenderer().getStartDate(this);var $=this.$("days");var p;var r;var i=0;var s=0;if(this._sLastTargetId){p=this._oItemNavigation.getItemDomRefs();for(i=0;i<p.length;i++){r=q(p[i]);if(r.attr("id")==this._sLastTargetId){s=i;break;}}}if($.length>0){var R=sap.ui.getCore().createRenderManager();this.getRenderer().renderDays(R,this,o);R.flush($[0]);R.destroy();}this._renderHeader();this.fireEvent("_renderMonth",{days:$.find(".sapUiCalItem").length});_.call(this);if(!N){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());}if(this._sLastTargetId){p=this._oItemNavigation.getItemDomRefs();if(s<=p.length-1){r=q(p[s]);this._sLastTargetId=r.attr("id");}}}function g(o,p){if(!this._checkDateEnabled(o)){return false;}var s=this.getSelectedDates();var r;var t=this._oItemNavigation.getItemDomRefs();var $;var y;var i=0;var P=this.getParent();var A=this;var S;var u=this.getPrimaryCalendarType();if(P&&P.getSelectedDates){A=P;}if(this.getSingleSelection()){if(s.length>0){r=s[0];S=r.getStartDate();if(S){S=a._createUniversalUTCDate(S,u);}}else{r=new sap.ui.unified.DateRange();A.addAggregation("selectedDates",r,true);}if(this.getIntervalSelection()&&(!r.getEndDate()||p)&&S){var E;if(o.getTime()<S.getTime()){E=S;S=o;if(!p){r.setProperty("startDate",a._createLocalDate(new Date(S.getTime())),true);r.setProperty("endDate",a._createLocalDate(new Date(E.getTime())),true);}}else if(o.getTime()>=S.getTime()){E=o;if(!p){r.setProperty("endDate",a._createLocalDate(new Date(E.getTime())),true);}}h.call(this,S,E);}else{h.call(this,o);r.setProperty("startDate",a._createLocalDate(new Date(o.getTime())),true);r.setProperty("endDate",undefined,true);}}else{if(this.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection");}else{var v=this._checkDateSelected(o);if(v>0){for(i=0;i<s.length;i++){S=s[i].getStartDate();if(S&&o.getTime()==a._createUniversalUTCDate(S,u).getTime()){A.removeAggregation("selectedDates",i,true);break;}}}else{r=new sap.ui.unified.DateRange({startDate:a._createLocalDate(new Date(o.getTime()))});A.addAggregation("selectedDates",r,true);}y=this._oFormatYyyymmdd.format(o.getJSDate(),true);for(i=0;i<t.length;i++){$=q(t[i]);if($.attr("data-sap-day")==y){if(v>0){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}else{$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");}}}}}return true;}function h(s,E){if(!Array.isArray(s)){s=[s];}var o=this._oItemNavigation.getItemDomRefs();var $;var i=0;var S=false;var p=false;if(!E){var F=s.map(function(t){return this._oFormatYyyymmdd.format(t.getJSDate(),true);},this);for(i=0;i<o.length;i++){$=q(o[i]);S=false;p=false;if(F.indexOf($.attr("data-sap-day"))>-1){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");S=true;}else if($.hasClass("sapUiCalItemSel")){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}if($.hasClass("sapUiCalItemSelStart")){$.removeClass("sapUiCalItemSelStart");}else if($.hasClass("sapUiCalItemSelBetween")){$.removeClass("sapUiCalItemSelBetween");}else if($.hasClass("sapUiCalItemSelEnd")){$.removeClass("sapUiCalItemSelEnd");}j.call(this,$,S,p);}}else{var r;for(i=0;i<o.length;i++){$=q(o[i]);S=false;p=false;r=this._newUniversalDate(this._oFormatYyyymmdd.parse($.attr("data-sap-day"),true));if(r.getTime()==s[0].getTime()){$.addClass("sapUiCalItemSelStart");S=true;$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");if(E&&r.getTime()==E.getTime()){$.addClass("sapUiCalItemSelEnd");p=true;}$.removeClass("sapUiCalItemSelBetween");}else if(E&&r.getTime()>s[0].getTime()&&r.getTime()<E.getTime()){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");$.addClass("sapUiCalItemSelBetween");$.removeClass("sapUiCalItemSelStart");$.removeClass("sapUiCalItemSelEnd");}else if(E&&r.getTime()==E.getTime()){$.addClass("sapUiCalItemSelEnd");p=true;$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");$.removeClass("sapUiCalItemSelStart");$.removeClass("sapUiCalItemSelBetween");}else{if($.hasClass("sapUiCalItemSel")){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}if($.hasClass("sapUiCalItemSelStart")){$.removeClass("sapUiCalItemSelStart");}else if($.hasClass("sapUiCalItemSelBetween")){$.removeClass("sapUiCalItemSelBetween");}else if($.hasClass("sapUiCalItemSelEnd")){$.removeClass("sapUiCalItemSelEnd");}}j.call(this,$,S,p);}}}function j($,s,E){if(!this.getIntervalSelection()){return;}var o="";var p=[];var r=this.getId();var t=false;o=$.attr("aria-describedby");if(o){p=o.split(" ");}var S=-1;var u=-1;for(var i=0;i<p.length;i++){var v=p[i];if(v==(r+"-Start")){S=i;}if(v==(r+"-End")){u=i;}}if(S>=0&&!s){p.splice(S,1);t=true;if(u>S){u--;}}if(u>=0&&!E){p.splice(u,1);t=true;}if(S<0&&s){p.push(r+"-Start");t=true;}if(u<0&&E){p.push(r+"-End");t=true;}if(t){o=p.join(" ");$.attr("aria-describedby",o);}}function k(){if(this._bMouseMove){this._unbindMousemove(true);}this.fireSelect();}function m(){if(!this._bNamesLengthChecked){var w;var W=this.$().find(".sapUiCalWH");var t=this._isMonthNameLong(W);var i=0;if(t){this._bLongWeekDays=false;var o=this._getLocaleData();var s=this._getFirstWeekDay();var p=o.getDaysStandAlone("narrow",this.getPrimaryCalendarType());for(i=0;i<W.length;i++){w=W[i];q(w).text(p[(i+s)%7]);}}else{this._bLongWeekDays=true;}this._bNamesLengthChecked=true;}}function n(){this._sInvalidateMonth=undefined;f.call(this,this._bNoFocus);this._bDateRangeChanged=undefined;this._bNoFocus=undefined;}return M;},true);
