#!/bin/bash
# https://git.andoniserra.me/dyndns-updater/
#
# OVH DYNHOST UPDATER
#
# This script updates your dynamic hosts on OVH
# you can get more information about creating dynhosts on
# https://docs.ovh.com/gb/en/domains/hosting_dynhost/
#
# This script is valid only for one dyndns user and domain,
# but you can add all the dynamic hosts you want to $DYNHOSTS
#

DYNHOSTS=( subdomain01.domain.com subdomain02.domain.com )
IP=`/usr/bin/curl -s ifconfig.me`

USER='USER'
PASSWORD='PASSWD'

for HOST in ${DYNHOSTS[*]}
do
        LAST_IP=`dig +short $HOST`
        echo "- Checking: " $HOST:
        echo "  - Registered IP: " $LAST_IP
        if [ $IP != $LAST_IP ];
        then
                curl -su $USER:$PASSWORD "http://www.ovh.com/nic/update?system=dyndns&hostname=$HOST&myip=$IP"
                echo "  - IP updated from $LAST_IP to $IP."
        else
                echo "  - IP unchanged for $HOST."
        fi
done
