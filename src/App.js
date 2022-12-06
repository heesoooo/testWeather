import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {useState} from 'react';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient'
import {Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from "@expo/vector-icons";

// 기기의 너비값 가져오는 함수? Dimensions
//const {height, width} = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');
console.log(SCREEN_WIDTH)
const icons = {
	Clouds: "cloudy",
	Clear: "day-sunny",
	Rain: "rain",
}

export default function App() {
    const [city, setCity] = useState("Loading");
    const [location, setLocation] = useState();
    const [days, setdays] = useState([]);
    const [ok, setOk] = useState(true);
    const [isReady, setReady] = React.useState(false);

    React.useEffect(()=>{
        const getWeather = setTimeout(async()=>{
          try{
            let {granted} = await Location.requestForegroundPermissionsAsync();
    
            if(!granted) {
                setOk(false);
            }
    
            const {coords : {latitude, longitude}} = await Location.getCurrentPositionAsync({
                accuracy: 5
            });
            //setLocation(location);
            console.log(latitude, longitude);    
            
            // 위치얻기
            const location = await Location.reverseGeocodeAsync(
                {latitude,longitude},
                {useGoogleMaps: false},
            );
            console.log(location[0].region);
            setCity(location[0].region);
            console.log(city);
    
          // 오픈 api url 받기
          const response = await fetch(
            `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=61b33230ecde09640ccfc58938a82788&units=metric`
            //`http://api.openweathermap.org/data/2.5/forecast/daily?lat=37.47613&lon=126.888951&appid=61b33230ecde09640ccfc58938a82788`
            // `https://api.openweathermap.org/data/3.0/onecall?lat=37.476126&lon=126.8889509&appid=61b33230ecde09640ccfc58938a82788`
            //`https://api.openweathermap.org/data/2.5/onecall?lat=37.47&lon=126.88&exclude=hourly,daily&appid=61b33230ecde09640ccfc58938a82788`
            // `https://api.openweathermap.org/data/2.5/forecast/daily?lat={latitude}&lon={longitude}&cnt={cnt}&appid=61b33230ecde09640ccfc58938a82788`
          );
          const json = await response.json();
          console.log(json.list);
          setdays(json.list);

          }
          catch(err){
            console.error(err);
          }
          finally{
            console.log("finally");
            setReady(true);
          }
        },0);
        return ()=>{
          clearTimeout(getWeather);
        }
      },[]);
    
      if(!isReady){
        return (
          <View style={{flex:1,justifyContent:"center",backgroundColor:"#222222"}}>
            <ActivityIndicator size={40} color="#FFF" />
          </View>
        )
      }

  return (
    <LinearGradient style={styles.container} colors={["#f7797d", "#FBD786", "#C6FFDD"]} start={[1,1]} end={[0,0]}>
        <StatusBar style="dark"></StatusBar>

        <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
        </View>

        <ScrollView
            // showsHorizontalScrollIndicator={true}
            // pagingEnabled
            // horizontal
            style={{ flex: 1, marginBottom: 12}}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={true}
            contentContatinerStyle={styles.weather}

            onMomentumScrollEnd ={
              () => {console.log('Scrolling is End')}
            }
            >
            <Days days={days}></Days>
        </ScrollView>

    </LinearGradient>
  );
}

function Days(props) {
  return (
      props.days.length === 0 ? (
        <View style={styles.day}></View>
      ) : (
			props.days.map((day, index) => (
			<View key={index} style={styles.day}>
				<Text>{day.dt_txt}</Text>
				<Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}℃</Text>
				<Text style={styles.main}>{day.weather[0].main}</Text>
				<Fontisto 
					name={icons[day.weather[0].main]}
					size={100}
					color="black"
				/>
				{console.log(day)}
			</View> ))
		)
	)
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    },
    city : {
        flex: 1, justifyContent: "center", alignItems: "center",
    },
    cityName : {
        fontSize: 68, fontWeight: "bold",
    },
    weather : {
        flex: 3,
        backgroundColor: "red"
    },
    day: {
        width: SCREEN_WIDTH, flex: 1, alignItems: "center", 
    },
    main: {
      marginBottom: 10,
    },
    temp: {
      marginTop: 10, marginBottom: 15, fontSize: 40,
	},
    description : {
        marginTop: 30,
        fontSize: 20,
    },
});