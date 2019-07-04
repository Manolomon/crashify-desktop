![Server Status](https://img.shields.io/badge/The%20server%20is-DOWN-red.svg?style=for-the-badge&logo=microsoft-azure&logoColor=white) ![Database Status](https://img.shields.io/badge/The%20database%20is-DOWN-red.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

# Crashify Desktop

![GitHub last commit](https://img.shields.io/github/last-commit/Manolomon/crashify-desktop.svg?style=for-the-badge) [![Docker-Badge](https://img.shields.io/docker/cloud/build/manolomon/crashify-proxy.svg?logo=docker&logoColor=white&style=for-the-badge)](https://hub.docker.com/r/manolomon/crashify-proxy) ![GitHub repo size](https://img.shields.io/github/repo-size/Manolomon/crashify-desktop.svg?logo=github&style=for-the-badge) ![GitHub](https://img.shields.io/github/license/Manolomon/crashify-desktop.svg?color=red&style=for-the-badge) ![GitHub release](https://img.shields.io/github/release/Manolomon/crashify-desktop.svg?color=yellow&style=for-the-badge)

Aplicación de escritorio para la recepción de reportes de accidentes de tránsito para la experiencia educativa Desarrollo de Sistemas en Red


## Ejecución de gRPC por proxy

Uso de imagen para la generación del proxy de envoy, que es requisito para la ejecución de gRPC en tecnología web.

Más información:
- [gRPC for Web Clients Repository](https://github.com/grpc/grpc-web#2-run-the-server-and-proxy),
- [How to use gRPC-web with React](https://medium.com/free-code-camp/how-to-use-grpc-web-with-react-1c93feb691b5)
- [A TODO app using grpc-web and Vue.js](https://medium.com/@aravindhanjay/a-todo-app-using-grpc-web-and-vue-js-4e0c18461a3e)

![Proxy envoy](https://cdn-images-1.medium.com/max/800/1*PJce89y7GZdBYsiHzmmUow.jpeg)

**Primera ejecución**

```bash
sh setup.sh
```

## Generación de gRPC Stubs

Ejecutar script `proto_gen.sh` que automáticamente actualiza el submódulo del servidor, donde se encuentra la definición del API. Se generan stubs para `grpc-web` en `javascript` y `typescript` que se econtrarán en la carpeta `src/app/lib`

```bash
sh update.sh
```

## Ejecutar Cliente en Angular

**Instalar Dependencias**

```bash
npm install
```

**Ejecutar**

```bash
ng serve

# Automáticamente abrir navegador

ng serve --open
```

## Ejecutar Cliente de Escritorio con electron

**Instalar Dependencias**

```bash
npm install
```

**Ejecutar [electron](https://electronjs.org/)**

```bash
npm run electron
```
