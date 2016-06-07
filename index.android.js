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
  Image,
  Navigator,
  BackAndroid
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';
import _ from 'underscore';

// get this baseUrl after you run "ngrok http <port>" or point to heroku
var baseUrl = "http://awesome-footprints.herokuapp.com/";

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
                <Text style={styles.toolbarTitleOneButton}>
                  Awesome Footprints
                </Text>
              </View>
              <View>
                <Text style={styles.instructions}>
                  Press the Scan button, scan the barcode of the product, and pull up the environmental impacts.  It is that simple!
                </Text>
                <Image
                  style={styles.logo}
                  source={require('./awesome_footprint_400_400.png')}
                />
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

///////////////////
// Page 2
///////////////////
class ScanToolbar extends Component {
  render() {
    return (<View>
              <View style={styles.toolbar}>
                {/*<TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.navigator.pop}>*/}
                <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.onPress}>
                  <Text style={styles.toolbarButtonText}>Back</Text>
                </TouchableHighlight>
                <Text style={styles.toolbarTitleOneButton}>
                  Awesome Footprints
                </Text>
              </View>
           </View>)
  }
}

class Scanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torchMode: 'off',
      cameraType: 'back',
      barCode: '',
      barCodeType: '',
      // tested and testOnPress are used for testing handler remove
      tested: false,
      testOnPress: this._test.bind(this),
      // TO UNCOMMENT: dynamic handler removal
      onBarCodeRead: this.barcodeReceived.bind(this)
    };
  }

  _navigateResult(){
    this.props.navigator.push({
        title: 'DisplayImpacts',
        component: DisplayImpacts,
        barCodeType: this.state.barCodeType,
        barCode: this.state.barCode,
        // TO UNCOMMENT: dynamic handler removal
        popCallback: this._popCallback.bind(this),
    });
  }

  barcodeReceived(e) {
    // debugger
    console.log('Barcode: ' + e.data);
    console.log('type: ' + e.type);
    // if (e.type === "UPC_A"){
    //   //console.log("Inside UPC_A");
    //   if (e.data === "722252212122"){
    //     console.log("Clif Bar");
    //   }
    // }

    // setting onBarCodeRead state to null will remove the onBarCodeRead handler
    // so we don't get multiple event fired causing multiple transitions
    // set state is asynchronous
    // http://stackoverflow.com/questions/30852251/react-native-this-setstate-not-working
    //this._navigateResult();

    // TO UNCOMMENT: dynamic handler removal
    this.setState( {barCode: e.data, barCodeType: e.type, onBarCodeRead: null}, () => this._navigateResult());

    // without dynamic handler removal
    //this.setState( {barCode: e.data, barCodeType: e.type}, () => this._navigateResult() );

  }

  _navigateBack() {
    this.props.navigator.pop();
  }


  _popCallback() {
    //console.log(this);
    // rebind the barCodeReceived handler
    // TO UNCOMMENT: dynamic handler removal
    this.setState( {onBarCodeRead: this.barcodeReceived.bind(this)} );
  }

  _test() {
    console.log("test");
    //this.setState({testOnPress: this._test});
    // once button is clicked, then remove the handler
    this.setState({tested: true, testOnPress: null});
  }

  render() {
    var text = this.state.tested ? 'Tested' : 'Untested';
    // TRY OUT DEBOUNCING:
    // debounce the call to this.barcodeReceived
    //var lazyBarcodeReceived = _.debounce( this.barcodeReceived.bind(this), 300 );
    // alternative of passing in an anonymous funciton that returns a function (which must then be called)
    //var lazyBarcodeReceived = _.debounce( (e) => this.barcodeReceived(e) , 300 );
    return (

      <View style={styles.containerScan}>
       <ScanToolbar onPress={this._navigateBack.bind(this)}/>
       {/*original version 2.0.0 of BarCodeScanner
       updating to version-2 branch of BarCodeScanner on github is BarCodeScannerPackage*/}
       <BarcodeScanner
           // TO UNCOMMENT: dynamic handler removal
           onBarCodeRead={this.state.onBarCodeRead}
           // Original
           //onBarCodeRead={this.barcodeReceived.bind(this)}
           // using debounce
           //onBarCodeRead={lazyBarcodeReceived}
           style={{flex: 1}}
           torchMode={this.state.torchMode}
           cameraType={this.state.cameraType}
          />
          {/* Testing making handler null on blickby insg state */}
          {/*<TouchableHighlight underlayColor="grey" onPress={this._test.bind(this)}>*/}
          {/* Making the onPress handler removable (ie. settable to null using state) */}
          {/*<TouchableHighlight underlayColor="grey" onPress={this.state.testOnPress}>
             <Text style={{fontSize: 30}}>{text}</Text>
           </TouchableHighlight>*/}
     </View>

    );
  }
}

