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

Thanks to:
andoniserra.me