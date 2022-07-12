import { Pagination } from '@js-camp/core/models/pagination';
import { PaginationMapper } from '@js-camp/core/mappers/pagination.mapper';

/** Send request. Return anime array
 * @param url link */
export async function getPagination(url: string): Promise<Pagination> {
  let pagination: Pagination = null;
  await fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(res => {
      pagination = PaginationMapper.fromDto(res);
    })
    .catch(err => {
      throw new Error(err.message);
    });
  return pagination;
}
