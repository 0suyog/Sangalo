import {
	createContext,
	useEffect,
	useReducer,
	type Dispatch,
	type FC,
} from "react";
import {
	chatterDetailsReducer,
	chatterReducerInitialState,
} from "../reducers/chatterReducers";
import type {
	ChatterReducerAction,
	ChatterReducerInitialType,
} from "../types/ChatterReducerTypes";
import { Outlet, useNavigate } from "react-router";
import {  useQuery } from "@tanstack/react-query";
import chatterServices from "../services/chatter.services";
import { useTokenContext } from "../hooks/contextHooks";



export type UserContextType = [
	ChatterReducerInitialType,
	Dispatch<ChatterReducerAction>
];

const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserContextProvider: FC = () => {
	const navigate = useNavigate();
	const [token, dispatchToken] = useTokenContext();
	const [userDetails, dispatchUserDetails] = useReducer(
		chatterDetailsReducer,
		chatterReducerInitialState
	);
	const me = useQuery({
		queryKey: ["me"],
		queryFn: chatterServices.me,
		enabled: !!token.token,
		retry: 1,
	});
	useEffect(() => {
		if (!token.token) {
			console.log("There is no token");
			navigate("/login");
		}
		if (me.isError) {
			localStorage.removeItem("token");
			dispatchToken({ type: "REMOVE" });
			navigate("/login");
		}
		if (!me.isError && !me.isPending) {
			dispatchUserDetails({ type: "ADD", payload: me.data });
		}
	}, [me.isError, me.isPending, me.data, token.token]);
	return (
		<UserContext.Provider value={[userDetails, dispatchUserDetails]}>
			<Outlet />
		</UserContext.Provider>
	);
};

export default UserContext;
