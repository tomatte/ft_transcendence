# ft_transcendence

Pong

## Generating Certificates:

### Production:

sudo apt-get install -y certbot

sudo certbot certonly --standalone -d tomatte.dev

### Local:

sudo apt install mkcert

mkcert -install

mkcert localhost
