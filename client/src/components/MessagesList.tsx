import { useQuery } from "@apollo/client";
import { useRef, type FC } from "react";
import { useParams } from "react-router";
import { GetAllMessages } from "../graphQLQueries/queries";
import { Message } from "./Message";
import Stack from "@mui/material/Stack";
import { useTokenContext } from "../hooks/contextHooks";

export const MessagesList: FC = () => {
	const { id } = useParams();
	const [token] = useTokenContext();
	const noOfMessagesPerRequest = useRef(10);
	const {
		loading,
		error,
		data: allMessagesData,
	} = useQuery(GetAllMessages, {
		variables: { count: noOfMessagesPerRequest.current, chatId: id as string },
		skip: !id || !token.token,
	});

	if (!id) {
		return <>Send FIrst message First</>;
	}

	if (loading) {
		return <>Loading Messages...</>;
	}

	if (error) {
		return <>Something went wrong... </>;
	}

	return (
		<Stack
			flexGrow={1}
			direction={"column-reverse"}
			sx={{
				overflowY: "scroll",
			}}
		>
			{allMessagesData &&
				allMessagesData.getMessages.map((message) => {
					return <Message message={message} key={message.id} />;
				})}
		</Stack>
	);
};
