/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';


class AwesomeFootprints extends Component {
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
    console.log('Barcode 4: ' + e.data);
    console.log('type: ' + e.type);
    if (e.type === "UPC_A"){
      //console.log("Inside UPC_A");
      if (e.data === "722252212122")
        console.log("Clif Bar");
    }
    this.setState( {barCode: e.data, barCodeType: e.type} );
  }

  render() {
    console.log("render");
    return (
        <BarcodeScanner
         onBarCodeRead={this.barcodeReceived.bind(this)}
         style={{ flex: 1 }}
         torchMode={this.state.torchMode}
         cameraType={this.state.cameraType}
        />

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
