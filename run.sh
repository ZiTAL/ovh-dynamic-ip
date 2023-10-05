#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
npx nightwatch -e firefox
bash bash/ovh.sh
rm -rf bash/cookie.txt
cd -