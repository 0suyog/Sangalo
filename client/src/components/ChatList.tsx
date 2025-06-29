import { useQuery } from "@apollo/client";
import { getAllChats } from "../graphQLQueries/queries";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import type { ChatListType } from "../types/ChatListTypes";
import { useUserContext } from "../hooks/contextHooks";
import { addFriendsWhoHaventBeenTextedYetInChatList } from "../helpers/chatHelper";
import type { AllChatsQuery, ReceivedChatType } from "../types/ApiChatTypes";
import List from "@mui/material/List";
import { UserBar } from "./userBars/UserBar";
import { ChatBar } from "./ChatBar";

export const ChatList = () => {
	const { loading, error, data } = useQuery<AllChatsQuery>(getAllChats);
	const [chats, setChats] = useState<ChatListType[]>([]);
	const [userDetails] = useUserContext();
	useEffect(() => {
		if (!loading && !error && data) {
			const chatWFriends = addFriendsWhoHaventBeenTextedYetInChatList(
				userDetails?.friends || [],
				data.getChats
			);
			console.log(chatWFriends);
			setChats(chatWFriends);
		}
	}, [loading, error, data?.getChats, userDetails]);
	if (loading) {
		return <Skeleton variant="rectangular" />;
	}
	return (
		<>
			<List>
				{chats.map((chat) => {
					console.log(chat);
					return <ChatBar chat={chat} key={chat.id} />;
				})}
			</List>
		</>
	);
};
