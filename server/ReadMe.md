# Getting Started

1.Install all dependencies with `npm i`<br>
2.Create a .env file with `touch .env`<br>
3.inside the .env file put this<br>

```
PORT=3000
MONGO_DEV_DB=<mongodb address used development>
MONGO_TEST_DB=<mongodb address used for running tests>
SECERT_KEY=<your secret key for jwt authentication>
```

4. start the server with `npm run dev`<br>
5. For testing you can use `npm test`<br>

# Types

```
NewChatterType:{
  username:string,
  password:string,
  displayName:string,
  email?:string
}
ChatterType:{
  username:string,
  displayName:string,
  email?:string,
  status: "online" | "offline" | "idle" | "dnd",
  friends?: Array<string>,
  id: string,
}
ChatterSearchResult:{
  username:string,
  displayName:string,
  status: "online" | "offline" | "idle" | "dnd",
}
ChatterSearchResponse:Array<ChatterSearchResult>,
LoginType:{
  username:string,
  password:string
}
TokenType:{
  token:string
}
SearchType:{
  displayName:string
}
```

# Validations

- username should be in between 4 and 16 in length
- password should be in between 8 and 16 in length
- displayName should be in between 4 and 16 in length

all the following endpoints are prefixed by `http://localhost:<yourPort>`

# End Points

## Unauthorized Endpoints

| Http Method | endpoint                        | body           | return Value        |
| ----------- | ------------------------------- | -------------- | ------------------- |
| POST        | /api/chatter/register           | NewChatterType | ChatterType         |
| POST        | /api/chatter/login              | LoginType      | TokenType           |
| GET         | /api/chatter/id/:id             | -              | ChatterType         |
| GET         | /api/chatter/username/:username | -              | ChatterType         |
| GET         | /api/chatter/exists/:username   | -              | {exists:true/false} |

## Authorized EndPoints

You need to set authorization header with `` `Bearer${token from TokenType}` ``
| Http Method | endpoint | body | return |
| ----------- | -------------------------- | ---------- | ---------------------------------------------- |
| POST | /api/chatter/addFriend/:id | - | - (status:200) |
| GET | /api/chatter/search | SearchType | ChatterSearchResponse |
| GET | /api/chatter/friends | - | Array<string> (the string will be friends ids) |
| DELETE | /api/chatter/delete | - | -(status:204 | ) |

# Errors

You will get different status codes with depending on the sitaution and type of error. You will get error of following structure as returned Data

```
{
  error:{
    name?:string,
    description:string,
    options:object // options usually contain the input that caused the error
  }
}
```

You will get status code of 422 incase of any invalid or mistyped data sent as body and along side that there will be a [zodError](https://zod.dev/packages/core?id=errors)

in endpoints that take :id if you send invalid id you will just get status 500 with a simple message
