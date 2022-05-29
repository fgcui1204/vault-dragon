# VaultDragon Tech Challenge

[![CI](https://github.com/fgcui1204/vault-dragon/actions/workflows/build-deploy.yml/badge.svg)](https://github.com/fgcui1204/vault-dragon/actions/workflows/build-deploy.yml)
## About the project

This Tech Challenge is to create and retrieve object api. 
This project is using serverless to deploy to aws cloud platform by [github actions](https://github.com/fgcui1204/vault-dragon/actions). 
The tests(unit test and api test) cover the critical functions of how the api is used in this challenge.


## Getting Started


### Prerequisites

- node >= 12.0
- serverless@3
- aws-cli


### Usage

1. Setup [AWS Credential](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) in your local.
2. Run `npm install -g serverless` to setup serverless. 
3. Run `npm run install` to install dependency.
4. Run `npm run test:unit` to run unit test.
5. Run `npm run test:api` to run api test.
6. Run `npm run start` to start this in your local.


### API Request

#### Create Object

```shell
curl --location --request POST 'https://ifz2xwryc2.execute-api.ap-southeast-2.amazonaws.com/object' \
--header 'Content-Type: application/json' \
--data-raw '{
    "key1": "value1"
}'
```

#### Retrieve Object

**If there is no timestamp provided, then will return the latest value**
```shell
curl --location --request GET 'https://ifz2xwryc2.execute-api.ap-southeast-2.amazonaws.com/object/key1'
```

**If there is a timestamp provided, then will return the closest value before this timestamp**
```shell
curl --location --request GET 'https://ifz2xwryc2.execute-api.ap-southeast-2.amazonaws.com/object/key1?timestamp=1653845073327'
```
