FROM node:14.16.0-alpine3.13


WORKDIR /api
COPY  package*.json ./
RUN npm install
COPY . .

EXPOSE 8080 

ENV sql_username=sa
ENV sql_password=postbank123?
ENV sql_host=192.168.101.117
ENV pbi_jwtPrivateKey=PBI123?

CMD ["node", "index.js"]