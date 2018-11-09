import * as extract from "extract-zip"
import { dirname } from "path"


export function unzip(inZip, outShapefile): Promise<string> {
    return new Promise((resolve, reject) => {
        var outShapefileDir = dirname(outShapefile);
        extract(inZip, { dir: outShapefileDir }, (err) => {
            if (err) {
                console.log(err)
                reject(`unzipping error ${err}`)
            } else {
                resolve(outShapefile)
            }
        })
    })
}