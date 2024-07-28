import renderTableLines from '../pages/RenderTableLines.js';

const AddPaginationTables = (currentPageData) => {
	const { rank_list, currentPage, itemsPerPage } = currentPageData;
	const totalItems = rank_list.length;

	if (totalItems === 0) {
        // Handle no items case
        addPaginationOnTable('');
        return;
    }

	const totalPages = Math.ceil(totalItems / itemsPerPage);
	let paginationHtml = generatePreviosAndLastButton(currentPage);
	paginationHtml += generateNumbersPagination(totalPages, currentPage);
	paginationHtml += generateNextAndLastButton(totalPages, currentPage);
	addPaginationOnTable(paginationHtml);
	addPaginationEventListeners(currentPageData);
};


const generateNumbersPagination = (totalPages, currentPage) => {
	let pagination = '';

	for (let index = 1; index <= totalPages; index++) {
		pagination += `
			<li class="pagination__item-number ${currentPage === index ? 'pagination__item-number--active' : ''}">
				<a href="#" data-page="${index}">${index}</a>
			</li>
		`
	}
	return pagination;
}


const generatePreviosAndLastButton = (currentPage) => {
	const isDisabledClass = currentPage === 1 ? 'pagination__control--disabled' : '';

	return `
		<li class="pagination__control ${isDisabledClass}">
			<a href="#" data-page="1">
				<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
				<span class="pagination__control__text">First</span>
			</a>
		</li>
		<li class="pagination__control ${isDisabledClass}">
			<a href="#" data-page="${currentPage - 1}">
				<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_arrow_left</span>
				<span class="pagination__control__text">Previous</span>
			</a>
		</li>`
}


const generateNextAndLastButton = (totalPages, currentPage) => {
	const isDisabledClass = currentPage === totalPages ? 'pagination__control--disabled' : '';
	return `
		<li class="pagination__control ${isDisabledClass}">
			<a href="#" data-page="${currentPage + 1}">
				<span class="material-icons-round pagination__control__icon-right icon--medium">keyboard_arrow_right</span>
				<span class="pagination__control__text">Next</span>
			</a>
		</li>
		<li class="pagination__control ${isDisabledClass}">
			<a href="#" data-page="${totalPages}">
				<span class="material-icons-round pagination__control__icon-right icon--medium">keyboard_double_arrow_right</span>
				<span class="pagination__control__text">Last</span>
			</a>
		</li>`
}


const addPaginationOnTable = (paginationHtml) => {
	document.querySelector('.pagination__list').innerHTML = paginationHtml;
}


const addPaginationEventListeners = (currentPageData) => {
	document.querySelectorAll('.pagination__control a, .pagination__item-number a').forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			const page = parseInt(event.target.getAttribute('data-page'), 10);
			if (!isNaN(page)) {
				currentPageData['currentPage'] = page;
				renderTableLines(currentPageData);
			}
		});
	});
}
export default AddPaginationTables;
