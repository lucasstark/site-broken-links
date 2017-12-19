const HtmlUrlChecker = require("broken-link-checker").HtmlUrlChecker;
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const UrlsRepository = require('./src/Repository/UrlsRepository');
const OptionsRepository = require('./src/Repository/OptionsRepository');

const menu = require('./src/Model/Menu');
const Args = require('./src/Model/Args');

let args = new Args(commandLineArgs(menu[1]['optionList']));

if (args.shouldShowHelp()) {
    console.log(getUsage(menu));
} else {
    // Load the option.
    let optionsRepository = new OptionsRepository(args);
    let option = optionsRepository.getOption();

    // Load the urls to test.
    let urlsRepository = new UrlsRepository(option, args);
    let urls = urlsRepository.findForRange();

    let htmlUrlChecker = new HtmlUrlChecker({}, {
        'link': (result, /** @var {Url} */url) => {
            console.log("checked: " + result.base.original + " => " + result.url.original);
            if(result.broken) {
                console.log(result.base.original + " => " + result.url.original);
                url.addBroken(result.url.original);
            }
        },
        'end': () => {
            console.log("Saved to file...");
        }
    });

    urls.forEach(url => htmlUrlChecker.enqueue(url.url, url));
}