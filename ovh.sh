#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
/usr/local/bin/npx testcafe firefox:headless ovh-domain.js
/usr/local/bin/node ovh-dyndns.js
cd -