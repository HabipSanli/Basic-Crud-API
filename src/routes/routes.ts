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
} from "../middlewares/middlewares";
const userRouter = express.Router();
import crypto from "crypto";

var user = {
	user_id: 0,
	name: "",
	surname: "",
	email: "",
	password: "",
	auth: false,
};

userRouter.route("/").get((req, res) => {
	const userId = req.header("1");
	res.sendStatus(200);
});

userRouter.route("/register").post(checkUserNotRegistered, register, (req, res) => {
	// Check if user exists by middleware +
	// Create user and insert into db +
	res.send("false");
});

userRouter.route("/login").post(checkUserExistance, login, (req, res) => {
	user.auth = true;
	//console.log(res.locals.id.id);
	console.log(req.body.name);
	res.json({
		auth: true,
	});
});

userRouter.route("/logout").post(logout, (req, res) => {
	user.auth = false;
	user.email = "";
	user.password = "";
	user.name = "";
	user.surname = "";
	user.user_id = 0;
	console.log("Log Out.");
});

userRouter.route("/credentials").put(authenticate, updateCredentials, (req, res) => {
	console.log("Credentials Changed");
	res.send("OK");
});

userRouter.route("/").delete(authenticate, deleteUser, (req, res) => {   
	user.auth = false;
	console.log("User removed");
	res.send("OK");
});

userRouter.route("/getUsers").get(getAllUserData);

export default userRouter;
