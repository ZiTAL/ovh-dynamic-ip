# Application to change OVH ip domain dynamically

requirements: node, npx, npm, curl, dig, firefox or chromium
```
su
apt-get install firefox-esr chromium
ln -s /usr/bin/firefox-esr /usr/local/bin/firefox
exit
```

install:
```
npm install
```

change these files to set credentials
**config.json** and **ovh-dyndns.sh**

run:
```
/bin/bash ovh.sh
```

Change browser: **ovh.sh**

replace
```
firefox:headless
```
by
```
 chromium:headless
 ```

 crontab every hour:
 ```
0 * * * * /bin/bash /home/projects/ovh-dynamic-ip/ovh.sh >>/dev/null 2>> /home/projects/ovh-dynamic-ip/ovh.log
 ```

Thanks to:
andoniserra.me