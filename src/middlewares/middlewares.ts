import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const cfg = require("../../config.json");
import {
	getPasswordByEmail,
	getUserByEmail,
	registerUser,
	getUserDataByEmail,
	updateNameInfo,
	removeUser,
	getAllUsers,
} from "../controller/postgrescontroller";
let blacklist: string[] = [];

//TRUST 

/////////////////////////JWT////////////////////////////////////
/*
////OLD AUTHENTICATION/////////
export async function checkAuth(req: Request, res: Response, next: NextFunction) {
	if (userdata.email != "" && userdata.name != "" && userdata.surname != "") {
		next();
	} else {
		res.status(401).json("User not authenticated.");
	}
}
*/
let ats = cfg.jwt.access_token_secret;

function generateToken(emailInfo: string) {
	let user_info = {
		email: emailInfo,
	};

	return jwt.sign(user_info, ats);
}

function verifyToken(token: string) {
	if (blacklist.includes(token)) {
		console.log("expired!");
		return null;
	} else {
		try {
			const tokenData = jwt.verify(token, ats);
			return tokenData as { email: string };
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization;
	if (header && header.startsWith("Bearer")) {
		const token = header.slice("Bearer ".length);
		try {
			const tokenData = verifyToken(token);
			if (tokenData === null) {
				res.status(401).json("Invalid token!!");
			} else {
				req.body.tokenData = tokenData;
				next();
			}
		} catch (error) {
			console.log(error);
			res.status(500).json("Something failed!");
		}
	} else {
		res.status(500).json("Token is not in valid form!");
	}
}

export async function logout(req: Request, res: Response) {
	let header = req.headers.authorization;
	if (header && header.startsWith("Bearer")) {
		let token = header.slice("Bearer ".length);
		if (blacklist.includes(token)) {
			res.status(403).json("Token isInvalid!");
		} else {
			blacklist.push(token);
			console.log(token);
			res.status(200).json("Logged Out!");
		}
	} else {
		res.status(500).json("Token is not in valid form!");
	}
}

////////////////////////////////////////////////////////////////

export async function checkUserExistance(req: Request, res: Response, next: NextFunction) {
	const emailQuery = req.body.email;
	if (typeof emailQuery === "string") {
		const user = await getUserByEmail(emailQuery);
		user ? next() : res.status(404).json("User Not Found!");
	} else {
		res.status(400).send("Invalid Credential : Wrong Data Format!");
	}
}

export async function checkUserNotRegistered(req: Request, res: Response, next: NextFunction) {
	const emailQuery = req.body.email;
	if (typeof emailQuery === "string") {
		const user = await getUserByEmail(emailQuery);
		user ? res.status(403).send("User already exists") : next();
	} else {
		res.status(400).send("Wrong email format");
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	const emailQuery = req.body.email;
	const passwordQuery = req.body.password;

	if (typeof emailQuery !== "string" || typeof passwordQuery !== "string") {
		res.status(400).send("Invalid Credential : Wrong Data Format!");
		return;
	}

	const usr = {
		email: emailQuery,
		password: crypto.createHash("sha256").update(passwordQuery).update(emailQuery).digest("hex"),
	};
	const cpass = await getPasswordByEmail(usr.email);
	if (!cpass) {
		res.status(500).send("Database operation failed!");
		return;
	}
	if (usr.password !== cpass.password) {
		res.status(401).send("Wrong Password!");
		return;
	}

	const tokenUser = await getUserDataByEmail(usr.email);
	if (tokenUser && typeof tokenUser != "boolean") {
		res.send(generateToken(tokenUser.email));
	} else {
		res.status(500).send("Database operation failed(unexpected)!");
	}
}

export async function register(req: Request, res: Response, next: NextFunction) {
	const nameQuery = req.body.name;
	const surnameQuery = req.body.surname;
	const emailQuery = req.body.email;
	const passwordQuery = req.body.password;

	if (typeof nameQuery === "string" && typeof surnameQuery === "string" && typeof emailQuery === "string" && typeof passwordQuery === "string") {
		const user = {
			name: nameQuery,
			surname: surnameQuery,
			email: emailQuery,
			password: crypto.createHash("sha256").update(passwordQuery).update(emailQuery).digest("hex"),
		};
		const r = await registerUser(user);
		if (r === true) {
			next();
		} else {
			res.sendStatus(500);
		}
	} else {
		res.sendStatus(400);
	}
}

export async function updateCredentials(req: Request, res: Response, next: NextFunction) {
	const emailQuery = req.body.tokenData.email;
	if (typeof emailQuery === "string") {
		const user = {
			name: req.body.name,
			surname: req.body.surname,
			email: emailQuery,
		};
		if (user.name != "" && user.name != null && user.surname != "" && user.surname != null) {
			if (await updateNameInfo(user)) {
				res.sendStatus(200);
			} else {
				res.status(500).send("Database operation failed");
			}
		} else {
			res.status(400).send("Invalid Credential : Cannot be Empty!");
		}
	} else {
		res.status(400).send("Invalid Credential : Wrong Data Format!");
	}
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
	const emailQuery = req.body.tokenData.email;
	if (typeof emailQuery === "string") {
		if (await removeUser(emailQuery)) {
			next();
		} else {
			res.status(500).send("Database operation failed");
		}
	} else {
		res.status(400).send("Request form is invalid");
	}
}

export async function getAllUserData(req: Request, res: Response) {
	const result = await getAllUsers();
	if (result) {
		result.rows.forEach(function (val) {
			console.log(val);
		});
		res.sendStatus(200);
	} else {
		res.status(500).send("Database operation failed");
	}
}
