# Getting Started

1.Install all dependencies with `npm i`\<br>
2.Create a .env file with `touch .env`\<br>
3.inside the .env file put this\<br>

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
  id: string,
}
PopulatedChatterType:{
  ...ChatterType,
  friends:Array<ChatterType>
}
ChatterSearchResponse:{chatters:Array<ChatterType>},
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

# HTTP End Points

## Unauthorized Endpoints

| Http Method | endpoint                        | body           | return Value        |
| ----------- | ------------------------------- | -------------- | ------------------- |
| POST        | /api/chatter/register           | NewChatterType | - (status:201)      |
| POST        | /api/chatter/login              | LoginType      | TokenType           |
| GET         | /api/chatter/id/:id             | -              | ChatterType         |
| GET         | /api/chatter/username/:username | -              | ChatterType         |
| GET         | /api/chatter/exists/:username   | -              | {exists:true/false} |
| GET         | /ping                           | -              | Pong                |

## Authorized EndPoints

You need to set authorization header with `` `Bearer${token from TokenType}` ``

| Http Method | endpoint                   | body       | return                                         |
| ----------- | -------------------------- | ---------- | ---------------------------------------------- |
| POST        | /api/chatter/addFriend/:id | -          | - (status:200)                                 |
| POST        | /api/chatter/search        | SearchType | ChatterSearchResponse                          |
| GET         | /api/chatter/friends       | -          | Array<string> (the string will be friends ids) |
| DELETE      | /api/chatter/delete        | -          | -(status:204 )                                 |
| GET         | /api/chatter/me            | -          | PopulatedChatterType                           |
| GET         | /api/chatter/friends       | -          | Array<ChatterType>                             |

# GraphQl TypeDefs

all graphql queries and mutations require auth token. send token same as Http endpoints after logging in.
for subscriptions i am using websockets with graphql-ws, you should include {auth:`Bearer ${token}`} in connectionParams when creating client. If you did not include auth in connectionParams the request will **fail** and most probably will **fail silently**.

You can see errors in server if you didnt provide proper auth dont mind the error the server will keep being up.

Graphql EndPoint:`http://localhost:<your port>/api/graphql`
Subscriptions EndPoint:`ws://localhost:<your port>/api/subscriptions`
The Date is scalar type and it takes any string that is parsable by Date class of js

```
  scalar Date

  enum Reactions{
    like
    love
    sad
    laugh
    cry
  }

  enum ChatterStatus{
    online
    offline
    idle
    dnd
  }

  enum ChatStatus{
    sent
    delivered
    read
  }


  type Reaction{
    chatter:String!
    reaction:Reactions
  }

  input NewChat{
    participants:[String!]!
    name:String!
  }


  type Chatter{
    id:String!
    username:String!
    displayName:String!
    status:ChatterStatus!
  }

  input NewMessage{
    chatId:String!
    message:String!
  }

  input FirstMessage{
    message:String!
    receiver:String!
  }

  type FirstMessageReturn{
    chat:Chat!
    message:String!
    sender:String!
    receiver:String!
    id:String!
    sentTime:Date!
  }

  type Message{
    chatId:String!
    message:String!
    sender:String!
    receiver:String!
    id:String!
    sentTime:Date!
    reactions:[Reaction!]!
  }

  input MessageFilter{
    earliest:Date
    count:Int!
    chatId:String!
  }

  type Chat{
    id:String!
    participants:[Chatter!]!
    name:String
    isGroup:Boolean
    latestMessage:Message
    status:ChatStatus
  }
  input MessageReacted{
    chatId:String!
    messageId:String!
    reaction:Reactions!
  }
  input ChatStatusUpdate{
    status:ChatStatus!
    chatId:String!
  }

  type Query{
    getMessages(filter:MessageFilter!):[Message!]!
    getChats:[Chat!]!
  }

  type Mutation{
    firstMessage(message:FirstMessage!):FirstMessageReturn!
    message(message:NewMessage!):Message!
    createGroup(groupDetails:NewChat!):Chat!
    messageReaction(details:MessageReacted!):Message!
    chatStatusUpdate(details:ChatStatusUpdate!):Chat!
  }

  type Subscription{
    message:Message!
    firstMessage:FirstMessageReturn!
    // messageReaction will trigger to all the participants in a chat(even to the one that reacted)
    messageReaction:Message!
    chatStatusUpdate:Chat!
    newGroup:Chat!
  }
```

I havent tested last three subscriptions it should work. You can use altair client to test graphql queries and subscriptions.
You will get this error

```
Server Error. Check that your server is up and running. You can check the console for more details on the network errors.
```

if either your server isnt up or you havent put auth in connectionParams.

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
