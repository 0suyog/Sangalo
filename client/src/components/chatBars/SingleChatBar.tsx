import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { AvatarWithStatus } from "../AvatarWithStatus";
import Typography from "@mui/material/Typography";
import type { ChatListType } from "../../types/ChatListTypes";
interface PropType {
	chat: ChatListType;
}
const SingleChatBar = () => {
	const [receiver, setReceiver] = useState<ReceivedChatterType | null>(null);
	const [userDetails] = useUserContext();
	const [latestMessageBy, setLatestMessageBy] = useState("");
	useEffect(() => {
		if (chat.type === "chat") {
			const receiver = chat.participants.find(
				(chatter) => chatter.id != userDetails?.id
			);
			if (receiver) {
				setReceiver(receiver);
			}
		}
	}, [setReceiver, chat, userDetails]);
	return (
		<>
			<Stack direction="row" gap={1}>
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
		</>
	);
};
