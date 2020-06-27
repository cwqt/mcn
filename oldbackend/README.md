<!-- # influxdb

```
    measurements: Measurement, IoTMeasurement, IoTState
    tags: device=:did / user=:uid, recordable=:rid
    fields: lightsensor1=231.4, lightsensor2=429.9
```

![](https://image.slidesharecdn.com/1influxdb-150819175653-lva1-app6891/95/paul-dix-influxdb-opensource-time-series-database-41-638.jpg?cb=1440007116) -->

# api

my.corrhizal.net api documentation, v2 - previously written in python flask.

- **body**: meaning a json body
- **params**: url fields, `/api/:MY_PARAM/something`
- **query**: `/api/something?MY_KEY=VALUE`
- **form-data**: for sending images; `enctype="multipart/form-data"`

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

`IUser`'s have the following fields removed when returned: `salt`, `pw_hash`.

- **GET**: read all users
  - returns
    - **200**: `IUser[]`
- **POST**: create a user of the form `IUser`
  - body
    - `username`: account username
    - `email`: account email address
    - `password`: account password, min 6 chars
  - returns
    - **201**: `IUser`
    - **409**: email/username in use
    - **422**: invalid data provided

---

## specific user

### `/users/:uid`

- **GET**: get specific user details
  - returns
    - **200**: `IUser`
    - **404**: no such user
- **PUT**: update user details
  - body
    - `name` users full name
    - `email` users email address
    - `location` lat/long user location
    - `bio` user description
    - `new_user`
  - returns
    - **200**: updated `IUser`
- **DELETE**: delete user accounts & all recordables/devices/events

### `/users/login`

- **POST**: logs in user, sets user session in Redis store
  - body
    - `email` user email address
    - `password` user password

### `/users/logout`

- **POST**: logs out current user, removes session
  - returns
    - **200**: logged out
    - **500**: error logging out

### `users/:uid/avatar`

- **PUT**: set user avatar image
  - form-data
    - `avatar`: blob
  - returns
    - **200**: image set
    - **422**: no image supplied
    - **500**: mongoose/aws error
    - **520**: multer error

### `users/:uid/cover_image`

- **PUT**: set user cover image
  - form-data
    - `cover_image`: blob
  - returns
    - **200**: image set
    - **422**: no image supplied
    - **500**: mongoose/aws error
    - **520**: multer error

---

## devices

### `/users/:uid/devices`

- **GET**: get a stub list of all devices

  - basic device info & last measurement time

- **POST**:
  - body
    - `friendly_name`: frontend name for device
  - returns
    **201**: created device, `IDeviceModel`
    **422**: invalid data provided
    **500**: mongoose err

### `/users/:uid/devices/:did`

- **GET**: read all device info inc. all images
  - returns
    - **200**: device, `IDeviceModel`
    - **500**: mongoose error
- **PUT**: update device
- **DELETE**: delete device
  - returns
    **200**: deleted
