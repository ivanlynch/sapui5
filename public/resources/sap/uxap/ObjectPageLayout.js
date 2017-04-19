/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/ResizeHandler","sap/ui/core/Control","sap/ui/core/CustomData","sap/ui/Device","sap/ui/core/delegate/ScrollEnablement","./ObjectPageSection","./ObjectPageSubSection","./ObjectPageSubSectionLayout","./LazyLoading","./ObjectPageLayoutABHelper","./ThrottledTaskHelper","sap/ui/core/ScrollBar","sap/ui/core/TitleLevel","./library"],function(q,R,C,a,D,S,O,b,c,L,A,T,d,e,l){"use strict";var f=C.extend("sap.uxap.ObjectPageLayout",{metadata:{library:"sap.uxap",properties:{showAnchorBar:{type:"boolean",defaultValue:true},showAnchorBarPopover:{type:"boolean",defaultValue:true},upperCaseAnchorBar:{type:"boolean",defaultValue:true},height:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},enableLazyLoading:{type:"boolean",defaultValue:false},subSectionLayout:{type:"sap.uxap.ObjectPageSubSectionLayout",defaultValue:c.TitleOnTop},sectionTitleLevel:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:sap.ui.core.TitleLevel.Auto},useIconTabBar:{type:"boolean",group:"Misc",defaultValue:false},showHeaderContent:{type:"boolean",group:"Misc",defaultValue:true},useTwoColumnsForLargeScreen:{type:"boolean",group:"Appearance",defaultValue:false},showTitleInHeaderContent:{type:"boolean",group:"Appearance",defaultValue:false},showOnlyHighImportance:{type:"boolean",group:"Behavior",defaultValue:false},isChildPage:{type:"boolean",group:"Appearance",defaultValue:false},alwaysShowContentHeader:{type:"boolean",group:"Behavior",defaultValue:false},showEditHeaderButton:{type:"boolean",group:"Behavior",defaultValue:false},flexEnabled:{type:"boolean",group:"Misc",defaultValue:false},showFooter:{type:"boolean",group:"Behavior",defaultValue:false}},associations:{selectedSection:{type:"sap.uxap.ObjectPageSection",multiple:false}},defaultAggregation:"sections",aggregations:{sections:{type:"sap.uxap.ObjectPageSection",multiple:true,singularName:"section"},headerTitle:{type:"sap.uxap.ObjectPageHeader",multiple:false},headerContent:{type:"sap.ui.core.Control",multiple:true,singularName:"headerContent"},footer:{type:"sap.m.IBar",multiple:false},_anchorBar:{type:"sap.uxap.AnchorBar",multiple:false,visibility:"hidden"},_iconTabBar:{type:"sap.m.IconTabBar",multiple:false,visibility:"hidden"},_headerContent:{type:"sap.uxap.ObjectPageHeaderContent",multiple:false,visibility:"hidden"},_customScrollBar:{type:"sap.ui.core.ScrollBar",multiple:false,visibility:"hidden"}},events:{toggleAnchorBar:{parameters:{fixed:{type:"boolean"}}},editHeaderButtonPress:{},navigate:{parameters:{section:{type:"sap.uxap.ObjectPageSection"}}}},designTime:true}});f.HEADER_CALC_DELAY=350;f.DOM_CALC_DELAY=200;f.FOOTER_ANIMATION_DURATION=350;f.TITLE_LEVEL_AS_ARRAY=Object.keys(e);f._getNextTitleLevelEntry=function(t){var i=f.TITLE_LEVEL_AS_ARRAY.indexOf(t),h=i!==-1,H=h&&(i!==f.TITLE_LEVEL_AS_ARRAY.length-1);if(!h){return e.Auto;}return f.TITLE_LEVEL_AS_ARRAY[H?i+1:i];};f.prototype.init=function(){this._bFirstRendering=true;this._bDomReady=false;this._bStickyAnchorBar=false;this._iStoredScrollPosition=0;this._bInternalAnchorBarVisible=true;this._$opWrapper=[];this._$anchorBar=[];this._$headerTitle=[];this._$stickyAnchorBar=[];this._$headerContent=[];this._$stickyHeaderContent=[];this._bMobileScenario=false;this._oSectionInfo={};this._aSectionBases=[];this._sScrolledSectionId="";this._iScrollToSectionDuration=600;this._$spacer=[];this.iHeaderContentHeight=0;this.iStickyHeaderContentHeight=0;this.iHeaderTitleHeight=0;this.iHeaderTitleHeightStickied=0;this.iAnchorBarHeight=0;this.iTotalHeaderSize=0;this._iREMSize=parseInt(q("body").css("font-size"),10);this._iOffset=parseInt(0.25*this._iREMSize,10);this._iScrollBarWidth=q.position.scrollbarWidth();this._iResizeId=R.register(this,this._onUpdateScreenSize.bind(this));this._oLazyLoading=new L(this);this._oABHelper=new A(this);};f.prototype.onBeforeRendering=function(){if(!this.getVisible()){return;}this._bMobileScenario=l.Utilities.isPhoneScenario();this._bTabletScenario=l.Utilities.isTabletScenario();this._bHContentAlwaysExpanded=this._checkAlwaysShowContentHeader();this._initializeScroller();this._getHeaderContent().setContentDesign(this._getHeaderDesign());this._oABHelper._getAnchorBar().setProperty("upperCase",this.getUpperCaseAnchorBar(),true);this._applyUxRules();this._storeScrollLocation();if(!q.isEmptyObject(this._oSectionInfo)&&this._bFirstRendering){this._preloadSectionsOnBeforeFirstRendering();this._bFirstRendering=false;}this._bStickyAnchorBar=false;var h=this.getHeaderTitle();if(h&&h.getAggregation("_expandButton")){h.getAggregation("_expandButton").attachPress(this._handleExpandButtonPress,this);}};f.prototype._preloadSectionsOnBeforeFirstRendering=function(){var t;if(!this.getEnableLazyLoading()){t=this.getUseIconTabBar()?[sap.ui.getCore().byId(this.getSelectedSection())||this._oFirstVisibleSection]:this.getSections();}else{var s=this.getUseIconTabBar()?this._grepCurrentTabSectionBases():this._aSectionBases;t=this._oLazyLoading.getSubsectionsToPreload(s);}this._connectModelsForSections(t);};f.prototype._grepCurrentTabSectionBases=function(){var F=[],s=this._oCurrentTabSection||sap.ui.getCore().byId(this.getSelectedSection())||this._oFirstVisibleSection;if(s){var h=s.getId();this._aSectionBases.forEach(function(o){if(o.getParent().getId()===h){F.push(o);}});}return F;};f.prototype.onAfterRendering=function(){this._ensureCorrectParentHeight();this._cacheDomElements();this._$opWrapper.on("scroll",this._onScroll.bind(this));if(this._bDomReady&&this.$().parents(":hidden").length===0){this._onAfterRenderingDomReady();}else{q.sap.delayedCall(f.HEADER_CALC_DELAY,this,this._onAfterRenderingDomReady);}};f.prototype._onAfterRenderingDomReady=function(){var s=this._oStoredSection||this._oFirstVisibleSection,F,h;this._bDomReady=true;this._adjustHeaderHeights();if(s){h=s.getId();F=this._oFirstVisibleSection&&this._oFirstVisibleSection.getId();if(this.getUseIconTabBar()){this._setSelectedSectionId(h);this._setCurrentTabSection(s);}else if(h!==F){this.scrollToSection(h);}}this._initAnchorBarScroll();if(sap.ui.Device.system.desktop){this._$opWrapper.on("scroll",this.onWrapperScroll.bind(this));}this._registerOnContentResize();this.getHeaderTitle()&&this.getHeaderTitle()._shiftHeaderTitle();this.getFooter()&&this._shiftFooter();this._setSectionsFocusValues();this._restoreScrollPosition();};f.prototype._shiftFooter=function(){var $=this.$("footerWrapper"),s=this._calculateShiftOffset();$.css(s.sStyleAttribute,s.iMarginalsOffset+"px");};f.prototype._calculateShiftOffset=function(){var h=0,s=sap.ui.getCore().getConfiguration().getRTL()?"left":"right",H=this._hasVerticalScrollBar(),i=this._iOffset;if(sap.ui.Device.system.desktop){h=this._iScrollBarWidth;if(!H){h=0;i+=this._iScrollBarWidth;}}return{"sStyleAttribute":s,"iActionsOffset":i,"iMarginalsOffset":h};};f.prototype.exit=function(){if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._iResizeId){R.deregister(this._iResizeId);}if(this._iContentResizeId){R.deregister(this._iContentResizeId);}};f.prototype._getCustomScrollBar=function(){if(!this.getAggregation("_customScrollBar")){var v=new d(this.getId()+"-vertSB",{vertical:true,size:"100%",scrollPosition:0,scroll:this.onCustomScrollerScroll.bind(this)});this.setAggregation("_customScrollBar",v,true);}return this.getAggregation("_customScrollBar");};f.prototype.onWrapperScroll=function(E){var s=Math.max(E.target.scrollTop,0);if(this._getCustomScrollBar()){if(this.allowCustomScroll===true){this.allowCustomScroll=false;return;}this.allowInnerDiv=true;this._getCustomScrollBar().setScrollPosition(s);}};f.prototype.onCustomScrollerScroll=function(E){var s=Math.max(this._getCustomScrollBar().getScrollPosition(),0);if(this.allowInnerDiv===true){this.allowInnerDiv=false;return;}this.allowCustomScroll=true;q(this._$opWrapper).scrollTop(s);};f.prototype.setShowOnlyHighImportance=function(v){var o=this.getShowOnlyHighImportance();if(o!==v){this.setProperty("showOnlyHighImportance",v,true);this.getSections().forEach(function(s){s._updateImportance();});}return this;};f.prototype.setIsHeaderContentAlwaysExpanded=function(v){var o=this.getAlwaysShowContentHeader();var s=(D.system.phone||D.system.tablet);if(o!==v){this.setProperty("alwaysShowContentHeader",v,s);}return this;};f.prototype.setBusy=function(B){var $=this.$("headerTitle"),r=C.prototype.setBusy.call(this,B);$.length>0&&$.toggleClass("sapUxAPObjectPageHeaderTitleBusy",B);return r;};f.prototype._initializeScroller=function(){if(this._oScroller){return;}this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:false,vertical:true});};f.prototype.setSelectedSection=function(s){if(!sap.ui.getCore().byId(s)){q.sap.log.warning("setSelectedSection aborted: unknown section",s,this);return this;}var o=this.getSelectedSection();if(s===o){return this;}this.scrollToSection(s);return this.setAssociation("selectedSection",s,true);};f.prototype._ensureCorrectParentHeight=function(){if(this._bCorrectParentHeightIsSet){return;}if(this.getParent().getHeight&&["","auto"].indexOf(this.getParent().getHeight())!==-1){this.$().parent().css("height","100%");}this._bCorrectParentHeightIsSet=true;};f.prototype._cacheDomElements=function(){this._$headerTitle=q.sap.byId(this.getId()+"-headerTitle");this._$anchorBar=q.sap.byId(this.getId()+"-anchorBar");this._$stickyAnchorBar=q.sap.byId(this.getId()+"-stickyAnchorBar");this._$opWrapper=q.sap.byId(this.getId()+"-opwrapper");this._$spacer=q.sap.byId(this.getId()+"-spacer");this._$headerContent=q.sap.byId(this.getId()+"-headerContent");this._$stickyHeaderContent=q.sap.byId(this.getId()+"-stickyHeaderContent");this._$contentContainer=q.sap.byId(this.getId()+"-scroll");this._$sectionsContainer=q.sap.byId(this.getId()+"-sectionsContainer");this._bDomElementsCached=true;};f.prototype._handleExpandButtonPress=function(E){this._expandCollapseHeader(true);};f.prototype._toggleStickyHeader=function(E){this._bIsHeaderExpanded=E;this._$headerTitle.toggleClass("sapUxAPObjectPageHeaderStickied",!E);};f.prototype._expandCollapseHeader=function(E){var h=this.getHeaderTitle();if(this._bHContentAlwaysExpanded){return;}if(E&&this._bStickyAnchorBar){if(h&&h.getIsActionAreaAlwaysVisible()&&!h.getIsObjectTitleAlwaysVisible()){h._setActionsPaddingStatus(E);}this._$headerContent.css("height",this.iHeaderContentHeight).children().appendTo(this._$stickyHeaderContent);this._toggleStickyHeader(E);}else if(!E&&this._bIsHeaderExpanded){this._$headerContent.css("height","auto").append(this._$stickyHeaderContent.children());this._$stickyHeaderContent.children().remove();this._toggleStickyHeader(E);}};f.prototype._updateNavigation=function(){if(this.getShowAnchorBar()){this._oABHelper._buildAnchorBar();}};f.prototype._applyUxRules=function(i){var s,h,v,V,j,k,m,F,o;s=this.getSections()||[];V=0;k=this.getShowAnchorBar();m=this.getUseIconTabBar();F=null;this._cleanMemory();s.forEach(function(n){if(!n.getVisible()){return true;}this._registerSectionBaseInfo(n);h=n.getSubSections()||[];v=0;o=null;h.forEach(function(p){if(!p.getVisible()){return true;}this._registerSectionBaseInfo(p);j=p.getVisibleBlocksCount();if(j===0){p._setInternalVisible(false,i);q.sap.log.info("ObjectPageLayout :: noVisibleBlock UX rule matched","subSection "+p.getTitle()+" forced to hidden");}else{p._setInternalVisible(true,i);p._setInternalTitleVisible(true,i);v++;if(!o){o=p;}if(this._shouldApplySectionTitleLevel(p)){p._setInternalTitleLevel(this._determineSectionBaseInternalTitleLevel(p));}}},this);if(v==0){n._setInternalVisible(false,i);q.sap.log.info("ObjectPageLayout :: noVisibleSubSection UX rule matched","section "+n.getTitle()+" forced to hidden");}else{n._setInternalVisible(true,i);n._setInternalTitleVisible(true,i);if(!F){F=n;}if(this.getSubSectionLayout()===c.TitleOnTop&&v===1&&o.getTitle().trim()!==""){q.sap.log.info("ObjectPageLayout :: TitleOnTop.sectionGetSingleSubSectionTitle UX rule matched","section "+n.getTitle()+" is taking its single subsection title "+o.getTitle());n._setInternalTitle(o.getTitle(),i);o._setInternalTitleVisible(false,i);}else{n._setInternalTitle("",i);}if(this._shouldApplySectionTitleLevel(n)){n._setInternalTitleLevel(this._determineSectionBaseInternalTitleLevel(n));}V++;}if(m){n._setInternalTitleVisible(false,i);}},this);if(V<=1){k=false;q.sap.log.info("ObjectPageLayout :: notEnoughVisibleSection UX rule matched","anchorBar forced to hidden");}else if(F&&k){F._setInternalTitleVisible(false,i);q.sap.log.info("ObjectPageLayout :: firstSectionTitleHidden UX rule matched","section "+F.getTitle()+" title forced to hidden");}if(k){this._oABHelper._buildAnchorBar();}this._setInternalAnchorBarVisible(k,i);this._oFirstVisibleSection=F;};f.prototype.setUseIconTabBar=function(v){var o=this.getUseIconTabBar();if(v!=o){this._applyUxRules();}this.setProperty("useIconTabBar",v);return this;};f.prototype._setCurrentTabSection=function(s,i){if(!s){return;}var o;if(s instanceof sap.uxap.ObjectPageSubSection){o=s;s=s.getParent();}else{o=this._getFirstVisibleSubSection(s);}if(this._oCurrentTabSection!==s){this._renderSection(s);this._oCurrentTabSection=s;}this._oCurrentTabSubSection=o;};f.prototype._renderSection=function(s){var $=this.$().find(".sapUxAPObjectPageContainer"),r;if(s&&$.length){r=sap.ui.getCore().createRenderManager();r.renderControl(s);r.flush($[0]);r.destroy();}};f.prototype.setShowAnchorBarPopover=function(v,s){this._oABHelper._buildAnchorBar();this._oABHelper._getAnchorBar().setShowPopover(v);return this.setProperty("showAnchorBarPopover",v,true);};f.prototype._getInternalAnchorBarVisible=function(){return this._bInternalAnchorBarVisible;};f.prototype._setInternalAnchorBarVisible=function(v,i){if(v!=this._bInternalAnchorBarVisible){this._bInternalAnchorBarVisible=v;if(i===true){this.invalidate();}}};f.prototype.setUpperCaseAnchorBar=function(v){this._oABHelper._getAnchorBar().setProperty("upperCase",v);return this.setProperty("upperCaseAnchorBar",v,true);};f.prototype._requestAdjustLayout=function(E,i,n){if(!this._oLayoutTask){this._oLayoutTask=new T(this._executeAdjustLayout,f.DOM_CALC_DELAY,this);}if(!i){q.sap.log.debug("ObjectPageLayout :: _requestAdjustLayout","delayed by "+f.DOM_CALC_DELAY+" ms because of dom modifications");}var t=arguments;Array.prototype.splice.call(t,0,2);return this._oLayoutTask.reSchedule(i,t);};f.prototype._executeAdjustLayout=function(n){var s=this._updateScreenHeightSectionBasesAndSpacer();if(s&&n){this._oLazyLoading.doLazyLoading();}return s;};f.prototype._adjustLayoutAndUxRules=function(){q.sap.log.debug("ObjectPageLayout :: _requestAdjustLayout","refreshing ux rules");var s=this._getSelectedSectionId(),o=sap.ui.getCore().byId(s),h=false;this._applyUxRules(true);if(!o||!o.getVisible()||!o._getInternalVisible()){o=this._oFirstVisibleSection;s=o&&o.getId();h=true;}if(o){this._setSelectedSectionId(s);if(this.getUseIconTabBar()){this._setCurrentTabSection(o);}this._requestAdjustLayout(null,false,true).then(function(){if(h){this.scrollToSection(s);}}.bind(this));}};f.prototype._getSelectedSectionId=function(){var o=this.getAggregation("_anchorBar"),s;if(o&&o.getSelectedSection()){s=o.getSelectedSection().getId();}return s;};f.prototype._setSelectedSectionId=function(s){var o=this.getAggregation("_anchorBar"),h=s&&this._oSectionInfo[s];if(!h){return;}if(o&&h.buttonId){o.setSelectedButton(h.buttonId);this.setAssociation("selectedSection",s,true);}};f.prototype.isFirstRendering=function(){return this._bFirstRendering;};f.prototype._cleanMemory=function(){var o=this.getAggregation("_anchorBar");if(o){o._resetControl();}this._oSectionInfo={};this._aSectionBases=[];};f.prototype._registerSectionBaseInfo=function(s){this._oSectionInfo[s.getId()]={$dom:[],positionTop:0,positionTopMobile:0,buttonId:"",isSection:(s instanceof O),sectionReference:s};this._aSectionBases.push(s);};f.prototype.scrollToSection=function(i,h,o,I){var s=sap.ui.getCore().byId(i);if(!this.getDomRef()){q.sap.log.warning("scrollToSection can only be used after the ObjectPage is rendered",this);return;}if(!s){q.sap.log.warning("scrollToSection aborted: unknown section",i,this);return;}if(!this._oSectionInfo[i]){q.sap.log.warning("scrollToSection aborted: section is hidden by UX rules",i,this);return;}if(this.bIsDestroyed){q.sap.log.debug("ObjectPageLayout :: scrollToSection","scrolling canceled as page is being destroyed");return;}if(this.getUseIconTabBar()){var t=O._getClosestSection(s);if(this._oCurrentTabSection){this._oCurrentTabSection._allowPropagationToLoadedViews(false);}t._allowPropagationToLoadedViews(true);this._setCurrentTabSection(s);this.getAggregation("_anchorBar").setSelectedButton(this._oSectionInfo[t.getId()].buttonId);this.setAssociation("selectedSection",t.getId(),true);}if(I){this.fireNavigate({section:O._getClosestSection(s)});}if(this._bIsHeaderExpanded){this._expandCollapseHeader(false);}o=o||0;s._expandSection();this._requestAdjustLayout(null,true);h=this._computeScrollDuration(h,s);var j=this._computeScrollPosition(s);if(this._sCurrentScrollId!=i){this._sCurrentScrollId=i;if(this._iCurrentScrollTimeout){clearTimeout(this._iCurrentScrollTimeout);if(this._$contentContainer){this._$contentContainer.parent().stop(true,false);}}if(this._bDomElementsCached){this._iCurrentScrollTimeout=q.sap.delayedCall(h,this,function(){this._sCurrentScrollId=undefined;this._iCurrentScrollTimeout=undefined;});}this._preloadSectionsOnScroll(s);this.getHeaderTitle()&&this.getHeaderTitle()._shiftHeaderTitle();this._scrollTo(j+o,h);}};f.prototype._computeScrollDuration=function(i,t){var h=parseInt(i,10);h=h>=0?h:this._iScrollToSectionDuration;if(this.getUseIconTabBar()&&((t instanceof O)||this._isFirstVisibleSectionBase(t))&&this._bStickyAnchorBar){h=0;}return h;};f.prototype._computeScrollPosition=function(t){var F=t&&(t instanceof O),i=t.getId(),s=this._bMobileScenario||F?this._oSectionInfo[i].positionTopMobile:this._oSectionInfo[i].positionTop,E=!this._bStickyAnchorBar;if(E&&this._isFirstVisibleSectionBase(t)){s-=this.iHeaderContentHeight;}return s;};f.prototype._preloadSectionsOnScroll=function(t){var i=t.getId(),h;if(!this.getEnableLazyLoading()&&this.getUseIconTabBar()){h=(t instanceof O)?t:t.getParent();this._connectModelsForSections([h]);}if(this.getEnableLazyLoading()){var s=this.getUseIconTabBar()?this._grepCurrentTabSectionBases():this._aSectionBases;h=this._oLazyLoading.getSubsectionsToPreload(s,i);if(D.system.desktop){q.sap.delayedCall(50,this,function(){this._connectModelsForSections(h);});}else{this._connectModelsForSections(h);}}};f.prototype.getScrollingSectionId=function(){return this._sScrolledSectionId;};f.prototype.setDirectScrollingToSection=function(s){this.sDirectSectionId=s;};f.prototype.getDirectScrollingToSection=function(){return this.sDirectSectionId;};f.prototype.clearDirectScrollingToSection=function(){this.sDirectSectionId=null;};f.prototype._scrollTo=function(y,t){if(this._oScroller){q.sap.log.debug("ObjectPageLayout :: scrolling to "+y);this._oScroller.scrollTo(0,y,t);}return this;};f.prototype._updateScreenHeightSectionBasesAndSpacer=function(){var i,o,s,p,P,h;if(!this._bDomReady){return false;}q.sap.log.debug("ObjectPageLayout :: _updateScreenHeightSectionBasesAndSpacer","re-evaluating dom positions");this.iScreenHeight=this.$().height();var j=0;this._aSectionBases.forEach(function(k){var I=this._oSectionInfo[k.getId()],$=k.$(),m,n=false;if(!I||!$.length){return;}if(!I.isSection){j++;}I.$dom=$;var r=$.position().top;I.positionTop=Math.ceil(r);if(I.isSection){m=k.$("header");}else{m=k.$("headerTitle");}n=m.length===0;if(!n){I.positionTopMobile=Math.ceil(m.position().top)+m.outerHeight();}else{I.positionTopMobile=I.positionTop;}if(!this._bStickyAnchorBar&&!this._bIsHeaderExpanded){I.positionTopMobile-=this.iAnchorBarHeight;I.positionTop-=this.iAnchorBarHeight;}I.sectionReference.toggleStyleClass("sapUxAPObjectPageSubSectionPromoted",n);if(this._bMobileScenario){if(P){this._oSectionInfo[P].positionBottom=I.positionTop;}P=k.getId();o=k;}else{if(I.isSection){if(P){this._oSectionInfo[P].positionBottom=I.positionTop;if(p){this._oSectionInfo[p].positionBottom=I.positionTop;}}P=k.getId();p=null;}else{if(p){this._oSectionInfo[p].positionBottom=I.positionTop;}p=k.getId();o=k;}}},this);if(o){i=this._computeLastVisibleHeight(o);if(this._bMobileScenario&&P){this._oSectionInfo[P].positionBottom=this._oSectionInfo[P].positionTop+i;}else{if(p){this._oSectionInfo[p].positionBottom=this._oSectionInfo[p].positionTop+i;}if(P&&p){this._oSectionInfo[P].positionBottom=this._oSectionInfo[p].positionTop+i;}}h=this._bStickyAnchorBar||(j>1)||this._checkContentBottomRequiresSnap(o);s=this._computeSpacerHeight(o,i,h);this._$spacer.height(s+"px");q.sap.log.debug("ObjectPageLayout :: bottom spacer is now "+s+"px");}this._updateCustomScrollerHeight(h);return true;};f.prototype._updateCustomScrollerHeight=function(r){if(sap.ui.Device.system.desktop&&this.getAggregation("_customScrollBar")){var s=this._computeScrollableContentSize(r);s+=this._getStickyAreaHeight(r);this._getCustomScrollBar().setContentSize(s+"px");var h=(s>this.iScreenHeight),v=(h!==this._getCustomScrollBar().getVisible());if(v){this._getCustomScrollBar().setVisible(h);this.getHeaderTitle()&&this.getHeaderTitle()._shiftHeaderTitle();}}};f.prototype._computeScrollableContentSize=function(s){var i=0;if(this._$contentContainer&&this._$contentContainer.length){i=this._$contentContainer[0].scrollHeight;}if(!this._bStickyAnchorBar&&s){i-=this.iAnchorBarHeight;}if(this._bStickyAnchorBar&&!s){i+=this.iAnchorBarHeight;}return i;};f.prototype._computeLastVisibleHeight=function(o){var i=this._bStickyAnchorBar||this._bIsHeaderExpanded;var h=this._getSectionPositionTop(o,i);return this._$spacer.position().top-h;};f.prototype._getStickyAreaHeight=function(i){if(this._bHContentAlwaysExpanded){return this.iHeaderTitleHeight;}if(i){return this.iHeaderTitleHeightStickied+this.iAnchorBarHeight;}return this.iHeaderTitleHeight;};f.prototype._getScrollableViewportHeight=function(i){var s=this.$().height();return s-this._getStickyAreaHeight(i);};f.prototype._getSectionPositionTop=function(s,h){var p=this._oSectionInfo[s.getId()].positionTop;if(!h){p+=this.iAnchorBarHeight;}return p;};f.prototype._getSectionPositionBottom=function(s,h){var p=this._oSectionInfo[s.getId()].positionBottom;if(!h){p+=this.iAnchorBarHeight;}return p;};f.prototype._determineSectionBaseInternalTitleLevel=function(s){var h=this.getSectionTitleLevel(),i=s instanceof O;if(h===e.Auto){return i?e.H3:e.H4;}return i?h:f._getNextTitleLevelEntry(h);};f.prototype._shouldApplySectionTitleLevel=function(s){return s.getTitleLevel()===e.Auto;};f.prototype._checkContentBottomRequiresSnap=function(s){var h=false;return this._getSectionPositionBottom(s,h)>=(this._getScrollableViewportHeight(h)+this._getSnapPosition());};f.prototype._computeSpacerHeight=function(o,i,s){var h,j,F;if(this.getFooter()&&this.getShowFooter()){F=this.$("footerWrapper").outerHeight();}j=this._getScrollableViewportHeight(s);if(!s){i=this._getSectionPositionBottom(o,false);}if(i<j){h=j-i;if(this._bMobileScenario){h+=(this._oSectionInfo[o.getId()].positionTopMobile-this._oSectionInfo[o.getId()].positionTop);}}else{h=0;}if(F>h){h+=F;}return h;};f.prototype._isFirstVisibleSectionBase=function(s){var o=this._oSectionInfo[s.getId()];if(o){return o.positionTop===this.iHeaderContentHeight;}return false;};f.prototype._getFirstVisibleSubSection=function(s){if(!s){return;}var F;this._aSectionBases.every(function(o){if(o.getParent()&&(o.getParent().getId()===s.getId())){F=o;return false;}return true;});return F;};f.prototype._initAnchorBarScroll=function(){this._requestAdjustLayout(null,true);this._sScrolledSectionId="";this._onScroll({target:{scrollTop:0}});};f.prototype._setAsCurrentSection=function(s){var o,h,i;if(this._sScrolledSectionId===s){return;}q.sap.log.debug("ObjectPageLayout :: current section is "+s);this._sScrolledSectionId=s;o=this.getAggregation("_anchorBar");if(o&&this._getInternalAnchorBarVisible()){h=sap.ui.getCore().byId(s);i=h&&h instanceof b&&(h.getTitle().trim()===""||!h._getInternalTitleVisible()||h.getParent()._getIsHidden());if(i){s=h.getParent().getId();q.sap.log.debug("ObjectPageLayout :: current section is a subSection with an empty or hidden title, selecting parent "+s);}if(this._oSectionInfo[s]){o.setSelectedButton(this._oSectionInfo[s].buttonId);this.setAssociation("selectedSection",s,true);this._setSectionsFocusValues(s);}}};f.prototype._registerOnContentResize=function(){var $=this._$sectionsContainer.length&&this._$sectionsContainer[0];if(!$){return;}if(this._iContentResizeId){R.deregister(this._iContentResizeId);}this._iContentResizeId=R.register($,this._onUpdateContentSize.bind(this));};f.prototype._onUpdateContentSize=function(E){var s,p,h,i;this._requestAdjustLayout().then(function(){s=this._$opWrapper.scrollTop();p=this.iScreenHeight;h=this._getClosestScrolledSectionId(s,p);i=this._getSelectedSectionId();if(i!==h){this.getAggregation("_anchorBar").setSelectedButton(this._oSectionInfo[h].buttonId);}}.bind(this));};f.prototype._onUpdateScreenSize=function(E){if(!this._bDomReady){q.sap.log.info("ObjectPageLayout :: cannot _onUpdateScreenSize before dom is ready");return;}this._oLazyLoading.setLazyLoadingParameters();q.sap.delayedCall(f.HEADER_CALC_DELAY,this,function(){this._bMobileScenario=l.Utilities.isPhoneScenario();this._bTabletScenario=l.Utilities.isTabletScenario();if(this._bHContentAlwaysExpanded!=this._checkAlwaysShowContentHeader()){this.invalidate();}this._adjustHeaderHeights();this._requestAdjustLayout(null,true);if(this.getFooter()&&this.getShowFooter()){this._shiftFooter();}this._scrollTo(this._$opWrapper.scrollTop(),0);});};f.prototype._onScroll=function(E){var s=Math.max(E.target.scrollTop,0),p,h=this.getHeaderTitle(),i=(s>0)&&(s>=this._getSnapPosition()),j,k=false;p=this.iScreenHeight;if(i&&!this._bHContentAlwaysExpanded){p-=(this.iAnchorBarHeight+this.iHeaderTitleHeightStickied);}else{if(i&&this._bHContentAlwaysExpanded){p=p-(this._$stickyAnchorBar.height()+this.iHeaderTitleHeight+this.iStickyHeaderContentHeight);}}if(this._bIsHeaderExpanded){this._expandCollapseHeader(false);}if(!this._bHContentAlwaysExpanded&&((h&&this.getShowHeaderContent())||this.getShowAnchorBar())){this._toggleHeader(i);}else if(s==0&&((h&&this.getShowHeaderContent())||this.getShowAnchorBar())){this._toggleHeader(false);}if(!this._bHContentAlwaysExpanded){this._adjustHeaderTitleBackgroundPosition(s);}q.sap.log.debug("ObjectPageLayout :: lazy loading : Scrolling at "+s,"----------------------------------------");j=this._getClosestScrolledSectionId(s,p);if(j){var m=this.getDirectScrollingToSection();if(j!==this._sScrolledSectionId){q.sap.log.debug("ObjectPageLayout :: closest id "+j,"----------------------------------------");var m=this.getDirectScrollingToSection();if(m&&m!==j){return;}this.clearDirectScrollingToSection();this._setAsCurrentSection(j);}else if(j===this.getDirectScrollingToSection()){this.clearDirectScrollingToSection();}}if(this.getEnableLazyLoading()){this._oLazyLoading.lazyLoadDuringScroll(s,E.timeStamp,p);}if(h&&this.getShowHeaderContent()&&this.getShowTitleInHeaderContent()&&h.getShowTitleSelector()){if(s===0){q.sap.byId(this.getId()+"-scroll").css("z-index","1000");k=false;}else if(!k){k=true;q.sap.byId(this.getId()+"-scroll").css("z-index","0");}}};f.prototype._getSnapPosition=function(){return(this.iHeaderContentHeight-(this.iHeaderTitleHeightStickied-this.iHeaderTitleHeight));};f.prototype._getClosestScrolledSectionId=function(s,p){if(this.getUseIconTabBar()&&this._oCurrentTabSection){return this._oCurrentTabSection.getId();}var i=s+p,h;q.each(this._oSectionInfo,function(I,o){if(o.isSection||this._bMobileScenario){if(!h&&(o.sectionReference._getInternalVisible()===true)){h=I;}if(o.positionTop<=i&&s<=o.positionBottom){if(o.positionTop<=s&&o.positionBottom>=s){h=I;return false;}}}}.bind(this));return h;};f.prototype._toggleHeader=function(s){var h=this.getHeaderTitle();if(!this._bHContentAlwaysExpanded&&!this._bIsHeaderExpanded){this._$headerTitle.toggleClass("sapUxAPObjectPageHeaderStickied",s);}if(h&&h.getIsActionAreaAlwaysVisible()&&!h.getIsObjectTitleAlwaysVisible()){h._setActionsPaddingStatus(!s);}if(!this._bStickyAnchorBar&&s){this._restoreFocusAfter(this._convertHeaderToStickied);h&&h._adaptLayout();this._adjustHeaderHeights();}else if(this._bStickyAnchorBar&&!s){this._restoreFocusAfter(this._convertHeaderToExpanded);h&&h._adaptLayout();this._adjustHeaderHeights();}};f.prototype._restoreFocusAfter=function(m){var o=sap.ui.getCore(),h=o.byId(o.getCurrentFocusedControlId());m.call(this);if(D.system.phone!==true){if(!o.byId(o.getCurrentFocusedControlId())){h&&h.$().focus();}}return this;};f.prototype._convertHeaderToStickied=function(){if(!this._bHContentAlwaysExpanded){this._$anchorBar.children().appendTo(this._$stickyAnchorBar);this._toggleHeaderStyleRules(true);if(this.iHeaderTitleHeight!=this.iHeaderTitleHeightStickied){this._adjustHeaderBackgroundSize();}}return this;};f.prototype._convertHeaderToExpanded=function(){if(!this._bHContentAlwaysExpanded){this._$anchorBar.css("height","auto").append(this._$stickyAnchorBar.children());this._toggleHeaderStyleRules(false);}return this;};f.prototype._toggleHeaderStyleRules=function(s){s=!!s;var v=s?"hidden":"inherit";this._bStickyAnchorBar=s;this._$headerContent.css("overflow",v);this._$headerContent.toggleClass("sapContrastPlus",!s);this._$headerContent.toggleClass("sapUxAPObjectPageHeaderDetailsHidden",s);this._$anchorBar.css("visibility",v);this.fireToggleAnchorBar({fixed:s});};f.prototype.getScrollDelegate=function(){return this._oScroller;};f.prototype.setHeaderTitle=function(h,s){if(h&&typeof h.addEventDelegate==="function"){h.addEventDelegate({onAfterRendering:this._adjustHeaderHeights.bind(this)});}return this.setAggregation("headerTitle",h,s);};f.prototype._adjustHeaderBackgroundSize=function(){var h=this.getHeaderTitle();if(h&&h.getHeaderDesign()=="Dark"){if(!this._bHContentAlwaysExpanded){this.iTotalHeaderSize=this.iHeaderTitleHeight+this.iHeaderContentHeight;this._$headerContent.css("background-size","100% "+this.iTotalHeaderSize+"px");}else{this.iTotalHeaderSize=this.iHeaderTitleHeight-this._$stickyAnchorBar.height();this._$stickyHeaderContent.css("background-size","100% "+this.iTotalHeaderSize+"px");}h.$().css("background-size","100% "+this.iTotalHeaderSize+"px");this._adjustHeaderTitleBackgroundPosition(0);}};f.prototype._adjustHeaderTitleBackgroundPosition=function(s){var h=this.getHeaderTitle();if(h&&h.getHeaderDesign()=="Dark"){if(this._bStickyAnchorBar){h.$().css("background-position","0px "+((this.iTotalHeaderSize-this.iHeaderTitleHeightStickied)*-1)+"px");}else{if(this._bHContentAlwaysExpanded){h.$().css("background-position","0px 0px");}else{h.$().css("background-position","0px "+(this.iHeaderTitleHeight+this.iHeaderContentHeight-this.iTotalHeaderSize-s)+"px");}}}};f.prototype._adjustHeaderHeights=function(){if(this._$headerTitle.length>0){var $=this._$headerTitle.clone();this.iHeaderContentHeight=this._$headerContent.height();this.iStickyHeaderContentHeight=this._$stickyHeaderContent.height();this.iAnchorBarHeight=this._bStickyAnchorBar?this._$stickyAnchorBar.height():this._$anchorBar.height();$.css({left:"-10000px",top:"-10000px",width:this._$headerTitle.width()+"px"});if(this._bStickyAnchorBar){this.iHeaderTitleHeightStickied=this._$headerTitle.height()-this.iAnchorBarHeight;$.removeClass("sapUxAPObjectPageHeaderStickied");$.appendTo(this._$headerTitle.parent());this.iHeaderTitleHeight=$.is(":visible")?$.height()-this.iAnchorBarHeight:0;}else{this.iHeaderTitleHeight=this._$headerTitle.is(":visible")?this._$headerTitle.height():0;$.addClass("sapUxAPObjectPageHeaderStickied");$.appendTo(this._$headerTitle.parent());this.iHeaderTitleHeightStickied=$.height();}$.remove();this._adjustHeaderBackgroundSize();q.sap.log.info("ObjectPageLayout :: adjustHeaderHeight","headerTitleHeight: "+this.iHeaderTitleHeight+" - headerTitleStickiedHeight: "+this.iHeaderTitleHeightStickied+" - headerContentHeight: "+this.iHeaderContentHeight);}else{q.sap.log.debug("ObjectPageLayout :: adjustHeaderHeight","skipped as the objectPageLayout is being rendered");}};f.prototype._getHeaderDesign=function(){var h=this.getHeaderTitle(),s=l.ObjectPageHeaderDesign.Light;if(h!=null){s=h.getHeaderDesign();}return s;};f.prototype._getVisibleSections=function(){return this.getSections().filter(function(s){return s.getVisible()&&s._getInternalVisible();});};f.prototype._setSectionsFocusValues=function(s){var h=this._getVisibleSections()||[],$,F='0',n='-1',t="tabIndex",o,i=h[0];h.forEach(function(j){$=j.$();if(s===j.sId){$.attr(t,F);o=j;j._setSubSectionsFocusValues();}else{$.attr(t,n);j._disableSubSectionsFocus();}});if(!o&&h.length>0){i.$().attr(t,F);i._setSubSectionsFocusValues();o=i;}return o;};f.prototype.setShowHeaderContent=function(s){var o=this.getShowHeaderContent();if(o!==s){if(o&&this._bIsHeaderExpanded){this._expandCollapseHeader(false);}this.setProperty("showHeaderContent",s);this._getHeaderContent().setProperty("visible",s);}return this;};f.prototype._headerTitleChangeHandler=function(){if(!this.getShowTitleInHeaderContent()||this._bFirstRendering){return;}var r=sap.ui.getCore().createRenderManager();this.getRenderer()._rerenderHeaderContentArea(r,this);this._getHeaderContent().invalidate();r.destroy();};f.prototype.getHeaderContent=function(){return this._getHeaderContent().getAggregation("content");};f.prototype.insertHeaderContent=function(o,i,s){return this._getHeaderContent().insertAggregation("content",o,i,s);};f.prototype.addHeaderContent=function(o,s){return this._getHeaderContent().addAggregation("content",o,s);};f.prototype.removeAllHeaderContent=function(s){return this._getHeaderContent().removeAllAggregation("content",s);};f.prototype.removeHeaderContent=function(o,s){return this._getHeaderContent().removeAggregation("content",o,s);};f.prototype.destroyHeaderContent=function(s){return this._getHeaderContent().destroyAggregation("content",s);};f.prototype.indexOfHeaderContent=function(o){return this._getHeaderContent().indexOfAggregation("content",o);};f.prototype._getHeaderContent=function(){if(!this.getAggregation("_headerContent")){this.setAggregation("_headerContent",new l.ObjectPageHeaderContent({visible:this.getShowHeaderContent(),contentDesign:this._getHeaderDesign(),content:this.getAggregation("headerContent",[])}),true);}return this.getAggregation("_headerContent");};f.prototype._checkAlwaysShowContentHeader=function(){return!this._bMobileScenario&&!this._bTabletScenario&&this.getShowHeaderContent()&&this.getAlwaysShowContentHeader();};f.prototype._connectModelsForSections=function(s){s=s||[];s.forEach(function(o){o.connectToModels();});};f.prototype._getHeightRelatedParameters=function(){return{iHeaderContentHeight:this.iHeaderContentHeight,iScreenHeight:this.iScreenHeight,iAnchorBarHeight:this.iAnchorBarHeight,iHeaderTitleHeightStickied:this.iHeaderTitleHeightStickied,iStickyHeaderContentHeight:this.iStickyHeaderContentHeight,iScrollTop:this._$opWrapper.scrollTop()};};f.prototype._hasVerticalScrollBar=function(){return(this._getCustomScrollBar().getVisible()===true);};f.prototype._shiftHeader=function(s,p){this.$().find(".sapUxAPObjectPageHeaderTitle").css("padding-"+s,p);};f.prototype._isFirstSection=function(s){var h=this._getVisibleSections();if(s===h[0]){return true;}return false;};f.prototype._restoreScrollPosition=function(){this._scrollTo(this._iStoredScrollPosition,0);};f.prototype._storeScrollLocation=function(){this._iStoredScrollPosition=this._oScroller.getScrollTop();this._oStoredSection=this._oCurrentTabSubSection||this._oCurrentTabSection||sap.ui.getCore().byId(this.getSelectedSection());if(this._oStoredSection){var s=this._aSectionBases.map(function(o){return o.getId();});if(s.indexOf(this._oStoredSection.getId())===-1){this._oStoredSection=null;}}this._oCurrentTabSection=null;};f.prototype.onkeyup=function(E){var F,o;if(E.which===q.sap.KeyCodes.TAB){F=sap.ui.getCore().getCurrentFocusedControlId();o=F&&sap.ui.getCore().byId(F);if(o&&this._isFirstSection(o)){this._scrollTo(0,0);}}};f.prototype.setShowFooter=function(s){var r=this.setProperty("showFooter",s,true);this._toggleFooter(s);return r;};f.prototype._toggleFooter=function(s){var u=sap.ui.getCore().getConfiguration().getAnimation(),F=this.getFooter();if(!g(F)){return;}F.toggleStyleClass("sapUxAPObjectPageFloatingFooterShow",s);F.toggleStyleClass("sapUxAPObjectPageFloatingFooterHide",!s);if(this._iFooterWrapperHideTimeout){q.sap.clearDelayedCall(this._iFooterWrapperHideTimeout);}if(u){if(!s){this._iFooterWrapperHideTimeout=q.sap.delayedCall(f.FOOTER_ANIMATION_DURATION,this,function(){this.$("footerWrapper").toggleClass("sapUiHidden",!s);});}else{this.$("footerWrapper").toggleClass("sapUiHidden",!s);this._iFooterWrapperHideTimeout=null;}q.sap.delayedCall(f.FOOTER_ANIMATION_DURATION,this,function(){F.removeStyleClass("sapUxAPObjectPageFloatingFooterShow");});}this._requestAdjustLayout();};f.prototype.clone=function(){Object.keys(this.mAggregations).forEach(this._cloneProxiedAggregations,this);return C.prototype.clone.apply(this,arguments);};f.prototype._cloneProxiedAggregations=function(s){var o=this.mAggregations[s];if(Array.isArray(o)&&o.length===0){o=this["get"+s.charAt(0).toUpperCase()+s.slice(1)]();}this.mAggregations[s]=o;};function g(o){if(arguments.length===1){return Array.isArray(o)?o.length>0:!!o;}return Array.prototype.slice.call(arguments).every(function(h){return g(h);});}return f;});
