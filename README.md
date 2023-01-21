# hyperswitch-react-demo-app

A simple react app to demo the new react-hyper-js library

## Running the sample

1. Build the application

```
yarn install
```

2. Provide valid Api key in server.js and Publishable key in App.jsx. You can create your keys using the Hyperswitch dashboard.

```
//in server.js
const hyper = require("@juspay-tech/hyper-node")("api_key");
```

```
//in App.jsx
const hyperPromise = loadHyper("publishable_key");
```

3. Run the application

```
yarn start
```

4. Go to [http://localhost:3000/checkout](http://localhost:3000/checkout)
