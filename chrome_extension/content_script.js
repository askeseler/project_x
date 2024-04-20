let scraper = new YtShortsScraper();


(async  () => {
  setTimeout(async function(){
    console.log("Executed after 1 seconds");
    await scraper.start_scraping();
  }, 1000);
})();


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello")
        sendResponse("Hello World sent by content script");
    }
  );