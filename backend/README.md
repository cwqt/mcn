# api

my.corrhizal.net api documentation, v2 - previously written in python flask.

* __body__: meaning a json body
* __params__: url fields, `/api/:MY_PARAM/something`
* __query__: `/api/something?MY_KEY=VALUE`
* __form-data__: for sending images; ` enctype="multipart/form-data"`

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
        - `email` users email address
        - `location` lat/long user location
        - `bio` user description
        - `new_user` 
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

### `/users/:uid/posts`
* __GET__: get user posts
* __POST__: create a post/thread of posts

### `/users/:uid/posts/:pid`
* __GET__: get post
* __PUT__: update post body
* __DELETE__: delete post

### `/user/:uid/followers
* __GET__: get paginated list of followers

### `/user/:uid/following
* __GET__: get paginated list of people we're following

### `/user/:uid/follows/:uid2
* __POST__: follow another user
* __DELETE__: un-follow a user

### `/user/:uid/blocks
* __GET__: get paginated list of blocked users

### `/user/:uid/blocks/:uid2
* __POST__: block a user
* __DELETE__: un-block a user

### `/user/:uid/timeline
* __GET__: get curated list of posts

### `/user/:uid/hearts
* __GET__: get paginated list of hearted posts

### `/user/:uid/hearts/:pid
* __POST__: heart a post
* __DELETE__: un-heart a post

### `/users/:uid/posts/comments`
### `/users/:uid/posts/comments/:cid`

---

## recordables

### `/users/:uid/recordables?type=garden/plant`
* __POST__: create a new recordable of type `type`
    * body
        - 


### `/users/:uid/recordables/:rid`
### `/users/:uid/recordables/:rid/events`
### `/users/:uid/recordables/:rid/measurements`

---

## devices

### `/users/:uid/devices`

* __GET__: read all user devices
    * returns
        - __200__: all user devices, `IDeviceModel[]`
        - __500__: mongoose error
* __POST__:
    * body
        - `friendly_name`: frontend name for device
    * returns
        __201__: created device, `IDeviceModel`
        __422__: invalid data provided
        __500__: mongoose err

### `/users/:uid/devices/:did`

* __GET__: read device
    * returns
        - __200__: device, `IDeviceModel`
        - __500__: mongoose error
* __PUT__: update device
    * body:
        - `user_id`: id of user who this device belongs to
        - `api_key_id`: id of api key for this device
        - `recordable_id`: id of recordable which this device is monitoring
        - `verified`: server has received a response from device
        - `hardware_model`:
        - `software_version`:
        - `friendly_title`: frontend name for device
        - `recording`: types of measurements, `ACCEPTED_MEASUREMENTS`
* __DELETE__: delete device
    * returns
        __200__: deleted

### `/users/:uid/devices/:did/ping`

* __GET__: used by device to verify existence and update `last_ping`
    - returns
        __200__: received pong
        __500__: mongoose error

---

## api keys

### `/users/:uid/api_keys`
### `/users/:uid/api_keys/:kid`

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
