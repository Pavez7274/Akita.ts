"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.data=void 0;const builder_1=require("../../classes/builder"),utils_1=require("../../classes/utils"),lodash_1=require("lodash"),util_1=require("util");exports.data={data:(new builder_1.FunctionBuilder).setName("ctx").setValue("description","get context data").setValue("use","$ctx[key?]").setValue("fields",[{name:"key",type:"string",optional:!0}]).setValue("example","$ctx[data.guild;id]").setValue("returns","Unknown"),code:async function(){await this.resolveFields();var t=(t=this.fields.split(!0))[0].startsWith("invoke")?await utils_1.Utils.Invoke(this,t.shift(),t,this.data.metadata.ctx):t.length?(0,lodash_1.get)(this.data.metadata.ctx,t.join(".")):this.data.metadata.ctx;return this.makeReturn("string"==typeof(t||="undefined")?t:(0,util_1.inspect)(t,{depth:null}))}};