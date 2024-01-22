FROM harbor.jlgltech.com/qa/node:14.12.0
COPY ./ /app
WORKDIR /app
RUN yarn install && yarn run build

FROM harbor.jlgltech.com/qa/nginx:latest
RUN mkdir /app && mkdir -vp /data/jacoco/report
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
