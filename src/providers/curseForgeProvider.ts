import axios, { AxiosResponse } from 'axios';
import { Search } from 'history';
import { Addon } from '../models/addon';

export const WOW_GAME_ID = 1;

// https://twitchappapi.docs.apiary.io/
const BASE_URL = 'https://addons-ecs.forgesvc.net/api/v2';
const ENDPOINT_GET_FEATURED = '/addon/featured';
const ENDPOINT_GET_CATEGORY_LIST = '/category';
const ENDPOINT_SEARCH = '/addon/search?';

interface GetFeaturedOptions {
  GameId: number;
  addonIds: number[];
  featuredCount: number;
  popularCount: number;
  updatedCount: number;
}

export interface SearchOptions {
  gameId?: number;
  searchFilter: string;
  pageSize: number;
  index: number;
  categoryID?: number;
  sort?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  avatarUrl: string;
  dateModified: Date;
  parentGameCategoryId: number;
  rootGameCategoryId: number;
  gameId: number;
  childGameCategorys?: Category[];
}

export class CurseForgeProvider {
  async getFeaturedAddons(
    options: GetFeaturedOptions = {
      GameId: WOW_GAME_ID,
      addonIds: [],
      featuredCount: 10,
      popularCount: 10,
      updatedCount: 10,
    }
  ) {
    const url = `${BASE_URL}${ENDPOINT_GET_FEATURED}`;

    try {
      const response: AxiosResponse = await axios.post(url, options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async getCategoryList(gameId = WOW_GAME_ID): Promise<Category[]> {
    const url = `${BASE_URL}${ENDPOINT_GET_CATEGORY_LIST}`;

    try {
      const response: AxiosResponse = await axios.get(url);

      const unsortedCategories: Category[] = response.data.filter(
        (category: Category) => category.gameId === gameId
      );

      // Game Category 1 === base 'addons' category
      const rootCategories: Category[] = unsortedCategories.filter(
        (category: Category) => category.parentGameCategoryId === 1
      );

      for (const c of unsortedCategories) {
        if (c.parentGameCategoryId !== null && c.parentGameCategoryId !== 1) {
          const { parentGameCategoryId } = c;
          const parentIndex = rootCategories.findIndex((cate: Category) => {
            return cate.id === parentGameCategoryId;
          });

          if (!rootCategories[parentIndex].childGameCategorys) {
            rootCategories[parentIndex].childGameCategorys = [];
          }

          rootCategories[parentIndex].childGameCategorys?.push(c);
        }
      }

      return rootCategories;
    } catch (error) {
      throw new Error(error);
    }
  }

  async search(options: SearchOptions): Promise<Addon[]> {
    options.gameId = WOW_GAME_ID;
    const searchParams = Object.entries(options)
      .map(([key, val]) => `${key}=${val}`)
      .join('&');

    const url = BASE_URL.concat(ENDPOINT_SEARCH, searchParams);

    try {
      const response: AxiosResponse = await axios.get(url);
      return response.data as Addon[];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCategoryId(name: string | string[]): Promise<number | undefined> {
    if (name === 'All Categories') return undefined;
    const url = `${BASE_URL}${ENDPOINT_GET_CATEGORY_LIST}`;

    try {
      // TODO this is repeated
      const response: AxiosResponse = await axios.get(url);

      const unsortedCategories: Category[] = response.data.filter(
        (category: Category) => category.gameId === WOW_GAME_ID
      );

      return unsortedCategories.filter((category) => {
        return category.name === name && category.id;
      })[0].id;
    } catch (error) {
      throw new Error(error);
    }
  }
}
