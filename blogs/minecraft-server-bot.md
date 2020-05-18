---
title: "Ephemeral Server with Terraform and a Discord Bot (because why not)"
description: "Alt title: the hoops I jump through for cheap Minecraft hosting"
date: 2020-05-06
tags: Terraform Python Minecraft
draft: true
---

> Minecraft hosting on the cheap

![Bot](/blogs/images/minecraft-server-bot/bot-demo.png "Discord bot demo")

## Problem

My friends and I have been getting back into Minecraft. I've been hosting a server for the [Tekxit modpack](https://www.technicpack.net/modpack/tekxit-3-official-1122.1253751).

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

In this blog post, I'll outline how I addressed each of these issues and show 
how I built this repo.

1. **Discord bot** as an interface for my friends to launch and stop the server
2. **Terraform templates** for launching infrastructure and **cloudinit** files for configuring the server
3. Data persistence using **Digital Ocean volumes**
4. Dynamic DNS with **DuckDNS**

## Discord Bot for my friends

### Setting up the bot

I used the amazing [Python Discord API wrapper](https://discordpy.readthedocs.io/en/latest/index.html) for all of my bot needs. The first thing I needed to do was create a bot account (which the [documentation](https://discordpy.readthedocs.io/en/latest/discord.html) details).

![Created the bot](/blogs/images/minecraft-server-bot/ephemeral-server-bot-create.png "")

Nice. I saved the `client secret` and the `client ID` into a `.env` file in my project.

```
# .env
DISCORD_CLIENT_ID=708003281070456935
DISCORD_CLIENT_SECRET=<not for your eyes>
```
I also went to the Bots tab and added a new bot. 

May as well create a new server to test this out in.

![Create Server](/blogs/images/minecraft-server-bot/create-server.png)

I want this setup to be easily reproducable, so I created a token retriever utility in the project...it's out of scope for this article, but the byproduct looks like this:

![Adding bot to server][/blogs/images/minecraft-server-bot/adding-to-server.png]

My bot will listen to a channel on a server and watch every message until the message is a command string. 

```python
def 

```


## Terraform and Cloudinit for provisioning
## Data Persistence
## Dynamic DNS with Duck DNS








