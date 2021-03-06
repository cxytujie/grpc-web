#!/bin/bash
# This is intended to be run by Travis CI

set -ex
wget https://github.com/google/protobuf/releases/download/v$PROTOBUF_VER/protoc-$PROTOBUF_VER-linux-x86_64.zip
unzip protoc-$PROTOBUF_VER-linux-x86_64.zip -d protobuf

export PATH=`pwd`/protobuf/bin:$PATH
