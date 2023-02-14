"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.data=void 0;const builder_1=require("../../classes/builder"),lodash_1=require("lodash");exports.data={data:(new builder_1.FunctionBuilder).setName("snake").setValue("description","converts string to snake case").setValue("use","$snake[text]").setValue("fields",[{name:"text",type:"string"}]).setValue("example","$snake[im bored documenting] // im_bored_documenting").setValue("returns","String"),code:async function(){var e;return await this.resolveFields(),this.inside?.startsWith("var:")?(this.inside=this.inside.slice(4),"string"!=typeof(e=this.variable(this.inside))?this.warn(`Variable ${this.inside.bgYellow} is not a string`):this.makeReturn(this.setVariable(this.inside,(0,lodash_1.snakeCase)(e)))):this.makeReturn((0,lodash_1.snakeCase)(this.inside?.unescape()))}};