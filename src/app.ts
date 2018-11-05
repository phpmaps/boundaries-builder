import * as request from "request-promise-native";
import cheerio from "cheerio"

const URL_PLACES = "https://www2.census.gov/geo/tiger/TIGER2018/PLACE/"
const URL_TEST = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/"


let params = {
    'f': 'json'
}

let options: request.RequestPromiseOptions = {
    method: "get",
    qs: params,
    json: true
};

(async () => {
    try {
        let response: any = await request("https://sampleserver6.arcgisonline.com/arcgis/rest/services/", options)
        console.log(response);
    } catch (e) {
        console.log(e)
        console.log("Booo")
    }
})();