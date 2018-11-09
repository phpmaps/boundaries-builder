import * as request from "request-promise-native"
import * as cheerio from "cheerio"
import { fork } from "child_process";
import { chunk } from "./utils"

const URL = "https://www2.census.gov/geo/tiger/TIGER2018/PLACE/"
const PROCESSES = 6

export class CensusPlaces {

    async scrape() {
        try {
            let options: request.RequestPromiseOptions = { method: "get" };
            let response = await request(URL, options)
            let $ = cheerio.load(response)
            let links = []
            $('table tr').each((i, tr) => {
                $(tr).find('td').each((j, td) => {
                    $(td).find('a').each((k, a) => {
                        let link = $(a).attr('href')
                        if (link.endsWith('.zip')) links.push(link)
                    })
                })
            })
            if (links.length >= PROCESSES) {
                links = chunk(links, Math.round(links.length / (PROCESSES - 1)));
            }
            console.log(links.length);
        } catch (error) {
            console.log(error.stack)
        }
    }
}
