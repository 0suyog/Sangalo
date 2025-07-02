import type { FC } from "react";
import type { FriendBarType } from "../../types/ChatListTypes";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import { AvatarWithStatus } from "../AvatarWithStatus";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router";

interface PropType {
	friend: FriendBarType;
	onClick: (id: string) => void;
}

export const FriendChatBar: FC<PropType> = ({ friend, onClick }) => {
	const { id } = useParams();
	return (
		<>
			<Card variant="outlined">
				<CardActionArea
					onClick={() => {
						onClick(`${friend.id}?new=true`);
					}}
					data-active={friend.id === id ? "" : undefined}
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
							onClick={() => {
								onClick(friend.id);
							}}
							sx={{ cursor: "pointer" }}
						>
							<>
								<AvatarWithStatus
									username={friend.username}
									image={`https://robohash.org/${friend.username}`}
									status={friend.status}
								/>
								<Stack alignItems={"center"} justifyContent={"center"}>
									<Typography
										variant="subtitle2"
										lineHeight={0.5}
										align="left"
										alignSelf={"start"}
									>
										{friend.displayName}
									</Typography>
									<Typography variant="caption">
										"Send a message to start a conversation"
									</Typography>
								</Stack>
							</>
						</Stack>
					</CardContent>
				</CardActionArea>
			</Card>
		</>
	);
};
