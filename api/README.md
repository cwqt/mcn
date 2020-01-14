# api

`pipenv run python3 app.py`

`.env`

* `APP_SETTINGS`: ["development", "testing", "staging, "production"] 
* `MONGO_URI`: `mongo+srv://<user>:<pass>.../db`
* `AUTH_SECRET_KEY`: "mysupersecretloginkey"

---

Responses returned in JSON, enveloped in `data` and `message` fields.  
__POST__, __PUT__ & __DELETE__ routes require an auth-token.  
e.g. `curl --header "x-access-token: 'jwt...'"  -X POST "http://localhost:5000/gardens/`

## Routes

`/auth/`

* __GET__: Generate a JSON Web Token, header `Auth-Token` with plain-text password (200)
	- Returns `{"data": "eyJ0eXAiOiJKV1QiLCJhbGc..."}`

`/auth/token`

* __GET__: Verify token works
	- Returns `{"data":true}`

`/gardens/`

* __GET__: List all garden id's (200)
* __POST__: Create a new garden `{"name": "my_cool_plant"}` (201)
	- Returns `{"data":{"_id":"feeff148-116b-11ea-8d3e-acde48001122"}}`

`/gardens/<uuid>`

* __GET__: List garden info & plant object id's (200)
* __POST__: Add a plant (201)
	- Returns `{"data":{"_id":"feeff148-116b-11ea-8d3e-acde48001122"}}`
* __PUT__: Add measurements
* __DELETE__: Delete garden (200)

`/plants/`

* __GET__: List all plant id's (200)
* __POST__: Add a new, individual plant (201)

`/plants/<uuid>`

* __GET__: List plant info
* __PUT__: Add measurement
* __DELETE__: Delete plant
* __PATCH__: Add/remove plant to/from garden