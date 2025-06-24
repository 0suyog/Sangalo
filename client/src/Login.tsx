import { type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import chatterServices from "./services/chatter.services";
import { Form } from "./form";
import { setToken } from "./apiData";

// import { useForm } from "react-hook-form";

export const Login: FC = () => {
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
			chatterServices.getFriends();
		},
	});

	const login = (username: string, password: string) => {
		loginMutation.mutate({ username, password });
	};

	return (
		<>
			<Form submitFunction={login} buttonText="Login" type="login" />
		</>
	);
};
