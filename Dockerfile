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

COPY --from=development /opt/app .

RUN SSR=1 yarn build --mode production --dest dist-ssr
RUN yarn build --mode production
RUN cp dist-ssr/js/ssr* dist


#
# {{ production }}
#
FROM node:alpine AS production
CMD node --enable-source-maps --trace-warnings \
    "$(find . -type f -name 'ssr*.js')"
ENV NODE_ENV production
EXPOSE ${PORT:-8080}
WORKDIR /opt/app

COPY package.json yarn[.]lock ./
RUN yarn install

COPY --from=build /opt/app/dist ./
