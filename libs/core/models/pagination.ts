import { Immerable, OmitImmerable } from '../models/immerable';
import Anime from '../models/anime';

/** Pagination info. */
export class Pagination extends Immerable {

  /** Total count Anime. */
  public count: number;

  /** Link next list Anime. */
  public next: string | null;

  /** Link previous list Anime. */
  public previous: string | null;

  /** List Anime. */
  public results: Anime[] | null;

  public constructor(data: Args) {
    super();
    this.count = data.count;
    this.next = data.next;
    this.previous = data.previous;
    this.results = data.results;
  }
}

type Args = OmitImmerable<Pagination>;
