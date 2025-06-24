import { useEffect, type FC } from "react";
import { Login } from "./Login";
import { Route, Routes } from "react-router";
import { Register } from "./Register";
import { FriendsList } from "./FriendsList";
import { setToken } from "./apiData";

const App: FC = () => {
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
		}
	});
	return (
		<Routes>
			<Route path="/" element={<FriendsList />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
		</Routes>
	);
};

export default App;
