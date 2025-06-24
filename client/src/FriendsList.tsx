import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import chatterServices from "./services/chatter.services";

export const FriendsList: FC = () => {
	const { isError, isPending, data, error } = useQuery({
		queryKey: ["friendsList"],
		queryFn: chatterServices.getFriends,
	});
	if (isPending) {
		return <>Loading...</>;
	}
	if (isError) {
		console.log(error);
		return <>An Error Occured. See console for details</>;
	}
	return <>{`${JSON.stringify(data, undefined, 2)}`}</>;
};
