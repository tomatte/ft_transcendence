FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf.template /etc/nginx/conf.d/default.conf.template

RUN apt install nginx openssl -y

COPY ./start.sh /app/start.sh

RUN chmod +x /app/start.sh

WORKDIR /var/www

ENTRYPOINT [ "/app/start.sh" ]