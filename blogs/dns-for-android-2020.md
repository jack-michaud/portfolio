---
title: "DNS Doesn't Work on Android"
description: "PKI on Raspberry Pi and DNS over TLS"
date: 2020-05-18
tags: RaspberryPi Infrastructure stunnel openssl
draft: true
---

# Background 
I run a Nextcloud server in my apartment to help myself break out of the "Goolag" 
> I heard "Goolag" on Reddit and I love it. Soon I'll break out of Google's iron grip on my online life. Nextcloud is a good alternative to the Gsuite.

Setting up Nextcloud was a breeze. I had a a docker-compose file to run the thing, moved the docker data root onto an external hard drive (by symlinking `/mnt/external/docker/` to `/var/lib/docker/`), set up an `nginx` reverse proxy to push all requests for `nextcloud.lomz.me` to the docker container, I added a zone file to my `bind9` config to point all internal requests for `nextcloud.lomz.me` to my pi, set up our router to tell all clients that my pi was the DNS server, and I had persistent, self-hosted cloud storage. 

That's great, except my Android phone won't resolve `nextcloud.lomz.me`. All other devices on my network could, but my phone could not. I could connect to the IP directly, but then I wouldn't be able to access the site through TLS. 

After some research, I found that some other folks were having the same issue. A user from [this thread](https://notifications.spiceworks.com/topic/2218883-android-devices-wont-resolve-local-server-names), "BrianBurbank", said that the issue was with Android wanting to use DNS over TLS opportunistically.

The [DNS over TLS RFC](https://tools.ietf.org/html/rfc7858#section-4.1) describes the "Oppertunistic Privacy Profile" as a profile that prefers DoT where it can. I think either my router is offering Cloudflare's `1.1.1.1` nameserver as a backup resolver which causes my phone to prefer that or my phone just goes directly to Google's DNS server (`8.8.8.8`) when it fails to resolve. 

The user BrianBurbank said that one solution is to...block all requests to external DNS servers...

No thanks, I think I'll try to solve this without a bulldozer! I'm going to set up DNS over TLS.

# The Plan

I have a `bind9` DNS server running on port 53, so I'm going to create a secure tunnel with `stunnel` on port 853 to forward requests to port 53. 
> I was thinking about using `nginx` for this, but I wanted to learn a new tool and `stunnel` seemed like a pretty apt tool for the job.

I also need to set up a certificate authority on my pi so I can issue certs to my network freely.

I should also serve my CA certificate up on an HTTP server so I can download it and install it on my phone easily.

## OpenSSL PKI

I found [this tutorial](https://pki-tutorial.readthedocs.io/en/latest/) on setting up a PKI with openssl. Understanding and remembering all of the openssl commands has been something I've always wanted to do, so this guide is indespensible.

The first thing I did was create a root CA config file, the signing CA config file, and a CSR config file. For the full annotated files, check out the [guide's examples](https://pki-tutorial.readthedocs.io/en/latest/simple/index.html). The only things I changed where the distinguished name (DN) fields, the default message digest from `sha1` to `sha256`, and the `match_pol` no longer needs to match the domain component exactly (so I can sign for any domain name, not just lomz.me).

### Config Files

Here's the root CA configuration file:

```
# root-ca.conf

# Root CA
[ default ]
ca                      = root-ca               # CA name
dir                     = .                     # Top dir

[ req ]
default_bits            = 2048
encrypt_key             = yes
default_md              = sha256 # For some reason the default message digest was sha1 in the given config
utf8                    = yes
string_mask             = utf8only
prompt                  = no
distinguished_name      = ca_dn
req_extensions          = ca_reqext

[ ca_dn ]
0.domainComponent       = "me"
1.domainComponent       = "lomz"
organizationName        = "Lomz.me"
organizationalUnitName  = "Jack Michaud"
commonName              = "Jack Michaud"

[ ca_reqext ]
keyUsage                = critical,keyCertSign,cRLSign
basicConstraints        = critical,CA:true
subjectKeyIdentifier    = hash

[ ca ]
default_ca              = root_ca               # The default CA section

[ root_ca ]
certificate             = $dir/ca/$ca.crt       # The CA cert
private_key             = $dir/ca/$ca/private/$ca.key # CA private key
new_certs_dir           = $dir/ca/$ca           # Certificate archive
serial                  = $dir/ca/$ca/db/$ca.crt.srl # Serial number file
crlnumber               = $dir/ca/$ca/db/$ca.crl.srl # CRL number file
database                = $dir/ca/$ca/db/$ca.db # Index file
unique_subject          = no                    # Require unique subject
default_days            = 3652                  # How long to certify for
default_md              = sha256                  # MD to use
policy                  = match_pol             # Default naming policy
email_in_dn             = no                    # Add email to cert DN
preserve                = no                    # Keep passed DN ordering
name_opt                = ca_default            # Subject DN display options
cert_opt                = ca_default            # Certificate display options
copy_extensions         = none                  # Copy extensions from CSR
x509_extensions         = signing_ca_ext        # Default cert extensions
default_crl_days        = 365                   # How long before next CRL
crl_extensions          = crl_ext               # CRL extensions

[ match_pol ]
domainComponent         = supplied              # Must be present
organizationName        = match                 # Must match 'Lomz.me'
organizationalUnitName  = optional              # Included if present
commonName              = supplied              # Must be present

# Certificate extensions define what types of certificates the CA is able to
# create.

[ root_ca_ext ]
keyUsage                = critical,keyCertSign,cRLSign
basicConstraints        = critical,CA:true
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always

[ signing_ca_ext ]
keyUsage                = critical,keyCertSign,cRLSign
basicConstraints        = critical,CA:true,pathlen:0
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always

[ crl_ext ]
authorityKeyIdentifier  = keyid:always

```

Here's the signing CA configuration file:


Here's the CSR configuration file (important because this is the configuration file that generates the signing request for my nameserver):


### Setting up PKI files

Again, following [this tutorial](https://pki-tutorial.readthedocs.io/en/latest/simple/index.html#create-root-ca):

#### Root CA

These commands set up the root CA database: 
```
mkdir -p ca/root-ca/private ca/root-ca/db crl certs
chmod 700 ca/root-ca/private
cp /dev/null ca/root-ca/db/root-ca.db
cp /dev/null ca/root-ca/db/root-ca.db.attr
echo 01 > ca/root-ca/db/root-ca.crt.srl
echo 01 > ca/root-ca/db/root-ca.crl.srl
```

Create a csr and key for the root CA:
```
pi@familypi:~/dot $ openssl req -new -config root-ca.conf -out ca/root-ca.csr -keyout ca/root-ca/private/root-ca.key
Generating a RSA private key
..........................+++++
......+++++
writing new private key to 'ca/root-ca/private/root-ca.key'
Enter PEM pass phrase:
Verifying - Enter PEM pass phrase:
-----
```
Now that we have a private key in `ca/root-ca/private/root-ca.key`, we can self-sign it from the CSR in `ca/root-ca.csr`.

```
pi@familypi:~/dot $ openssl ca -selfsign -config root-ca.conf -in ca/root-ca.csr -out ca/root-ca.crt -extensions root_ca_ext
Using configuration from root-ca.conf
Enter pass phrase for ./ca/root-ca/private/root-ca.key:
Check that the request matches the signature
Signature ok
Certificate Details:
        Serial Number: 1 (0x1)
        Validity
            Not Before: May 18 18:32:56 2020 GMT
            Not After : May 18 18:32:56 2030 GMT
        Subject:
            domainComponent           = me
            domainComponent           = lomz
            organizationName          = Lomz.me
            organizationalUnitName    = Jack Michaud
            commonName                = Jack Michaud
        X509v3 extensions:
            X509v3 Key Usage: critical
                Certificate Sign, CRL Sign
            X509v3 Basic Constraints: critical
                CA:TRUE
            X509v3 Subject Key Identifier:
                8A:87:12:92:E8:D7:E1:2D:A3:BF:16:8D:0F:9F:97:B5:DA:F4:6D:D9
            X509v3 Authority Key Identifier:
                keyid:8A:87:12:92:E8:D7:E1:2D:A3:BF:16:8D:0F:9F:97:B5:DA:F4:6D:D9

Certificate is to be certified until May 18 18:32:56 2030 GMT (3652 days)
Sign the certificate? [y/n]:y


1 out of 1 certificate requests certified, commit? [y/n]y
Write out database with 1 new entries
Data Base Updated
```

Cool!


#### Signing CA

```
mkdir -p ca/signing-ca/private ca/signing-ca/db crl certs
chmod 700 ca/signing-ca/private
cp /dev/null ca/signing-ca/db/signing-ca.db
cp /dev/null ca/signing-ca/db/signing-ca.db.attr
echo 01 > ca/signing-ca/db/signing-ca.crt.srl
echo 01 > ca/signing-ca/db/signing-ca.crl.srl
```

```
pi@familypi:~/dot $ openssl req -new -config signing-ca.conf -out ca/signing-ca.csr -keyout ca/signing-ca/private/signing-ca.key
Generating a RSA private key
................................................................................................................................................................................................+++++
...................+++++
writing new private key to 'ca/signing-ca/private/signing-ca.key'
Enter PEM pass phrase:
Verifying - Enter PEM pass phrase:
-----
```

```
pi@familypi:~/dot $ openssl ca -config root-ca.conf -in ca/signing-ca.csr -out ca/signing-ca.crt -extensions signing_ca_ext
Using configuration from root-ca.conf
Enter pass phrase for ./ca/root-ca/private/root-ca.key:
Check that the request matches the signature
Signature ok
Certificate Details:
        Serial Number: 2 (0x2)
        Validity
            Not Before: May 18 18:40:33 2020 GMT
            Not After : May 18 18:40:33 2030 GMT
        Subject:
            domainComponent           = me
            domainComponent           = lomz
            organizationName          = Lomz.me
            organizationalUnitName    = Jack Michaud
            commonName                = Jack Michaud
        X509v3 extensions:
            X509v3 Key Usage: critical
                Certificate Sign, CRL Sign
            X509v3 Basic Constraints: critical
                CA:TRUE, pathlen:0
            X509v3 Subject Key Identifier:
                49:B8:39:7A:D0:C1:D7:9A:2B:03:23:53:0E:C9:29:B4:B3:E9:ED:ED
            X509v3 Authority Key Identifier:
                keyid:8A:87:12:92:E8:D7:E1:2D:A3:BF:16:8D:0F:9F:97:B5:DA:F4:6D:D9

Certificate is to be certified until May 18 18:40:33 2030 GMT (3652 days)
Sign the certificate? [y/n]:y


1 out of 1 certificate requests certified, commit? [y/n]y
Write out database with 1 new entries
Data Base Updated
```

#### Creating CSR for the nameserver

```
pi@familypi:~/dot $ SAN=DNS:lomz.me openssl req -new -config tls-csr.conf -out certs/ns.lomz.me.csr -keyout certs/ns.lomz.me.key
Generating a RSA private key
...........+++++
.....................+++++
writing new private key to 'certs/ns.lomz.me.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
1. Domain Component         (eg, com)       []:me
2. Domain Component         (eg, company)   []:lomz
3. Domain Component         (eg, pki)       []:ns
4. Organization Name        (eg, company)   []:Lomz.me
5. Organizational Unit Name (eg, section)   []:
6. Common Name              (eg, FQDN)      []:ns.lomz.me
```

```
pi@familypi:~/dot $ openssl ca -config signing-ca.conf -in certs/ns.lomz.me.csr -out certs/ns.lomz.me.crt -extensions server_ext
Using configuration from signing-ca.conf
Enter pass phrase for ./ca/signing-ca/private/signing-ca.key:
Check that the request matches the signature
Signature ok
Certificate Details:
        Serial Number: 1 (0x1)
        Validity
            Not Before: May 18 19:00:25 2020 GMT
            Not After : May 18 19:00:25 2022 GMT
        Subject:
            domainComponent           = me
            domainComponent           = lomz
            domainComponent           = ns
            organizationName          = Lomz.me
            commonName                = ns.lomz.me
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Basic Constraints:
                CA:FALSE
            X509v3 Extended Key Usage:
                TLS Web Server Authentication, TLS Web Client Authentication
            X509v3 Subject Key Identifier:
                82:51:A6:1D:26:A3:FA:C0:90:5B:74:17:3B:81:F8:EB:86:70:8C:9C
            X509v3 Authority Key Identifier:
                keyid:49:B8:39:7A:D0:C1:D7:9A:2B:03:23:53:0E:C9:29:B4:B3:E9:ED:ED

            X509v3 Subject Alternative Name:
                DNS:lomz.me
Certificate is to be certified until May 18 19:00:25 2022 GMT (730 days)
Sign the certificate? [y/n]:y


1 out of 1 certificate requests certified, commit? [y/n]y
Write out database with 1 new entries
Data Base Updated
```

COOL!

The last thing that needs to be done is create a CRL to show all the issued certs.

```
pi@familypi:~/dot $ openssl ca -gencrl -config signing-ca.conf -out crl/signing-ca.crl
Using configuration from signing-ca.conf
Enter pass phrase for ./ca/signing-ca/private/signing-ca.key:
```

Done. We have the final certs in the `certs` directory!

```
pi@familypi:~/dot $ ls certs/ | grep -v csr
ns.lomz.me.crt  ns.lomz.me.key
```

I just need to concantenate all of the certs in the certificate chain together so the whole chain can be validated by devices in my network that have my CA as a trusted authority.

```
pi@familypi:~/dot $ cat ca/signing-ca.crt ca/root-ca.crt > ca/signing-ca-chain.crt
pi@familypi:~/dot $ cat certs/ns.lomz.me.crt ca/signing-ca-chain.crt > certs/ns.lomz.me.chain.crt
```

##  DNS over TLS tunnel

This shouldn't be too bad. `stunnel` seems really easy to configure.

```
# dnstun.conf
[dns]
accept = 853
connect = 127.0.0.1:53
cert = certs/ns.lomz.me.chain.crt
key = certs/ns.lomz.me.key
```

```
pi@familypi:~/dot $ sudo stunnel dnstls.conf
```

No output...but testing the port from a different machine:

```bash
[~]$ nc -zv ns.lomz.me 853
found 0 associations
found 1 connections:
     1:	flags=82<CONNECTED,PREFERRED>
	outif en0
	src 192.168.0.16 port 63451
	dst 192.168.0.250 port 853
	rank info not available
	TCP aux info available

Connection to ns.lomz.me port 853 [tcp/*] succeeded!
```
...shows that the port open and working. But at this point I know that we don't have the root CA installed. 
I tried to establish a TLS connection with `openssl`:

```
[~]$ openssl s_client -showcerts -connect ns.lomz.me:853
```

It returned the cert chain properly, but had this return code:

```
# ...
Verify return code: 19 (self signed certificate in certificate chain)
# ...
```

Yes, we have a self signed cert. What if I specify the root CA file in the openssl command...?

```
pi@familypi:~/dot $ openssl s_client -showcerts -connect ns.lomz.me:853 -CAfile ca/root-ca.crt
```
```
# ...
Verify return code: 0 (ok)
# ...
```
Nice. So all we need to do now is serve the root CA cert for people to add into their trusted stores.

### Serve Root CA cert

Okay, time to set up another site in `nginx`. 
```
# /etc/nginx/sites-available/ns
server {
    listen 80;
    server_name 192.168.0.250 ns.lomz.me;
    location / {
      root /var/www/ns/;
      index index.html;
    }
}
```

```
pi@familypi:~/dot $ sudo ln -s /etc/nginx/sites-available/ns /etc/nginx/sites-enabled/ns
pi@familypi:~/dot $ sudo mkdir -p /var/www/ns
pi@familypi:~/dot $ sudo cp ca/root-ca.crt /var/www/ns/
pi@familypi:~/dot $ sudo touch /var/www/ns/index.html
```

```
# /var/www/ns/index.html
<html>
  <head>
    <title>
      CA
    </title>
  </head>
  <body>
    <a href="/root-ca.crt">
      Download CA cert
    </a>
  </body>
</html>
```

So now whenever I go to the server's IP address or to ns.lomz.me, I'll get a page that prompts me to download the root CA.

Now, when I get the root CA onto my phone...
Uh...


Looks like I can't open the `.crt` for some reason. What _should_ be happening is a dialog asking you to name the certificate opens up.
Just to make sure this wasn't an issue with my certificate, I downloaded another certificate and tried to import it to no avail.

I saw a [stack overflow post](https://stackoverflow.com/a/61826920) that said a `pkcs12` certificate worked for him...but that literally would bundle my root CA's private key into the cert. No thanks.

I tried to export it in `der` format:

```
pi@familypi:~/dot $ openssl x509 -in ca/root-ca.crt -out ca/root-ca.cer -outform der
pi@familypi:~/dot $ sudo cp ca/root-ca.cer /var/www/ns/root-ca.cer
```

and redownloaded...
Oh yeah. Looks like it worked.

Thanks, but that's my cert!

It looks like it still doesn't work. I'm going to take a break from figuring this out for now D:


