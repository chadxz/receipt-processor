FROM node:22.13.1-alpine as build

ENV HUSKY 0

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22.13.1-alpine

ENV NODE_ENV production

WORKDIR /app

COPY --from=build /app/dist/ .

EXPOSE 3000
CMD ["node", "--enable-source-maps", "index.js"]
