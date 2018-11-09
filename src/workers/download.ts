import * as request from "request-promise-native"
import { createWriteStream } from "fs-extra"
import { join } from "path"

export function download(url: string, zipDir: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            let zipName = url.substring(url.lastIndexOf('/') + 1);
            let options = {
                method: "GET",
                encoding: null,
                headers: {
                    "Content-type": "applcation/zip"
                }
            }
            let file = await request.get(url, options)
            let buffer = Buffer.from(file)
            let zipPath = join(zipDir, zipName)
            let stream = createWriteStream(zipPath)
            stream.write(buffer)
            stream.end()
            resolve(zipPath)
        } catch (error) {
            reject(`Downloading error ${error}`)
            console.log(error.stack)
        }
    });
}