---
title: "Ephemeral Server with Terraform and a Discord Bot (because why not)"
description: "Alt title: the hoops I jump through for cheap Minecraft hosting"
date: 2020-05-06
---

> Minecraft hosting on the cheap

![Bot](/blogs/images/bot-demo.png "Discord bot demo")

## Problem

My friends and I have been getting back into Minecraft. I've been hosting a server for the [Texkit modpack][https://www.technicpack.net/modpack/tekxit-3-official-1122.1253751].

The modpack has over 130 mods, so the server is a real resource hog -- I couldn't run it on my most powerful Raspberry Pi (RPi 4, 4 GB), so the next easiest solution was to run it on a Digital Ocean droplet.

Cloud hosting is a blessing but, man, it costs a lot. The `s-2vcpu-4gb` Droplet size
[costs about $20 a month][https://slugs.do-api.dev/] to run 24/7. I can't justify Minecraft 
as an essential cost, so I was looking for ways to minimize this cost. Just turning it on as needed was ideal.


At first, I was booting up a Droplet manually, `tar`ing and `scp`ing up the server
files, and running the `java` command every time we wanted to play (and `tar`ing and `scp`ing when we were done), but there where a few issues with this:

1. My friends needed me to start and stop the server every time we wanted to play
2. It's a pain for me to manually start the server from Digital Ocean
3. There is no way to automatically persist the data without manual backup
4. The server had a new IP address on every boot (which wipes all of our waypoints from a `minimap` mod)

## Outline

In this blog post, I'll outline how I addressed each of these issues.

1. **Discord bot** as an interface for my friends to launch and stop the server
2. **Terraform templates** for launching infrastructure and **cloudinit** files for configuring the server
3. Data persistence using **Digital Ocean volumes**
4. Dynamic DNS with **DuckDNS**

## Discord Bot for my friends
## Terraform and Cloudinit for provisioning
## Data Persistence
## Dynamic DNS with Duck DNS








