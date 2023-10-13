#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
/bin/bash ovh-domain.sh
/bin/bash ovh-dyndns.sh
cd -