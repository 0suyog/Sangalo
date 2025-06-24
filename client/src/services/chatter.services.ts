import axios from "axios";
import type { LoginRequestType, NewChatterType, ReceivedChatterType, TokenType } from "../types/chatterTypes";
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
  console.log(res.data)
  return res.data
}


export default { registerChatter, loginChatter, getFriends }