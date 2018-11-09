import { download } from "./download"
import { unzip } from "./unzip"
import { shpToGeojson } from "./geojson"
import { join, basename } from "path"

export async function doWork(links: string[], zipDir): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
        let err = null;
        try {
            let zipProms = links.map((v, i) => { return download(v, zipDir) })
            let zips = await Promise.all(zipProms) as string[]
            try {
                let shapefileDir = join(zipDir, "shapefiles")
                let shapefileProms = zips.map((zip, i) => {
                    let outShapefile = join(shapefileDir, basename(zip).replace(".zip", ".shp"))
                    return unzip(zip, outShapefile)
                })
                let shapefiles: string[] = await Promise.all(shapefileProms)
                let geojsons: string[] = await shpToGeojson(shapefiles,zipDir)
                console.log(shapefiles)
                console.log(geojsons)
                resolve(geojsons)
            } catch (error) {
                err = `Unzip error ${error.stack}`;
            }
        } catch (error) {
            err = `Download error  ${error.stack}`;
            reject(err)
        }
    })
}
