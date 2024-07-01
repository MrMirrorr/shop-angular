import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverErrorCatcher } from '../utils/server-error-catcher';

export const fetchFavorites = createAsyncThunk(
	'products/fetchFavorites',
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/api/favorites`, { timeout: 3000 });

			const {
				data: { data },
			} = res;

			return { data };
		} catch (err) {
			return serverErrorCatcher(err, 'error fetchFavorites', rejectWithValue);
		}
	},
);
