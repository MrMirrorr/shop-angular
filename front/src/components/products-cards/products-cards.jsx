import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/actions';
import {
	selectCategories,
	selectProducts,
	selectSearch,
	selectSortDirection,
} from '../../redux/selectors';
import { generateLoader } from '../../utils';
import { ProductsCardsLoader } from '../loaders';
import { PAGINATION_LIMIT } from '../../constants';
import { AlertError, Pagination, ProductCard } from '../../components';
import styled from 'styled-components';

const ProductsCardsContainer = ({ className }) => {
	const dispatch = useDispatch();
	const { products, currentPage, lastPage, isLoading, error } =
		useSelector(selectProducts);
	const { value: search, shouldSearch } = useSelector(selectSearch);
	const { active: category } = useSelector(selectCategories);
	const sort = useSelector(selectSortDirection);

	useEffect(() => {
		const params = {
			search,
			limit: PAGINATION_LIMIT,
			page: currentPage,
			category,
			sort,
		};

		dispatch(fetchProducts(params));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, currentPage, shouldSearch, category, sort]);

	return (
		<>
			<div className={className}>
				{isLoading ? (
					generateLoader(9, <ProductsCardsLoader />)
				) : error ? (
					<AlertError className="error">{error}</AlertError>
				) : (
					products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))
				)}
			</div>
			{lastPage > 1 && products.length > 0 && (
				<Pagination currentPage={currentPage} lastPage={lastPage} />
			)}
		</>
	);
};

export const ProductsCards = styled(ProductsCardsContainer)`
	flex-grow: 1;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
`;
