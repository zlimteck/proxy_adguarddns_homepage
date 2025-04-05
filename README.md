# 🌐 proxy_adguarddns_homepage

## Description:

A small local proxy to expose AdGuard DNS data and display it in a Homepage interface.

### Configurations:

1. Clone the repository:

`git clone https://github.com/zlimteck/proxy_adguarddns_homepage`

2. Install the dependencies:

`npm install`

3. In the exemple.env file change the following:

`ADGUARD_TOKEN=yourtokenhere
ADGUARD_REFRESH_TOKEN=refreshtokenhere`

You can get the token and the refreshtoken via the following command: (more informations here: https://adguard-dns.io/kb/private-dns/api/overview/)

`$ curl 'https://api.adguard-dns.io/oapi/v1/oauth_token' -i -X POST \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'username=user%40adguard.com' \
    -d 'password=********' \
    -d 'mfa_token=727810'`

4. Rename the exemple.env file to .env

5. Run the proxy:

Node method:

`node proxy_for_adguarddns.js`

Docker method:

In the repository folder, use the following command to build the docker image:

`docker build -t proxy_for_adguarddns .`

Then run the docker image with the following command:

`docker run -d -p 3786:3786 --name proxy_for_adguarddns proxy_for_adguarddns`

In your browser, go to the url http://localhost:3786/adguard-dns
