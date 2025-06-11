import createApp from "./app";
import { PORT } from "./utils/config";
import { logger } from "./utils/helpers";


(async () => {
	let { app } = await createApp()
	app.listen(PORT, () => {
		logger.log(`Server has started; http://localhost:${PORT}`)
	})
})()
