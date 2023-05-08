'use strict';


import PagesRepository from "./PagesRepository.js";

export default class PagesComponent {
    #storage;

    constructor(storage) {
        console.log("IN CONSTRUCTOR OF PAGES COMPONENT");
        this.#storage = storage;
        this.#initialiseHTML();
    }

    async #initialiseHTML() {
        this.ShowPages();
    }

    ShowPages() {
        var data = this.#storage.storage;
        console.log(data);
        if(data.length > 2)
            this.#ShowResultsData(data.time, data.totalHints, data[0], data.length-2);
        const table = document.getElementById("resultsTable");
        
        for(let index = 0; index < data.length - 2; index++) {
            let page = data.getItem(index);
            let row = document.createElement("tr");
            let c1 = document.createElement("td");
            let c2 = document.createElement("td");
    
            c1.innerText = index+1;
            
            let link = document.createElement("a");
            link.href = "../../hint-report/" + page + ".html";
            link.target = "_blank";
            link.innerHTML = page;
            c2.appendChild(link);
    
            row.appendChild(c1);
            row.appendChild(c2);
            table.appendChild(row);
        }
        
    }

    #ShowResultsData(time, totalHints, mainUrl, totalPages) {
        const min = Math. floor((time/1000/60) << 0);
        const sec = Math. floor((time/1000) % 60);
        document.getElementById("scan-time").innerHTML = min + "m  " + sec + "s";
        document.getElementById("total-hints").innerHTML = totalHints;
        document.getElementById("main-url").innerHTML = mainUrl;
        document.getElementById("total-pages").innerHTML = totalPages;
    }
}

function DeleteResultData() {
    document.getElementById("wrong-url-format").innerText =
    document.getElementById("scan-time").innerHTML = "";
    document.getElementById("total-hints").innerHTML = "";
    document.getElementById("main-url").innerHTML = "";
    document.getElementById("total-pages").innerHTML = "";
}

const init = function() {
    const pagesStorage = new PagesRepository(localStorage);
    const pagesComponent = new PagesComponent(pagesStorage);
    document.getElementById("submitBtn").onclick = () => HandleForm();

    if (!pagesStorage.storage) {
        alert("Browser doesn't support storage");
        return;
    }

    async function HandleForm() {
        pagesStorage.clear();
        DeleteResultData();
        document.getElementById("loader").style.visibility = "visible";

        const url = document.getElementById("url").value;
        const nrOfUrls = document.getElementById("nrOfUrls").value;

        try {
            const response = await fetch("http://localhost:3001/geturls", {
                method: "POST",
                header: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    maxurls: nrOfUrls,
                }),
            });
            if(!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const json = await response.json();
            pagesStorage.addData(json);
            pagesComponent.ShowPages();
            document.getElementById("loader").style.visibility = "hidden";
            if(json.urls <= 0) {
                document.getElementById("wrong-url-format").innerText = "Wrong format of url!"
            }
        } catch (error) {
            console.log(error);
        }
    }
}

window.onload = init;