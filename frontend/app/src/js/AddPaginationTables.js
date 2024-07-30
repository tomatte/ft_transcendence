import renderTableLines from '../pages/RenderTableLines.js';

const AddPaginationTables = (currentPageData) => {
    const { rank_list, currentPage, itemsPerPage } = currentPageData;
    const totalItems = rank_list.length;

    if (totalItems === 0) {
        addPaginationOnTable('');
        return;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHtml = generatePreviosAndLastButton(currentPage);
    paginationHtml += generateNumbersPagination(totalPages, currentPage);
    paginationHtml += generateNextAndLastButton(totalPages, currentPage);
    addPaginationOnTable(paginationHtml);

    // Add event listener for pagination clicks with debounce
    addDebouncedPaginationEventListeners(currentPageData);
};

const generateNumbersPagination = (totalPages, currentPage) => {
    let pagination = '';

    for (let index = 1; index <= totalPages; index++) {
        pagination += `
            <li class="pagination__item-number ${currentPage === index ? 'pagination__item-number--active' : ''}">
                <a href="#" data-page="${index}">${index}</a>
            </li>
        `;
    }
    return pagination;
};

const generatePreviosAndLastButton = (currentPage) => {
    const isFirstPage = currentPage === 1;
    const isDisabledClass = isFirstPage ? 'pagination__control--disabled' : '';

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
        </li>`;
};

const generateNextAndLastButton = (totalPages, currentPage) => {
    const isLastPage = currentPage === totalPages;
    const isDisabledClass = isLastPage ? 'pagination__control--disabled' : '';

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
        </li>`;
};

const addPaginationOnTable = (paginationHtml) => {
    const paginationList = document.querySelector('.pagination__list');
    if (paginationList) {
        paginationList.innerHTML = paginationHtml;
    } else {
        console.error('Pagination list element not found.');
    }
};

let debounceTimer = null;

const addDebouncedPaginationEventListeners = (currentPageData) => {
    const paginationList = document.querySelector('.pagination__list');
    if (paginationList) {
        paginationList.addEventListener('click', (event) => {
            event.preventDefault();
            const target = event.target.closest('a[data-page]');
            if (target) {
                const page = parseInt(target.getAttribute('data-page'), 10);
                if (!isNaN(page)) {
                    // Clear previous timer
                    if (debounceTimer) {
                        clearTimeout(debounceTimer);
                    }
                    // Set new timer for debounce
                    debounceTimer = setTimeout(() => {
                        currentPageData.currentPage = page;
                        renderTableLines(currentPageData);
                    }, 300); // Adjust delay (in milliseconds) as needed
                }
            }
        });
    } else {
        console.error('Pagination list element not found.');
    }
};

export default AddPaginationTables;
