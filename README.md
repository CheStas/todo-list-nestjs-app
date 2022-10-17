# TODO list nestjs test app

## Installation

```bash
$ npm i
$ docker-compose build
```

## Running the app

```bash
# development
$ docker-compose up
```

## API Swagger documentation
For detailed documentation please run the app and visit
http://localhost:3000/docs

## Running unit tests
```bash
$ npm run test
```

### Generate test coverage
```
$ npm run test:cov
```

## Running the app production
```bash
docker-compose -f docker-compose-prod.yml up
```
