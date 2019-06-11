#!/bin/bash

git submodule update --init --recursive

cd crashify-server

git pull origin master

cd ..

npm install

mkdir -p src/app/lib

export PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
export OUT_DIR="./src/app/lib"

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=true:${OUT_DIR}" \
    crashify.proto

docker run -d --name crashify-proxy -p 8080:8080 --net=host manolomon/crashify-proxy

ng serve --open