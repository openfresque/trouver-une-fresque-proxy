# trouver-une-fresque-proxy

A proxy is needed to hide secrets from the frontend.

## node

Use [nvm](https://github.com/nvm-sh/nvm) to install the last LTS node version.

```console
nvm install --lts
```

## trouver-une-fresque-proxy

```console
git clone https://github.com/trouver-une-fresque/trouver-une-fresque-proxy ~/trouverunefresque
cp .env.dist .env
vim .env
npm i
```

## PM2

Run the backend script using PM2.

```console
npm i -g pm2
pm2 startup
pm2 start backend.js
pm2 save

curl localhost:8000/events
```

## nginx

```console
cd /etc/nginx/conf.d
nano trouverunefresque.conf
sudo nginx -t
sudo nginx -s reload
```

## certbot

```console
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
sudo nginx -t
```