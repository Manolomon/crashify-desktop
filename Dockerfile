FROM envoyproxy/envoy:latest
RUN apt-get update
COPY envoy.yaml /etc/envoy.yaml