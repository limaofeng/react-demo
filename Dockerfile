FROM limaofeng/node-alpine

COPY . /app

WORKDIR /app

RUN cnpm install -g yarn serve && yarn && yarn build

EXPOSE 3000

CMD serve -p 3000 -s build