const fs = require('fs')

const account_value  = 'USER'
const password_value = 'PASSWD'

module.exports = 
{
    "ovh loggin": async function(browser)
    {
        browser.useXpath()
        browser.resizeWindow(1980, 1080)
        browser.maximizeWindow()
        const wait = 15 * 1000

        // login page
        browser.url('https://www.ovh.com/auth/?action=disconnect&onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager%2F')

        const account  = '//*[@id="account"]'
        const password = '//*[@id="password"]'
        const submit   = '//*[@id="login-submit"]'

        browser.waitForElementVisible(account, wait)

        browser.setValue(account,  account_value)
        browser.pause(1 * 1000)

        browser.setValue(password, password_value)
        browser.pause(1 * 1000)

        browser.click(submit)

        // accept cookies page
        const accept = '/html/body/div[4]/div/div/div[2]/div/button[1]'
        browser.waitForElementVisible(accept, wait)
        browser.pause(2 * 1000)
        browser.click(accept)

        // save cookies to file
        browser.getCookies(function(cookies)
        {
            cookies          = cookies.value
            const cookie_str = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
            fs.writeFileSync('./bash/cookie.txt', cookie_str)
        })
    }
}