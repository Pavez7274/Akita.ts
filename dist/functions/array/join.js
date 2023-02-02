"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.data=void 0;const tslib_1=require("tslib"),builder_1=require("../../classes/builder"),utils_1=require("../../classes/utils"),lodash_1=tslib_1.__importDefault(require("lodash"));exports.data={data:(new builder_1.FunctionBuilder).setName("join").setValue("description","unify the values of an array in a string").setValue("use","$join[key;separator?]").setValue("fields",[{name:"key",description:"the key of the array to join or a json array",type:"string<variable> | array"},{name:"separator",description:"the element separator `(default \\b)`",type:"string",optional:!0}]).setValue("example",'$var[array;["hola!", "sabias", "que", "hablo", "español?"]]\n$join[array] // hola! sabias que hablo español?').setValue("returns","String"),code:async e=>{await e.func.resolve_fields(e);var[a,r=" "]=e.interpreter.fields(e),a=lodash_1.default.get(e.metadata.vars,a,void 0);return lodash_1.default.isArray(a)?{code:e.code.replace(e.func.id,a.join(r)||"")}:utils_1.Utils.Warn("Invalid Array Provided",e,!0)}};