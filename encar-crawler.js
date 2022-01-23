const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');


// 환경설정
fs.mkdirSync('result', {recursive: true});


async function main() {
    // 드라이버 생성
    let options = new chrome.Options();
    options.addArguments('--headless');  
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    // 페이지 접근
    url = 'http://www.encar.com/fc/fc_carsearchlist.do?carType=for&searchType=model&TG.R=B#!%7B%22action%22%3A%22(And.Hidden.N._.(C.CarType.N._.(C.Manufacturer.%EB%B2%A4%EC%B8%A0._.(C.ModelGroup.S-%ED%81%B4%EB%9E%98%EC%8A%A4._.Model.S-%ED%81%B4%EB%9E%98%EC%8A%A4%20W223.))))%22%2C%22toggle%22%3A%7B%7D%2C%22layer%22%3A%22%22%2C%22sort%22%3A%22ModifiedDate%22%2C%22page%22%3A1%2C%22limit%22%3A20%7D';
    await driver.get(url);

    // 한번에 50개씩 보기
    await driver.findElement(By.css('#pagerow > option:nth-child(4)')).click();
    
    // 현재 페이지에서 데이터 수집
    result = [];
    let curPage = 0;
    while(curPage < 100) {
        curPage++;
        await driver.sleep(3000);
        let elementList = await driver.findElements(By.css('#sr_normal > tr'));
        for (const element of elementList) {
            let info = {};
        
            const name = await element.findElement(By.css('td.inf > a')).getText();
            const year = await element.findElement(By.css('td.inf > span.detail > span.yer')).getText();
            const km = await element.findElement(By.css('td.inf > span.detail > span.km')).getText();
            const fue = await element.findElement(By.css('td.inf > span.detail > span.fue')).getText();
            const loc = await element.findElement(By.css('td.inf > span.detail > span.loc')).getText();
            const prc = await element.findElement(By.css('td.prc_hs')).getText();
            const link = await element.findElement(By.css('td.inf > a')).getAttribute('href');
        
            info['name'] = name;
            info['year'] = year;
            info['km'] = km;
            info['fue'] = fue;
            info['loc'] = loc;
            info['prc'] = prc;
            info['link'] = link;
            result.push(info);
        }

        // 다음페이지 이동
        try {
            await driver.findElement(By.css("#pagination"))
                .findElement(By.css(`a[data-page='${curPage+1}']`))
                .click();
        } catch(NoSuchElementError) {
            break;
        }
    }
    
    // 데이터 저장
    resultJSON = JSON.stringify(result);
    fs.writeFileSync('result/data.json', resultJSON);

    // 종료
    await driver.quit();
}
    

main();