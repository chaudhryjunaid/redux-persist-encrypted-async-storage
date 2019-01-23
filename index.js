import { AsyncStorage } from 'react-native';
import * as Keychain from 'react-native-keychain';

export default ({keyName = 'redux-persist-encrypted-async-storage:key'} = {}) => {
  const noop = () => null;

  return {
    async getItem(key, callback = noop) {
      try {
        let result = await AsyncStorage.getItem(key);

        callback(null, result);
        return result;
      } catch (error) {
        callback(error);
        throw error;
      }
    },

    async setItem(key, value, callback = noop) {
      try {
        await AsyncStorage.setItem(key, value);
        callback(null);
      } catch (error) {
        callback(error);
        throw error;
      }
    },

    async removeItem(key, callback = noop) {
      try {
        await AsyncStorage.removeItem(key);
        callback(null);
      } catch (error) {
        callback(error);
        throw error;
      }
    },

    async getAllKeys(callback = noop) {
      try {
        const result = await AsyncStorage.getAllItems();

        callback(null, result);
        return result;
      } catch (error) {
        callback(error);
        throw error;
      }
    },
  };
};
