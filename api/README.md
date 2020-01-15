# api

`pipenv run python3 app.py`

`.env`

* `APP_SETTINGS`: [`"development"`, `"testing"`, `"staging"`, `"production"`] 
* `MONGO_URI`: `mongo+srv://<user>:<pass>.../db`
* `AUTH_SECRET_KEY`: "mysupersecretloginkey"

---

Responses returned in JSON, enveloped in `data` and `message` fields.  
__POST__, __PUT__ & __DELETE__ routes require an auth-token.  
e.g. `curl --header "x-access-token: 'jwt...'"  -X POST "http://localhost:5000/gardens/`

## Routes

`/`

* __GET__: Returns README.md as HTML

`/auth/`

* __GET__: Generate a JSON Web Token, header `Auth-Token` with plain-text password (200)
	- Returns `{"data": "eyJ0eXAiOiJKV1QiLCJhbGc..."}`

`/auth/token`

* __GET__: Verify token works
	- Returns `{"data":true}`

`/gardens/`

* __GET__: List all gardens (200)
* __POST__: Create a new garden (201)
	- Body `{"name":"Very big garden", "image":"https://myimage.com"}`
	- Returns `{"data":"feeff148-116b-11ea-8d3e-acde48001122"}`

`/gardens/<uuid>`

* __GET__: List garden info & plant object id's (200)
* __PUT__: Add measurements
* __DELETE__: Delete garden (200)

`/plants/`

* __GET__: List all plant id's (200)
* __POST__: Add a new, individual plant (or to garden) (201)
	- `/plants?garden=<uuid>`

`/plants/<uuid>`

* __GET__: List plant info
* __PUT__: Add measurement
* __DELETE__: Delete plant
* __PATCH__: Add/remove plant to/from garden

`/plants/<uuid>/measurements`
`/gardens/<uuid>/measurements`

* __GET__: Get measurements
	- Takes query `?last=<last_n_records>`




