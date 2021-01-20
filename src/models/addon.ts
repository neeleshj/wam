export interface Author {
  name: string;
  url: string;
  projectId: number;
  id: number;
  projectTitleId?: number;
  projectTitleTitle: string;
  userId: number;
  twitchId: number;
}

export interface Attachment {
  id: number;
  projectId: number;
  description: string;
  isDefault: boolean;
  thumbnailUrl: string;
  title: string;
  url: string;
  status: number;
}

export interface Dependency {
  id: number;
  addonId: number;
  type: number;
  fileId: number;
}

export interface Module {
  foldername: string;
  fingerprint: any;
  type: number;
}

export interface SortableGameVersion {
  gameVersionPadded: string;
  gameVersion: string;
  gameVersionReleaseDate: Date;
  gameVersionName: string;
}

export interface LatestFile {
  id: number;
  displayName: string;
  fileName: string;
  fileDate: Date;
  fileLength: number;
  releaseType: number;
  fileStatus: number;
  downloadUrl: string;
  isAlternate: boolean;
  alternateFileId: number;
  dependencies: Dependency[];
  isAvailable: boolean;
  modules: Module[];
  packageFingerprint: any;
  gameVersion: string[];
  sortableGameVersion: SortableGameVersion[];
  installMetadata?: any;
  changelog?: any;
  hasInstallScript: boolean;
  isCompatibleWithClient: boolean;
  categorySectionPackageType: number;
  restrictProjectFileAccess: number;
  projectStatus: number;
  renderCacheId: number;
  fileLegacyMappingId?: any;
  projectId: number;
  parentProjectFileId?: any;
  parentFileLegacyMappingId?: any;
  fileTypeId?: any;
  exposeAsAlternative?: any;
  packageFingerprintId: number;
  gameVersionDateReleased: Date;
  gameVersionMappingId: number;
  gameVersionId: number;
  gameId: number;
  isServerPack: boolean;
  serverPackFileId?: any;
  gameVersionFlavor: string;
}

export interface AddonCategory {
  categoryId: number;
  name: string;
  url: string;
  avatarUrl: string;
  parentId: number;
  rootId: number;
  projectId: number;
  avatarId: number;
  gameId: number;
}

export interface CategorySection {
  id: number;
  gameId: number;
  name: string;
  packageType: number;
  path: string;
  initialInclusionPattern: string;
  extraIncludePattern: string;
  gameCategoryId: number;
}

export interface GameVersionLatestFile {
  gameVersion: string;
  projectFileId: number;
  projectFileName: string;
  fileType: number;
  gameVersionFlavor: string;
}

export interface Addon {
  id: number;
  name: string;
  authors: Author[];
  attachments: Attachment[];
  websiteUrl: string;
  gameId: number;
  summary: string;
  defaultFileId: number;
  downloadCount: number;
  latestFiles: LatestFile[];
  categories: AddonCategory[];
  status: number;
  primaryCategoryId: number;
  categorySection: CategorySection;
  slug: string;
  gameVersionLatestFiles: GameVersionLatestFile[];
  isFeatured: boolean;
  popularityScore: number;
  gamePopularityRank: number;
  primaryLanguage: string;
  gameSlug: string;
  gameName: string;
  portalName: string;
  dateModified: string;
  dateCreated: string;
  dateReleased: string;
  isAvailable: boolean;
  isExperiemental: boolean;
}
