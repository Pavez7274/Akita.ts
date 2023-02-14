"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.data=void 0;const builder_1=require("../../classes/builder"),lodash_1=require("lodash");exports.data={data:(new builder_1.FunctionBuilder).setName("lower").setValue("description","converts string to lower case").setValue("use","$lower[text]").setValue("fields",[{name:"text",type:"string"}]).setValue("example","$lower[HI] // hi\n$lower[var:NAME] // convers string value to lower case").setValue("returns","String"),code:async function(){var e;return await this.resolveFields(),this.inside?.startsWith("var:")?(this.inside=this.inside.slice(4),"string"!=typeof(e=this.variable(this.inside))?this.warn(`Variable ${this.inside.bgYellow} is not a string`):this.makeReturn(this.setVariable(this.inside,(0,lodash_1.lowerCase)(e)))):this.makeReturn((0,lodash_1.lowerCase)(this.inside?.unescape()))}};