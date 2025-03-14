# proxy_adguarddns_homepage

### Configurations:

1. Clone the repository:

`git clone https://github.com/zlimteck/proxy_adguarddns_homepage`

2. Install the dependencies:

`npm install`

3. In the exemple.env file change the following:

`
ADGUARD_USERNAME=yourusernamehere
ADGUARD_PASSWORD=yourpasswordhere
`

ADGUARD_TOKEN It is optional, it will be generated automatically via the proxy with ADGUARD_USERNAME and ADGUARD_PASSWORD.

4. Rename the exemple.env file to .env

5. Run the proxy:

`node proxy_for_homepage.js`

In your browser, go to the url http://localhost:3786/adguard-dns
