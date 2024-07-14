FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf.template /etc/nginx/conf.d/default.conf.template

RUN apt install nginx openssl -y

RUN openssl req -x509 -nodes -newkey rsa:2048 -keyout /etc/nginx/key.key -out /etc/nginx/crt.crt -subj "/CN=localhost"


COPY ./start.sh /app/start.sh

RUN chmod +x /app/start.sh

WORKDIR /var/www

ENTRYPOINT [ "/app/start.sh" ]