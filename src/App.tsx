import {
  Flex,
  VStack,
  Image,
  Text,
  HStack,
  Tag,
  TagLabel,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Addon, Attachment, Category } from './models/addon';
import { CurseForgeProvider } from './providers/curseForgeProvider';

const AddonListItem = ({ data }: { data: Addon }) => {
  const getDefaultAttachment = () => {
    return data.attachments.filter((attachment: Attachment) => {
      return attachment.isDefault;
    })[0] as Attachment;
  };

  return (
    <Flex direction="row" width="100%" px="8px" py="5px">
      <Image
        boxSize="100px"
        src={getDefaultAttachment().thumbnailUrl}
        alt={getDefaultAttachment().description}
        mr="2rem"
      />
      <Flex direction="column" width="100%" justifyContent="start">
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="1.5rem">
            {data.name}
          </Text>
          <Text fontWeight="light" fontSize="1rem" color="grey">
            {data.authors[0].name}
          </Text>
        </Flex>
        <HStack>
          {data.categories.map((category) => {
            return (
              <Tag size="sm" key={category.categoryId}>
                <TagLabel>{category.name}</TagLabel>
              </Tag>
            );
          })}
        </HStack>
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

const Hello = () => {
  const [data, setData] = React.useState([] as Addon[]);

  React.useEffect(() => {
    const async = async () => {
      const curse = new CurseForgeProvider();
      const addons = await curse.search({
        searchFilter: '',
        pageSize: 10,
        index: 0,
      });

      setData(addons);
    };
    async();
  }, []);

  return (
    <VStack spacing="10px">
      {data.map((item) => {
        return <AddonListItem key={item.id} data={item} />;
      })}
    </VStack>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
