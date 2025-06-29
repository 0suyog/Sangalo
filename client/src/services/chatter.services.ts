import axios from "axios";
import type { LoginRequestType, NewChatterType, ReceivedChatterType, ReceivedPopoulatedChatterType, SearchRequestType, TokenType } from "../types/ApiChatterTypes";
import { BASEURL, TOKEN } from "../apiData";
const registerChatter = async (chatterDetails: NewChatterType): Promise<ReceivedChatterType | undefined> => {
  const res = await axios.post(`${BASEURL}/chatter/register`, chatterDetails);
  return res.data as ReceivedChatterType
}

const loginChatter = async (loginDetails: LoginRequestType): Promise<TokenType | undefined> => {
  const res = await axios.post(`${BASEURL}/chatter/login`, loginDetails);
  return res.data as TokenType;
}

const getFriends = async (): Promise<ReceivedChatterType[]> => {
  const res = await axios.get(`${BASEURL}/chatter/friends`, {
    headers: {
      Authorization: TOKEN
    }
  })
  return res.data
}

const addFriend = async (id: string) => {
  await axios.post(`${BASEURL}/chatter/addFriend/${id}`, {}, {
    headers: {
      Authorization: TOKEN
    }
  })
}

const searchChatter = async (filter: SearchRequestType): Promise<{ chatters: ReceivedChatterType[] }> => {
  const response = await axios.post(`${BASEURL}/chatter/search`, filter, {
    headers: {
      Authorization: TOKEN
    }
  })
  return response.data
}

const me = async (): Promise<ReceivedPopoulatedChatterType> => {
  const response = await axios.get(`${BASEURL}/chatter/me`, { headers: { Authorization: TOKEN } })
  return response.data
}



export default { registerChatter, loginChatter, getFriends, addFriend, searchChatter, me }