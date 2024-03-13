#
# base
#
FROM node:alpine AS base
WORKDIR /opt/app
USER node:node

COPY package-lock.json package.json ./
#
# build
#
FROM base AS build
ENV NODE_ENV=development

USER root
RUN npm install
COPY . ./
RUN npm run build:ssr
RUN mv /opt/app/dist/salathiel.genese.name/browser/protos /opt/app/dist/salathiel.genese.name

USER node:node
#
# production
#
FROM base AS production
CMD ["node", "dist/salathiel.genese.name/server/main.js"]
ENV NODE_ENV=production
ENV PORT=80

COPY package.json package-lock.json ./
COPY --from=build /opt/app/dist ./dist
