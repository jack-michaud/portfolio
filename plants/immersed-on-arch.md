---
title: "Immersed VR Desktop on Arch"
description: "Immersed only came with a .deb so I made a PKGBUILD"
date: 2020-07-25
tags: arch
stage: sapling
---

Got pairing code , gave me a .deb
Oh, do these work on arch?

```
jack@CASTOR ~> cd Downloads/
jack@CASTOR ~/Downloads> makepkg Immersed_amd64.deb
==> ERROR: PKGBUILD does not exist.
```
oh, okay.

Luckily there's this deb to pacman converter script on the AUR...

https://github.com/helixarch/debtap

```
jack@CASTOR ~/Downloads [1]> yay -Ss debtap
aur/debtap 3.3.1-1 (+222 5.45%)
    A script to convert .deb packages to Arch Linux packages, focused on accuracy. Do not use it to convert packages that already exist on official repositories or can be built from AUR!
jack@CASTOR ~/Downloads> yay -S debtap
```

now that that's installed, it's time to convert the package!

```
jack@CASTOR ~/Downloads> debtap Immersed_amd64.deb
Error: You must run at least once "debtap -u" with root privileges (preferably recently), before running this script
```
FINE!

```
jack@CASTOR ~/Downloads [1]> sudo debtap -u
```
After downloading the apt repositories, I ran the command again and went on with generating a pkgbuild.
`-p` generate a pkgbuild
```
jack@CASTOR /t/immersed> mv ~/Downloads/Immersed_amd64.deb .
jack@CASTOR /t/immersed> debtap -p Immersed_amd64.deb
==> Extracting package data...
==> Fixing possible directories structure differencies...
==> Generating .PKGINFO file...

:: Enter Packager name:
Jack Michaud

:: Enter package license (you can enter multiple licenses comma separated):
MIT

*** Creation of .PKGINFO file in progress. It may take a few minutes, please wait...

==> Checking and generating .INSTALL file (if necessary)...

:: If you want to edit .PKGINFO and .INSTALL files (in this order), press (1) For vi (2) For nano (3) For default editor (4) For a custom editor or any other key to continue: 3

==> Generating .MTREE file...

==> Creating final package...
==> Package successfully created!

==> Generating PKGBUILD file...
==> PKGBUILD and immersed-bin immersed.install are now located in "/tmp/immersed/immersed-bin
immersed" and ready to be edited
==> Removing leftover files...
jack@CASTOR /t/immersed> ls
 immersed-2.1-1-x86_64.pkg.tar.zst  'immersed-bin'$'\n''immersed'/
```

I inspected the `.INSTALL` script, and I saw some apt specific stuff that I swapped out.

```
post_install() {
	gtk-update-icon-cache -q -t -f usr/share/icons/hicolor
	update-desktop-database
	chmod +x /usr/share/handlers/immersed-handler
	xdg-mime default /usr/share/applications/immersed-handler.desktop x-scheme-handler/immersed
	#apt-key add /usr/bin/immersed-res/immersed.pub
  # We're on arch!
  pacman-key --add /usr/bin/immersed-res/immersed.pub
	update-desktop-database -q
}

post_upgrade() {
	post_install
}

post_remove() {
	gtk-update-icon-cache -q -t -f usr/share/icons/hicolor
	update-desktop-database -q
}
```



At first, I tried to click the magic link to open the agent, and it didnt work. Just opened a brave window.

The `immersed://` URL schema should be handled by the `immersed-handler` script that's installed in `/usr/share/handlers/immersed-handler`...

I forgot to install the package!

```
jack@CASTOR /t/immersed> cd immersed-bin\nimmersed/
jack@CASTOR /t/i/immersed-binimmersed> ls
'immersed-bin'$'\n''immersed.install'   PKGBUILD
```
Weird filenames, I think it's just a bug in debtap.

```
jack@CASTOR /t/i/immersed-binimmersed> makepkg -i PKGBUILD
==> ERROR: BUILDDIR contains invalid characters: '
'
==> ERROR: PKGDEST contains invalid characters: '
'
==> ERROR: SRCDEST contains invalid characters: '
'
==> ERROR: SRCPKGDEST contains invalid characters: '
'
==> ERROR: LOGDEST contains invalid characters: '
'
```

Maybe I should check this out.
Looks like the install like in the pkgbuild points to a
specific script location that definitely isnt the right name. 

```
mv immersed-bin\nimmersed.install immersed.install
```

