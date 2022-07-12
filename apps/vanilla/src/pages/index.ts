import AnimeCard from '../components/animeCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getPagination } from '../components/api';
import { Table } from '../components/animeTable/table';
import { PaginationContainer } from '../components/pagination/paginationContainer';
import { TableHeaderButton } from '../components/animeTable/tableHeaderButton';
import Pagination from '../components/pagination/pagination';
import PaginationCell from '../components/pagination/paginationCell';
import PaginationNext from '../components/pagination/paginationNext';
import PaginationPrevious from '../components/pagination/paginationPrevious';
import {
  SORT_BY_TITLE_ENG_URL,
  SORT_BY_AIRED_START_URL,
  SORT_BY_STATUS_URL,
  SORT_BY_ID_URL,
  BASE_URL,
} from '../components/constants/constants';

const limitAnimeOnPage = 25;
const paginationLength = 10;

/** sorting state variable. used in request. */
let ordering = 'id';

/** anime container */
const animeTable: Table = new Table('#anime-container');

/** pagination container. */
const paginationContainer: PaginationContainer = new PaginationContainer(
  '#pagination-container',
  0,
  25,
);

/** pagination state variable. */
let currentPagination: Pagination = new Pagination(0, '', '', []);

/** instance of header button responsible for sorting by title eng. */
const titleEngSortBtn = new TableHeaderButton('#table-title-eng', () => {
  ordering = 'title_eng';
  renderPage(SORT_BY_TITLE_ENG_URL, paginationLength, 0);
});

/** instance of header button responsible for sorting by aired start. */
const airedStartSortBtn = new TableHeaderButton('#table-aired-start', () => {
  ordering = 'aired__startswith';
  renderPage(SORT_BY_AIRED_START_URL, paginationLength, 0);
});

/** instance of header button responsible for sorting by status. */
const statusSortBtn = new TableHeaderButton('#table-status', () => {
  ordering = 'status';
  renderPage(SORT_BY_STATUS_URL, paginationLength, 0);
});

/** The handler passed to the constructor when the pagination cell is instantiated.
 *  Updates the pagination state and the table.
 *  @param indexOfCell used to calculate offset in request.
 */
function handlePaginationCellClick(indexOfCell: number): void {
  getPagination(`${BASE_URL}${indexOfCell * limitAnimeOnPage}&ordering=${ordering}`)
    .then(res => {
      currentPagination = res;
      animeTable.clearTable();
      renderTable();
    });
}

/** The handler passed to the constructor when the pagination next button is instantiated.
 *  Updates the pagination state and the table.
 *  @param indexOfLastCell used to calculate offset in request.
 */
function handlePaginationNextClick(indexOfLastCell: number): void {
  renderPage(`${BASE_URL}${indexOfLastCell * limitAnimeOnPage}&ordering=${ordering}`,
    paginationLength, indexOfLastCell);
}

/** The handler passed to the constructor when the pagination previous button is instantiated.
 *  Updates the pagination state and the table.
 *  @param indexOfFirstCell used to calculate offset in request.
 */
function handlePaginationPreviousClick(indexOfFirstCell: number) {
  renderPage(`${BASE_URL}${(indexOfFirstCell - paginationLength) * limitAnimeOnPage}&ordering=${ordering}`,
    paginationLength, indexOfFirstCell - paginationLength);
}

/** Creates and initializes a pagination cell array. Return array of HTML elements.
 * @param paginationLength.
 * @param paginationStartIndex.
 * */
function createPaginationCellList(
  paginationLength: number,
  paginationStartIndex: number
): HTMLElement[] {
  const cellsList: HTMLElement[] = [];
  for (
    let i = paginationStartIndex;
    i <= paginationLength + paginationStartIndex;
    i++
  ) {

    //Condition for defining the previous button
    if (i === paginationStartIndex) {
      cellsList.push(
        new PaginationPrevious(
          '<<',
          handlePaginationPreviousClick,
          i === 0
        ).initiatePaginationCell()
      );

      //Condition for defining the next button
    } else if (i === paginationLength + paginationStartIndex) {
      const maxPageNumber = currentPagination.count / 25;
      cellsList.push(
        new PaginationNext(
          '>>',
          handlePaginationNextClick,
          i >= maxPageNumber
        ).initiatePaginationCell()
      );
      break;
    } else {

      //initiate simple pagination cell
      cellsList.push(
        new PaginationCell(i, handlePaginationCellClick).initiatePaginationCell(),
      );
    }
  }
  return cellsList;
}

/** Render table. */
function renderTable(): void {
  const animeList = currentPagination.results;
  animeList?.forEach(item => {
    animeTable.renderElement(new AnimeCard(item).createAnimeCard('.anime-template'));
  });
}

/** Sends a request and updates the table and pagination.
 * @param url - link for request
 * @param paginationLength
 * @param paginationStartIndex*/
function renderPage(url: string, paginationLength: number, paginationStartIndex: number): void {
  getPagination(url)
    .then((res: Pagination) => {
      currentPagination = res;
      const paginationCellList: HTMLElement[] = createPaginationCellList(
        paginationLength,
        paginationStartIndex,
      );
      paginationContainer.renderPagination(paginationCellList);
      animeTable.clearTable();
      renderTable();
    })
    .catch(err => {
      throw new Error(err.message);
    });
}

/** Initial page rendering. */
renderPage(SORT_BY_ID_URL, paginationLength, 0);

/** set event listeners on sorting buttons. */
statusSortBtn.setEventListener();
airedStartSortBtn.setEventListener();
titleEngSortBtn.setEventListener();