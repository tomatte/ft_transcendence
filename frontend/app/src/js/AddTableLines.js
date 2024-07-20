const AddTableLines = (currentPageData) => {
	const startIndex = (currentPageData['currentPage'] - 1) * currentPageData['itemsPerPage'];
	const endIndex = startIndex + currentPageData['itemsPerPage'];
	const currentPageItems = currentPageData['rank_list'].slice(startIndex, endIndex);
	const generateTableRows = currentPageData['createLines'];


	let tableRowsHTML = generateTableRows(currentPageItems, startIndex);
	const tableBody = document.querySelector('.page-content__container__content tbody');
	tableBody.innerHTML = tableRowsHTML;
};

export default AddTableLines
