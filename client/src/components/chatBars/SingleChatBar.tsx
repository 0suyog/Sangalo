import { useEffect, useState, type FC } from "react";
import type { ChatBarType } from "../../types/ChatListTypes";
import Stack from "@mui/material/Stack";
import { AvatarWithStatus } from "../AvatarWithStatus";
import Skeleton from "@mui/material/Skeleton";
import type { ReceivedChatterType } from "../../types/ApiChatterTypes";
import { useUserContext } from "../../hooks/contextHooks";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { useParams } from "react-router";
import CardContent from "@mui/material/CardContent";

interface PropType {
	chat: ChatBarType;
	onClick: (id: string) => void;
}
export const SingleChatBar: FC<PropType> = ({ chat, onClick }) => {
	const [receiver, setReceiver] = useState<ReceivedChatterType | null>(null);
	const [userDetails] = useUserContext();
	const { id } = useParams();
	useEffect(() => {
		const receiver = chat.participants.find(
			(chatter) => chatter.id != userDetails?.id
		);
		if (receiver) {
			setReceiver(receiver);
		}
	}, [setReceiver, chat, userDetails]);
	if (chat.type === "chat") {
		return (
			<>
				<Card variant="outlined">
					<CardActionArea
						onClick={() => onClick(chat.id)}
						data-active={chat.id === id ? "" : undefined}
						sx={{
							"&[data-active]": {
								backgroundColor: "action.selected",
							},
							"&:hover": {
								backGroundColor: "action.hover",
							},
						}}
					>
						<CardContent>
							<Stack
								direction="row"
								gap={1}
								onClick={() => onClick(chat.id)}
								sx={{ cursor: "pointer" }}
							>
								{!receiver ? (
									<>
										<Skeleton variant="circular" />
										<Skeleton variant="rectangular" />
									</>
								) : (
									<>
										<AvatarWithStatus
											username={receiver.username}
											image={chat.pictures[0]}
											status={receiver.status}
										/>
										<Stack alignItems={"center"} justifyContent={"center"}>
											<Typography
												variant="subtitle2"
												lineHeight={0.5}
												align="left"
												alignSelf={"start"}
											>
												{receiver.displayName}
											</Typography>
											<Typography variant="caption">
												{`${chat.latestMessage.message}`}
											</Typography>
										</Stack>
									</>
								)}
							</Stack>
						</CardContent>
					</CardActionArea>
				</Card>
			</>
		);
	}
	return <></>;
};
