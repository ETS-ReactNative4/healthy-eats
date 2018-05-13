import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert, ImageEditor, ImageStore, Dimensions, ScrollView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { ImagePicker, LinearGradient } from 'expo';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Clarifai from 'clarifai'

const { width } = Dimensions.get('window');
let ingredientsList = []


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
  constructor(props) {
    super(props)
    const foodImage = props.navigation.state.params && props.navigation.state.params.foodImage
    this.state = {
      isLoading: false,
      foodImage: foodImage || null,
    };
  }
  componentWillMount() {
    process.nextTick = setImmediate;
    this.clarifaiCall()
  }

  async clarifaiCall() {
    this.setState({ isLoading: true })
    const { foodImage } = this.state
    // console.log(foodImage)



    const Clarifai = require('clarifai');
    let responseJSON = null;

    const app = new Clarifai.App({ apiKey: 'a751e448217d4364a555a0e2d6d59006' });
    app.models.predict(Clarifai.FOOD_MODEL, { base64: foodImage.base64 }).then(
      async response => {
        // do something with response
        console.log(response)
        responseJSON = response
        // console.log("should be object ", responseJSON)
        this.setState({
          isLoading: false,
          prediction: responseJSON.outputs[0]
        })
      },
      function (err) {
        // there was an error
        console.log(err)
        Alert.alert('Unable to get you food ingredients', `Reason.. ${err.status.description}!`)

      }
    );

  }

  loadingView = () => {
    return (
      <LinearGradient colors={['#DAE2F8', '#D6A4A4']} style={styles.loadingView}>
        <View style={styles.activityIndicatorAndButtonContainer}>
          <ActivityIndicator size="large" />
        </View>
      </LinearGradient>
    )
  }

  displayValue(ingredient, index) {
    return (
      <View key={index}>
        {ingredient.value > 0.70 &&
          <View style={styles.predictionInfoContainer}>
            <View>
              <Text style={styles.ingredientLabel}>{ingredient.name}</Text>
            </View>
            <View>
              <Text style={styles.percentLabel}>{(ingredient.value * 100).toPrecision(3)}</Text>
            </View>
          </View>
        }
      </View>

    )
  }
  renderPrediction(){
    const { prediction } = this.state

    return (
      <View>
        <View style={styles.predictionTableContainer}>
          <Text style={styles.predictionTableLabel}>PREDICTED INGREDIENT</Text>
          <Text style={styles.predictionTableLabel}>ACCURACY %</Text>
        </View>
        {
          prediction.data.concepts.map((ingredient, index) => {
            {ingredient.value > 0.70 && ingredientsList.push(ingredient.name)} 
            return this.displayValue(ingredient, index)
          })
          
        }

      </View>
    )

  }
  predictionResult(){
    const { prediction, isLoading } = this.state
    console.log("IngredientsList", ingredientsList)

    let { foodImage } = this.state;
    return (
      <ScrollView style={styles.container}>
        {foodImage &&
          <View style={styles.imageContainer}><Image source={{ uri: foodImage.uri }} style={styles.imageStyle} /></View>}
        <View styles={styles.predictionContainer}>
          {this.renderPrediction()}
        </View>
        <Button
          title={'Start Cooking!'}
          containerViewStyle={{ marginVertical: 10, alignItems: 'center' }}
          textStyle={{ color: 'white' }}
          buttonStyle={{
            backgroundColor: '#1ABC9C',
            width: 200,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
          }}
          onPress={() => this.props.navigation.navigate('FoodList', {ingredientsList: ingredientsList})}
        />
      </ScrollView>
    );
  }
  render() {
    const { prediction, isLoading } = this.state
    console.log(isLoading)
    return (
      (isLoading ? this.loadingView() : this.predictionResult())
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionContainer: {
    // flex: 1,
  },
  predictionInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#aaaaaa',
    marginBottom: 10,
  },
  predictionTableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  predictionTableLabel: {
    color: '#B4B7BA',
    fontSize: 14,
  },
  ingredientLabel: {
    fontSize: 18,
    color: '#2E4A62',
    fontWeight: 'bold'
  },
  percentLabel: {
    fontSize: 18,
    color: '#2E4A62'
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  imageStyle: {
    height: width / 1.5,
    width: width/ 1.2, 
    borderRadius: 25,
  },
});
