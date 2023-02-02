"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.data=void 0;const tslib_1=require("tslib"),builder_1=require("../../classes/builder"),utils_1=require("../../classes/utils"),lodash_1=tslib_1.__importDefault(require("lodash"));var LR;!function(e){e[e.left=1]="left",e[e.right=2]="right"}(LR=LR||{}),exports.data={data:(new builder_1.FunctionBuilder).setName("each").setValue("description","like javascript forEach").setValue("use","$each[var;code;type?]").setValue("fields",[{name:"var",type:"string"},{name:"code",type:"string<interpretableCode>"},{name:"type",type:"string<left | right>",optional:!0}]).setValue("example",'$var[texts;["hi", "nya", "ily paul banks"]]\n$each[texts;\n\t$log[EACH INFO;$var[item]]\n]').setValue("returns","Void"),code:async t=>{await t.func.resolve_field(t,0),await t.func.resolve_field(t,2);let[e,,a="1"]=t.interpreter.fields(t),[r]=(a=a.toLowerCase(),await t.interpreter._(t.func),t.interpreter.fields(t,1)),i=lodash_1.default.get(t.metadata.vars,e);return lodash_1.default.isArray(i)?LR[a]?(lodash_1.default[["1","left"].includes(a.toLowerCase())?"forEach":"forEachRight"](i,async e=>{t.metadata.item=e,e=await t.interpreter.parse(r,t,t.client),lodash_1.default.merge(t,e)}),t.break=!1,{code:t.code?.replace(t.func.id,"")}):utils_1.Utils.Warn(`invalid type ${a.bgWhite} `+"(valid types: left | right | 1 | 2)".bgYellow,t):utils_1.Utils.Warn(`variable ${e.bgYellow} is not an array`,t)}};