import * as fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import enUSLangJson from "../src/i18n/lang/en-US.json" assert { type: "json"};

type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never
};

type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

type FieldTypeMap = XOR<{ children: FieldTypeMap[] }, { type: string }> & { name: string };



const generatorLocaleTypeMap = (obj: object): FieldTypeMap[] => {
    return Object.entries(obj)
        .map(([k, v]) => {
            return typeof v === "object" ? {
                name: k,
                children: generatorLocaleTypeMap(v)
            } : {
                name: k,
                type: typeof v
            };
        });
}

const typeMap = generatorLocaleTypeMap(enUSLangJson);

const fillSpace = (length: number) => " ".repeat(length);
const defaultSpaceLength = 4;
const generatorLocaleTypeStr = (typeData: FieldTypeMap[], spaceLength: number): string => {
    return "{\n" + typeData.map(i => {
        if (i.children) {
            return `${fillSpace(spaceLength)}${i.name}: ${generatorLocaleTypeStr(i.children, spaceLength + defaultSpaceLength)}`;
        } else {
            return `${fillSpace(spaceLength)}${i.name}: ${i.type}`;
        }
    }).join(",\n") + `\n${fillSpace(spaceLength - defaultSpaceLength)}}`;
}

const typeContent = `interface Locale ` + generatorLocaleTypeStr(typeMap, defaultSpaceLength);
const dirPath = path.dirname(fileURLToPath(import.meta.url));
const localeTypeFilePath = path.resolve(dirPath, "../src/types/locale.d.ts");

await fs.writeFile(localeTypeFilePath, typeContent, {
    encoding: "utf8"
});