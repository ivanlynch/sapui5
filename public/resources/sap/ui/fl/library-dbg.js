/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/fl/RegistrationDelegator"
	],
	function(RegistrationDelegator) {
	"use strict";

	/**
	 * SAPUI5 library for UI Flexibility and Descriptor Changes and Descriptor Variants.
	 *
	 * @namespace
	 * @name sap.ui.fl
	 * @author SAP SE
	 * @version 1.44.11
	 * @private
	 * @sap-restricted
	 *
	 */

	sap.ui.getCore().initLibrary({
		name:"sap.ui.fl",
		version:"1.44.11",
		dependencies:["sap.ui.core"],
		noLibraryCSS: true
	});

//	if ( XMLView.registerPreprocessor ){
//		// Register preprocessor for flexibility changes
//		XMLView.registerPreprocessor("controls", "sap.ui.fl.PreprocessorImpl", true);
//		// Deactivated until caching is in place!
//		//XMLView.registerPreprocessor("viewxml", "sap.ui.fl.XmlPreprocessorImpl", true);
//	} else {
//		//workaround solution until registerPreprocessor is available
//		//PreprocessorImpl because in the workaround case there is no preprocessor base object
//		View._sContentPreprocessor = "sap.ui.fl.PreprocessorImpl";
//	}

	RegistrationDelegator.registerAll();

	return sap.ui.fl;

}, /* bExport= */ true);
