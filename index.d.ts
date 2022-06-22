import { Application, Request, Response } from "express"
import { TypedEmitter } from "tiny-typed-emitter";
import { FunctionBuilder } from "./src/classes/builder";
import { SKRSContext2D } from "@napi-rs/canvas";

export interface ConstructorOptions {
    port: number
}

export interface Events {
    ready: (app: Application) => void;
    error: (app: Application) => void;
}

export interface Route {
    path: string
    details?: Record<string, any>
    code: string
}

export interface Data {
    app: Application
    code: string
    func: string
    req: Request
    res: Response
    break: boolean
    unpack: (d: Data) => UnpackedFunction
    _: Record<string, any>
    routes: Endpoints
}

export interface UnpackedFunction {
    name: string
    inside: string | null
    splits: string[] | []
}

export interface FunctionBuilderData {
    name: string,
    extra?: Record<string, any>
}

export interface SourceFunction {
    data: FunctionBuilderData | FunctionBuilder
    code: (data: Data) =>  Promise<{ code: string } | void>
}

export class Interpreter {
    constructor(app: Application)
    public functions: SourceFunction[]
    public app: Application
    private unpack(d: Data): UnpackedFunction
    public parse(text: string): string
    public addFunction(func: SourceFunction)
    private load(): void
}

export const Utils = {
    /**
     * Sends a warn to the console.
     * @param error The error itself.
     * @param data The source.
     */
    Warn(error: string, data: string): void;,
    /**
     * Checks if this string/number is a valid number resolvable.
     * @param num The text to check if its a number.
     */
    isNumber(num: string): boolean;,
    /**
     * Convert a string to boolean.
     * @param str The string to validate as boolean.
     */
    booleanify(str: string): boolean;,
    /**
     * Resolve a condition inside a string.
     * @param condition The string conditional.
     */
    condition(condition: string): boolean | null;,
    /**
     * Convert a string to json.
     * @param json The JSON/Object string.
     */
    loadObject(json: string): Record<string, any> | null;,
    /**
     * Checks if a string is a valid color code (hex) resolvable.
     * @param str The color code.
     */
    isValidHex(str: string): boolean;,
    /**
     * Cuts a molde in the next drawing of the canvas.
     * @param ctx The canvas context.
     * @param x X position.
     * @param y Y position.
     * @param width Width.
     * @param height Height.
     * @param radius The circle radius.
     */
    molde(ctx: SKRSContext2D, x: number, y: number, width: number, height: number, radius: number): void
}

export class Endpoints {
    constructor(app: Application)
    public app: Application
    public routes: Route[]
    public getRoutes(): Route[]
    /**
     * Add a route to the API.
     * @param route The route data.
     * @example
     * module.exports = {
     *      path: '/endpoint',
     *      code: `
     * $send[200;json;{text: "hello"}]
     * `
     * }
     */
    public add(route: Route): void
    /**
     * Load a routes directory (Handler)
     * @param dir The directory path
     * @example
     * <API>.routes.load('./routes')
     */
    public async load(dir: string): Promise<void>
}

export class API extends TypedEmitter<Events> {
    public app: Application
    public interpreter: Interpreter
    public routes: Endpoints
    constructor(options: ConstructorOptions)
    /**
     * Set the spaces in the objects.
     * @param howmany The number of breaklines in the JSON objects.
     */
    public setSpaces(howmany: number): void;
    /**
     * Starts the API.
     */
    public connect(): void
}

declare global {
    interface String {
        /**
         * Replace last argument from a string.
         */
        resolve(What: string, Replacement: string): string
        after(): string | null
        escape(): string | null
        unescape(): string | null
    }
}