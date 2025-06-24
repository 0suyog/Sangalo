import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState, type SyntheticEvent } from "react";
import CrossedEye from "@mui/icons-material/VisibilityOff";
import Eye from "@mui/icons-material/Visibility";
import LoginRounded from "@mui/icons-material/LoginRounded";
interface PropTypes {
	submitFunction:
		| ((username: string, password: string, displayName: string) => void)
		| ((username: string, password: string) => void);
	buttonText: string;
	type: "login" | "register";
}
export const Form = ({ submitFunction, buttonText, type }: PropTypes) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [showHelperText, setShowHelperText] = useState(false);
	const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setShowHelperText(true);
		if (type === "login") {
			(submitFunction as (username: string, password: string) => void)(
				username,
				password
			);
		}
		if (type === "register") {
			submitFunction(username, password, displayName);
		}
	};
	return (
		<Box
			height={"100vh"}
			display={"flex"}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Card raised>
				<Typography variant="h3" align="center" marginTop={3}>
					<strong>SANGALO</strong>
				</Typography>

				<form onSubmit={handleSubmit}>
					<Stack gap={2} margin={5}>
						<TextField
							variant="outlined"
							size="medium"
							error={showHelperText && !username}
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							helperText={
								showHelperText && !username ? "*Username is Required" : ""
							}
							slotProps={{
								formHelperText: {
									color: "error",
								},
							}}
						/>
						{type === "register" && (
							<TextField
								variant="outlined"
								size="medium"
								error={showHelperText && !displayName}
								placeholder="DisplayName"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								required
								helperText={
									showHelperText && !displayName
										? "*Displayname is Required"
										: ""
								}
								slotProps={{
									formHelperText: {
										color: "error",
									},
								}}
							/>
						)}
						<TextField
							variant="outlined"
							size="medium"
							error={showHelperText && !password}
							type={showPassword ? "text" : "password"}
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							helperText={
								showHelperText && !password ? "*Password is Required" : ""
							}
							slotProps={{
								formHelperText: {
									color: "error",
								},
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <Eye /> : <CrossedEye />}
											</IconButton>
										</InputAdornment>
									),
								},
							}}
						/>
						<Button variant="outlined" type="submit">
							{buttonText}
							<LoginRounded />
						</Button>
					</Stack>
				</form>
			</Card>
		</Box>
	);
};
