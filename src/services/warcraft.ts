/* eslint-disable max-classes-per-file */
import * as fs from 'fs';

const fsPromises = fs.promises;

// const DEFAULT_WOW_DIR = '/Applications/World of Warcraft/';
// const DEFAULT_RETAIL_DIR = '_retail_';
// const DEFAULT_ADDONS_DIR = 'interface/Addons';

export default class WarcraftService {
  static async exists(path: string): Promise<boolean> {
    try {
      await fsPromises.access(path, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  constructor() {
    const init = async () => {
      // Check to see if the addon folder exists in default location
      // Get a list of the dirs in the addon folder
    };
    init();
  }
}
