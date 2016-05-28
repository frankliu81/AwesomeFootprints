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
  Navigator,
  ToolbarAndroid
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';

///////////////////
// Page 1
///////////////////
class HomeToolbar extends Component {
  render() {
    //debugger
    return (<View>
              <View style={styles.toolbar}>
                <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.onPress}>
                  <Text style={styles.toolbarButtonText}>Scan</Text>
                </TouchableHighlight>
                <Text style={styles.toolbarTitle}>
                  TreadLight.ly
                </Text>
                <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.onPress}>
                  <Text style={styles.toolbarButtonText}>Compare</Text>
                </TouchableHighlight>
              </View>
            </View>)
  }
}

class Home extends Component {
  _navigate() {
    this.props.navigator.push({
      name: "Scanner",
      component: Scanner
    });
  }

  render() {
    return <HomeToolbar onPress={this._navigate.bind(this)}/>
          // Below is put into ScanToolbar
          // return (<View>
          //           <View style={styles.toolbar}>
          //             <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={() => this._navigate()}>
          //               <Text style={styles.toolbarButtonText}>Scan</Text>
          //             </TouchableHighlight>
          //             <Text style={styles.toolbarTitle}>
          //               TreadLight.ly
          //             </Text>
          //             <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={() => this._navigate()}>
          //               <Text style={styles.toolbarButtonText}>Compare</Text>
          //             </TouchableHighlight>
          //           </View>
          //         </View>)
  }
}


class ScanToolbar extends Component {
  render() {
    return (<View>
              <View style={styles.toolbar}>
                {/*<TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.navigator.pop}>*/}
                <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.onPress}>
                  <Text style={styles.toolbarButtonText}>Back</Text>
                </TouchableHighlight>
                <Text style={styles.toolbarTitleOneButton}>
                  TreadLight.ly
                </Text>
              </View>
           </View>)
  }
}

///////////////////
// Page 2
///////////////////
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
    this.props.navigator.pop();
  }

  render() {
    return (
      // Refactor into ScanToolbar
      // <View style={styles.container}>
      //   <TouchableHighlight underlayColor="grey" onPress={() => this._navigate()}>
      //     <Text>Back</Text>
      //   </TouchableHighlight>
      //    <BarcodeScanner
      //    onBarCodeRead={this.barcodeReceived.bind(this)}
      //    style={{ height: 400, width: 300 }}
      //    //style={{flex: 1}}
      //    torchMode={this.state.torchMode}
      //    cameraType={this.state.cameraType}
      //   />
      // </View>

      <View style={styles.containerScan}>
       <ScanToolbar onPress={this._navigate.bind(this)}/>
       <BarcodeScanner
           onBarCodeRead={this.barcodeReceived.bind(this)}
           //style={{ height: 400, width: 300 }}
           style={{flex: 1}}
           torchMode={this.state.torchMode}
           cameraType={this.state.cameraType}
          />
     </View>

    );
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
  containerScan: {
    flex: 1,
    justifyContent: 'center',
    // without alignItems stretch, the scanner appear to have zero width,
    // and the toolbar won't stretch out
    // https://github.com/facebook/react-native/issues/2957#event-417214498
    alignItems: 'stretch',
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
  toolbarAndroid: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  toolbar: {
    backgroundColor:'#81c04d',
    paddingTop:30,
    paddingBottom:10,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 100,
    marginLeft: 20,
    //color:'#fff',
    //textAlign:'center'
  },
  toolbarButtonText:{
    color:'#fff',
    fontSize: 20,
  },
  toolbarTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    flex:1,
    fontSize: 20,
  },
  toolbarTitleOneButton:{
    color:'#fff',
    justifyContent: 'flex-start',
    fontWeight:'bold',
    flex:1,
    fontSize: 20,
  }
  // button: {
  //   marginTop: 20,
  //   marginBottom: 20,
  // }
});

AppRegistry.registerComponent('AwesomeFootprints', () => AwesomeFootprints);
