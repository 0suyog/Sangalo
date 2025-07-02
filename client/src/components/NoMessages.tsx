import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FC } from "react";

export const NoMessages: FC = () => {
	return (
		<Stack flexGrow={1} height={"100%"} justifyContent={"space-around"}>
			<Typography variant="h4" textAlign={"center"}>
				Send a Message to Start a Conversation
			</Typography>
		</Stack>
	);
};
