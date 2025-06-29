import { useEffect, useState, type FC } from "react";
import type { ReceivedChatterType } from "../../types/ApiChatterTypes";
import { AvatarWithStatus } from "../AvatarWithStatus";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useMutation as useReactMutation } from "@tanstack/react-query";
import chatterServices from "../../services/chatter.services";
import { useUserContext } from "../../hooks/contextHooks";
import { useMutation as useGraphqlMutation } from "@apollo/client";
import { FirstMessage } from "../../graphQLQueries/mutations";

interface propTypes {
	chatter: ReceivedChatterType;
}

export const UserBar: FC<propTypes> = ({ chatter }) => {
	const [userDetails, _dispatchUserDetails] = useUserContext();
	const [sendFirstMessage, { data }] = useGraphqlMutation(FirstMessage);
	const addFriendMutation = useReactMutation({
		mutationFn: chatterServices.addFriend,
	});
	const [isFriend, setIsFriend] = useState(true);
	useEffect(() => {
		console.log(isFriend);
	});
	useEffect(() => {
		setIsFriend(true);
		if (userDetails) {
			if (
				!userDetails.friends.find((friend) => {
					return friend.id === chatter.id;
				})
			) {
				setIsFriend(false);
			}
		}
	}, [userDetails, chatter]);
	return (
		<>
			<Stack
				direction={"row"}
				alignItems={"center"}
				justifyContent="space-between"
			>
				<Stack direction={"row"} alignItems={"center"} gap={1}>
					<AvatarWithStatus
						username={chatter.username}
						status={chatter.status}
						image={`https://robohash.org/${chatter.username}`}
					/>
					<Stack alignItems={"center"} justifyContent={"center"}>
						<Typography variant="subtitle2" lineHeight={0.5}>
							{chatter.displayName}
						</Typography>
						<Typography variant="caption">{chatter.username}</Typography>
					</Stack>
				</Stack>
				{!isFriend ? (
					<Button
						variant="contained"
						onClick={() => addFriendMutation.mutate(chatter.id)}
					>
						<Add fontSize="small" />
					</Button>
				) : (
					<Button
						variant="outlined"
						onClick={() => {
							sendFirstMessage({
								variables: {
									message: "This is First Message",
									receiver: chatter.id,
								},
							});
						}}
					></Button>
				)}
			</Stack>
		</>
	);
};
