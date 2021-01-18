import { List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import { ApiService } from './services/apiService';

const Test = () => {
  React.useEffect(() => {
    const async = async () => {
      const api = new ApiService();

      const categories = await api.getCategoryList();
      // console.log(categories);
    };
    async();
  });

  return (
    <List spacing={2}>
      <ListItem>Yes</ListItem>
    </List>
  );
};

const Hello = () => {
  return (
    <div>
      <Test />
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
