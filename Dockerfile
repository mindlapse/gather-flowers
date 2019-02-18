FROM node:current-alpine


RUN mkdir /opt/flower /data


VOLUME /data

COPY . /opt/flower

WORKDIR /opt/flower

ENV API_KEY=unk

CMD node gather.js