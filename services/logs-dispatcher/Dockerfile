FROM fluent/fluentd:v1.10-1
LABEL maintainer="support@amazee.io"

USER root

RUN apk add --no-cache --update --virtual .build-deps \
      build-base ruby-dev \
      && gem install fluent-plugin-elasticsearch \
      && gem install fluent-plugin-kubernetes_metadata_filter \
      && gem install fluent-plugin-prometheus \
      && gem install fluent-plugin-record-modifier \
      && gem install fluent-plugin-rewrite-tag-filter \
      && gem install fluent-plugin-route \
      && gem sources --clear-all \
      && apk del .build-deps \
      && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem \
      && apk add --no-cache curl

COPY fluent.conf /fluentd/etc/
COPY entrypoint.sh /bin/

USER fluent

# environment variables that must be defined to point to the k8s api
# these are set by default when running in k8s
ENV KUBERNETES_SERVICE_HOST KUBERNETES_SERVICE_PORT
