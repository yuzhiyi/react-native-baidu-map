import {
  Image,
  requireNativeComponent,
  View,
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';

import MapTypes from './MapTypes';

if (Platform.OS !== 'web') {
  var react_native = require('react-native');
  var RCTBaiduMapView = react_native.UIManager.RCTBaiduMapView;
  var Commands = RCTBaiduMapView.Commands;
  var COMMAND_UPDATE_MARKER = Commands.updateMaker;
}

export default class MapView extends Component {
  static propTypes = {
    ...View.propTypes,
    id: PropTypes.string,
    callback: PropTypes.func,
    zoomControlsVisible: PropTypes.bool,
    trafficEnabled: PropTypes.bool,
    baiduHeatMapEnabled: PropTypes.bool,
    mapType: PropTypes.number,
    zoom: PropTypes.number,
    center: PropTypes.object,
    local: PropTypes.object,
    marker: PropTypes.object,
    markers: PropTypes.array,
    childrenPoints: PropTypes.array,
    onMapStatusChangeStart: PropTypes.func,
    onMapStatusChange: PropTypes.func,
    onMapStatusChangeFinish: PropTypes.func,
    onMapLoaded: PropTypes.func,
    onMapClick: PropTypes.func,
    onMapDoubleClick: PropTypes.func,
    onMarkerClick: PropTypes.func,
    onMapPoiClick: PropTypes.func
  };

  static defaultProps = {
    id: `itminus_bmap${parseInt('' + Math.random() * 10000000, 10)}`, // Web 的容器 <div/> 的 id
    callback: map => map.centerAndZoom('杭州', 15), // 当检测到 Web 的 BMap 加载完毕后执行
    zoomControlsVisible: true,
    trafficEnabled: false,
    baiduHeatMapEnabled: false,
    mapType: MapTypes.NORMAL,
    childrenPoints: [],
    marker: null,
    markers: [],
    center: null,
    local: null,
    zoom: 10
  };

  constructor() {
    super();
    this.map;
  }

  _onChange(event) {
    if (typeof this.props[event.nativeEvent.type] === 'function') {
      this.props[event.nativeEvent.type](event.nativeEvent.params);
    }
  }

  updateMarker(marker) {
    if (Platform.OS !== 'web') {
      react_native.UIManager.dispatchViewManagerCommand(react_native.findNodeHandle(this), COMMAND_UPDATE_MARKER, [marker]);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Platform.OS === 'web') {
      if (nextProps.markers !== this.props.markers) {
        nextProps.markers.map(marker => {
          var icon = marker.status ? require('../android/src/main/res/mipmap-hdpi/icon_kezulin.png') : require('../android/src/main/res/mipmap-hdpi/icon_bukezulin.png');
          Image.getSize(icon, (w, h) => {
            var m = new BMap.Marker(new BMap.Point(marker.longitude, marker.latitude), {
              icon: new BMap.Icon(icon, new BMap.Size(w, h))
            });
            this.props.onMarkerClick && m.addEventListener('click', () => this.props.onMarkerClick(marker));
            this.map.addOverlay(m);
          });
        });
      }
    }
  }

  componentDidMount() {
    if (Platform.OS === 'web') {
      this.map = new BMap.Map(this.props.id);
      this.map.enableScrollWheelZoom(true);
      this.props.callback(this.map);
    }
  }

  render() {
    if (Platform.OS === 'web') {
      return React.createElement('div', {
        style: this.props.style,
        id: this.props.id
      });
    } else {
      return <BaiduMapView {...this.props} onChange={this._onChange.bind(this)}/>;
    }
  }
}

if (Platform.OS !== 'web') {
  var BaiduMapView = requireNativeComponent('RCTBaiduMapView', MapView, {
    nativeOnly: {
      onChange: true
    }
  });
}
