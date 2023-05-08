import { Analyzer, AnalyzerResult, FormatterOptions } from 'hint';
import fetch from 'node-fetch';
import * as http from 'http'
import { ServerResponse, IncomingMessage } from "http";

interface BodyParams {
    start_url: string;
    max_urls: number;
}

interface resultData {
    time: number;
    totalHints: number; 
    urls?: [];
}


async function CheckWebPage(urls) {
    const userConfig = {
        extends: ["accessibility"],
        formatters: ["html"],
    };

    try {
        const begin = Date.now();

        const webhint = Analyzer.create(userConfig);
        const results: AnalyzerResult[] = await webhint.analyze(urls);
    
        const end = Date.now();
        const time = end - begin;
        let totalHints = 0;

        results.forEach((result) => {
            console.log(`Result for: ${result.url}`);
            totalHints += result.problems.length;
            const options: FormatterOptions = {
                // date: Date.now().toLocaleString(),
                scanTime: time,
                target: result.url,
                version: "6.14.15",
            }
            webhint.format(result.problems, options);
        });
        const resultData: resultData = {
            time: time,
            totalHints: totalHints
        };
        return resultData;
    } catch(ex) {
        console.log("Error during validation: " + ex)
    }
}


async function FetchData(params: BodyParams) {
    const data = await fetch(`http://localhost:3002/geturls`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
    .then((res) => res.json())
    .catch((ex) => console.log(ex));
    return data;
}


async function FetchUrlsAndExecuteValidation(url: string, max_urls: number) {
    const params: BodyParams = {
        start_url: url,
        max_urls: max_urls,
    };
    const urls = await FetchData(params);
    const resultData: resultData = await CheckWebPage(urls);
    resultData.urls = urls
    return resultData;
}



const myServer = http.createServer(async (req, res) => {
    if (req.method == "POST" && req.url == "/geturls") {
        return getUrls(req, res);
    }
 });
myServer.listen(3001, () => {
    console.log('Server is running on port 3001. Go to http://localhost:3001/')
 });

const getUrls = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        console.log("REQUEST COMING IN");
        
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
    
        req.on("end", async () => {
            const { url, maxurls } = JSON.parse(body);
            const resultData = await FetchUrlsAndExecuteValidation(url, parseInt(maxurls));
            res.statusCode = 200;
            res.statusMessage = "OK";
            res.end(JSON.stringify(resultData));
        });
    } catch(error) {
        console.log(error);
    }

}
