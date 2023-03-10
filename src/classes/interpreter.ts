import { SourceFunction, Data, Falsy } from "../../index";
import { Compiler, FnD } from "./compiler";
import { Container } from "./container";
import { AkitaClient } from "./client";
import { Fields } from "./fields";
import { Utils } from "./utils";
import { That } from "./data";
import lodash from "lodash";
import fs from "fs";

export class Interpreter {
    public functions: SourceFunction[]
    private compiler: Compiler;
    constructor() {
        this.compiler = new Compiler("");
        this.functions = [];
        this.load();
        this.compiler.set_functions(this.functions.map(function (fn: SourceFunction) {
            return fn.data.name;
        }));
    }
    public fields(data: Data, index = 0, unescape = true): string[] {
        return data.func.fields?.slice(index)?.map(a => unescape ? a.value.unescape()?.trim()! : a.value.trim()) || [];
    }
    public async resolve_fields(data: Data, start = 0, end: number | Falsy = undefined): Promise<FnD> {
        for (let i = start; i < data.func?.fields?.length!; i++) {
            if (i == end) break;
            data.func = await this.resolve_field(data, i);
        }
        return data.func!;
    }
    public async resolve_field(data: Data, index: number): Promise<FnD> {
        if (data.func?.fields?.[index]) {
            for (const over of data.func.fields[index].overs) {
                const finded = data.interpreter.functions.find(f => f.data.name == over.name);
                if (finded) {
                    over.resolve_fields = this.resolve_fields;
                    over.resolve_field = this.resolve_field;
                    const new_data = { ...data, func: over, code: data.func!.fields![index].value }
                    // @ts-ignore
                    const reject = await finded.code(new_data);
                    if (reject?.code && data.func?.inside && data.func.fields) {
                        data.func.fields[index].value = reject.code;
                        data.func.inside = data.func.fields.map((field) => field.value).join(";");
                        data.func.total = `${data.func.name}[${data.func.inside}]`;
                        data.break = new_data.break;
                        data.metadata = new_data.metadata;
                    }
                }
            }
        }
        return data.func!;
    }
    public async parse(text: string, d: undefined | Data, client: AkitaClient): Promise<Data | undefined> {
        if (text) {
            this.compiler.set_code(text);
            this.compiler.match();
            let data: Data = {
                metadata: lodash.merge({
                    ctn: new Container().setInstance(d?.metadata?.ctx?.data),
                    parent: d?.metadata?.parent || null,
                    yields: d?.metadata?.yields || {},
                    vars: d?.metadata?.vars || {}
                }, d?.metadata),
                code: this.compiler.result || "",
                compiler: this.compiler,
                interpreter: this,
                break: !!d?.break,
                func: {} as FnD,
                client
            }
            for (const fn of Object.values(this.compiler.matched!).reverse()) {
                if (data.break) break;
                // @ts-ignore
                data = await this.run_function(fn, new That(data, new Fields(data))) || data;
            }
            return data;
        }
    }
    public async run_function(fn: FnD, d: That): Promise<Data> {
        try {
            const finded = this.functions.find(i => i.data.name == fn.name);
            if (finded) {
                fn.resolve_fields = this.resolve_fields;
                fn.resolve_field = this.resolve_field;
                d.data.func = fn;
                const reject = await finded.code.apply(d, [d.data]);
                if (reject?.code) {
                    d.data.code = reject.code.trim() || "";
                }
            }
            return d.data;
        } catch ($: unknown) {
            console.log($)
            d.data.client?.emit("functionError", $ as Error, d);
            return d.data;
        }
    }
    public async _(fn: FnD) {
        if (fn.fields) {
            for (let i = 0; i < fn.fields.length; i++) {
                for (const o of fn.fields[i].overs) {
                    await this._(o);
                    fn.fields[i].value = fn.fields[i].value.replaceAll(o.id, o.total);
                    fn.inside = fn.inside?.replaceAll(o.id, o.total);
                    fn.total = fn.total.replaceAll(o.id, o.total);
                }
            }
        }
    }
    public addFunction(func: SourceFunction): void {
        this.functions[this.functions.length] = func;
        this.compiler.set_functions(this.functions.map(function (fn: SourceFunction) {
            return fn.data.name;
        }));
        this.functions.sort((a, b) => b.data.name.length - a.data.name.length)
    }
    private load(): void {
        const mod = __dirname.replace("classes", "functions");
        for (const folder of fs.readdirSync(mod)) {
            for (const file of fs.readdirSync(`${mod}/${folder}/`)) {
                const r: SourceFunction | undefined = require(`../functions/${folder}/${file}`).data
                if (r) this.addFunction(r);
            }
        }
        String.prototype.unescape = function () {
            return this
                .replace(/@at/gi, "@")
                .replace(/@left/gi, "[")
                .replace(/@right/gi, "]")
                .replace(/@semi/gi, ";")
                .replace(/@colon/gi, ":")
                .replace(/@equal/gi, "=")
                .replace(/@or/gi, "||")
                .replace(/@and/gi, "&&")
                .replace(/@higher/gi, ">")
                .replace(/@lower/gi, "<")
                .replace(/@left_parent/gi, ")")
                .replace(/@right_parent/gi, "(")
                .replace(/@dollar/gi, "$")
        };
        String.prototype.escape = function () {
            return this
                .replace(/@/g, "@at")
                .replace(/\]/g, "@right")
                .replace(/\[/g, "@left")
                .replace(/;/g, "@semi")
                .replace(/:/g, "@colon")
                .replace(/=/g, "@equal")
                .replace(/\|\|/g, "@or")
                .replace(/&&/g, "@and")
                .replace(/>/g, "@higher")
                .replace(/</g, "@lower")
                .replace(/\$/g, "@dollar")
        };
        String.prototype.asyncReplace = function (pattern: string | RegExp, replacer: Function | string) {
            const _this = this, values: any[] = [];
            try {
                if (typeof replacer === "function") {
                    return _this.replace(pattern, function () {
                        return values.push(replacer.apply(undefined, arguments)), ""
                    }), Promise.all(values)
                        .then(function (resolved) {
                            return _this.replace(pattern, () => resolved.shift()!);
                        });
                } else {
                    return Promise.resolve(this.replace(pattern, replacer));
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}