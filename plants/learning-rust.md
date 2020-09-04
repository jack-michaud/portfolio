---
title: "Rust Tidbits"
description: "Learning Rust in 2020 from the POV of a Python developer"
date: 2020-09-04
tags: rust
stage: sapling
---

I've tried learning rust a while I was in school, but it didn't stick. I think 
it was because I didn't have a full appreciation for the type of low level 
things that Rust could do -- I initially tried starting my Rust journey by 
writing a lisp parser, but I lost steam on it quickly.

Recently, I started picking it up again. This time, I implemented stuff that I 
found useful.

- I wrote a REST API for a chat server using `actix-web` and `diesel`
- I wrote a https://pusher.com replacement using `hyper`, `tokio`, `tungsten`
- I wrote a Discord websocket bot client implementation with `tungsten` 
- I wrote a Blockchain implementation as an exercise to learn ECDH and some crypto

Here is a list of some takeaways and patterns I use as I learn more rust.

## if let

Love me some `if let`. Instead of using a match, you can use an `if let` which
is especially useful if you only care about one result.

```rust
let res: Result<u8, ()> = Ok(1);

match res {
  Ok(num) => println!("Got number!"),
  Err(_) => {},
}
```
...can be rewritten as...

```rust
let res: Result<u8, ()> = Ok(1);

if let Ok(num) = res { 
  println!("Got number!");
}
```

Same thing can be done for `Option`.


```rust
let res: Option<u8> = Some(1);

if let Some(num) = res { 
  println!("Got number!");
}
```

## Custom Error Types

Everyone talks about how writing custom error types is _the_ pattern, and I 
never knew what that really meant or how to do it. Anyway, here's how I do it.


I have some function that lets you connect to a peer.
```
fn connect_to_peer() -> Result<TcpStream, Box<dyn Error>> {
  let stream = get_stream()?;
  Ok(stream)
}
```

A dynamic error, huh? So it can literally be any error type? Feels weird.

> But it works, because no matter the error, it can be put in the box and the rust compiler will be happy.

Still, it's a hell to maintain when you don't know what kind of errors this 
function will throw. 

Make it return our own error type!

```rust
enum PeerError {
};

fn connect_to_peer() -> Result<TcpStream, PeerError> {
  // ...
}
```

Now, an implementor can handle the error:

```rust
connect_to_peer().map_err(|peerError| {
  match peerError {
    // Handle each value in the enum!
  }
});
```

`.map_err` can be used to transform errors into your own error, too. So within
the function:


```
enum PeerError {
  CouldNotConnect
};

fn connect_to_peer() -> Result<TcpStream, PeerError> {
  // `?` is kinda like Python's `raise`. It will immediately return
  // Err(PeerError::CouldNotConnect
  let stream = get_stream().map_err(|e| PeerError::CouldNotConnect)?;
  Ok(stream)
}
```
