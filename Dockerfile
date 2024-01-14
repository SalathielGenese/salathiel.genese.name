FROM node:alpine AS build
ENV NODE_ENV=development
WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm install
COPY . ./

RUN npm run build:ssr



FROM node:alpine AS production
CMD ["node", "dist/salathiel.genese.name/server/main.js"]
ENV NODE_ENV=production
WORKDIR /opt/app
ENV PORT=8080
USER node

COPY package.json package-lock.json ./
COPY --from=build /opt/app/dist ./dist
