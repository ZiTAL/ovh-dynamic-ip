#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
/bin/bash ${DIR}/dyndns.sh
/bin/bash ${DIR}/host.sh