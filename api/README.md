# api

`/plants/`

* __GET__: List all plants (200)
* __POST__: Create a new plant `{"name": "my_cool_plant"}` (201)
	- Returns `{"message":{"_id":"5d3cb7263dd6cd525239e21c"}}`

`/plants/<uuid>`

* __GET__: Get document info (200)
* __POST__: Add a moisture level `{"moisture_level":"314"}` (201)
* __DELETE__: Delete plant (200)
