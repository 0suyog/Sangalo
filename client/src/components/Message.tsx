import { useEffect, useState, type FC } from "react";
import { useUserContext } from "../hooks/contextHooks";
import type { ReceivedMessageType } from "../types/messageTypes";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

interface PropType {
	message: ReceivedMessageType;
}
export const Message: FC<PropType> = ({ message }) => {
	const [userDetails] = useUserContext();
	const [type, setType] = useState("received");
	useEffect(() => {
		if (userDetails?.id === message.sender) {
			setType("sent");
		}
	}, [userDetails, setType, message]);
	return (
		<Stack direction={type === "sent" ? "row-reverse" : "row"} >
			<Box border={"2px solid black"} p={2}>{message.message}</Box>
		</Stack>
	);
};
