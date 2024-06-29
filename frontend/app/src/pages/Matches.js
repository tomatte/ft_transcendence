const Matches = () => {
  const component = document.createElement('div');
  component.innerHTML = `
<div class="page-content__container__header">
<div class="page-content__container__header__info">
    <h4 class="page-content__container__header__info__title">MATCHES</h4>
    <h6 class="page-content__container__header_table-total-number">0</h6>
</div>
<button class="button button--secondary">
    <span class="material-icons-round button__icon-left">sports_tennis</span>
    <span class="button__text font-body-regular-bold">Label</span>
    <span class="material-icons-round button__icon-right">sports_tennis</span>
</button>
</div>

<div class="page-content__container__content">
    <div class="table__header-group">
            <div class="table__header-group-data">
            <span class="table__header">PLAYER</span>
            </div>
            <div class="table__header-group-data">
            <span class="table__header">GAME TYPE</span>
            </div>
            <div class="table__header-group-data">
            <span class="table__header">SCORE</span>
            </div>
            <div class="table__header-group-data">
            <span class="table__header">DATE</span>
            </div>
    </div>
     
    <div class="table__row-group">
        <div class="table__row-group__row"> 
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
         </div>
         <div class="table__row-group__row"> 
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
        </div>
        <div class="table__row-group__row"> 
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
        </div>
        <div class="table__row-group__row"> 
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
         </div>
         <div class="table__row-group__row"> 
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
                <div class="table__row-group__row__data">        </div>
         </div>
         </div>

    <div class="nav-pagination">
        <div class="playground-container playground-container--pagination">
            <nav class="pagination font-body-regular-bold">
              <ul class="pagination__list">
                <li class="pagination__control pagination__control--disabled">
                  <a href="#">
                    <span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
                    <span class="pagination__control__text">First</span>
                  </a>
                </li>
                <li class="pagination__control pagination__control--disabled">
                  <a href="#">
                    <span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
                    <span class="pagination__control__text">Previous</span>
                  </a>
                </li>
                <li class="pagination__item-number pagination__item-number--active"><a href="#">1</a></li>
                <li class="pagination__item-number"><a href="#">2</a></li>
                <li class="pagination__item-number"><a href="#">3</a></li>
                <li class="pagination__item-number"><a href="#">4</a></li>
                <li class="pagination__item-number"><a href="#">5</a></li>
                <li class="pagination__item-number">
                  <a href="#">
                    <span class="material-icons-round icon--small">more_horiz</span>
                  </a>
                </li>
                <li class="pagination__item-number"><a href="#">25</a></li>
                <li class="pagination__control">
                  <a class="pagination__control__link" href="#">
                    <span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
                    <span class="pagination__control__text">Next</span>
                  </a>
                </li>
                <li class="pagination__control">
                  <a class="pagination__control__link" href="#">
                    <span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
                    <span class="pagination__control__text">Last</span>
                  </a>
                </li>
              </ul>
          </nav>
      
          </div>
    </div>
</div>

 `;
  return component;
};

export default Matches;