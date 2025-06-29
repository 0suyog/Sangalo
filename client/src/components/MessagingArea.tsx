import { useQuery } from "@apollo/client";
import { useTokenContext } from "../hooks/contextHooks";
import chatterServices from "../services/chatter.services";
import { getAllChats, GetAllMessages } from "../graphQLQueries/queries";
import { useEffect, type FC } from "react";
import Box from "@mui/material/Box";
import { FriendsList } from "../FriendsList";
import { ChatList } from "./ChatList";

export const MessagingArea: FC = () => {
	const [token, dispatchToken] = useTokenContext();
	return (
		<>
			<Box>
				<ChatList />
			</Box>
		</>
	);
};
