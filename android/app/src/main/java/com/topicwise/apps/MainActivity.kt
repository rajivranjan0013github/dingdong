package com.topicwise.apps

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen  // ✅ splash screen import
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability

class MainActivity : ReactActivity() {

  private lateinit var appUpdateManager: AppUpdateManager
  private val updateListener = InstallStateUpdatedListener { state ->
    if (state.installStatus() == InstallStatus.DOWNLOADED) {
      // Update downloaded for FLEXIBLE flow; ask user to restart to complete.
      showCompleteUpdateDialog()
    }
  }
  private val activityResultLauncher =
    registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
      // User may have accepted, declined, or the flow failed. Nothing special to do here.
      // We will re-check state in onResume to resume immediate updates or prompt for completion.
    }

  // ✅ Show splash screen before super.onCreate
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this) // ✅ shows the splash screen
    super.onCreate(null)
    WindowCompat.setDecorFitsSystemWindows(window, false)

    // In-app updates setup
    appUpdateManager = AppUpdateManagerFactory.create(this)
    appUpdateManager.registerListener(updateListener)
    checkForAppUpdate()
  }

  // ✅ Handle deep links when app is already running
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  override fun getMainComponentName(): String = "topicwise.apps"

  /**
   * Returns the instance of the [ReactActivityDelegate].
   * We use [DefaultReactActivityDelegate] which allows you to enable
   * New Architecture with a single boolean flag [fabricEnabled].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onResume() {
    super.onResume()
    // Check for downloaded-but-not-installed updates and for immediate-update resume.
    appUpdateManager.appUpdateInfo.addOnSuccessListener { info ->
      if (info.installStatus() == InstallStatus.DOWNLOADED) {
        // Flexible update downloaded, prompt to complete.
        showCompleteUpdateDialog()
      }

      if (info.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
        // Resume an ongoing immediate update.
        appUpdateManager.startUpdateFlowForResult(
          info,
          activityResultLauncher,
          AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build()
        )
      }
    }
  }

  override fun onDestroy() {
    // Avoid leaking the listener
    appUpdateManager.unregisterListener(updateListener)
    super.onDestroy()
  }

  private fun checkForAppUpdate() {
    appUpdateManager.appUpdateInfo.addOnSuccessListener { info ->
      if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
        when {
          info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE) -> {
            appUpdateManager.startUpdateFlowForResult(
              info,
              activityResultLauncher,
              AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build()
            )
          }
          info.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE) -> {
            appUpdateManager.startUpdateFlowForResult(
              info,
              activityResultLauncher,
              AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build()
            )
          }
        }
      }
    }
  }

  private fun showCompleteUpdateDialog() {
    // Use a simple AlertDialog to avoid adding Material dependency for Snackbar
    AlertDialog.Builder(this)
      .setTitle("Update ready")
      .setMessage("An update has just been downloaded.")
      .setCancelable(false)
      .setPositiveButton("RESTART") { _, _ ->
        appUpdateManager.completeUpdate()
      }
      .setNegativeButton("LATER", null)
      .show()
  }
}
