import { Button, List, ListItem } from '@chakra-ui/react';
import { remote } from 'electron';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  AddonManagerProvider,
  LocalAddon,
} from './providers/addonManagerProvider';

const Local = () => {
  let addonManager: AddonManagerProvider;
  const [path, setPath] = React.useState<string | undefined>(
    '/Applications/World of Warcraft/_retail_' // TODO remove this is only so we dont have to open the dialoge
  );

  const [addons, setAddons] = React.useState<LocalAddon[]>([]);

  const onClick = () => {
    remote.dialog
      .showOpenDialog({
        title: 'Select Retail Directory',
        defaultPath: '/Applications/World of Warcraft/_retail_', // TODO this needs to change to windows one depending on platform darwin/win32, process.platform 'C:\\Program Files (x86)\\World of Warcraft\\_retail_'
        properties: ['openDirectory'],
      })
      .then((res: Electron.OpenDialogReturnValue) => {
        if (!res.canceled && res.filePaths) {
          const basePath = res.filePaths[0];
          setPath(basePath);
        }
        return res;
      })
      .catch((e) => {
        throw new Error(e);
      });
  };

  React.useEffect(() => {
    if (path) {
      addonManager = new AddonManagerProvider(path);

      addonManager
        .scanLocalAddons()
        .then((results) => {
          setAddons(results);
          return true;
        })
        .catch((e) => console.error(e));
    }
  }, [path]);

  return (
    <>
      <Button onClick={onClick}>Select Directory</Button>

      <List>
        {addons.map((a, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={index}>{a.dirName}</ListItem>
          );
        })}
      </List>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Local} />
      </Switch>
    </Router>
  );
}
