const fs           = require('fs');
const { execSync } = require('child_process');
const { Selector } = require('testcafe');

const config  = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const command = 'curl -s ifconfig.me'
const IP      = execSync(command, { encoding: 'utf-8' });

fixture('ovh')
    .page(`https://www.ovh.com/auth/?action=disconnect&onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager%2F%23%2Fweb%2Fdomain%2F${config.domain}%2Fzone"`)    

test('ovh login', async t =>
{
    await t.maximizeWindow()

    const account  = await Selector('#account')
    const password = await Selector('#password')
    const login    = await Selector('#login-submit')

    await t.typeText(account,  config.account)
    await t.typeText(password, config.password)
    await t.click(login)

    const cookie_accept = Selector('button[data-navi-id="cookie-accept"]')
    await t.click(cookie_accept)

    const iframe = Selector('iframe').nth(0)
    await t.switchToIframe(iframe)
    const trs = Selector('td').filter(node => node.textContent.trim() === 'A').parent(0)
    await t.wait(30 * 1000).expect(trs.exists).ok()
    
    let count = await trs.count
    if(count<1)
        return false

    for (let i = 0; i < count; i++)
    {
        let tr = await trs.nth(i)
        const button = tr.find('td:last-child button').nth(0)
        await t.click(button)
        await t.wait(1 * 1000)
        const oami = tr.find('oui-action-menu-item').nth(0)
        await t.click(oami)
        await t.wait(5 * 1000)
        const target = await Selector('#target')
        await t.wait(5 * 1000).expect(target.exists).ok()
        await t.typeText(target, IP, { replace: true })
        const next = await Selector('#currentAction button').filter(node => node.textContent.trim() === 'Next').nth(0)
        await t.click(next)
        await t.wait(5 * 1000)
        const confirm = await Selector('#currentAction button').filter(node => node.textContent.trim() === 'Confirm').nth(1)
        await t.wait(5 * 1000).expect(confirm.exists).ok()
        await t.click(confirm)
        await t.wait(5 * 1000)
    }
});
