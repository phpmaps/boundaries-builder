import * as shapefile from "shapefile"
import { writeJSON } from "fs-extra"
import { join, basename } from "path"

export function shpToGeojson(shapes: string[], zipDir: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        let geojsons: string[] = []
        for (let shape of shapes) {
            let name = basename(shape).replace(".shp", ".json")
            try {
                let source = await shapefile.open(shape)
                try {
                    let filename: string = join(zipDir, "geojson", name)
                    let geojson = await source.read();
                    await writeJSON(filename, geojson.value)
                    geojsons.push(filename)
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        }
        resolve(geojsons)
    })
}