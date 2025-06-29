import {
	createContext,
	useEffect,
	useReducer,
	type Dispatch,
	type FC,
	type ReactNode,
} from "react";
import {
	chatterDetailsReducer,
	chatterReducerInitialState,
} from "../reducers/chatterReducers";
import type {
	ChatterReducerAction,
	ChatterReducerInitialType,
} from "../types/ChatterReducerTypes";
import { Outlet, Route } from "react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import chatterServices from "../services/chatter.services";
import { useTokenContext } from "../hooks/contextHooks";

interface UserContextProviderProps {
	children: ReactNode;
}

export type UserContextType = [
	ChatterReducerInitialType,
	Dispatch<ChatterReducerAction>
];

const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserContextProvider: FC = () => {
	const [token, dispatchToken] = useTokenContext();
	const [userDetails, dispatchUserDetails] = useReducer(
		chatterDetailsReducer,
		chatterReducerInitialState
	);
	const me = useQuery({
		queryKey: ["me"],
		queryFn: chatterServices.me,
		enabled: !!token.token,
	});
	useEffect(() => {
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