/////////////////
// Page 3
/////////////////

class DisplayImpacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resJson: {},
    };

    // bind it once during initialization
    // bind creates a new function, we only wants to bind once
    // instead of for example, binding each time on click which
    // can cause memory leak
    this.storeImpactJson = this.storeImpactJson.bind(this);
  }

  componentDidMount(){
    this.getImpacts();
  }

  _navigateBack() {
    //console.log(this.props.route);

    // TO UNCOMMENT: dynamic handler removal
    this.props.route.popCallback();
    this.props.navigator.pop();
  }

  storeImpactJson(resJson) {
    //console.log("resJson")
    //console.log(resJson);
    this.setState({resJson: resJson});
    //return resJson;
   }

  getImpacts() {
    //console.log("getImpacts")
    fetch(baseUrl + "/products/lookup.json?barcode_type=" + this.props.route.barCodeType + "&barcode=" + this.props.route.barCode )
    .then(function(res) {
      //console.log("res")
      //console.log(res)
      return res.json();
     })
    .then(this.storeImpactJson)
  }

  render() {
    //console.log("this.props.route.barCode: " + this.props.route.barCode)
    // var product;
    // if (this.props.route.barCodeType === "UPC_A"){
    //   //console.log("Inside UPC_A");
    //   if (this.props.route.barCode === "722252212122"){
    //     product = "Clif Bar";
    //   }
    // }
    var impactsView;
    //console.log("this.state.res ", this.state.resJson)
    if (_.isEmpty(this.state.resJson))
    {
      impactsView = <Text>Initializing...</Text>
    }
    else {
      impactsView = <ImpactsView resJson={this.state.resJson}></ImpactsView>
    }

    return (<View>
              <ScanToolbar onPress={this._navigateBack.bind(this)}/>
              <Text>Display Impacts</Text>
              {/*<Text>{JSON.stringify(this.state.resJson)}</Text>*/}
              {impactsView}
            </View>)
  }

}

class ImpactsView extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    //console.log("ImpactsView");
    //console.log(this.props.resJson);
    // JSON.stringify(this.props.resJson);
    var product = this.props.resJson["product_lookup"]
    var id = product["id"];
    var name = product["name"];
    var barcodeType = product["barcodeType"];
    var barcode = product["barcode"];
    var totalImpact = product["total_impact"];
    var greenhouseGases = totalImpact["Greenhouse Gases (kg CO2 eq)"];
    var energyConsumption = totalImpact["Energy Consumption (kWh)"];
    var renewablePercentage = totalImpact["Renewable Percentage (%)"];
    var waterUse = totalImpact["Water Use (L)"];
    var waste = totalImpact["Waste (kg)"];

    return (<View>
              <Text>Product Id: {id}</Text>
              <Text>Name: {name}</Text>
              <Text>Barcode Type: {barcodeType}</Text>
              <Text>Barcode: {barcode}</Text>
              <Text>Total Impacts</Text>
              <Text>Greenhouse Gases (kg CO2 eq): {greenhouseGases}</Text>
              <Text>Energy Consumption (kWh): {energyConsumption}</Text>
              <Text>Renewable Percentage (%): {renewablePercentage}</Text>
              <Text>Water Use (L): {waterUse}</Text>
              <Text>Waste (kg): {waste}</Text>
            </View>)
  }

}
// store the navigator for BackAndroid
// var _navigator;

class AwesomeFootprints extends Component {

  _renderScene (route, navigator) {
      // _navigator = navigator;
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
  logo: {
    flex: 1,
    resizeMode: 'cover',
  },
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
    marginTop: 15,
    marginBottom: 15,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 20,
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


//BackAndroid.addEventListener('hardwareBackPress', function() {
    //  if (!this.onMainScreen()) {
    //    this.goBack();
    //    return true;
    //  }
    //  return false;
    //_navigator.pop();
//});
