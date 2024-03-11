#
# base
#
FROM node:alpine AS base
COPY package-lock.json /opt/app/
COPY package.json /opt/app/
WORKDIR /opt/app
#
# build
#
FROM base AS build
ENV NODE_ENV=development
RUN npm install

COPY . ./
RUN npm run build:ssr
RUN ln -s /opt/app/dist/salathiel.genese.name/browser/protos /opt/app/dist/salathiel.genese.name/protos
#
# production
#
FROM base AS production
CMD ["node", "dist/salathiel.genese.name/server/main.js"]
ENV NODE_ENV=production
ENV PORT=80
#USER node

COPY package.json package-lock.json ./
COPY --from=build /opt/app/dist ./dist
