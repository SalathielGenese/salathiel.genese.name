#
# {{ development }}
#
FROM node:latest AS development
CMD [ "yarn", "serve" ]
WORKDIR /opt/app

COPY package.json yarn[.]lock ./
RUN yarn install
COPY . ./

#
# {{ build }}
#
FROM node:latest AS build
WORKDIR /opt/app

COPY --from=development /opt/app ./
RUN yarn build

#
# {{ production }}
#
FROM nginx AS production
WORKDIR /opt/app
EXPOSE 8080

COPY --from=build /opt/app/dist ./
COPY nginx.conf /etc/nginx/nginx.conf
