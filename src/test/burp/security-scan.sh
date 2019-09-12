#!/bin/bash

CURRENTDIR=$PWD
SCRIPTDIR=$(dirname $0)
echo $SCRIPTDIR

cd $SCRIPTDIR

echo $PWD

echo Running Scan

burpctl start

./crawl.js

HTTPS_PROXY=http://localhost:8080 newman run ../postman/accesscontrol-tests.json -k

burpctl crawl

burpctl scan

mkdir ../../../target/burp
burpctl report -f ../../../target/burp/security-scan-report.html

burpctl stop

cd "$CURRENTDIR"
