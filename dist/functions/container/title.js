"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.data=void 0;const builder_1=require("../../classes/builder");exports.data={data:(new builder_1.FunctionBuilder).setName("setTitle").setValue("description","sets the title of this embed").setValue("use","$setTitle[index;text;url?]").setValue("fields",[{name:"index",description:"the index of the embed",type:"number[0,4]"},{name:"text",description:"the title of the embed",type:"string"},{name:"url",description:"the url of the embed",type:"string<URL>",optional:!0}]).setValue("example","$setTitle[0;discord!;https://discord.com/]").setValue("returns","Void"),code:async function(){await this.resolveFields();var[e=0,t,s=null]=this.fields.split(!0),e=Number(e);return this.meta.ctn.data.embeds[e]||this.meta.ctn.addEmbed(),this.meta.ctn.data.embeds[e].setTitle(t).setURL(s),this.makeReturn("")}};