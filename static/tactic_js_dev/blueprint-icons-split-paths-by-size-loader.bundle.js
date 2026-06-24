"use strict";
(self["webpackChunktactic"] = self["webpackChunktactic"] || []).push([["blueprint-icons-split-paths-by-size-loader"],{

/***/ "./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/splitPathsBySizeLoader.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/splitPathsBySizeLoader.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   splitPathsBySizeLoader: () => (/* binding */ splitPathsBySizeLoader)
/* harmony export */ });
/* harmony import */ var change_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! change-case */ "./node_modules/pascal-case/dist.es2015/index.js");
/* harmony import */ var _iconTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../iconTypes */ "./node_modules/@blueprintjs/icons/lib/esm/iconTypes.js");
/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A dynamic loader for icon paths that generates separate chunks for the two size variants.
 */
const splitPathsBySizeLoader = async (name, size) => {
    const key = (0,change_case__WEBPACK_IMPORTED_MODULE_0__.pascalCase)(name);
    let pathsRecord;
    if (size === _iconTypes__WEBPACK_IMPORTED_MODULE_1__.IconSize.STANDARD) {
        pathsRecord = await __webpack_require__.e(/*! import() | blueprint-icons-16px-paths */ "blueprint-icons-16px-paths").then(__webpack_require__.bind(__webpack_require__, /*! ../generated/16px/paths */ "./node_modules/@blueprintjs/icons/lib/esm/generated/16px/paths/index.js"));
    }
    else {
        pathsRecord = await __webpack_require__.e(/*! import() | blueprint-icons-20px-paths */ "blueprint-icons-20px-paths").then(__webpack_require__.bind(__webpack_require__, /*! ../generated/20px/paths */ "./node_modules/@blueprintjs/icons/lib/esm/generated/20px/paths/index.js"));
    }
    return pathsRecord[key];
};
//# sourceMappingURL=splitPathsBySizeLoader.js.map

/***/ })

}]);
//# sourceMappingURL=blueprint-icons-split-paths-by-size-loader.bundle.js.map