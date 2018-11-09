import * as cheerio from "cheerio"
import * as request from "request-promise-native"
import { chunk } from "../utils"

const URL = "https://www2.census.gov/geo/tiger/TIGER2014/SLDU/"

export class CensusSldu {

    processes: number = null

    constructor(processes: number) {
        this.processes = processes
    }

    scrape(): Promise<string[][]> {
        return new Promise<string[][]>(async (resolve, reject) => {
            if (!this.processes) reject("Number of processess must be defined.  Use setProcess() before calling scrape().")
            let options: request.RequestPromiseOptions = { method: "get" };
            try {
                let response: any = await request(URL, options)
                let $ = cheerio.load(response)
                let links = [];
                $('table tr').each((i, tr) => {
                    $(tr).find('td').each((j, td) => {
                        $(td).find('a').each((k, a) => {
                            let link = $(a).attr('href')
                            if (link.endsWith('.zip')) links.push(link)
                        })
                    })
                })
                links = links.map((v, i) => { return URL + v })
                let finalLinks = []
                if (links.length >= this.processes) {
                    finalLinks = chunk(links, Math.round(links.length / (this.processes - 1)));
                } else {
                    finalLinks.push(links)
                }
                resolve(finalLinks)
            } catch (e) {
                reject(e)
            }
        })
    }

    setProcesses(num: number) {
        this.processes = num
    }

    getProcesses() {
        return this.processes
    }
}