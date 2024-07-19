import CreatePaginationForTables from './CreatePaginationForTables.js';

const renderTableLines = (currentPageData) => {
	const start = (currentPageData['currentPage'] - 1) * currentPageData['itemsPerPage'];
	const end = start + currentPageData['itemsPerPage'];
	const rakingCurrentPagination = currentPageData['rank_list'].slice(start, end);
	const createTableLines = currentPageData['createLines'];


	let tableLines = createTableLines(rakingCurrentPagination, start);
	const tableBody = document.querySelector('.page-content__container__content tbody');
	tableBody.innerHTML = tableLines;
	CreatePaginationForTables(currentPageData);
};

export default renderTableLines
