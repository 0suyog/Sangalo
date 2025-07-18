import { useEffect, type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import chatterServices from "./services/chatter.services";
import { Form } from "./form";
import { setToken, TOKEN } from "./apiData";
import { useTokenContext } from "./hooks/contextHooks";
import { useNavigate } from "react-router";

export const Login: FC = () => {
	const [token, dispatchToken] = useTokenContext();
	const navigate = useNavigate();
	const loginMutation = useMutation({
		mutationKey: ["userToken"],
		mutationFn: chatterServices.loginChatter,
		onSuccess: (data) => {
			if (!data?.token) {
				console.log("Something went wrong");
				return;
			}
			localStorage.setItem("token", data.token);
			setToken(data.token);
			navigate("/messaging");
			dispatchToken({ type: "SET", payload: data });
			chatterServices.getFriends();
		},
	});

	useEffect(() => {
		console.log("login is being reached ");
		console.log(TOKEN.length);
		if (token.token) {
			navigate("/messaging");
		}
	}, []);

	const login = (username: string, password: string) => {
		loginMutation.mutate({ username, password });
	};

	return (
		<>
			<Form submitFunction={login} buttonText="Login" type="login" />
		</>
	);
};
