# URL Encoding and Decoding 

In the context of Dynamic, and other popular Interception proxies, URL Encoding and Decoding is the way Dynamic changes the URLs, specifically to hide them. 

## Encoding types 
There's a few types of encodings that Dynamic currently supports. 

### XOR 
The XOR encryption algorithm is an example of symmetric encryption where the same key is used to both encrypt and decrypt a message. Symmetric Encryption: The same cryptographic key is used both to encrypt and decrypt messages

Okay, yes, XOR is a cipher not an encoding. But for the purpose of simplicity, we're going to refer to it as an encoding. 

Example: 
* `https://google.com`
    * `hvtrs8%2F-wuw%2Cgmoelg.aoo%2F`
* `https://www.youtube.com`
    * `hvtrs8%2F-wuw%2Cymuvu%60e%2Ccmm-`

Want to use XOR? Change your `encoding` value to `xor`

### AES
Similar to the XOR encoding, AES (Advanced Encryption Standard) encoding is a type of symmetric encryption where the same key is used to both encrypt and decrypt a message, however AES doesn't settle for a one-byte affair; it operates with much longer key lengths (up to 256 bits) compared to the 8 bits of XOR. Like XOR, it is also a cipher and not an encoding. If you're trying to hide your activity the best, AES is the way to go. While the URL may not be readable, it will be **very** difficult for a third party to decrypt the URL without the key.

Example: 
* `https://google.com`
    * `88b1yAJnVf99jJZjWhNiho+l5CUg1PRDZGg0Dn005/MseDO3Sn2Mzs`
* `https://www.youtube.com`
    * `+Bu/h2WhD6UXm5YAYzOuiiPEmA5l/gEZC0CUtY4jb3h6f4Cgwzsm/i`

If this fits your need, Change your `encoding` value to `aes`

### Plain
In computing, plain encoding is a loose term for data (e.g. file contents) that represent *only characters* of readable material but not its graphical representation nor other objects (floating-point numbers, images, etc.). It may also include a limited number of "whitespace" characters that affect simple arrangement of text. 
Note that this provides very little URL cloaking. 

Example: 
* `https://google.com`
    * `https%3A%2F%2Fgoogle.com`
* `https://www.youtube.com`
    * `https%3A%2F%2Fwww.youtube.com`

If this fits your need, Change your `encoding` value to `plain`

### Base64
Base64 is a encoding algorithm that allows you to transform any characters into an alphabet which consists of Latin letters, digits, plus, and slash. Thanks to it, Dynamic can hide URLs by turning the letters of the URL into numbers.

Example: 
* `https://google.com`
    * `aHR0cHM6Ly9nb29nbGUuY29t`
* `https://www.youtube.com`
    * `aHR0cHM6Ly93d3cueW91dHViZS5jb20=`

If this fits your need, Change your `encoding` value to `base64`


