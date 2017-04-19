/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Base'],function(q,B){"use strict";var S={};S.applyChange=function(c,C,p){p.modifier.setVisible(C,false);p.modifier.setStashed(C,true);return true;};S.completeChangeContent=function(c,s){};S.buildStableChangeInfo=function(r){return r;};return S;},true);
