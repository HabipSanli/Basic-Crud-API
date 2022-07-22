import express from "express";
import {
	checkUserExistance,
	register,
	login,
	logout,
	updateCredentials,
	deleteUser,
	checkUserNotRegistered,
	getAllUserData,
	authenticate,
	authenticateByRedis,
	logoutbyRedis,
	sendMessage,
} from "../middlewares/middlewares";
const userRouter = express.Router();


userRouter.route("/")
.get((req, res) => {
	const userId = req.header("1");
	res.sendStatus(200);
});

userRouter.route("/register")
.post(checkUserNotRegistered, register, (req, res) => {
	// Check if user exists by middleware +
	// Create user and insert into db +
	res.send("false");
});

userRouter.route("/login")
.post(checkUserExistance, login, (req, res) => {
	//console.log(res.locals.id.id);
	console.log(req.body.name);
	res.json({
		auth: true,
	});
});

userRouter.route("/logout")
.post(logoutbyRedis, (req, res) => {
	console.log("Log Out.");
});

userRouter.route("/credentials")
.put(authenticateByRedis, updateCredentials, (req, res) => {
	console.log("Credentials Changed");
	res.send("OK");
});

userRouter.route("/")
.delete(authenticateByRedis, deleteUser, (req, res) => {   
	console.log("User removed");
	res.send("OK");
});

userRouter.route("/getUsers")
.get(getAllUserData);

userRouter.route("/sendMsg")
.post(sendMessage,(req,res)=>{
	res.send('Message sent!');
})
export default userRouter;
