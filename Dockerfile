FROM node

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json $HOME/warn/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/warn
RUN npm install --python=/usr/bin/python3

USER root
COPY . $HOME/warn
RUN mkdir -p database
RUN chown -R app:app $HOME/*
USER app
