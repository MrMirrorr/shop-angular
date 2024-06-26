import { validationResult } from 'express-validator';

export default async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors.array()[0]);
	}

	next();
};
