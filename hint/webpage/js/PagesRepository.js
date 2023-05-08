'use strict';


export default class PagesRepository {
    // #urls = ["https-amai-vlaanderen-oproep", "https-amai-vlaanderen-ai-verhalen", "https-amai-vlaanderen-aikompas", "https-verhalen-amai-vlaanderen-gezondheid", "https-verhalen-amai-vlaanderen-mobiliteit", "https-verhalen-amai-vlaanderen-natuur"];
    #storage;

    constructor(storage) {
        console.log("IN CONSTRUCTOR OF STORAGE COMPONENT");
        this.#storage = storage;
    }

    get storage() {
        return this.#storage;
    }

    clear() {
        this.#storage.clear();
    }

    addData(resultData) {
        console.log("PRINTING URLS IN STORAGE");
        this.#storage.setItem("time", resultData.time);
        this.#storage.setItem("totalHints", resultData.totalHints);
        
        resultData.urls.forEach((url, index) => {
            url = url.replace("://", "-").replaceAll("/", "-").replaceAll(".", "-").replaceAll("?", "-query-").replaceAll("=", "-query-");

            if(url.charAt(url.length -1) == "-") {
                url = url.substring(0, url.length-1);
                console.log("REPLACING CHAR");

            }
            this.#storage.setItem(index, url);
        });
    }
}
