import { useQuery } from "@tanstack/react-query";
import { useEffect, type FC } from "react";
import chatterServices from "./services/chatter.services";
import { UserBar } from "./components/userBars/UserBar";
import { useTokenContext, useUserContext } from "./hooks/contextHooks";

export const FriendsList: FC = () => {
	const [token, dispatchToken] = useTokenContext();
	useEffect(() => {
		dispatchToken({ type: "CHECK" });
	}, []);
	const { isError, isPending, data, error } = useQuery({
		queryKey: ["friendsList"],
		queryFn: chatterServices.getFriends,
		enabled: !!token.token,
	});
	const me = useQuery({
		queryKey: ["me"],
		queryFn: chatterServices.me,
		enabled: !!token.token,
	});
	useEffect(() => {
		if (!(me.isError || me.isPending)) {
			dispatchUserDetails({ type: "ADD", payload: me.data });
		}
	}, [me.data]);
	const [userDetails, dispatchUserDetails] = useUserContext();
	if (isPending) {
		return <>Loading...</>;
	}
	if (isError) {
		console.log(error);
		return <>An Error Occured. See console for details</>;
	}
	return (
		<>
			{data.map((chatter) => {
				return <UserBar chatter={chatter} key={chatter.id} />;
			})}
		</>
	);
};
