#
# {{ development }}
#
FROM node:alpine AS development
CMD [ "yarn", "serve" ]
WORKDIR /opt/app

COPY package.json yarn[.]lock ./
RUN yarn install
COPY . ./

#
# {{ build }}
#
FROM node:alpine AS build
WORKDIR /opt/app

ARG API_ENDPOINT=http://api:8080/

COPY nginx.conf .
RUN sed -i -e "s#proxy_pass http://api/;#proxy_pass $API_ENDPOINT/;#" nginx.conf

COPY --from=development /opt/app ./
RUN yarn build


#
# {{ production }}
#
FROM nginx:alpine AS production
WORKDIR /opt/app
EXPOSE 8080
USER nginx

COPY --from=build /opt/app/dist ./
COPY --from=build /opt/app/nginx.conf /etc/nginx/conf.d
