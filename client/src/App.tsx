import { useEffect, type FC } from "react";
import { Login } from "./Login";
import { Route, Routes } from "react-router";
import { Register } from "./Register";
import { FriendsList } from "./FriendsList";
import { SearchSideBar } from "./components/SearchSideBar";
import { UserContextProvider } from "./components/UserContextProvider";
import { MessagingArea } from "./components/MessagingArea";

const App: FC = () => {
	useEffect(() => {
		console.log("App got rerenderd");
	});
	return (
		<Routes>
			<Route path="/register" element={<Register />} />
			<Route path="/login" element={<Login />} />
			<Route element={<UserContextProvider />}>
				<Route path="/" element={<FriendsList />} />
				<Route path="/fr" element={<FriendsList />} />
				<Route path="/search" element={<SearchSideBar />} />
				<Route path="/messaging">
					<Route index element={<MessagingArea />} />
					<Route path=":id" element={<MessagingArea />} />
					<Route path="new/:id" element={<MessagingArea />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default App;
