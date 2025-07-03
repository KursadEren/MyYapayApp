import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';

export async function requestStoragePerm(){
  if(Platform.OS!=='android') return true;
  const perm=Platform.Version>=33
   ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
   : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  return (await PermissionsAndroid.request(perm))
         ===PermissionsAndroid.RESULTS.GRANTED;
}

export async function copyAssetToDoc(asset){
  const dst=`${RNFS.DocumentDirectoryPath}/${asset}`;
  if(!(await RNFS.exists(dst))) await RNFS.copyFileAssets(asset,dst);
  return `file://${dst}`;
}
