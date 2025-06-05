import mongoose from "mongoose";

const globalTearDown = async () => {
	await mongoose.disconnect();
	console.log("Test Db Disconnected");
};

export { globalTearDown };
