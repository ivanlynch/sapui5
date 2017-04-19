/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Column','./library','sap/ui/core/Element','sap/ui/model/type/Boolean','sap/ui/model/type/DateTime','sap/ui/model/type/Float','sap/ui/model/type/Integer','sap/ui/model/type/Time','./TableUtils','./AnalyticalColumnMenu'],function(q,C,l,E,B,D,F,I,T,a,A){"use strict";function i(c){return a.isInstanceOf(c,"sap/ui/table/AnalyticalTable");}var b=C.extend("sap.ui.table.AnalyticalColumn",{metadata:{library:"sap.ui.table",properties:{leadingProperty:{type:"string",group:"Misc",defaultValue:null},summed:{type:"boolean",group:"Misc",defaultValue:false},inResult:{type:"boolean",group:"Misc",defaultValue:false},showIfGrouped:{type:"boolean",group:"Appearance",defaultValue:false},groupHeaderFormatter:{type:"any",group:"Behavior",defaultValue:null}}}});b.prototype.init=function(){C.prototype.init.apply(this,arguments);this._bSkipUpdateAI=false;};b._DEFAULT_FILTERTYPES={"Time":new T({UTC:true}),"DateTime":new D({UTC:true}),"Float":new F(),"Integer":new I(),"Boolean":new Boolean()};b.prototype._createMenu=function(){return new A(this.getId()+"-menu");};b.prototype.setGrouped=function(g,s){var p=this.getParent();var t=this;if(i(p)){if(g){p._addGroupedColumn(this.getId());}else{p._aGroupedColumns=q.grep(p._aGroupedColumns,function(v){return v!=t.getId();});}}var r=this.setProperty("grouped",g,s);this._updateColumns(true);return r;};b.prototype.setSummed=function(s){var r=this.setProperty("summed",s,true);this._updateTableAnalyticalInfo();return r;};b.prototype.setVisible=function(v,s){this.setProperty("visible",v,s);this._updateColumns();return this;};b.prototype.getLabel=function(){var L=this.getAggregation("label");if(!L){if(!this._oBindingLabel){var p=this.getParent();if(i(p)){var o=p.getBinding("rows");if(o){this._oBindingLabel=l.TableHelper.createLabel();var m=o.getModel();if(m.oMetadata&&m.oMetadata.isLoaded()){this._oBindingLabel.setText(o.getPropertyLabel(this.getLeadingProperty()));}else{var t=this;m.attachMetadataLoaded(function(){t._oBindingLabel.setText(o.getPropertyLabel(t.getLeadingProperty()));});}}}}L=this._oBindingLabel;}return L;};b.prototype.getFilterProperty=function(){var p=this.getProperty("filterProperty");if(!p){var P=this.getParent();if(i(P)){var o=P.getBinding("rows");var L=this.getLeadingProperty();if(o&&q.inArray(L,o.getFilterablePropertyNames())>-1){p=L;}}}return p;};b.prototype.getSortProperty=function(){var p=this.getProperty("sortProperty");if(!p){var P=this.getParent();if(i(P)){var o=P.getBinding("rows");var L=this.getLeadingProperty();if(o&&q.inArray(L,o.getSortablePropertyNames())>-1){p=L;}}}return p;};b.prototype.getFilterType=function(){var f=this.getProperty("filterType");if(!f){var p=this.getParent();if(i(p)){var o=p.getBinding("rows");var L=this.getLeadingProperty(),P=o&&o.getProperty(L);if(P){switch(P.type){case"Edm.Time":f=b._DEFAULT_FILTERTYPES["Time"];break;case"Edm.DateTime":case"Edm.DateTimeOffset":f=b._DEFAULT_FILTERTYPES["DateTime"];break;case"Edm.Single":case"Edm.Double":case"Edm.Decimal":f=b._DEFAULT_FILTERTYPES["Float"];break;case"Edm.SByte":case"Edm.Int16":case"Edm.Int32":case"Edm.Int64":f=b._DEFAULT_FILTERTYPES["Integer"];break;case"Edm.Boolean":f=b._DEFAULT_FILTERTYPES["Boolean"];break;}}}}return f;};b.prototype._afterSort=function(){this._updateTableAnalyticalInfo();};b.prototype._updateColumns=function(s,f){if(this._bSkipUpdateAI){return;}var p=this.getParent();if(i(p)){p._updateColumns(s,f);}};b.prototype._updateTableAnalyticalInfo=function(s){if(this._bSkipUpdateAI){return;}var p=this.getParent();if(p&&i(p)&&!p._bSuspendUpdateAnalyticalInfo){p.updateAnalyticalInfo(s);}};b.prototype._updateTableColumnDetails=function(){if(this._bSkipUpdateAI){return;}var p=this.getParent();if(p&&i(p)&&!p._bSuspendUpdateAnalyticalInfo){p._updateTableColumnDetails();}};b.prototype.shouldRender=function(){if(!this.getVisible()){return false;}return(!this.getGrouped()||this._bLastGroupAndGrouped||this.getShowIfGrouped())&&(!this._bDependendGrouped||this._bLastGroupAndGrouped);};b.prototype.getTooltip_AsString=function(){var t=E.prototype.getTooltip_AsString.apply(this);var p=this.getParent();if(!t&&i(p)){var o=p.getBinding("rows");if(o&&this.getLeadingProperty()){t=o.getPropertyQuickInfo(this.getLeadingProperty());}}return t;};b.prototype._menuHasItems=function(){var m=function(){var t=this.getParent();var o=t.getBinding("rows");var r=o&&o.getAnalyticalQueryResult();return(t&&r&&r.findMeasureByPropertyName(this.getLeadingProperty()));}.bind(this);return C.prototype._menuHasItems.apply(this)||m();};b.prototype.isFilterableByMenu=function(){var f=this.getFilterProperty();if(!f||!this.getShowFilterMenuEntry()){return false;}var p=this.getParent();if(i(p)){var o=p.getBinding("rows");if(o){if(q.inArray(f,o.getFilterablePropertyNames())>-1&&!o.isMeasure(f)&&o.getProperty(f)){return true;}}}return false;};b.prototype.isGroupableByMenu=function(){var p=this.getParent();if(i(p)){var o=p.getBinding("rows");if(o){var r=o.getAnalyticalQueryResult();if(r&&r.findDimensionByPropertyName(this.getLeadingProperty())&&q.inArray(this.getLeadingProperty(),o.getSortablePropertyNames())>-1&&q.inArray(this.getLeadingProperty(),o.getFilterablePropertyNames())>-1){return true;}}}return false;};return b;});
