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
      //barCode: '',
      //barCodetype: '',
    };
  }

  barcodeReceived(e) {
    console.log('Barcode: ' + e.data);
    console.log('type: ' + e.type);
    //this.state.barCode = e.data;
    //this.state.barCodeType = e.type;
  }

  render() {
    return (
      <BarcodeScanner
       onBarCodeRead={this.barcodeReceived}
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
