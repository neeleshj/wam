import fs, { Dirent } from 'fs';
import path from 'path';

const fsPromises = fs.promises;

export interface LocalAddon {
  dirName: string;
  path: string;
  tocData?: any; // TODO testing the other method
  tocMeta?: any;
}

export class AddonManagerProvider {
  addonPath: string;

  constructor(private installationPath: string) {
    this.addonPath = this.getAddonsPath();
    console.log('Addon Path', this.addonPath);
  }

  getAddonsPath() {
    const addonsPath = path.join(this.installationPath, 'Interface', 'AddOns');
    if (fs.existsSync(addonsPath)) {
      return addonsPath;
    }
    throw new Error('AddOns directory not found!');
  }

  // TODO could be static maybe ?
  async scanLocalAddons(): Promise<LocalAddon[]> {
    // TODO add return type

    const addonDirs = (
      await fs.promises.readdir(this.addonPath, { withFileTypes: true })
    ).filter((a) => a.isDirectory());

    const localAddons = addonDirs.map((a: Dirent) => {
      return {
        dirName: a.name,
        path: path.resolve(this.addonPath, a.name),
      } as LocalAddon;
    });

    for (let index = 0; index < localAddons.length; index++) {
      const element = localAddons[index];
      const tocTagRegex = /^## *(\w+): *(.*)/gm;

      // eslint-disable-next-line no-await-in-loop
      const addonFiles = await fsPromises.readdir(element.path);
      const tocFiles = addonFiles.filter(
        (f) => path.extname(f).toLowerCase() === '.toc'
      );

      const tocFileName = tocFiles.find(
        (fName) => path.basename(fName, '.toc') === element.dirName
      );

      if (!tocFileName) {
        throw new Error(
          `Addon ${element.dirName} does not have a corresponding .toc file!`
        );
      }

      // eslint-disable-next-line no-await-in-loop
      const tocFile = await fsPromises.readFile(
        path.resolve(element.path, tocFileName),
        'utf8'
      );

      const data = {
        author: this.getValue('Author', tocFile),
        curseProjectId: this.getValue('X-Curse-Project-ID', tocFile),
        interface: this.getValue('Interface', tocFile),
        title: this.getValue('Title', tocFile),
        website: this.getValue('Website', tocFile),
        version: this.getValue('Version', tocFile),
        partOf: this.getValue('X-Part-Of', tocFile),
        category: this.getValue('X-Category', tocFile),
        localizations: this.getValue('X-Localizations', tocFile),
        wowInterfaceId: this.getValue('X-WoWI-ID', tocFile),
        dependencies: this.getValue('Dependencies', tocFile),
        tukUiProjectId: this.getValue('X-Tukui-ProjectID', tocFile),
        tukUiProjectFolders: this.getValue('X-Tukui-ProjectFolders', tocFile),
        loadOnDemand: this.getValue('LoadOnDemand', tocFile),
      };

      element.tocData = data;
      element.tocMeta = tocFile
        .split('\n')
        .filter((line) => line.trim().startsWith('## '));

      console.log(element);

      // Array.from(tocFile.matchAll(tocTagRegex), (m) => [m[1], m[2]]).reduce(
      //   (acc: any, current: Array<string>) => {
      //     const [name, value] = current;
      //     console.log(name, value);
      //     acc[name.toLowerCase()] = value;
      //     return acc;
      //   },
      //   element
      // );

      // TODO find the addon on the curse store and set the current state
      // is the addon out of date
    }

    return localAddons;
  }

  private getValue(key: string, tocText: string): string {
    const match = new RegExp(`^## ${key}:(.*?)$`, 'm').exec(tocText);

    if (!match || match.length !== 2) {
      return '';
    }

    return this.stripEncodedChars(match[1].trim());
  }

  private stripEncodedChars(value: string) {
    let str = this.stripColorChars(value);
    str = this.stripNewLineChars(str);

    return str;
  }

  private stripColorChars(value: string) {
    return value.replace(/\|[a-zA-Z0-9]{9}/g, '');
  }

  private stripNewLineChars(value: string) {
    return value.replace(/\|r/g, '');
  }
}
