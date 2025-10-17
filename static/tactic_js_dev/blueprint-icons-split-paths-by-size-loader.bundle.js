"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktactic"] = self["webpackChunktactic"] || []).push([["blueprint-icons-split-paths-by-size-loader"],{

/***/ "./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/splitPathsBySizeLoader.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/splitPathsBySizeLoader.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   splitPathsBySizeLoader: () => (/* binding */ splitPathsBySizeLoader)\n/* harmony export */ });\n/* harmony import */ var change_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! change-case */ \"./node_modules/pascal-case/dist.es2015/index.js\");\n/* harmony import */ var _iconTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../iconTypes */ \"./node_modules/@blueprintjs/icons/lib/esm/iconTypes.js\");\n/*\n * Copyright 2023 Palantir Technologies, Inc. All rights reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n/**\n * A dynamic loader for icon paths that generates separate chunks for the two size variants.\n */\nconst splitPathsBySizeLoader = async (name, size) => {\n    const key = (0,change_case__WEBPACK_IMPORTED_MODULE_0__.pascalCase)(name);\n    let pathsRecord;\n    if (size === _iconTypes__WEBPACK_IMPORTED_MODULE_1__.IconSize.STANDARD) {\n        pathsRecord = await __webpack_require__.e(/*! import() | blueprint-icons-16px-paths */ \"blueprint-icons-16px-paths\").then(__webpack_require__.bind(__webpack_require__, /*! ../generated/16px/paths */ \"./node_modules/@blueprintjs/icons/lib/esm/generated/16px/paths/index.js\"));\n    }\n    else {\n        pathsRecord = await __webpack_require__.e(/*! import() | blueprint-icons-20px-paths */ \"blueprint-icons-20px-paths\").then(__webpack_require__.bind(__webpack_require__, /*! ../generated/20px/paths */ \"./node_modules/@blueprintjs/icons/lib/esm/generated/20px/paths/index.js\"));\n    }\n    return pathsRecord[key];\n};\n//# sourceMappingURL=splitPathsBySizeLoader.js.map\n\n//# sourceURL=webpack://tactic/./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/splitPathsBySizeLoader.js?");

/***/ })

}]);