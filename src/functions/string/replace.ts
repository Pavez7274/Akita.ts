import { FunctionBuilder } from "../../classes/builder";
import { SourceFunction, Data } from "../../../index";
import { That } from "src/classes/data";
// import Hjson from "hjson";

export const data: SourceFunction = {
    data: new FunctionBuilder()
        .setName('replace')
        .setValue('description', '...')
        .setValue('use', '$replace[text;pattern;replacer]')
        .setValue('fields', [{
            name: 'text',
            type: 'string'
        }, {
            name: "pattern",
            type: "string | regexp"
        }, {
            name: "replacer",
            type: "string | void"
        }])
        .setValue('example', '$replace[hello mid;hello;uwu]')
        .setValue('returns', 'Void'),
    code: async function (this: That) {
        await this.resolveFields()
        let [text, pattern, replacer] = this.fields.split(true) as [string, string | RegExp, string]
        if (text.startsWith("var:")) {
            let value = this.variable(text = text.slice(4))
            if (typeof value !== "string") return this.warn(`Variable ${text.bgYellow} is not a string`)
            text = value
        }
        if (/\/(.*?)\/(.+)?/g.test(pattern as string)) {
            let splitted = (pattern as string).split("/")
            pattern = new RegExp(splitted.slice(1, -1).join("/"), splitted.at(-1))
        }
        if (replacer.startsWith("run:")) {
            let callback = this.data.client.cbs[replacer = replacer.slice(4)]
            if (callback) {
                text = await text.asyncReplace(pattern, async (...params) => {
                    let data = await this.data.interpreter.parse(callback.trim().replace(/\$(\d+)/g, (_, a) => {
                        return params[Number(a) - 1]
                    }), this.data, this.data.client)
                    return data?.metadata?.yields?.[0] || data?.code || ""
                })
                return this.makeReturn(text)
            } else return this.warn(`callback ${callback.bgYellow} does not exists`)
        }
        return this.makeReturn(text.replace(pattern, replacer))
        // await d.func.resolve_fields(d);
        // let [text, pattern, replacer] = d.interpreter.fields(d) as [string, string | RegExp, string];
        // if (text.startsWith("var:")) {
        //     let n = text.slice(4), value = lodash.get(d.metadata.vars, n);
        //     if (typeof value != "string")
        //         return Utils.Warn(`Variable ${n.bgYellow} is not a string`, d);
        //     text = value;
        // };
        // if (/\/(.*?)\/(.+|)/g.test(pattern as string)) {
        //     let splitted = (pattern as string).split("/");
        //     pattern = new RegExp(splitted[1], splitted[2]);
        // };
        // if (replacer.startsWith("run:")) {
        //     let n = replacer.slice(4), cb = d.client.cbs[n];
        //     if (!cb)
        //         return Utils.Warn(`callback ${n.bgYellow} does not exists`, d);
        //     text = await text.asyncReplace(pattern, async (...params: any[]) => {
        //         let data = await d.interpreter.parse(cb.trim().replace(/\$(\d+)/g, (_, a) => params[Number(a) - 1]), d, d.client);
        //         return data?.metadata?.yield || data?.code || "";
        //     });
        //     return {
        //         code: d.code?.replace(d.func.id, text)
        //     };
        // };
        // return {
        //     code: d.code?.replace(d.func.id, text.replace(pattern, replacer))
        // };
    }
}