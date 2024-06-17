import { CartModel, CartItemModel } from '../models/index.js';
import mapCartItem from '../helpers/map-cart-item.js';
import serverErrorHandler from '../utils/server-error-handler.js';

// create cart item
export const create = async (req, res) => {
	try {
		const userId = req.user.id;
		const { productId, quantity } = req.body;

		let cart = await CartModel.findOne({ userId });

		if (!cart) {
			cart = await CartModel.create({ userId });
		}

		let cartItem = await CartItemModel.findOne({ cartId: cart._id, productId });

		if (cartItem) {
			if (cartItem.quantity === 1 && quantity === -1) {
				return res.status(400).send({
					error: 'Количество товара в корзине не может быть меньше 1',
				});
			}
			cartItem.quantity += quantity;
			await cartItem.save();
		} else {
			cartItem = await CartItemModel.create({
				cartId: cart._id,
				productId,
				quantity,
			});
			cart.items.push(cartItem._id);
			await cart.save();
		}

		await cartItem.populate('productId');

		res.send({
			error: null,
			data: { cartItem: mapCartItem(cartItem) },
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось добавить товар в корзину');
	}
};

// delete cart item

export const remove = async (req, res) => {
	try {
		const userId = req.user.id;
		const itemId = req.params.itemId;

		const cart = await CartModel.findOne({ userId });

		await CartItemModel.deleteOne({ _id: itemId });
		await CartModel.findByIdAndUpdate(cart._id, {
			$pull: { items: itemId },
		});

		res.send({
			error: null,
			success: true,
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось удалить товар из корзины');
	}
};

// delete many

export const removeMany = async (req, res) => {
	try {
		const cartId = req.params.cartId;

		await CartItemModel.deleteMany({ cartId });

		await CartModel.findByIdAndUpdate(cartId, { items: [] });

		res.send({
			error: null,
			success: true,
		});
	} catch (err) {
		serverErrorHandler(res, err, 'Не удалось удалить товары пользователя из корзины');
	}
};
