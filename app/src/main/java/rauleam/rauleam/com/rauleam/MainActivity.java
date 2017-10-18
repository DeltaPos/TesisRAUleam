package rauleam.rauleam.com.rauleam;

import android.app.Activity;
import android.location.Location;
import android.location.LocationListener;
import android.support.annotation.Nullable;

import android.os.Bundle;

import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;

import java.io.IOException;

public class MainActivity extends Activity {

    private ArchitectView architectView;
    private LocationProvider locationProvider;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        this.architectView = (ArchitectView)this.findViewById( R.id.architectView );
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        config.setLicenseKey("wymKGMYbMTBfjdHznSaSRIRJFfezkqQ0LF6h6gdVJAwSGx33FE0FE0ViSgsk/0IUxXNiMYSXW/UYcPNDWPN0jD0V+KHJFydUaHDeg4iLg3PnJbOnnjD0JE4dEGkY0wYNyU46texvdEW6bnbL/JEE2xqaq1s9GvjptnIxyp7V5LlTYWx0ZWRfX7zattdz0iSKBqH5Te86Aqh9+DYvS8+05p9Kket6AEGMD8fsA8M5FIiBby6dK8yBbr6lXH7x3YjNl6Q1cj3Zh/2KSBotuWKvyola/xlx/vZLYYwj1ZIeyQKzP9GghfU7f7QfBo6gEJX5w/dVWxsYksHDjzRqptcWfFooEjkkdxdU3BJI8eaIFetK4xocM+iuRbJ+w5IAxrZkyCh+/ahuyxws3419A2wtrs43O8xhJI2kHbhLZ1n7X6MNre2VB6FHqqd0QEgcuL2n6wOS2+VrAg1CrOJ9zh6BvAm1UHYzZjVhKnfiUi/nw2AUt++1sTn+qvZuomRlOVih3huXZLsaiNeljq608NOD8bL8KPM9uCvmzXqnqNSJqJmtB+t+esR8jxRtALBdR8g+SXUWp0aaPe8whBEr4nDe9u/+zJP0eAJvVh9XtYbPMYXw1OSdGeJt+SWa2tJrrTvorEl296FVCM/39IeJY7sV7Ok3S2O9hXe5n4kFeQ+tUjfExAMWre9Pthuj+0WAYQt0BgCbXt9R3xBaOZc/ihrp9g==");
        this.architectView.onCreate( config );


        locationProvider = new LocationProvider(this, new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {

                if (location != null && MainActivity.this.architectView != null) {
                    // check if location has altitude at certain accuracy level & call right architect method (the one with altitude information)
                    if (location.hasAltitude() && location.hasAccuracy() && location.getAccuracy() < 7) {
                        MainActivity.this.architectView.setLocation(location.getLatitude(), location.getLongitude(), location.getAltitude(), location.getAccuracy());
                    } else {
                        MainActivity.this.architectView.setLocation(location.getLatitude(), location.getLongitude(), location.hasAccuracy() ? location.getAccuracy() : 1000);
                    }
                }

            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }

        });

    }



    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        this.architectView.onPostCreate();
        try {
            this.architectView.load("www/index.html");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @Override
    protected void onResume() {
        super.onResume();
        architectView.onResume();
        locationProvider.onResume();

    }

    @Override
    protected void onPause() {
        super.onPause();
        architectView.onPause();
        locationProvider.onPause();


    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        architectView.onDestroy();
    }

}
