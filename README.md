
# react-native-refresh-scroll-view

## Getting started

`$ npm install react-native-refresh-scroll-view --save`

### Mostly automatic installation

`$ react-native link react-native-refresh-scroll-view`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-refresh-scroll-view` and add `RNRefreshScrollView.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNRefreshScrollView.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.ohflying.react.RNRefreshScrollViewPackage;` to the imports at the top of the file
  - Add `new RNRefreshScrollViewPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-refresh-scroll-view'
  	project(':react-native-refresh-scroll-view').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-refresh-scroll-view/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-refresh-scroll-view')
  	```


## Usage
```javascript
import {RefreshFlatList, PullState} from 'react-native-refresh-scroll-view';
  
