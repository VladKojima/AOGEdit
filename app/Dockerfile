FROM alpine:latest
RUN apk update && apk upgrade && apk add nodejs npm
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "node", "/app/server.js" ]
