import { Image } from 'react-native';

export default function HeaderLogo() {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: 120, height: 36, resizeMode: 'contain' }}
    />
  );
}