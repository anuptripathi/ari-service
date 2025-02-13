<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

CUSTOM NOTE:

--in pjsip.conf, the aor and extension name/context should be same.
--enable in ari.conf to true, and also enable in http.conf to allow ari to work.
--modules show like ari. use this command to check if ari module is loaded or not. else load them by module load module name.
--if you are using in docker like below, make sure to map required ports like 5060,8088 etc (see the docker compose file)
asterisk: image: andrius/asterisk:latest

volumes:

- ./asterisk_config:/etc/asterisk # Persistent configuration files
- ./asterisk_data:/var/lib/asterisk

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
 -p 5060:5060/udp \
 -p 5060:5060/tcp \
 --network host \
 custom-opensips

docker stop opensips
docker rm opensips
