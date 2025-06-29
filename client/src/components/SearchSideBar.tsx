import { useMutation } from "@tanstack/react-query";
import chatterServices from "../services/chatter.services";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import type { ReceivedChatterType } from "../types/ApiChatterTypes";
import Divider from "@mui/material/Divider";
import { UserBar } from "./userBars/UserBar";

export const SearchSideBar = () => {
	const searchMutaion = useMutation({
		mutationFn: chatterServices.searchChatter,
		mutationKey: ["searchResult"],
		onSuccess: (data) => {
			setSearchResults(data.chatters);
		},
	});
	const [searchResults, setSearchResults] = useState<ReceivedChatterType[]>([]);
	const [search, setSearch] = useState("");
	return (
		<Stack>
			<Input
				placeholder="Search..."
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						searchMutaion.mutate({ displayName: search });
					}
				}}
				onChange={(e) => setSearch(e.target.value)}
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon />
					</InputAdornment>
				}
			/>
			<Divider />
			<Stack gap={1}>
				{searchResults.map((chatter) => {
					return <UserBar chatter={chatter} key={chatter.username} />;
				})}
			</Stack>
		</Stack>
	);
};
