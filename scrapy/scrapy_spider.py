import scrapy

from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from urllib.parse import urlparse



class MySpider(CrawlSpider):
    name = 'scrapy_spider'

    def __init__(self, url, *a, **kw):
        super().__init__(*a, **kw)
        self.start_urls = [url]
        self.allowed_domains = [urlparse(self.start_urls[0]).hostname]
        
    custom_settings = {
        'CLOSESPIDER_PAGECOUNT': 180,
    }

    rules = (
        Rule(LinkExtractor(), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        yield {'url':  response.url}
