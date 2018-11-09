import { dirname, join } from "path"
import { CensusPlaces } from "./scrappers/census-places"
import { CensusSldu } from "./scrappers/census-sldu"
import { doWork } from "./workers/download-unzip"
import { makeDir } from "./utils"


process.on('unhandledRejection', (reason, p) => {
    console.log('Shit unhandled rejection at:', p, 'reason:', reason);
});

const APP_PATH = `${dirname(require.main.filename)}`
const PROCESSES = 6;

export async function places() {
    let workspace = join(APP_PATH, "places")
    let geojson = join(APP_PATH, "places", "geojson")
    let places = new CensusPlaces(PROCESSES)
    let chunks: string[][] = await places.scrape()

    makeDir(workspace)
    makeDir(geojson)

    let proms = []
    for (let chunk of chunks) {
        proms.push(doWork(chunk, workspace));
    }
    try {
        let newShapefiles = await Promise.all(proms)
        console.log(newShapefiles)
    } catch (error) {
        console.log(error.stack)
    }
}

export async function sldu() {
    let workspace = join(APP_PATH, "sldus")
    let sldus = new CensusSldu(PROCESSES)
    let chunks: string[][] = await sldus.scrape()

    makeDir(workspace)
    
    let proms = []
    for (let chunk of chunks) {
        proms.push(doWork(chunk, workspace));
    }
    try {
        let newShapefiles = await Promise.all(proms)
        console.log(newShapefiles)
    } catch (error) {
        console.log(error.stack)
    }
}

places()