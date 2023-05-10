# Dynamics' File structure

/ 
├── index.js                  # the server 
└── static/                   # carries all files accessible to the client
    ├── index.html            # the frontend html
    ├── sw.js                 # Dynamics' service worker
    ├── resources/            # contains styles and scripts for the frontend
    │   ├── style.css         # the styles for the frontend
    │   └── index.js          # the script that registers the service worker, and does some other important things
    └── dynamic/              # the build directory for Dynamics' scripts, so it can be accessible to the client
        ├── dynamic.client.js # the client code for Dynamic
        ├── dynamic.handler.js# dynamics' handler 
        ├── dynamic.worker.js # dynamics service worker code
        └── dynamic.config.js # the configuration file for dynamic

/lib                          # contains the code that gets compiled
└── client/                  # contains client scripts
