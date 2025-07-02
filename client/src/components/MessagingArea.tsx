import { useEffect, useState, type FC } from "react";
import { ChatList } from "./ChatList";
import { MessagesList } from "./MessagesList";
import Stack from "@mui/material/Stack";
import { useMutation, useSubscription } from "@apollo/client";
import { SubscribeToMessage } from "../graphQLQueries/subscriptions";
import { useTokenContext } from "../hooks/contextHooks";
import {
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router";
import type {
	FirstMessageType,
	NewMessageType,
	ReceivedFirstMessageType,
	ReceivedMessageType,
	SendMessageMutationType,
} from "../types/messageTypes";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Send from "@mui/icons-material/Send";
import { FirstMessage, SendMessage } from "../graphQLQueries/mutations";
import { NoMessages } from "./NoMessages";
import {
	addNewChatToCache,
	addNewMessageToCache,
	updateChatOrderInCache,
} from "../helpers/cacheManagementHelper";

export const MessagingArea: FC = () => {
	const [token] = useTokenContext();
	const { id } = useParams();
	const [message, setMessage] = useState("");
	const [firstMessage, setIsFirstMessage] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	useEffect(() => {
		if (searchParams.get("new")) {
			setIsFirstMessage(true);
		} else {
			setIsFirstMessage(false);
		}
	}, [searchParams]);
	useSubscription(SubscribeToMessage, {
		skip: !token.token || !id,
		onData: ({ client, data }) => {
			if (data.data) {
				addNewMessageToCache(
					client.cache,
					{
						chatId: data.data.message.id,
						count: 10,
					},
					data.data.message
				);
			}
		},
	});

	const [sendFirstMessageMutation] = useMutation<
		{ firstMessage: ReceivedFirstMessageType },
		FirstMessageType
	>(FirstMessage, {
		variables: { receiver: id as string, message: message },
		update: (caches, data) => {
			if (data.data) {
				const ReceivedMessage = data.data.firstMessage;
				const parsedMessage: ReceivedMessageType = {
					...ReceivedMessage.chat.latestMessage,
					chatId: ReceivedMessage.chat.id,
					reactions: [],
				};
				addNewMessageToCache(
					caches,
					{
						chatId: parsedMessage.chatId,
						count: 10,
					},
					parsedMessage
				);
				console.log(ReceivedMessage.chat, ReceivedMessage.chatId);
				addNewChatToCache(caches, {
					...ReceivedMessage.chat,
					latestMessage: {
						...ReceivedMessage.chat.latestMessage,
						chatId: ReceivedMessage.chat.id,
						reactions: [],
					},
					name: null,
					isGroup: false,
					status: "sent",
				});
			}
		},
		onCompleted: (data) => {
			navigate(`/messaging/${data.firstMessage.chat.id}`);
		},
	});

	const [sendMessageMutation] = useMutation<
		SendMessageMutationType,
		NewMessageType
	>(SendMessage, {
		variables: { chatId: id as string, message: message },
		update: (caches, data) => {
			if (data.data) {
				const ReceivedMessage = data.data.message;
				addNewMessageToCache(
					caches,
					{
						chatId: ReceivedMessage.chatId,
						count: 10,
					},
					{ ...ReceivedMessage, reactions: [] }
				);
				updateChatOrderInCache(caches, ReceivedMessage);
			}
		},
	});

	const handleSend = () => {
		if (!firstMessage) {
			sendMessageMutation();
		} else {
			sendFirstMessageMutation();
		}
		setMessage("");
	};

	return (
		<>
			<Stack direction="row" flexGrow={1} height="100vh">
				<ChatList />
				<Stack flexGrow={1} height={"100%"} justifyContent={"space-between"}>
					{firstMessage ? <NoMessages /> : <MessagesList />}
					<TextField
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSend();
							}
						}}
						onChange={(e) => setMessage(e.target.value)}
						value={message}
						fullWidth
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => {
												handleSend();
											}}
										>
											<Send />
										</IconButton>
									</InputAdornment>
								),
							},
						}}
						sx={{
							alignSelf: "end",
						}}
					/>
				</Stack>
			</Stack>
		</>
	);
};
