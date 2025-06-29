import {
	createContext,
	useReducer,
	type Dispatch,
	type FC,
	type ReactNode,
} from "react";
import type { TokenType } from "../types/ApiChatterTypes";
import { tokenReducer } from "../reducers/tokenReducer";
import type { TokenActionType } from "../types/TokenReducerTypes";
const TokenContext = createContext<
	[TokenType, Dispatch<TokenActionType>] | undefined
>(undefined);
export const TokenContextProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [token, dispatchToken] = useReducer(tokenReducer, { token: "" });
	return (
		<TokenContext.Provider value={[token, dispatchToken]}>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenContext;
