import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import CryptoJSCore from 'crypto-js/core';
import AES from 'crypto-js/aes';

import uuidv4 from 'uuid/v4';

let encryptionKey = null;
export default ({ service = 'com.redux-persist-encrypted-async-storage' } = {}) => {
  const noop = () => null;

  const getEncryptionKey = async () => {
    if (encryptionKey == null) {
      let { password: encryptionKeyValue } = await Keychain.getGenericPassword({ service });
      if (!encryptionKeyValue) {
        encryptionKeyValue = uuidv4();
        await Keychain.setGenericPassword('data', encryptionKeyValue, {
          service,
          accessible: Keychain.ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
        });
      }
      encryptionKey = encryptionKeyValue;
    }

    return encryptionKey;
  };

  return {
    async getItem(key, callback = noop) {
      try {
        let decryptedString;
        const encryptedValue = await AsyncStorage.getItem(key);
        try {
          const secretKey = await getEncryptionKey();
          const bytes = AES.decrypt(encryptedValue, secretKey);
          decryptedString = bytes.toString(CryptoJSCore.enc.Utf8);
        } catch (err) {
          throw new Error(`Could not decrypt state: ${err.message}`);
        }
        callback(null, decryptedString);
        return decryptedString;
      } catch (error) {
        callback(error);
        throw error;
      }
    },

    async setItem(key, value, callback = noop) {
      try {
        let encryptedValue = value;
        if (value) {
          const secretKey = await getEncryptionKey();
          encryptedValue = AES.encrypt(value, secretKey).toString();
        }
        await AsyncStorage.setItem(key, encryptedValue);
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
