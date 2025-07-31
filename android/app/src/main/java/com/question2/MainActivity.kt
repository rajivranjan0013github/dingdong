package com.question2

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen  // ✅ splash screen import

class MainActivity : ReactActivity() {

  // ✅ Show splash screen before super.onCreate
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this) // ✅ shows the splash screen
    super.onCreate(savedInstanceState)
  }

  // ✅ Handle deep links when app is already running
  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent)
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  override fun getMainComponentName(): String = "question2"

  /**
   * Returns the instance of the [ReactActivityDelegate].
   * We use [DefaultReactActivityDelegate] which allows you to enable
   * New Architecture with a single boolean flag [fabricEnabled].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
