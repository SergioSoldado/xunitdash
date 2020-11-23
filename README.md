# xunitdash

# Demo
https://www.hubshuffle.com/xunitdash/testRuns

# Generating the model python definition

```bash
flask-sqlacodegen --flask postgresql://xunitdash:xunitdash@xunitdash_database
```

# Updating the API

* Retrieve the swagger json file from localhost after starting the flask sqlalchemy instance.
* Convert the json file to the API sources as follows:

```bash 
openapi-generator generate -g typescript-axios -i ./swagger.json -o ./src/api
```

# Running

### Run postgres with docker:

Enter the <code>deployment</code> directory and do:
```bash
docker-compose build && docker compose up &
```

Setup DNS.

```bash
./start-dns-proxy.sh
```

### Start the backend 

Run the <code>./source/db/server.py</code> script. ToDo relocate this file.

### (Optional) Generate placeholder data

Run the <code>api/tools/placeholder_data_creator.py</code> script.

### Run the frontend

```bash
cd frontend
yarn install
yarn run dev
```
