"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.data=void 0;const builder_1=require("../../classes/builder");exports.data={data:(new builder_1.FunctionBuilder).setName("flat").setValue("description","mutate the array with all sub-array elements concatenated into it recursively up to the specified depth").setValue("use","$flat[key;limit?]").setValue("fields",[{name:"key",description:"the key of the array to join or a json array",type:"string<variable>"},{name:"separator",description:"the depth level specifying how deep a nested array structure should be flattened `(default: Infinity)`",type:"string",optional:!0}]).setValue("example",`$var[array;[
	"my", "best", [
		"friend's", [
			"a", "butcher"
		]
	]
]]
$flat[array] // ["my", "best", "friend's", "a", "butcher"]
$join[array] // my best friend's a butcher`).setValue("returns","Any[]"),code:async function(){await this.resolveFields();var[e,t=1/0]=this.fields.split(!0),a=this.variable(e);return Array.isArray(a)?(this.setVariable(e,a.flat(Number(t))),this.makeReturn(a)):this.warn("invalid array provided")}};