# Neo Nano

## Purpose:

To provide an integrated goal tracking tool and community forum centered on the the callenge of writing a 50,000 word novel in November. 

- NaNoWriMo (National Novel Writing Month) was a challenge to write a 50,000 word novel in the month of November
- www.nanowrimo.org used to host the challenge, with a website that provided both community forums and tools/graphs for tracking your progress in the challenge.

## Deployments:

- [staging](https://neo-nano.vercel.app/)
- production (TBD)

## Run Locally

### Prerequisits:

- [Node.js](https://nodejs.org/en)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

### Env variables:
- Make a copy of .env.sample in the packages/neo-nano-ui workspace, and name it .env.local. DO NOT COMMIT THIS FILE.
- ask a codeowner to securly share the missing values, or follow the instructions in .env.sample for each value. 


### Install depencies

- open a console in the root of this project
- run `yarn`

### Run unit tests

```
cd packages/neo-nano-ui
yarn dev
```

### Run the NextJS app on localhost

```
cd packages/neo-nano-ui
yarn dev
```


## Tools

- development framework: NextJs (colocated frontend and severless api)
- infrastructure - vercel
- logging - sentry
- database - neon
- auth - auth0 
