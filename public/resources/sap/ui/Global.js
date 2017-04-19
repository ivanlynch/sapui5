/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','jquery.sap.dom'],function(q){"use strict";if(window.OpenAjax&&window.OpenAjax.hub){OpenAjax.hub.registerLibrary("sap","http://www.sap.com/","0.1",{});}if(typeof window.sap!=="object"&&typeof window.sap!=="function"){window.sap={};}if(typeof window.sap.ui!=="object"){window.sap.ui={};}sap.ui=q.extend(sap.ui,{version:"1.44.11",buildinfo:{lastchange:"",buildtime:"20170410-1221"}});var c=window["sap-ui-config"]||{};var s=0;if(c['xx-nosync']==='warn'||/(?:\?|&)sap-ui-xx-nosync=(?:warn)/.exec(window.location.search)){s=1;}if(c['xx-nosync']===true||c['xx-nosync']==='true'||/(?:\?|&)sap-ui-xx-nosync=(?:x|X|true)/.exec(window.location.search)){s=2;}var v=null;sap.ui.getVersionInfo=function(o){if(typeof o!=="object"){o={library:o};}o.async=o.async===true;o.failOnError=o.failOnError!==false;if(!sap.ui.versioninfo){if(o.async&&v instanceof Promise){return v.then(function(){return sap.ui.getVersionInfo(o);});}var h=function(V){v=null;if(V===null){return undefined;}sap.ui.versioninfo=V;return sap.ui.getVersionInfo(o);};var H=function(e){v=null;throw e;};var r=q.sap.loadResource("sap-ui-version.json",{async:o.async,failOnError:o.async||o.failOnError});if(r instanceof Promise){v=r;return r.then(h,H);}else{return h(r);}}else{var R;if(typeof o.library!=="undefined"){var L=sap.ui.versioninfo.libraries;if(L){for(var i=0,l=L.length;i<l;i++){if(L[i].name===o.library){R=L[i];break;}}}}else{R=sap.ui.versioninfo;}return o.async?Promise.resolve(R):R;}};sap.ui.namespace=function(n){return q.sap.getObject(n,0);};sap.ui.lazyRequire=function(C,m,M){if(s===2){q.sap.log.error("[nosync] lazy stub creation ignored for '"+C+"'");return;}var f=C.replace(/\//gi,"\."),l=f.lastIndexOf("."),p=f.substr(0,l),a=f.substr(l+1),P=q.sap.getObject(p,0),o=P[a],b=(m||"new").split(" "),d=b.indexOf("new");M=M||f;if(!o){if(d>=0){o=function(){if(s){if(s===1){q.sap.log.error("[nosync] lazy stub for constructor '"+f+"' called");}}else{q.sap.log.debug("lazy stub for constructor '"+f+"' called.");}q.sap.require(M);var r=P[a];if(r._sapUiLazyLoader){throw new Error("lazyRequire: stub '"+f+"'has not been replaced by module '"+M+"'");}var i=q.sap.newObject(r.prototype);var R=r.apply(i,arguments);if(R&&(typeof R==="function"||typeof R==="object")){i=R;}return i;};o._sapUiLazyLoader=true;b.splice(d,1);}else{o={};}P[a]=o;}q.each(b,function(i,e){if(!o[e]){o[e]=function(){if(s){if(s===1){q.sap.log.error("[no-sync] lazy stub for method '"+f+"."+e+"' called");}}else{q.sap.log.debug("lazy stub for method '"+f+"."+e+"' called.");}q.sap.require(M);var r=P[a];if(r[e]._sapUiLazyLoader){throw new Error("lazyRequire: stub '"+f+"."+e+"' has not been replaced by loaded module '"+M+"'");}return r[e].apply(r,arguments);};o[e]._sapUiLazyLoader=true;}});};sap.ui.lazyRequire._isStub=function(C){var l=C.lastIndexOf("."),a=C.slice(0,l),p=C.slice(l+1),o=q.sap.getObject(a);return!!(o&&typeof o[p]==="function"&&o[p]._sapUiLazyLoader);};sap.ui.resource=function(l,r){var m=r.match(/^themes\/([^\/]+)\//);if(m){l+=".themes."+m[1];r=r.substr(m[0].length);}return q.sap.getModulePath(l,'/')+r;};sap.ui.localResources=function(n){q.sap.registerModulePath(n,"./"+n.replace(/\./g,"/"));};return sap.ui;});
