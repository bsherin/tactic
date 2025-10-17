"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktactic"] = self["webpackChunktactic"] || []).push([["blueprint-icons-all-paths-loader"],{

/***/ "./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/allPathsLoader.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/allPathsLoader.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   allPathsLoader: () => (/* binding */ allPathsLoader)\n/* harmony export */ });\n/*\n * Copyright 2023 Palantir Technologies, Inc. All rights reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * A simple module loader which concatenates all icon paths into a single chunk.\n */\nconst allPathsLoader = async (name, size) => {\n    const { getIconPaths } = await Promise.all(/*! import() | blueprint-icons-all-paths */[__webpack_require__.e(\"blueprint-icons-20px-paths\"), __webpack_require__.e(\"blueprint-icons-16px-paths\"), __webpack_require__.e(\"blueprint-icons-all-paths\")]).then(__webpack_require__.bind(__webpack_require__, /*! ../allPaths */ \"./node_modules/@blueprintjs/icons/lib/esm/allPaths.js\"));\n    return getIconPaths(name, size);\n};\n//# sourceMappingURL=allPathsLoader.js.map\n\n//# sourceURL=webpack://tactic/./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/allPathsLoader.js?");

/***/ })

}]);