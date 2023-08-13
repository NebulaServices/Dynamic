# Bare version and path 


You might have noticed this setting in your configuration file: 
```js
  bare: {
    version: 2, 
    path: '/bare/',
  },
```
This is refering to the Bare endpoint that Dynamic uses. The version is what Dynamic concatonates to the path. It will finally look something like `/path/version/`. There are differences in the versions. Details on the specification can be found here: 

* v1: https://github.com/tomphttp/specifications/blob/master/BareServerV1.md
* v2: https://github.com/tomphttp/specifications/blob/master/BareServerV2.md
* v3: https://github.com/tomphttp/specifications/blob/master/BareServerV3.md

## Unsupported versions. 
Dynamic does not have stable support v3 as of now. 