FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

COPY . .

RUN yarn build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app  .

#ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 3000

CMD yarn migrate:run; yarn start
