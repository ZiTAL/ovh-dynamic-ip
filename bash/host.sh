#!/bin/bash
DIR=$(dirname "$0")
IP=`curl -s ifconfig.me`
DATA_RAW="{\"subDomain\":\"\",\"target\":\"$IP\",\"ttl\":0}"
COOKIE=`cat ${DIR}/cookie.txt`
HEADERS="-H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json;charset=utf-8' -H 'X-OVH-MANAGER-PAGE: app.domain.product.zone' -H 'X-OVH-MANAGER-VERSION: thallium-moose-1' -H 'Content-Language: en_GB' -H 'Origin: https://www.ovh.com' -H 'Connection: keep-alive' -H 'Referer: https://www.ovh.com/manager/web/' -H 'Sec-Fetch-Dest: empty' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Site: same-origin' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache'"
TARGET=$DIR/tmp.sh
echo "#!/bin/bash" > $TARGET

# edit IP (domain.com)
COMMAND="curl 'https://www.ovh.com/engine/apiv6/domain/zone/domain.com/record/1234567890' --compressed \
-X PUT $HEADERS \
-H 'X-OVH-MANAGER-NAVIGATION-ID: abc12def' \
-H 'X-OVH-MANAGER-REQUEST-ID: 1234567890123-01' \
-H 'Cookie: $COOKIE' \
--data-raw '$DATA_RAW'"
echo $COMMAND >> $TARGET

# refresh IP
COMMAND="curl 'https://www.ovh.com/engine/apiv6/domain/zone/domain.com/refresh' --compressed \
-X POST $HEADERS \
-H 'X-OVH-MANAGER-NAVIGATION-ID: abc12def' \
-H 'X-OVH-MANAGER-REQUEST-ID: 1234567890123-02' \
-H 'Cookie: $COOKIE' \
-H 'TE: trailers' --data-raw '{}'"
echo $COMMAND >> $TARGET

# edit IP (www.domain.com)
COMMAND="curl 'https://www.ovh.com/engine/apiv6/domain/zone/domain.com/record/0987654321' \
--compressed -X PUT $HEADERS \
-H 'X-OVH-MANAGER-NAVIGATION-ID: cba1def1' \
-H 'X-OVH-MANAGER-REQUEST-ID: 2234567890123-01' \
-H 'Cookie: $COOKIE' \
--data-raw '$DATA_RAW'"
echo $COMMAND >> $TARGET

# refresh IP
COMMAND="curl 'https://www.ovh.com/engine/apiv6/domain/zone/domain.com/refresh' --compressed \
-X POST $HEADERS \
-H 'X-OVH-MANAGER-NAVIGATION-ID: cba1def1' \
-H 'X-OVH-MANAGER-REQUEST-ID: 2234567890123-02' \
-H 'Cookie: $COOKIE' \
-H 'TE: trailers' --data-raw '{}'"
echo $COMMAND >> $TARGET

/bin/bash $TARGET
rm -rf $TARGET