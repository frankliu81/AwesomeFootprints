/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Navigator
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';


class Scanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torchMode: 'off',
      cameraType: 'back',
      barCode: '',
      barCodeType: ''
    };
  }

  barcodeReceived(e) {
    // debugger
    console.log('Barcode: ' + e.data);
    console.log('type: ' + e.type);
    //debugger
    if (e.type === "UPC_A"){
      //console.log("Inside UPC_A");
      if (e.data === "722252212122")
        console.log("Clif Bar");
    }
    this.setState( {barCode: e.data, barCodeType: e.type} );
  }

  _navigate() {
    this.props.navigator.push({
      name: "Home",
      component: Home
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight underlayColor="grey" onPress={() => this._navigate()}>
          <Text>Back</Text>
        </TouchableHighlight>
         <BarcodeScanner
         onBarCodeRead={this.barcodeReceived.bind(this)}
         style={{ height: 400, width: 300 }}
         //style={{flex: 1}}
         torchMode={this.state.torchMode}
         cameraType={this.state.cameraType}
        />
      </View>
    );
  }
}


class Home extends Component {
  _navigate() {
    this.props.navigator.push({
      name: "Scanner",
      component: Scanner
    });
  }

  //onPressButton: function(){
  //   console.log("Button Pressed");
  // }

  onPressButton(){
      //debugger;
      console.log("Button Pressed");
  }


  render() {
    return (<View style={styles.container}>
              <TouchableHighlight underlayColor="grey" onPress={() => this._navigate()}>
                <Text>Scan</Text>
              </TouchableHighlight>
              <Text>
                Welcome these are the instructions
              </Text>
            </View>)
  }
}


class AwesomeFootprints extends Component {

  _renderScene (route, navigator) {
      var Component = route.component;
      return (
        <Component {...route.props} navigator={navigator} route={route} />
      );
  }

  render() {
    //console.log("In AwesomeFootprints component");
    return (
      <Navigator
        initialRoute={{
          name: "Home",
          component: Home
        }}
        configureScene={() => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={this._renderScene} />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AwesomeFootprints', () => AwesomeFootprints);
