/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./tn.js":
/*!***************!*\
  !*** ./tn.js ***!
  \***************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\nvar url = 'https://portal.arc.io/api/createNewAccount';\nvar invite = '000000';\n\n// localhost:80 should be shared\n\nfunction fixNumber(num) {\n    num = String(num);\n\n    if (num.length==1) num = '00000'+num;\n    if (num.length==2) num = '0000'+num;\n    if (num.length==3) num = '000'+num;\n    if (num.length==4) num = '00'+num;\n    if (num.length==5) num = '0'+num;\n\n    return num;\n}\n\nfor (let x=0;x<999999;x+=1) {\n    invite++;\n\n    var n = fixNumber(invite);\n\n    var body = {\n        \n    }\n}\n\n//# sourceURL=webpack://dynamic-interception-proxy/./tn.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./tn.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;