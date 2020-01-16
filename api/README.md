# api

`pipenv run python3 app.py`

`.env`

* `APP_SETTINGS`: [`"development"`, `"testing"`, `"staging"`, `"production"`] 
* `MONGO_URI`: `mongo+srv://<user>:<pass>.../db`
* `AUTH_SECRET_KEY`: `"mysupersecretloginkey"`

---

Responses returned in JSON, enveloped in `data` and `message` fields.  
__POST__, __PUT__ & __DELETE__ routes require an `x-access-token` JWT token, `Auth-Password` superceedes auth token.  

e.g.
```shell
curl --header "x-access-token: 'jwt...'"  -X POST "http://localhost:5000/gardens/
curl --header "Auth-Password: 'supersecretpassword'"  -X DELETE "http://localhost:5000/
```

## Routes

`/`

* __GET__: Returns README.md as HTML
* __DELETE__: Delete all gardens and plants
	- Requires `Auth-Password`
* __POST__: Create base collections
	- Requires `Auth-Password`

`/auth/`

* __GET__: Generate a JSON Web Token for use in `x-access-token` header (200)
	- Requires header `Auth-Password`
	- Returns `{"data": "eyJ0eXAiOiJKV1QiLCJhbGc..."}`

`/auth/token`

* __GET__: Verify token works
	- Returns `{"data":true}`

`/gardens/`

* __GET__: List all gardens (200)
* __POST__: Create a new garden (201)
	- JSON body `{"name":"Very big garden", "image":"https://myimage.com"}`
	- Returns `{"data":"feeff148-116b-11ea-8d3e-acde48001122"}`

`/gardens/<uuid>`

* __GET__: List garden info & plant object id's (200)
* __PUT__: Add measurements
	- Requires JSON body (see <#Accepted Measurements>)
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

## Accepted measurements

View [common/measurements.py](https://gitlab.com/cxss/moisture.track/blob/master/api/common/measurements.py) for a list of accepted measurements and their types.

e.g.

```
curl --location --request PUT 'http://localhost:5000/gardens/5e1f51a0588102a1a413f8c4' \
--header 'Content-Type: application/json' \
--header 'x-access-token: supersecrettoken' \
--data-raw '{
	"moisture": 548,
	"light": 319,
	"temperature": 715,
	"humidity": 949,
	"water_level": 37,
	"light_on": false
}'
```

