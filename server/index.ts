import { PORT } from "./utils/config";
import app from "./app";
import { logger } from "./utils/helpers";

const server = app.listen(PORT, () => {
	logger.log(`Server running at ${PORT}`);
});

export default server;
