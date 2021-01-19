import { List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApiService, Category } from './services/apiService';

const CategoryListItem = ({ data }: { data: Category }): JSX.Element => {
  const [showChildren, setShowChildren] = React.useState(false);

  const nested = (data.childGameCategorys || []).map((c) => {
    return <CategoryListItem key={c.id} data={c} />;
  });

  return (
    <>
      <ListItem onClick={() => setShowChildren(!showChildren)}>
        {data.name}
      </ListItem>
      {showChildren && nested}
    </>
  );
};

const Categories = () => {
  const [categories, setCategories] = React.useState([] as Category[]);

  React.useEffect(() => {
    const async = async () => {
      const api = new ApiService();

      const data = await api.getCategoryList();
      setCategories(data);
    };
    async();
  });

  return (
    <List spacing={2}>
      {categories.map((category) => {
        return <CategoryListItem key={category.id} data={category} />;
      })}
    </List>
  );
};

const Hello = () => {
  return (
    <div>
      <Categories />
    </div>
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
