import pool from '../db/pool';
import { QueryResult } from 'pg';
import { CheckUser, User, LogUser, userPassword, userCredentials, UserFullForm } from "../models/user";


export async function getAllUsers(): Promise<QueryResult<any>> {
	try {
		const result = await pool.query("SELECT name, surname, email, password, user_id FROM public.users;");
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function registerUser(user: User): Promise<boolean> {
	try {
		await pool.query("INSERT INTO public.users(name,surname,email,password) VALUES($1,$2,$3,$4)", [
			user.name,
			user.surname,
			user.email,
			user.password,
		]);
	} catch (error) {
		console.error(error);
		throw error;
	}
	return true;
}

export async function getUserByEmail(email: string): Promise<CheckUser | null> {
	try {
		const { rows, rowCount } = await pool.query<{
			name: string;
			surname: string;
		}>("SELECT name, surname FROM public.users WHERE email = $1", [email]);
		if (rowCount === 0) {
			return null;
		} else {
			return rows[0];
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getUserDataByEmail(email: string): Promise<UserFullForm | boolean> {
	try {
		const { rows, rowCount } = await pool.query<{
			name: string;
			surname: string;
			email: string;
			password: string;
			user_id: number;
		}>("SELECT name, surname, email, password, user_id FROM users WHERE email = $1", [email]);
		if (rowCount === 0) {
			return false;
		} else {
			let userModel = {
				name: rows[0].name,
				surname: rows[0].surname,
				email: rows[0].email,
				password: rows[0].password,
				user_id: rows[0].user_id,
			};
			console.log(userModel);
			return userModel;
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getPasswordByEmail(email: string): Promise<userPassword | null> {
	try {
		const { rows, rowCount } = await pool.query<{ name: string; password: string }>("SELECT name,password FROM users WHERE email = $1", [email]);
		if (rowCount === 0) {
			return null;
		} else {
			let foundUser = {
				name: rows[0].name,
				password: rows[0].password,
			};
			return foundUser;
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateNameInfo(user: userCredentials): Promise<boolean> {
	try {
		pool.query("UPDATE users SET name = $1, surname = $2 WHERE email = $3", [user.name, user.surname, user.email]);
	} catch (error) {
		console.error(error);
		throw error;
	}
	return true;
}

export async function removeUser(email: string): Promise<boolean> {
	try {
		pool.query("DELETE FROM users WHERE email = $1", [email]);
	} catch (error) {
		console.error(error);
		throw error;
	}
	return true;
}