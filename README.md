# trouver-une-fresque-proxy

A proxy is needed to hide secrets from the frontend.

## node

Use [nvm](https://github.com/nvm-sh/nvm) to install the last LTS node version.

```console
nvm install --lts
```

## trouver-une-fresque-proxy

```console
git clone https://github.com/openfresque/trouver-une-fresque-proxy ~/trouver-une-fresque-proxy
cd ~/trouver-une-fresque-proxy
cp .env.dist .env
vim .env
npm i
```

## PM2

Run the backend script using PM2.

```console
npm i -g pm2
pm2 startup

cd ~/trouver-une-fresque-proxy
pm2 start backend.js
pm2 save

curl localhost:8000/events
```

## nginx

```console
cp ~/trouver-une-fresque-proxy/trouverunefresque.conf /etc/nginx/conf.d
sudo nginx -t
sudo nginx -s reload
```

## certbot

Certbot will look at the nginx conf above to infer the DNS record you want to work with. Certbot will use port 80 to communicate, make sure this port is accessible via the DNS record.

```console
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
sudo nginx -t
```

If you want to modify ports, simply edit `/etc/nginx/conf.d/trouverunefresque.conf` (e.g., occurences of ports 80 and 443 can be changed to 8080 and 4443).
