// https://git.andoniserra.me/dyndns-updater/ oinarrituta

const fs           = require('fs')
const { execSync } = require('child_process')

const config     = JSON.parse(fs.readFileSync('config.json', 'utf8'))
const domain     = config.ovh.domain
const subdomains = config.dyndns.subdomains
const IP         = execSync('curl -s ifconfig.me', { encoding: 'utf-8' }).trim()

for(let i=0; i<config.dyndns.subdomains.length; i++)
{
        const host       = `${subdomains[i]}.${domain}`
        let   command    = `dig +short ${host}`
        const current_ip = execSync(command, { encoding: 'utf-8' }).trim()
        if(IP!==current_ip)
        {
                command = `curl -su ${config.dyndns.account}:${config.dyndns.password} "http://www.ovh.com/nic/update?system=dyndns&hostname=${host}&myip=${IP}"`
                execSync(command, { encoding: 'utf-8' })
                console.log(`${host}: updated from ${current_ip} to ${IP}`)
        }
        else
                console.log(`${host}: NOT updated, same IP: ${IP}`)
}