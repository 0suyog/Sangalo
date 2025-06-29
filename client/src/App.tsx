import { useEffect, type FC } from "react";
import { Login } from "./Login";
import { Route, Routes } from "react-router";
import { Register } from "./Register";
import { FriendsList } from "./FriendsList";
import { setToken } from "./apiData";
import { SearchSideBar } from "./components/SearchSideBar";
import { UserContextProvider } from "./components/UserContextProvider";
import { useTokenContext } from "./hooks/contextHooks";
import { MessagingArea } from "./components/MessagingArea";

const App: FC = () => {
	const [token, dispatchToken] = useTokenContext();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
			dispatchToken({ type: "SET", payload: { token: token } });
		}
	}, []);
	return (
		<Routes>
			<Route path="/register" element={<Register />} />
			<Route path="/login" element={<Login />} />
			<Route element={<UserContextProvider />}>
				<Route path="/" element={<FriendsList />} />
				<Route path="/fr" element={<FriendsList />} />
				<Route path="/search" element={<SearchSideBar />} />
				<Route path="/messaging" element={<MessagingArea />} />
			</Route>
		</Routes>
	);
};

export default App;
