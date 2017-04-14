package org.lovebing.reactnative.baidumap;

import android.util.Log;
import android.widget.Button;

import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by lovebing on Sept 28, 2016.
 */
public class MarkerUtil {

    public static void updateMaker(Marker maker, ReadableMap option) {
        LatLng position = getLatLngFromOption(option);
        maker.setPosition(position);
        maker.setTitle(option.getString("title"));
	int icon = selectedImage(option);	
        BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(icon);
	maker.setIcon(bitmap);
	maker.setDraggable(false);
    }

    public static Marker addMarker(MapView mapView, ReadableMap option) {
	int icon = selectedImage(option);	
        BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(icon);
        LatLng position = getLatLngFromOption(option);
        OverlayOptions overlayOptions = new MarkerOptions()
                .icon(bitmap)
                .position(position)
                .title(option.getString("title"));
        Marker marker = (Marker)mapView.getMap().addOverlay(overlayOptions);
        marker.setDraggable(false);
        return marker;
    }
    
    private static int selectedImage(ReadableMap option) {
	int icon;
	boolean selected;
	if(!option.hasKey("selected")) {
	    selected = false;
	} else {
	    selected = option.getBoolean("selected");
	}
	if(selected == true) {
	    icon = R.mipmap.icon_kezulin;
	} else {
	    icon = R.mipmap.icon_yijinzulin;
	}
	return icon;
    }

    private static LatLng getLatLngFromOption(ReadableMap option) {
        double latitude = option.getDouble("latitude");
        double longitude = option.getDouble("longitude");
        return new LatLng(latitude, longitude);

    }
}
