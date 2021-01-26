import {
  Box,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Addon, AddonCategory, Attachment } from '../types';
import { Category, CurseForgeProvider } from '../providers/curseForgeProvider';

const AddonListItem = ({ data }: { data: Addon }) => {
  const getDefaultAttachment = (): null | Attachment => {
    if (!data.attachments || data.attachments.length === 0) return null;

    const attachment: Attachment = data.attachments.filter((a: Attachment) => {
      return a.isDefault;
    })[0];

    return attachment;
  };

  return (
    <Flex direction="row" width="100%" px="8px" py="5px">
      {getDefaultAttachment() !== null ? (
        <Image
          boxSize="100px"
          src={getDefaultAttachment()?.thumbnailUrl}
          alt={getDefaultAttachment()?.description}
        />
      ) : (
        <Box boxSize="100px" bg="tomato" />
      )}

      <Flex direction="column" width="100%" justifyContent="start" ml="2rem">
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="1.5rem">
            {data.name}
          </Text>
          <Text fontWeight="light" fontSize="1rem" color="grey">
            {data.authors[0].name}
          </Text>
        </Flex>
        <HStack>
          {[
            ...new Map(
              data.categories.map((item: AddonCategory) => [
                item.categoryId,
                item,
              ])
            ).values(),
          ].map((category) => {
            return (
              <Tag size="sm" key={`${data.id}_${category.categoryId}`}>
                <TagLabel>{category.name}</TagLabel>
              </Tag>
            );
          })}
        </HStack>
        <Text>{data.summary}</Text>
        <HStack spacing={2}>
          <Stat>
            <StatLabel>Rank</StatLabel>
            <StatNumber>{data.gamePopularityRank}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Downloads</StatLabel>
            <StatNumber>
              {new Intl.NumberFormat('en-US', {
                maximumFractionDigits: 2,
                notation: 'compact',
                compactDisplay: 'short',
              }).format(data.downloadCount)}
            </StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Created</StatLabel>
            <StatNumber>
              {new Date(data.dateCreated).toLocaleDateString()}
            </StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Updated</StatLabel>
            <StatNumber>
              {new Date(data.dateModified).toLocaleDateString()}
            </StatNumber>
          </Stat>
        </HStack>
      </Flex>
    </Flex>
  );
};

interface CategoryFilterProps {
  // eslint-disable-next-line react/require-default-props
  onCategoryChange?: (value: string | string[]) => void;
}

