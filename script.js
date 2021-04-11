const pup = require("puppeteer");

let id = "kena90828@gmail.com";
let tab;

async function main() {
    let browser = await pup.launch({
        headless : false,
        defaultViewport : false,
        args : ["--start-maximized"] 
    });

    let pages = await browser.pages();
    tab = pages[0];

    //codeforces
    await tab.goto("https://codeforces.com/");
    await tab.waitForSelector(".menu-list.main-menu-list li", {visible : true});
    let buttons = await tab.$$(".menu-list.main-menu-list li");
    await buttons[2].click();

    //contest page
    await tab.waitForSelector("table tr[data-contestid]", {visible : true});
    
    let result = await tab.evaluate(() => {
        let rows = document.querySelectorAll('table tr[data-contestid]');
        return Array.from(rows, row => {
          let columns = row.querySelectorAll('td');
          return Array.from(columns, column => column.innerText);
        });
    });
    // console.log(result);
    
    let contests = [];

    for(let i = 0; i < result.length && i < 5; i++) {
        contests[i] = {
            'name' : result[i][0],
            'date' : result[i][2].substring(0, 11),
            'time' : result[i][2].substring(12,17),
        } 
    }

    // console.log(contests);


    ////------ reminder -----------//
    await tab.goto("https://www.google.com/calendar/about/");
    await tab.waitForSelector(".signin-btn");
    await tab.click(".signin-btn");
    //sign in 
    await tab.waitForSelector("#identifierId", {visible : true});

    await tab.type("#identifierId", id);
    // await tab.waitForSelector(".VfPpkd-RLmnJb", {visible : true});
    await tab.click(".VfPpkd-RLmnJb");
    let options = await tab.$$(".VfPpkd-Jh9lGc");
    await options[0].click();
    // await tab.waitForSelector(".VfPpkd-RLmnJb", {visible : true});
    // await tab.click(".VfPpkd-RLmnJb");

    // let button = await tab.$$(".ZFr60d.CeoRYc");
    // await button[1].click();


    //set reminder
    for(let i in contests) {
        await setReminder(contests[i]);
    }


}

async function setReminder(obj){
    await tab.waitForSelector(".VfPpkd-BIzmGd.SaBhMc.NNFoTc.wJGlHe.kBIr7e");
    await tab.click(".VfPpkd-BIzmGd.SaBhMc.NNFoTc.wJGlHe.kBIr7e");
    await tab.waitForSelector(".kx3Hed.VZhFab");
    let buttons = await tab.$$(".kx3Hed.VZhFab");
    await buttons[1].click();
    
    await tab.type(".mvRfff input", obj.name);
    await tab.waitForSelector(".mVuQpd");
    let inputFields = await tab.$$(".mVuQpd");
    await inputFields[4].click();
    await inputFields[4].type(obj.date);
    await inputFields[5].click();
    await inputFields[5].type(obj.time);
    await tab.click(".uArJ5e.UQuaGc.Y5sE8d");

}

main();
