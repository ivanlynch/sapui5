/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/dt/test/Test','sap/ui/dt/DesignTime','sap/ui/dt/test/Element'],function(q,T,D,E){"use strict";var a=T.extend("sap.ui.dt.test.ElementEnablementTest",{metadata:{library:"sap.ui.dt",properties:{type:{type:"string"},create:{type:"any"},timeout:{type:"int",defaultValue:0},groupPostfix:{type:"string"}}}});a.prototype.init=function(){this._aAggregatedTestResult=null;this._aAggregatedInfoResult=null;this._sAggregation=null;this._$TestAreaDomRef=null;};a.prototype.exit=function(){if(this._oDesignTime){this._oDesignTime.destroy();}window.clearTimeout(this._iTimeout);this._oElement.destroy();if(this._$TestAreaDomRef){this._$TestAreaDomRef.remove();delete this._$TestAreaDomRef;}};a.prototype.run=function(){var t=this;return this._setup().then(function(){t._mResult=t.createSuite("Element Enablement Test");var e=t.addGroup(t._mResult.children,t.getType(),"Given that an DesignTime is created for "+t.getType());t._testAggregations(e.children);t._mResult=t.aggregate(t._mResult);return t._mResult;});};a.prototype._createElement=function(){var t=this.getType();var c=this.getCreate();var b=q.sap.getObject(t);var e;if(c){e=c();}else{e=new b();}if(e.addStyleClass){e.addStyleClass("minSize");}return e;};a.prototype._getTestArea=function(){if(!this._$TestAreaDomRef){this._$TestAreaDomRef=q("<div id='"+this.getId()+"--testArea"+"'></div>").css({height:"500px",width:"1000px"}).appendTo("body");}return this._$TestAreaDomRef;};a.prototype._setup=function(){var t=this;window.clearTimeout(this._iTimeout);this._bNoRenderer=false;this._bErrorDuringRendering=false;return new Promise(function(r,R){t._oElement=t._createElement();try{t._oElement.getRenderer();}catch(e){t._bNoRenderer=true;}if(!t._bNoRenderer){try{t._oElement.placeAt(t._getTestArea().get(0));sap.ui.getCore().applyChanges();}catch(e){t._bErrorDuringRendering=true;}if(!t._bErrorDuringRendering){t._oDesignTime=new D({rootElements:[t._oElement]});t._oDesignTime.attachEventOnce("synced",function(){sap.ui.getCore().applyChanges();if(t.getTimeout()){t._iTimeout=window.setTimeout(function(){r();},t.getTimeout());}else{r();}},t);}else{r();}}else{r();}});};a.prototype._testAggregations=function(t){var A=this.addGroup(t,"Aggregations","Each aggregation needs to be ignored or has a visible domRef maintained in the metadata",this.getGroupPostfix());if(this._bNoRenderer){this.addTest(A.children,true,"Control has no renderer","Control has no renderer, not supported by the element test (requires a special element test)",T.STATUS.UNKNOWN);}else if(this._bErrorDuringRendering){this.addTest(A.children,true,"Error during rendering","Element can't be rendered, not supported by the DesignTime (please, provide a create method for this element)",T.STATUS.ERROR);}else{var m=E.getAggregationsInfo(this._oElement);for(var s in m){var b=m[s];var c=this.addGroup(A.children,s,(b.ignored?"Aggregation ignored":"Aggregation tests"));if(!b.ignored){this.addTest(c.children,b.overlayVisible,"Overlay Visible","Overlay domRef is visible in DOM");if(b.domRefDeclared){this.addTest(c.children,b.domRefDeclared,"Dom Ref Declared","DomRef is declared in design time metadata");this.addTest(c.children,b.domRefFound,"Dom Ref Found","Declared DomRef is found in DOM");this.addTest(c.children,b.domRefVisible,"Dom Ref Visible","Declared DomRef is visible");}else{if(b.overlayVisible){this.addTest(c.children,b.overlayGeometryCalculatedByChildren,"Overlay Geometry calculated by children","Control might work based on DT Heuristic, but safer with domRefDeclared",T.STATUS.PARTIAL_SUPPORTED);}else{this.addTest(c.children,false,"Overlay Dom Ref","Overlay domRef is not declared and aggregation overlay is not visible (please, declare domRef for this aggregation)",T.STATUS.PARTIAL_SUPPORTED);}}if(b.overlayTooSmall){this.addTest(c.children,false,"Overlay too small","Aggregation Overlay is too small to be accessible, please ensure to render it big enough that it can be reach by a user. If content is needed, provide a create method for this element",T.STATUS.PARTIAL_SUPPORTED);}}}}};return a;},true);
