const fs           = require('fs');
const { execSync } = require('child_process');
const { Selector } = require('testcafe');

const config     = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const IP         = execSync('curl -s ifconfig.me',             { encoding: 'utf-8' }).trim();
const CURRENT_IP = execSync(`dig +short ${config.ovh.domain}`, { encoding: 'utf-8' }).trim();

if(CURRENT_IP===IP)
{
    console.log(`${config.ovh.domain}: NOT updated, same IP: ${IP}`)
    process.exit()
}

fixture('ovh')
    .page(`https://www.ovh.com/auth/?action=disconnect&onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager%2F%23%2Fweb%2Fdomain%2F${config.ovh.domain}%2Fzone`)

test('ovh update ip', async t =>
{
    //await t.maximizeWindow()
    await t.resizeWindow(1920, 1080)

    const account  = await Selector('#account')
    const password = await Selector('#password')
    const login    = await Selector('#login-submit')

    await t.typeText(account,  config.ovh.account)
    await t.typeText(password, config.ovh.password)
    await t.click(login)

    const cookie_accept = Selector('button[data-navi-id="cookie-accept"]')
    await t.click(cookie_accept)

    const iframe = Selector('iframe[title="app"]').nth(0)
    await t.switchToIframe(iframe)
    await t.wait(30 * 1000).expect(Selector('td').filter(node => node.textContent.trim() === 'A').exists).ok()

    let trs = await getTrs()
    if(trs.length>0)
    {
        for(let i=0; i<trs.length; i++)
            await  editRecord(trs[i])
        return true
    }
    return false

    async function getTrs()
    {
        let   r   = []
        let   trs = []
        const tds = await Selector('td').filter(node => node.textContent.trim() === 'A')
        let count = await tds.count
        for (let i = 0; i < count; i++)
            trs.push(tds.nth(i).parent())

        for (let i = 0; i < count; i++)
        {
            const tr   = trs[i]
            const span = await tr.find('span').nth(0)
            let ip     = await span.textContent
            ip         = ip.trim()
            if(ip!==IP)
                r.push(tr)
        }
        return r
    }

    async function editRecord(tr)
    {
        const button = tr.find('td:last-child button').nth(0)
        await t.click(button)
        await t.wait(1 * 1000)
        const oami = tr.find('oui-action-menu-item').nth(0)
        await t.click(oami)
        await t.wait(3 * 1000)
        const target = await Selector('#target')
        await t.wait(3 * 1000).expect(target.exists).ok()
        await t.typeText(target, IP, { replace: true })
        const next = await Selector('#currentAction button').filter(node => node.textContent.trim() === 'Next').nth(0)
        await t.click(next)
        await t.wait(3 * 1000)
        const confirm = await Selector('#currentAction button').filter(node => node.textContent.trim() === 'Confirm').nth(1)
        await t.wait(3 * 1000).expect(confirm.exists).ok()
        await t.click(confirm)
        await t.wait(3 * 1000)        
    }
});
