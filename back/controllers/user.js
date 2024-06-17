import bcrypt from 'bcrypt';
import {
	UserModel,
	CartModel,
	CartItemModel,
	OrderModel,
	CommentModel,
} from '../models/index.js';
import mapUser from '../helpers/map-user.js';
import { generateToken } from '../helpers/token.js';
import { ROLE } from '../constants/roles.js';
import serverErrorHandler from '../utils/server-error-handler.js';

// register
export const register = async (req, res) => {
	try {
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		const user = await UserModel.create({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			password: passwordHash,
		});

		const userId = user._id;

		await CartModel.create({ userId });

		const token = generateToken({
			id: userId,
		});

		res.cookie('token', token, { httpOnly: true }).send({
			error: null,
			data: mapUser(user),
		});
	} catch (err) {
		if (err.code === 11000) {
			console.log(err);
			return res.status(500).send({
				error: 'Этот email уже зарегистрирован',
			});
		}
		serverErrorHandler(res, err, 'Не удалось зарегистрироваться');
	}
};

// login
export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).send({
				error: 'Пользователь не найден',
			});
		}

		const isValidPass = await bcrypt.compare(req.body.password, user.password);

		if (!isValidPass) {
			return res.status(400).send({
				error: 'Неверный логин или пароль',
			});
		}

		const token = generateToken({
			id: user.id,
		});

		res.cookie('token', token, { httpOnly: true }).send({
			error: null,
			data: mapUser(user),
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось авторизоваться');
	}
};

// getMe
export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.user.id);

		if (!user) {
			return res.status(404).send({
				error: 'Пользователь не найден',
			});
		}

		res.send({
			error: null,
			data: mapUser(user),
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Нет доступа');
	}
};

// logout
export const logout = (_, res) => {
	try {
		res.cookie('token', '', { httpOnly: true }).send({
			error: null,
			success: true,
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось выйти');
	}
};

// get all users
export const getAllUsers = async (_, res) => {
	try {
		const users = await UserModel.find();

		res.send({
			error: null,
			data: users.map(mapUser),
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось получить пользователей');
	}
};

// get all roles
export const getAllRoles = async (_, res) => {
	const roles = [
		{ id: ROLE.ADMIN, name: 'Администратор' },
		{ id: ROLE.USER, name: 'Пользователь' },
	];

	res.send({
		data: roles,
	});
};

// delete
export const remove = async (req, res) => {
	try {
		const userId = req.params.id;

		const cart = await CartModel.findOne({ userId });

		await FavoriteModel.deleteMany({ userId });

		await CartItemModel.deleteMany({ cartId: cart._id });

		await CartModel.deleteOne({ _id: cart._id });

		await OrderModel.deleteMany({ user: userId });

		await CommentModel.deleteMany({ author: userId });

		await UserModel.deleteOne({ _id: userId });

		res.send({
			error: null,
			success: true,
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось удалить пользователя');
	}
};

// edit (roles)
export const updateRoleId = async (req, res) => {
	try {
		const userId = req.params.id;
		const newRoleId = req.body.roleId;

		const newUser = await UserModel.findByIdAndUpdate(
			userId,
			{ roleId: newRoleId },
			{
				returnDocument: 'after',
			},
		);

		res.send({
			error: null,
			data: mapUser(newUser),
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось изменить роль пользователя');
	}
};

// edit (user)
export const update = async (req, res) => {
	try {
		const userId = req.user.id;
		const newUserData = {
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
		};

		const newUser = await UserModel.findByIdAndUpdate(userId, newUserData, {
			returnDocument: 'after',
		});

		res.send({
			error: null,
			data: mapUser(newUser),
		});
	} catch (err) {
		if (err.code === 11000) {
			console.log(err);
			return res.status(500).send({
				error: 'Этот email уже занят',
			});
		}
		serverErrorHandler(res, err, 'Не удалось изменить данные пользователя');
	}
};
