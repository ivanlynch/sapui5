/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/DataType','sap/ui/base/ManagedObject','sap/ui/core/CustomData','./mvc/View','./ExtensionPoint','./StashedControlSupport'],function(q,D,M,C,V,E,S){"use strict";function p(t,v,n,c){var b=M.bindingParser(v,c,true);if(b&&typeof b==="object"){return b;}var a=v=b||v;var T=D.getType(t);if(T){if(T instanceof D){a=T.parseValue(v);}}else{throw new Error("Property "+n+" has unknown type "+t);}return typeof a==="string"?M.bindingParser.escape(a):a;}function l(x){return x.localName||x.baseName||x.nodeName;}var X={};X.loadTemplate=function(t,s){var r=q.sap.getResourceName(t,"."+(s||"view")+".xml");return q.sap.loadResource(r).documentElement;};X.parseViewAttributes=function(x,v,s){var a=v.getMetadata().getAllProperties();for(var i=0;i<x.attributes.length;i++){var b=x.attributes[i];if(b.name==='controllerName'){v._controllerName=b.value;}else if(b.name==='resourceBundleName'){v._resourceBundleName=b.value;}else if(b.name==='resourceBundleUrl'){v._resourceBundleUrl=b.value;}else if(b.name==='resourceBundleLocale'){v._resourceBundleLocale=b.value;}else if(b.name==='resourceBundleAlias'){v._resourceBundleAlias=b.value;}else if(b.name==='class'){v.addStyleClass(b.value);}else if(!s[b.name]&&a[b.name]){s[b.name]=p(a[b.name].type,b.value,b.name,v._oContainingView.oController);}}};var e=false;X.enrichTemplateIds=function(x,v){var r=(e!==false);e=true;try{X.parseTemplate(x,v);}finally{e=r;}return x;};X.parseTemplate=function(x,v){var d=sap.ui.getCore().getConfiguration().getDesignMode();var r=[];if(d){v._sapui_declarativeSourceInfo={xmlNode:x,xmlRootNode:v._oContainingView===v?x:v._oContainingView._sapui_declarativeSourceInfo.xmlRootNode};}var c=v.sViewName||v._sFragmentName;if(!c){var t=v;var L=0;while(++L<1000&&t&&t!==t._oContainingView){t=t._oContainingView;}c=t.sViewName;}if(v.isSubView()){a(x,true);}else{if(x.localName==="View"&&x.namespaceURI!=="sap.ui.core.mvc"){q.sap.log.warning("XMLView root node must have the 'sap.ui.core.mvc' namespace, not '"+x.namespaceURI+"'"+(c?" (View name: "+c+")":""));}b(x);}return r;function a(x,R,I){if(x.nodeType===1){var j=l(x);if(x.namespaceURI==="http://www.w3.org/1999/xhtml"||x.namespaceURI==="http://www.w3.org/2000/svg"){r.push("<"+j+" ");var H=false;for(var i=0;i<x.attributes.length;i++){var n=x.attributes[i];var o=n.value;if(n.name==="id"){H=true;o=m(v,x);}r.push(n.name+"=\""+q.sap.encodeHTML(o)+"\" ");}if(R===true){r.push("data-sap-ui-preserve"+"=\""+v.getId()+"\" ");if(!H){r.push("id"+"=\""+v.getId()+"\" ");}}r.push(">");if(window.HTMLTemplateElement&&x instanceof HTMLTemplateElement&&x.content instanceof DocumentFragment){b(x.content);}else{b(x);}r.push("</"+j+">");}else if(j==="FragmentDefinition"&&x.namespaceURI==="sap.ui.core"){b(x,false,true);}else{var u=h(x);for(var i=0;i<u.length;i++){var w=u[i];if(v.getMetadata().hasAggregation("content")){v.addAggregation("content",w);}else if(v.getMetadata().hasAssociation(("content"))){v.addAssociation("content",w);}r.push(w);}}}else if(x.nodeType===3&&!I){var y=x.textContent||x.text,z=l(x.parentNode);if(y){if(z!="style"){y=q.sap.encodeHTML(y);}r.push(y);}}}function b(x,R,I){var j=x.childNodes;for(var i=0;i<j.length;i++){a(j[i],R,I);}}function f(n,i){var j;var o=sap.ui.getCore().getLoadedLibraries();q.each(o,function(w,y){if(n===y.namespace||n===y.name){j=y.name+"."+((y.tagNames&&y.tagNames[i])||i);}});j=j||n+"."+i;q.sap.require(j);var u=q.sap.getObject(j);if(u){return u;}else{q.sap.log.error("Can't find object class '"+j+"' for XML-view","","XMLTemplateProcessor.js");}}function g(n){if(n.namespaceURI==="http://www.w3.org/1999/xhtml"||n.namespaceURI==="http://www.w3.org/2000/svg"){var i=n.attributes['id']?n.attributes['id'].textContent||n.attributes['id'].text:null;if(e){X.enrichTemplateIds(n,v);return[];}else{var j=sap.ui.requireSync("sap/ui/core/mvc/XMLView");return[new j({id:i?m(v,n,i):undefined,xmlNode:n,containingView:v._oContainingView})];}}else{return h(n);}}function h(n){if(l(n)==="ExtensionPoint"&&n.namespaceURI==="sap.ui.core"){return E(v,n.getAttribute("name"),function(){var j=n.childNodes;var o=[];for(var i=0;i<j.length;i++){var u=j[i];if(u.nodeType===1){o=q.merge(o,g(u));}}return o;});}else{return k(n);}}function k(n){var o=n.namespaceURI,u=f(o,l(n)),w={},y="",z=[],A=null;if(!u){return[];}var B=u.getMetadata();var K=B.getAllSettings();if(!e){for(var i=0;i<n.attributes.length;i++){var F=n.attributes[i],N=F.name,I=K[N],G=F.value;if(N==="id"){w[N]=m(v,n,G);}else if(N==="class"){y+=G;}else if(N==="viewName"){w[N]=G;}else if(N==="fragmentName"){w[N]=G;w['containingView']=v._oContainingView;}else if((N==="binding"&&!I)||N==='objectBindings'){var H=M.bindingParser(G,v._oContainingView.oController);if(H){w.objectBindings=w.objectBindings||{};w.objectBindings[H.model||undefined]=H;}}else if(N.indexOf(":")>-1){if(F.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"){var J=l(F);z.push(new C({key:J,value:p("any",G,J,v._oContainingView.oController)}));}else if(F.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1"){A=G;}else if(N.indexOf("xmlns:")!==0){q.sap.log.warning(v+": XMLView parser encountered and ignored attribute '"+N+"' (value: '"+G+"') with unknown namespace");}}else if(I&&I._iKind===0){w[N]=p(I.type,G,N,v._oContainingView.oController);}else if(I&&I._iKind===1&&I.altTypes){w[N]=p(I.altTypes[0],G,N,v._oContainingView.oController);}else if(I&&I._iKind===2){var H=M.bindingParser(G,v._oContainingView.oController);if(H){w[N]=H;}else{q.sap.log.error(v+": aggregations with cardinality 0..n only allow binding paths as attribute value (wrong value: "+N+"='"+G+"')");}}else if(I&&I._iKind===3){w[N]=v._oContainingView.createId(G);}else if(I&&I._iKind===4){w[N]=q.map(G.split(/[\s,]+/g),function(j){return j?v._oContainingView.createId(j):null;});}else if(I&&I._iKind===5){var O=V._resolveEventHandler(G,v._oContainingView.oController);if(O){w[N]=O;}else{q.sap.log.warning(v+": event handler function \""+G+"\" is not a function or does not exist in the controller.");}}else if(I&&I._iKind===-1){if(V.prototype.isPrototypeOf(u.prototype)&&N=="async"){w[N]=p(I.type,G,N,v._oContainingView.oController);}else{q.sap.log.warning(v+": setting '"+N+"' for class "+B.getName()+" (value:'"+G+"') is not supported");}}else{if(X._supportInfo){X._supportInfo({context:n,env:{caller:"createRegularControls",error:true,info:"unknown setting '"+N+"' for class "+B.getName()}});}}}if(z.length>0){w.customData=z;}}function P(n,R,T){var j;for(j=n.firstChild;j;j=j.nextSibling){Q(n,R,T,j);}}function Q(n,R,T,_,a1){var b1;if(_.nodeType===1){b1=_.namespaceURI===o&&T&&T[l(_)];if(b1){P(_,b1);}else if(R){if(!a1&&_.getAttribute("stashed")==="true"){S.createStashedControl(m(v,_),{stashedAlias:_.getAttribute("stashedAlias"),sParentId:w["id"],sParentAggregationName:R.name,fnCreate:function(){return Q(n,R,T,_,true);}});if(e){X.enrichTemplateIds(_,v);}return;}var c1=g(_);for(var j=0;j<c1.length;j++){var d1=c1[j];var e1=R.name;if(R.multiple){if(!w[e1]){w[e1]=[];}if(typeof w[e1].path==="string"){w[e1].template=d1;}else{w[e1].push(d1);}}else{w[e1]=d1;}}return c1;}else if(l(n)!=="FragmentDefinition"||n.namespaceURI!=="sap.ui.core"){throw new Error("Cannot add direct child without default aggregation defined for control "+B.getElementName());}}else if(_.nodeType===3){if(q.trim(_.textContent||_.text)){throw new Error("Cannot add text nodes as direct child of an aggregation. For adding text to an aggregation, a surrounding html tag is needed: "+q.trim(_.textContent||_.text));}}return[];}var R=B.getDefaultAggregation();var T=B.getAllAggregations();P(n,R,T);var U;if(e&&n.hasAttribute("id")){s(v,n);}else{if(V.prototype.isPrototypeOf(u.prototype)&&typeof u._sType==="string"){U=sap.ui.view(w,undefined,u._sType);}else{U=new u(w);}if(y&&U.addStyleClass){U.addStyleClass(y);}}if(!U){U=[];}else if(!q.isArray(U)){U=[U];}if(X._supportInfo&&U){for(var i=0,W=U.length;i<W;i++){var Y=U[i];if(Y&&Y.getId()){var Z=X._supportInfo({context:n,env:{caller:"createRegularControls",nodeid:n.getAttribute("id"),controlid:Y.getId()}}),$=A?A+",":"";$+=Z;X._supportInfo.addSupportInfo(Y.getId(),$);}}}if(d){U.forEach(function(Y){Y._sapui_declarativeSourceInfo={xmlNode:n,xmlRootNode:v._sapui_declarativeSourceInfo.xmlRootNode,fragmentName:B.getName()==='sap.ui.core.Fragment'?w['fragmentName']:null};});}return U;}function m(v,x,i){if(x.getAttributeNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1","id")){return x.getAttribute("id");}else{return v._oContainingView.createId(i?i:x.getAttribute("id"));}}function s(v,x){x.setAttribute("id",v._oContainingView.createId(x.getAttribute("id")));x.setAttributeNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1","id",true);}};return X;},true);
