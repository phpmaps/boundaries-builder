import { existsSync, mkdirSync } from "fs-extra"

export function chunk(arr, size: number): String[] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size))
}

export function makeDir(dir: string) {
    if (!existsSync(dir)) {
        mkdirSync(dir);
    }
}