const CategoryFilter = ({
  onCategoryChange = () => {},
}: CategoryFilterProps) => {
  // TODO I am setting a default here but its not working?
  const allParentCategories = 'All Categories';
  const allChildCategories = 'All';

  const [data, setData] = React.useState<Category[]>([]);
  const [parentSelected, setParentSelected] = React.useState<string>(
    allParentCategories
  );
  const [childSelected, setChildSelected] = React.useState<string>(
    allChildCategories
  );

  React.useEffect(() => {
    const async = async () => {
      const curse = new CurseForgeProvider(); // TODO this could be passed down
      const categories = await curse.getCategoryList();
      setData(categories);
    };
    async();
  }, []);

  const onParentCategoryChange = (value: string | string[]) => {
    setParentSelected(value as string);
    setChildSelected(allChildCategories); // Type Assertion is okay here, as the MenuOptionGroup is in radio mode
    onCategoryChange(value);
  };

  const onChildCategoryChange = (value: string | string[]) => {
    setChildSelected(value as string); // Type Assertion is okay here, as the MenuOptionGroup is in radio mode
    const c = value === 'All' ? parentSelected : (value as string);
    onCategoryChange(c);
    // console.log('chi', c);
  };

  const showChildCategoryMenu = (): boolean => {
    if (parentSelected === allParentCategories) return false;
    const category = data.filter((c) => c.name === parentSelected)[0];
    if (!category.childGameCategorys) return false;
    return true;
  };

  const getChildrenCategories = (parentName: string): Category[] => {
    const parent = data.find((c) => {
      return c.name === parentName;
    });

    if (!parent || !parent.childGameCategorys) return [];

    return parent.childGameCategorys;
  };

  return (
    <HStack spacing={4}>
      <Menu closeOnSelect>
        <MenuButton
          minWidth="225px"
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: 'gray.100' }}
          _expanded={{ bg: 'red.200' }}
          _focus={{ outline: 0, boxShadow: 'outline' }}
        >
          {parentSelected}
        </MenuButton>
        <MenuList maxHeight="600px" overflowY="auto">
          <MenuOptionGroup
            type="radio"
            defaultValue={allParentCategories}
            onChange={onParentCategoryChange}
          >
            <MenuItemOption isChecked value={allParentCategories}>
              {allParentCategories}
            </MenuItemOption>
            {data.map((category: Category) => {
              return (
                <MenuItemOption key={category.id} value={category.name}>
                  {category.name}{' '}
                  {category.childGameCategorys &&
                  category.childGameCategorys.length > 0
                    ? `(${category.childGameCategorys.length})`
                    : undefined}
                </MenuItemOption>
              );
            })}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      {showChildCategoryMenu() && (
        <Menu closeOnSelect>
          <MenuButton
            minWidth="225px"
            px={4}
            py={2}
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            _hover={{ bg: 'gray.100' }}
            _expanded={{ bg: 'blue.200' }}
            _focus={{ outline: 0, boxShadow: 'outline' }}
          >
            {childSelected}
          </MenuButton>
          <MenuList maxHeight="600px" overflowY="auto">
            <MenuOptionGroup
              type="radio"
              defaultValue={allChildCategories}
              onChange={onChildCategoryChange}
            >
              <MenuItemOption isChecked value={allChildCategories}>
                {allChildCategories}
              </MenuItemOption>
              {getChildrenCategories(parentSelected).map(
                (category: Category) => {
                  return (
                    <MenuItemOption key={category.id} value={category.name}>
                      {category.name}
                    </MenuItemOption>
                  );
                }
              )}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      )}
    </HStack>
  );
};

// 1 - popularity/rank ?
// 2 - updated
// 3 - ????
// 4 - ???
// 5 - download count
// 6 - ???

interface SortFilterProps {
  // eslint-disable-next-line react/require-default-props
  onSortChange?: (value: number) => void;
}

const SortFilter = ({ onSortChange = () => {} }: SortFilterProps) => {
  const [selected, setSelected] = React.useState<string>('Popularity');

  const onChange = (value: string | string[]) => {
    setSelected(value as string);
    switch (value as string) {
      case 'Popularity':
        onSortChange(1);
        break;
      case 'Last Updated':
        onSortChange(2);
        break;
      case 'Download Count':
        onSortChange(5);
        break;
      default:
        onSortChange(1);
    }
  };

  return (
    <Menu closeOnSelect>
      <MenuButton
        minWidth="225px"
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'gray.100' }}
        _expanded={{ bg: 'red.200' }}
        _focus={{ outline: 0, boxShadow: 'outline' }}
      >
        {selected}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          type="radio"
          defaultValue="Popularity"
          onChange={onChange}
        >
          <MenuItemOption key={1} value="Popularity">
            Popularity
          </MenuItemOption>
          <MenuItemOption key={2} value="Last Updated">
            Last Updated
          </MenuItemOption>
          <MenuItemOption key={5} value="Download Count">
            Download Count
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

const Hello = () => {
  const [data, setData] = React.useState<Addon[]>([]);
  const [category, setCategory] = React.useState<number | undefined>();
  const [sort, setSort] = React.useState<number | undefined>();

  const curse = new CurseForgeProvider(); // TODO this could be passed down

  React.useEffect(() => {
    const async = async () => {
      const addons = await curse.search({
        searchFilter: '',
        pageSize: 10,
        index: 0,
        categoryID: category,
        sort,
      });

      setData(addons);
    };
    async();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort]);

  const onCategoryChange = async (value: string | string[]) => {
    const categoryId = await curse.getCategoryId(value);
    setCategory(categoryId);
  };

  const onSortChange = async (value: number) => {
    setSort(value);
  };

  return (
    <>
      <CategoryFilter onCategoryChange={onCategoryChange} />
      <SortFilter onSortChange={onSortChange} />
      <VStack spacing="10px">
        {data.map((item) => {
          return <AddonListItem key={item.name} data={item} />;
        })}
      </VStack>
    </>
  );
};
