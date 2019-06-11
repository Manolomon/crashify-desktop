#!/bin/bash

echo "\e[96mActualizando submodulos...\e[0m"

git submodule update --init --recursive

cd crashify-server

git pull origin master

cd ..

echo "\e[96mInstalando Dependencias...\e[0m"

npm install

echo "\e[96mGenerando Protos...\e[0m"

mkdir -p src/app/lib

export PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
export OUT_DIR="./src/app/lib"

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=true:${OUT_DIR}" \
    crashify.proto

echo "\e[96mIniciando Contenedor Docker del Proxy...\e[0m"

docker run -d --name crashify-proxy -p 8080:8080 --net=host manolomon/crashify-proxy

echo "\e[92mFinalizado\e[0m"

ng serve --open