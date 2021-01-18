import axios, { AxiosResponse } from 'axios';

export const WOW_GAME_ID = 1;

// https://twitchappapi.docs.apiary.io/
const BASE_URL = 'https://addons-ecs.forgesvc.net/api/v2';
// const ENDPOINT_GET_GAMES_LIST = '/game?supportsAddons=true';
// const ENDPOINT_GET_GAME_INFO = (gameId: number) => `/game/${gameId}`;
const ENDPOINT_GET_FEATURED = '/addon/featured';
const ENDPIINT_GET_CATEGORY_LIST = '/category';

interface GetFeaturedOptions {
  GameId: number;
  addonIds: number[];
  featuredCount: number;
  popularCount: number;
  updatedCount: number;
}

interface Category {
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

export class ApiService {
  async getFeaturedAddons(
    options: GetFeaturedOptions = {
      GameId: 1,
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

  async getCategoryList(gameId = 1) {
    const url = `${BASE_URL}${ENDPIINT_GET_CATEGORY_LIST}`;

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
}
