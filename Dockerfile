FROM node:current-alpine


RUN mkdir /opt/flower /data


VOLUME /data

COPY . /opt/flower

WORKDIR /opt/flower

CMD node gather.js 