```
jack@CASTOR /t/i/test [2]> ls -a
./  ../  etc/  immersed-2.1-1-x86_64.pkg.tar.zst  .INSTALL  .MTREE  .PKGINFO  usr/
jack@CASTOR /t/i/test> rm immersed-2.1-1-x86_64.pkg.tar.zst
jack@CASTOR /t/i/test> tar czf data.tar.gz *
```

```
jack@CASTOR /t/i/immersed> ls
data.tar.gz  immersed.install  PKGBUILD
jack@CASTOR /t/i/immersed> makepkg -i PKGBUILD
==> Making package: immersed 2.1-1 (Sun 26 Jul 2020 04:30:41 PM PDT)
==> Checking runtime dependencies...
==> Missing dependencies:
  -> libva1
==> Checking buildtime dependencies...
==> ERROR: Could not resolve all dependencies.
```

Now I can install the missing dependencies!
Done...Trying again

```
jack@CASTOR /t/i/immersed> makepkg -i PKGBUILD
==> Making package: immersed 2.1-1 (Sun 26 Jul 2020 04:31:30 PM PDT)
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
==> ERROR: PUT_FULL_URL_FOR_DOWNLOADING_amd64_DEB_PACKAGE_HERE was not found in the build directory and is not a URL.
```

Oh. Do you think I need to edit these fields in the PKGBUILD?

```
source_i686=("PUT_FULL_URL_FOR_DOWNLOADING_i386_DEB_PACKAGE_HERE")
source_x86_64=("PUT_FULL_URL_FOR_DOWNLOADING_amd64_DEB_PACKAGE_HERE")
sha512sums_i686=('PUT_SHA512SUM_OF_i386_DEB_PACKAGE_HERE')
```
```
source_i686=("PUT_FULL_URL_FOR_DOWNLOADING_i386_DEB_PACKAGE_HERE")
source_x86_64=("https://immersedvr.com/dl/Immersed_amd64.deb")
sha512sums_i686=('PUT_SHA512SUM_OF_i386_DEB_PACKAGE_HERE')
```
I don't know the i686 package URL, sorry.


```
jack@CASTOR /t/i/immersed> makepkg -i PKGBUILD
==> Making package: immersed 2.1-1 (Sun 26 Jul 2020 04:34:35 PM PDT)
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
  -> Downloading Immersed_amd64.deb...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 20.3M  100 20.3M    0     0  36.6M      0 --:--:-- --:--:-- --:--:-- 36.6M
==> Validating source_x86_64 files with sha512sums...
    Immersed_amd64.deb ... Passed
==> Extracting sources...
  -> Extracting Immersed_amd64.deb with bsdtar
==> Entering fakeroot environment...
==> Starting package()...
sed: -e expression #1, char 14: unknown option to `s'
==> ERROR: A failure occurred in package().
    Aborting...
```

Is that supposed to happen?
There was this line in the PKGBUILD...
```
ls usr/share/applications/*.desktop | while read line; do
  sed -i 's/^Exec=\/usr\/local\/bin\//Exec=\/usr\/bin\//g' $line
done

```

Pretty sure that's bad syntax.
```
ls usr/share/applications/*.desktop | while read line; do
  sed -i 's/^Exec=\/usr\/local\/bin\//Exec=\/usr\/bin\//g' $line
done

```

Tried running makepkg again...and...

```
==> Finished making: immersed 2.1-1 (Sun 26 Jul 2020 04:40:17 PM PDT)
==> Installing package immersed with pacman -U...
loading packages...
resolving dependencies...
looking for conflicting packages...

Packages (1) immersed-2.1-1

Total Installed Size:  65.22 MiB

:: Proceed with installation? [Y/n]
```
Wahoo!

```
jack@CASTOR /t/i/immersed> Immersed
Immersed: /usr/lib/libcurl-gnutls.so.4: no version information available (required by Immersed)
fish: Job 2, “Immersed” terminated by signal SIGSEGV (Address boundary error)
```

Excuse me?

Running `strace` showed me that it was expecting two `.so` files in `/usr/local/bin`

```
openat(AT_FDCWD, "/usr/local/bin/immersed-res/va1/libavutil.so", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)
openat(AT_FDCWD, "/usr/local/bin/immersed-res/va2/libavutil.so", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)
```
But I had renamed the install paths in PKGBUILD to put them not there. Maybe it was good that the `sed` was broken. I removed that for loop.

And for good measure, moved the binaries from where it was installed to the proper place.
```
jack@CASTOR /t/i/immersed> sudo mv /usr/bin/immersed-res/ /usr/local/bin/
```
Got a dialog box! It works!




