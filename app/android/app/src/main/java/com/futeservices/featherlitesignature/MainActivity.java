package com.futeservices.featherlitesignature;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

/**
 * The app is a presentation piece: it runs edge to edge in landscape with no
 * system chrome, and the screen must not sleep while a walkthrough is playing.
 */
public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        goImmersive();
        tuneWebView();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // swiping from an edge temporarily reveals the bars; put them back
        if (hasFocus) {
            goImmersive();
        }
    }

    private void goImmersive() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.hide(WindowInsetsCompat.Type.systemBars());
        controller.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }

    private void tuneWebView() {
        WebView webView = getBridge().getWebView();
        if (webView == null) {
            return;
        }
        WebSettings settings = webView.getSettings();
        // every asset is packaged in the APK, so nothing has to be revalidated
        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        // the panoramas and the three.js floor plans are heavy textures
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setBackgroundColor(0xFF000000);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
    }
}
