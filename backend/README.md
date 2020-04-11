# api

my.corrhizal.net api documentation, v2 - previously written in python flask.

* __body__: meaning a json body
* __params__: url fields, `/api/:MY_PARAM/something`
* __query__: `/api/something?MY_KEY=VALUE`

## errors

upon error, return will match the following interface, `IError`:

```json
{
    "status": fail | error,
    "statusCode": http_status_code,
    "message": [
        {
            "msg": error_message_for_param,
            "param": form_field, e.g. 'username',
            "location": body | params
        }
    ],
    "stack": stack_trace
}
```

or instead of an array for `message`, a string.

# routes

## users

### `/users/`

`IUserModel`'s have the following fields removed when returned: `salt`, `pw_hash`.

* __GET__: read all users
    * returns
        - __200__: `IUserModel[]`
* __POST__: create a user of the form `IUser`
    * body
        - `username`: account username
        - `email`: account email address
        - `password`: account password, min 6 chars
    * returns
        - __201__: `IUserModel`
        - __409__: email/username in use
        - __422__: invalid data provided

---

## specific user

### `/users/:uid`
* __GET__: get specific user details
    * returns
        - __200__: `IUserModel`
        - __404__: no such user
* __PUT__: update user details
    * body
        - `name` users full name
        - `avatar`
        - `cover_image`
        - `email` users email address
        - `location` lat/long user location
        - `bio` user description
    * returns
        - __200__: updated `IUserModel`
* __DELETE__: delete user accounts & all recordables/devices/events

### `/users/login`
* __POST__: logs in user, sets user session in Redis store
    * body
        - `email` user email address
        - `password` user password

### `/users/logout`
* __POST__: logs out current user, removes session
    * returns
        - __200__: logged out
        - __500__: error logging out

### `users/:uid/avatar`
* __PUT__: set user avatar image
    * form-data
        - `avatar`: blob
    * returns
        - __200__: image set
        - __422__: no image supplied 
        - __500__: mongoose/aws error 
        - __520__: multer error

### `users/:uid/cover_image`
* __PUT__: set user cover image
    * form-data
        - `cover_image`: blob
    * returns
        - __200__: image set
        - __422__: no image supplied 
        - __500__: mongoose/aws error 
        - __520__: multer error


---

## recordables

### `/users/:uid/recordables?type=garden/plant`
### `/users/:uid/recordables/:rid`
### `/users/:uid/recordables/:rid/events`
### `/users/:uid/recordables/:rid/measurements`

---

## devices

### `/users/:uid/devices`
### `/users/:uid/devices/:did`

---

## api keys

### `/users/:uid/api_keys`
### `/users/:uid/api_keys/:kid`

---

## posts

### `/users/:uid/posts`
### `/users/:uid/posts/:pid`
### `/users/:uid/posts/comments`
### `/users/:uid/posts/comments/:cid`

---

## auth

### `/auth/verify`
* __GET__: verify user email
    * params
        - `hash`
        - `email`
    * returns 
        - __301__: redirect to `FE_URL/verified`
        - __304__: already verified
        - __500__: mongoose err
