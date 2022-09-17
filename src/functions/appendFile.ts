import { FunctionBuilder } from "../classes/builder";
import { SourceFunction } from "../../index";
import { Utils } from "../classes/utils";
import fs from 'fs';

export const data: SourceFunction = {
    data: new FunctionBuilder()
    .setName('appendFile')
    .setValue('description', 'Appends content to the end of the file, if the file exists.')
    .setValue('use', '$appendFile[path;content]')
    .setValue('returns', 'Void'),
    code: async d => {
        let r = d.unpack(d);
        if (!r.inside) return Utils.Warn('Invalid inside provided in:', d.func);
        let [path, content] = r.splits;
        if (!path) return Utils.Warn('Path is required in:', d.func);
        if (!content) return Utils.Warn('Content is required in:', d.func);
        try {
            fs.appendFileSync(path, content)
            return {
                code: d.code.resolve(`${d.func}[${r.inside}]`, '')
            };
        } catch(err) {
            return Utils.Warn('Error trying to append the provided file.', d.func);
        } 
    }
}