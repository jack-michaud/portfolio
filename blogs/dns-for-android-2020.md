---
title: "DNS Doesn't Work on Android"
description: "PKI on Raspberry Pi and DNS over TLS"
date: 2020-05-18
tags: RaspberryPi Infrastructure stunnel openssl
draft: true
---

# Background 
I run a Nextcloud server in my apartment to help myself break out of the "Goolag" (I heard this term on Reddit and I love it. Soon I'll break out of Google's iron grip on my online life. Nextcloud is a good alternative to the Gsuite).

Setting up Nextcloud was a breeze. I had a a docker-compose file to run the thing, moved the docker data root onto an external hard drive (by symlinking `/mnt/external/docker/` to `/var/lib/docker/`), set up an `nginx` reverse proxy to push all requests for `nextcloud.lomz.me` to the docker container, I added a zone file to my `bind9` config to point all internal requests for `nextcloud.lomz.me` to my pi, set up our router to tell all clients that my pi was the DNS server, and I had persistent, self-hosted cloud storage. 

That's great, except my Android phone won't resolve `nextcloud.lomz.me`. All other devices on my network could, but my phone could not.

After some research, I found that some other folks were having the same issue. A user from [this thread](https://notifications.spiceworks.com/topic/2218883-android-devices-wont-resolve-local-server-names), "BrianBurbank", said that the issue was with Android wanting to use DNS over TLS opportunistically.

The [DNS over TLS RFC](https://tools.ietf.org/html/rfc7858#section-4.1) describes the "Oppertunistic Privacy Profile" as a profile that prefers DoT where it can. Because my internal nameserver `ns.lomz.me` is offering Cloudflare's `1.1.1.1` nameserver as a backup resolver, my phone is preferring Cloudflare's nameserver. 

The user BrianBurbank said that one solution is to...block all requests to external DNS servers...

No thanks, I think I'll try to solve this without a bulldozer! I'm going to set up DNS over TLS.






