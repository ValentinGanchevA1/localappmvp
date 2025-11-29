// src/components/common/LazyImage.tsx
import React, { useState } from 'react';
import { Image, ActivityIndicator, View, StyleSheet } from 'react-native';

interface LazyImageProps {
  uri: string;
  style?: any;
  placeholder?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  uri,
  style,
  placeholder,
}) => {
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState(false);

  const imageStyle = loading ? styles.hidden : styles.visible;

  return (
    <View style={style}>
      {loading && (placeholder || <ActivityIndicator />)}
      <Image
        source={{ uri }}
        style={[style, imageStyle]}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  visible: {
    display: 'flex',
  },
});
