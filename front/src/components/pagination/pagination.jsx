import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../redux/slices/products';
import { Button } from '..';
import styled from 'styled-components';

const PaginationContainer = ({ className, currentPage, lastPage }) => {
	const dispatch = useDispatch();

	return (
		<div className={className}>
			<Button
				width="100px"
				height="35px"
				color="#525864"
				fontWeight="400"
				radius="20px"
				disabled={currentPage === 1}
				onClick={() => dispatch(setCurrentPage(1))}
			>
				В начало
			</Button>
			<Button
				width="130px"
				height="35px"
				color="#525864"
				fontWeight="400"
				radius="20px"
				disabled={currentPage === 1}
				onClick={() => dispatch(setCurrentPage(currentPage - 1))}
			>
				Предыдущая
			</Button>
			<div className="current-page">
				{currentPage} из {lastPage}
			</div>
			<Button
				width="130px"
				height="35px"
				color="#525864"
				fontWeight="400"
				radius="20px"
				disabled={currentPage === lastPage}
				onClick={() => dispatch(setCurrentPage(currentPage + 1))}
			>
				Следующая
			</Button>
			<Button
				width="100px"
				height="35px"
				color="#525864"
				fontWeight="400"
				radius="20px"
				disabled={currentPage === lastPage}
				onClick={() => dispatch(setCurrentPage(lastPage))}
			>
				В конец
			</Button>
		</div>
	);
};

export const Pagination = styled(PaginationContainer)`
	display: flex;
	justify-content: center;
	margin: 0 0 20px;
	padding: 0 15px;
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	max-width: 700px;

	button {
		margin: 0 5px;
		flex-shrink: 0;
	}

	.current-page {
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 35px;
		margin: 0 5px;
		font-size: 18px;
		font-weight: 500;
		line-height: 1;
		text-align: center;
		border: 1px solid #000;
		border-radius: 10px;
		min-width: 70px;
	}
`;
