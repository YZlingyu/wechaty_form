/**
 * Wechaty
 *
 * https://github.com/wechaty/wechaty
 *
 * Ssl Key & Cert files.
 *
 * Hardcoded here, NO need to re-config.
 * because there will only be visit from 127.0.0.1
 * so it will not be a security issue.
 *
 * http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
 * openssl req -x509 -days 3650 -nodes -newkey rsa:2048 -keyout key.pem -out cert.pem
 * openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
 *
 * Reference:
 * What is a Pem file - http://serverfault.com/a/9717
 */
declare const key: string;
declare const cert: string;
export { cert, key };
