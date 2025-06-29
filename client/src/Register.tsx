import { useMutation } from "@tanstack/react-query";
import chatterServices from "./services/chatter.services";
import { Form } from "./form";
import { useNavigate } from "react-router";

export const Register = () => {
	const navigate = useNavigate();
	const registerMutation = useMutation({
		mutationFn: chatterServices.registerChatter,
		onSuccess: () => {
			navigate("/login");
		},
	});

	const register = (
		username: string,
		password: string,
		displayName: string
	) => {
		registerMutation.mutate({ username, password, displayName });
	};
	return (
		<>
			<Form submitFunction={register} type="register" buttonText="register" />
		</>
	);
};
