import crochet
import os
import logging
import scrapy_spider

from flask import Flask, request, Response, abort, jsonify
from scrapy import signals
from scrapy.signalmanager import dispatcher
from scrapy.crawler import CrawlerRunner
from urllib.parse import urlparse


# Config
crochet.setup()
url_data = []
crawl_runner = CrawlerRunner()

app = Flask(__name__)
app.config.update(
    {
        "TESTING": True,
        "DEBUG": True
    }
)
logging.basicConfig(
    format="%(asctime)s %(process)d,%(threadName)s %(filename)s:%(lineno)d [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.INFO,
)


# Spider
def __get_request_body():
    if request_body := request.get_json(silent=True):
        return request_body
    abort(405, message="Invalid input")

def __is_malformed_message(data, fields):
    if not all(x in data for x in fields):
        abort(
            405,
            message=f"Malformed request body. Mandatory fieds: {[field for field in fields]}",
        )

def read_json_data():
    try:
        with open('items.json', "r") as f:
            data = f.readlines()
            f.close()
        os.remove("items.json")
        return Response(response=data, status=200, mimetype="application/json")
    except Exception as ex:
        print(ex + ex.__traceback__)
        abort(400, message=f"Exception during reading data: {ex}")


@app.route("/geturls", methods=["POST"])
def get_urls():
    content = __get_request_body()
    __is_malformed_message(content, ["start_url", "max_urls"])

    try:
        url = content["start_url"]
        max_urls = content["max_urls"]
        scrape_with_crochet(url)
    except Exception as ex:
        print(ex)
        abort(400, message=f"Exception during crawling website: {ex}")

    output_data = []
    for index, data in enumerate(url_data):
        if index == max_urls:
            break
        output_data.append(data["url"])
    url_data.clear()
    return jsonify(output_data)


# Logic
@crochet.wait_for(timeout=240.0)
def scrape_with_crochet(url):
    dispatcher.connect(_crawler_result, signal=signals.item_scraped)
    
    eventual = crawl_runner.crawl(
        scrapy_spider.MySpider, url = url)
    
    return eventual

def _crawler_result(item, response, spider):
    url_data.append(dict(item))


# Run
if __name__ == '__main__':
    app.run(host='localhost', port=3002, debug=True)