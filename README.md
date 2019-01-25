# redux-persist-encrypted-async-storage
Redux persist storage engine that provides an encryption layer over async storage

### What this project provides
This project provides an AES encryption layer (using a randomly generated secure key stored in keychain/keystore) over AsyncStorage for react-native projects

### To install in your project:
First install `react-native-keychain`. Then:

```
  yarn add 'https://github.com/chaudhryjunaid/redux-persist-encrypted-async-storage.git#master'
```

OR

```
  npm i 'https://github.com/chaudhryjunaid/redux-persist-encrypted-async-storage.git#master'
```

### Usage:
```
  import createStorage from 'redux-persist-encrypted-async-storage';
  
  const rootPersistConfig = {
    key: 'root',
    storage: createStorage()
  };
  
  const rootReducer = combineReducers({
    key: keyReducer
  });

  export default persistReducer(rootPersistConfig, rootReducer);
```
### API
```
  createStorage({ service?: string }): Storage
```

Service is the service key used to store the secure key in keychain/keystore using react-native-keychain. See react-native-keychain for more details. Default service value is: `com.redux-persist-encrypted-async-storage`
