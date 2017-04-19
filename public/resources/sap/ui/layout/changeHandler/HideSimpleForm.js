/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/changeHandler/JsControlTreeModifier'],function(q,J){"use strict";var H={};H.applyChange=function(c,C,p){var m=p.modifier;var v=p.view;var a=p.appComponent;var o=c.getDefinition();var r=m.bySelector(o.content.elementSelector||o.content.sHideId,a,v);var b=m.getAggregation(C,"content");var s=-1;if(o.changeType==="hideSimpleFormField"){b.some(function(f,i){if(f===r){s=i;m.setVisible(f,false);}if(s>=0&&i>s){if((m.getControlType(f)==="sap.m.Label")||(m.getControlType(f)==="sap.ui.core.Title")||(m.getControlType(f)==="sap.m.Title")||(m.getControlType(f)==="sap.m.Toolbar")){return true;}else{m.setVisible(f,false);}}});}else if(o.changeType==="removeSimpleFormGroup"){b.some(function(f,i){if(f===r){s=i;}if(s>=0&&i>s){if((m.getControlType(f)==="sap.ui.core.Title")||(m.getControlType(f)==="sap.m.Title")||(m.getControlType(f)==="sap.m.Toolbar")){if(s===0){m.removeAggregation(C,"content",f,v);m.insertAggregation(C,"content",f,0,v);}return true;}else{m.setVisible(f,false);}}});m.removeAggregation(C,"content",r,v);}return true;};H._getStableElement=function(e){if(e.getMetadata().getName()==="sap.ui.layout.form.FormContainer"){return e.getTitle()||e.getToolbar();}else if(e.getMetadata().getName()==="sap.ui.layout.form.FormElement"){return e.getLabel();}else{return e;}};H.completeChangeContent=function(c,s,p){var C=c.getDefinition();if(s.removedElement&&s.removedElement.id){var S=this._getStableElement(sap.ui.getCore().byId(s.removedElement.id));C.content.elementSelector=J.getSelector(S,p.appComponent);}else{throw new Error("oSpecificChangeInfo.removedElement.id attribute required");}};H.buildStableChangeInfo=function(r){return r;};return H;},true);
