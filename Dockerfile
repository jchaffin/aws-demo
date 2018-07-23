FROM node:alpine


WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && \
    npm link

ENV SHELL /bin/sh
CMD ["s3-demo", "--setup"]
ENTRYPOINT ["s3-demo"]






