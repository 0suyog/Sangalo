import { useQuery } from "@apollo/client";
import { getAllChats } from "../graphQLQueries/queries";
import {
	useEffect,
	useState,
	type FC,
} from "react";
import Skeleton from "@mui/material/Skeleton";
import type { ChatListType } from "../types/ChatListTypes";
import { useTokenContext, useUserContext } from "../hooks/contextHooks";
import { addFriendsWhoHaventBeenTextedYetInChatList } from "../helpers/chatHelper";
import { useNavigate } from "react-router";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Search from "@mui/icons-material/Search";
import { ChatBar } from "./chatBars/ChatBar";

export const ChatList: FC = () => {
	const [token] = useTokenContext();
	const { loading, error, data } = useQuery(getAllChats, {
		skip: !token.token,
	});
	const [userDetails] = useUserContext();
	const navigate = useNavigate();
	const [chats, setChats] = useState<ChatListType[]>([]);

	useEffect(() => {
		if (!loading && !error && data) {
			const chatWFriends = addFriendsWhoHaventBeenTextedYetInChatList(
				userDetails?.friends || [],
				data.getChats
			);
			setChats(chatWFriends);
		}
	}, [loading, error, data, userDetails]);

	if (loading) {
		return <Skeleton variant="rectangular" />;
	}

	const handleChatBarClick = (id: string) => {
		navigate(`/messaging/${id}`);
	};

	return (
		<Stack gap={0.5}>
			<Card sx={{ borderRadius: 8 }}>
				<CardActionArea sx={{ cursor: "text" }}>
					<Stack direction={"row"} alignItems={"center"} p={0.5} gap={0.5}>
						<Search />
						<Typography>search</Typography>
					</Stack>
				</CardActionArea>
			</Card>
			<Stack gap={0.2}>
				{chats.map((chat) => {
					return (
						<ChatBar chat={chat} key={chat.id} onClick={handleChatBarClick} />
					);
				})}
			</Stack>
		</Stack>
	);
};
