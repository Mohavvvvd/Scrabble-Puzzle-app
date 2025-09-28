import React from 'react';
import { View, ViewProps } from 'react-native';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export default function ScreenWrapper({ children, style, ...props }: ScreenWrapperProps) {
  return (
    <View 
      style={[
        { flex: 1,paddingTop:50,backgroundColor:'#0f0c29'}, 
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}