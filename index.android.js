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
  ListView,
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
                  {"\n"} Step 1: Press the Scan button
                </Text>
                <Text style={styles.instructions}>
                  {"\n"} Step 2: Scan your product's barcode
                </Text>
                <Text style={styles.instructions}>
                  {"\n"} Step 3: View the environmental impacts.  Simple!
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
              <Text style={styles.impactDisplayTitle}>Total Impacts</Text>
              {impactsView}
            </View>)
  }

}

class ImpactRowView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    //console.log("ImpactRowView");
    //console.log(this.props.data);
    var heading = Object.keys(this.props.data)[0];
    var value = this.props.data[heading];
    return (
      <View style={styles.impactRowContainer}>
        <Text style={styles.impactRowHeading}>{heading}</Text>
        <Text style={styles.impactRowValue}>{value}</Text>
      </View>
    )
  }
}

class ImpactsView extends Component {
  constructor(props) {
    super(props);
    //var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => _.isEqual(r1, r2)});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  render() {

    var product = this.props.resJson["product_lookup"]
    var id = product["id"];
    var name = product["name"];
    var barcodeType = product["barcodeType"];
    var barcode = product["barcode"];
    var totalImpact = product["total_impact"];
    //impacts_ds will contain:
    // [{"Waste (kg)":32},{"Water Use (L)":26},
    // {"Renewable Percentage (%)":4.4} ... ]"
    impactsDataSource = [];
    for (var key in totalImpact) { impactsDataSource.unshift({[key]: totalImpact[key]}); }

    console.log(JSON.stringify(impactsDataSource));
    return (
      <ListView
        dataSource={this.state.dataSource.cloneWithRows(impactsDataSource)}
        renderRow={(rowData) => <ImpactRowView data={rowData}/>}
      />
    )

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
    color: '#333333',
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 16,
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
  },
  impactDisplayTitle:{
    textAlign: 'center',
    fontSize: 24,
    color: 'green',
    marginTop: 30,
    marginBottom: 30,
  },
  impactRowContainer:{
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection:'row',
    borderWidth: 1,
    borderColor: 'black',
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 30,
  },
  impactRowHeading:{
    fontSize: 20,
  },
  impactRowValue:{
    fontSize: 20,
  },
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
