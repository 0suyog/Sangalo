import { PORT } from "./utils/config";
import { connectDb } from "./dbhandler";
import app from "./app";

connectDb();

const server = app.listen(PORT, () => {
	console.log(`Server running at ${PORT}`);
});

export default server;
