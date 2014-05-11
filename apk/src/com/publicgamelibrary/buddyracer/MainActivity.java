package com.publicgamelibrary.buddyracer;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.WindowManager;
//import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.publicgamelibrary.buddyracer.R;
import com.google.analytics.tracking.android.EasyTracker;

import com.appbrain.AppBrain;


@SuppressLint("SetJavaScriptEnabled")
public class MainActivity extends Activity {

	private WebView webview;
	public WebAppInterface WebApp;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, 
                WindowManager.LayoutParams.FLAG_FULLSCREEN); 
		
		AppBrain.init(this);
		AppBrain.getAds().showInterstitial(this);
        
        initGame();
	}

	
	public void initGame() {
		webview = (WebView) findViewById(R.id.webview);
		// webview.setWebViewClient(new CustomWebViewClient(this));
		// create instance of object
		WebApp = new WebAppInterface(this);
		// call instance method using object

		webview.addJavascriptInterface(WebApp, "Android");

		WebSettings wSettings = webview.getSettings();
		wSettings.setJavaScriptEnabled(true);
		wSettings.setDatabaseEnabled(true);
		wSettings.setJavaScriptCanOpenWindowsAutomatically(true);
		wSettings.setDomStorageEnabled(true);
		webview.setWebChromeClient(new WebChromeClient());
		webview.loadUrl("file:///android_asset/www/index.html");
	}

	@Override
	public void onStart() {
		super.onStart();
		// The rest of your onStart() code.
		EasyTracker.getInstance(this).activityStart(this); // Add this method.
	}

	@Override
	public void onStop() {
		super.onStop();
		// The rest of your onStop() code.
		EasyTracker.getInstance(this).activityStop(this); // Add this method.
	}

	@Override
	public void onResume() {
		super.onResume();
		if (webview != null) {
			System.out.println("Resuming webview state");
			WebApp.resumeSnd();
			// webview.resumeTimers();
		}
	}

	@Override
	public void onPause() {
		super.onPause();
		if (webview != null) {
			WebApp.muteAll();
			System.out.println("Saving webview state");
		}
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		if (webview != null) {
			WebApp.stopSnd();
			webview.destroy();
		}
	}

	
}
