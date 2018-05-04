import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

export default class RecognitionResultScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Clarified',
    headerTintColor: '#2F80ED',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    headerStyle: { backgroundColor: '#FAFAFA', borderBottomWidth: 0.5, borderBottomColor: '#aaaaaa', },
  });
  render() {
    return (
      <View style={styles.container}>
        <Text>This is RecognitionResultScreen uses Clarifai</Text>
        <Button
          title={'Get Food based on ingredients'}
          containerViewStyle={{ marginTop: 20 }}
          backgroundColor={'#c84343'}
          borderRadius={5}
          textStyle={{ color: 'white' }}
          onPress={() => this.props.navigation.navigate('FoodList')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
