# Performance modes 
Dynamic provides two performance options to fit your needs. 

## Development

When you set your performance mode to `development`, Dynamic will not cache itself or minify at all. 

This mode is recommended when: 
* Creating middleware with the Dynamic API 
* Testing features that require debugging 

## Production

When you set your performance mode to `production`, Dynamic will cache its bundle and configuration file. This is Dynamics peak performance mode. 

This mode is recommended when: 
* Production or public use is intended
* When speed is priority over middleware updates. 
