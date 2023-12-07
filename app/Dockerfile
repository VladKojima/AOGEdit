FROM alpine:latest
RUN apk update && apk upgrade && apk add nodejs
COPY . ./app
EXPOSE 3000
WORKDIR /app
CMD [ "node", "/app/server.js" ]
