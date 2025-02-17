## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
# run the voice app (microservice) in watch mode
$ npm run start:dev voiceapp

# production mode
$ npm run start:prod
# run the voice app (microservice)
$ npm run start:prod voiceapp
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

#ARI releated and asteris related settings
ARI releated and asteris related settings

--in pjsip.conf, the aor and extension name/context should be same.
--enable in ari.conf to true, and also enable in http.conf to allow ari to work.
--modules show like ari. use this command to check if ari module is loaded or not. else load them by module load module name.
--if you are using in docker like below, make sure to map required ports like 5060,8088 etc (see the docker compose file)
asterisk: image: andrius/asterisk:latest

volumes:

- ./asterisk_config:/etc/asterisk # Persistent configuration files
- ./asterisk_data:/var/lib/asterisk
- ./asterisk_data/sounds:/var/lib/asterisk/sounds # mount is separately

docker cp asterisk:/etc/asterisk ./asterisk_config
docker cp asterisk:/var/lib/asterisk ./asterisk_data

docker cp /sounds/ asterisk:/var/lib/asterisk/

Hostname EWS2K19-JMP
IP 122.186.47.3
User ID gulfam
Password Ex@t0@123

[gulfam@ewscentosR9 ~]$ sudo iptables -A INPUT -p udp --dport 5060 -s 223.190.81.19 -j ACCEPT
[gulfam@ewscentosR9 ~]$ sudo iptables -A INPUT -p udp --dport 5060 -j DROP
[gulfam@ewscentosR9 ~]$ sudo ip6tables -A INPUT -p udp --dport 5060 -s 2401:4900:1c66:2a0:3525:d8f4:69f2:a0ea -j ACCEPT
[gulfam@ewscentosR9 ~]$ sudo ip6tables -A INPUT -p udp --dport 5060 -j DROP

module show like ari
module load res_ari.so

module load res_ari_applications.so
module load res_ari_asterisk.so
module load res_ari_bridges.so
module load res_ari_channels.so
module load res_ari_device_states.so
module load res_ari_endpoints.so
module load res_ari_events.so
module load res_ari_playbacks.so
module load res_ari_recordings.so
module load res_ari_sounds.so

/var/lib/asterisk/sounds # chmod 755 thanks-call-later.wav

#install sipp tester on Ubuntu:
sudo apt update
sudo apt install -y gcc g++ make autoconf automake libtool libncurses5-dev libpcap-dev libssl-dev libpcre3-dev libnet1-dev
sudo apt install sip-tester
sipp -v

docker pull opensips/opensips
docker run -d --name opensips \
 --network host \
 -e DBENGINE=MYSQL \
 -e DBURL="mysql://opensips:opensips@localhost/opensips" \
 -e LOG_LEVEL=3 \
 -v $(pwd)/opensips.cfg:/etc/opensips/opensips.cfg \
 opensips/opensips

docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=opensips -e MYSQL_USER=opensips -e MYSQL_PASSWORD=opensips mysql:5.7

docker run -d --name opensips \
 --network host \
 -e DBENGINE=MYSQL \
 -e DBURL="mysql://opensips:opensips@localhost/opensips" \
 -e LOG_LEVEL=3 \
 -v $(pwd)/opensips.cfg:/etc/opensips/opensips.cfg \
 opensips/opensips

docker exec -it opensips sh
ls /usr/lib/x86_64-linux-gnu/opensips/modules/

apt update
apt install -y software-properties-common
apt-get install -y procps
apt install -y nano
apt install -y bash
apt install -y lsof
apt install -y opensips-mysql-module
apt install -y opensips-mi_json-module

opensips-cli -h

cp /etc/opensips/opensips.cfg /etc/opensips/opensips.cfg.original

cp /etc/opensips/opensips.cfg.original /etc/opensips/opensips.cfg

nano /etc/opensips/opensips.cfg

docker build -t custom-opensips .

docker run -d --name opensips \
 --network host \
 custom-opensips

or

docker run -d --name opensips \
 -p 5060:5060/udp \
 -p 5060:5060/tcp \
 --network asterisk_default \
custom-opensips

docker build -t custom-mysql .
docker run -d --name mysql -p 3306:3306 custom-mysql

docker stop opensips
docker rm opensips
```
