import { useMutation } from "@tanstack/react-query";
import chatterServices from "./services/chatter.services";
import { Form } from "./form";

export const Register = () => {
	const registerMutation = useMutation({
		mutationFn: chatterServices.registerChatter,
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
