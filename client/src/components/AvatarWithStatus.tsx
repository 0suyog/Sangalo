import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import online from "../assets/online.png";
import offline from "../assets/offline.png";
import dnd from "../assets/dnd.png";
import idle from "../assets/idle.png";
import type { FC } from "react";
import type { ChatterStatusType } from "../types/ApiChatterTypes";
interface propTypes {
	username: string;
	image: string;
	status: ChatterStatusType;
}
export const AvatarWithStatus: FC<propTypes> = ({
	username,
	image,
	status,
}) => {
	const statusMap: Record<ChatterStatusType, string> = {
		offline: offline,
		dnd: dnd,
		idle: idle,
		online: online,
	};
	return (
		<Badge
			overlap="circular"
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			badgeContent={
				<img
					src={statusMap[status]}
					width={10}
					height={10}
					style={{ border: "1px solid gray", borderRadius: 100 }}
				/>
			}
		>
			<Avatar
				src={image}
				alt={`${username}'s avatar`}
				sx={{
					border: "2px solid gray",
				}}
			/>
		</Badge>
	);
};
