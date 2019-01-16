import Autocomplete from 'react-native-autocomplete-input';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TOMTOM_API_KEY = 'Your TOMTOM API Key here';

export default class TomTomAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      placeQuery: '',
      //Bias searches near San Francisco
      currentLat: 37.7749,
      currentLon: -122.4194,
    };
  }

  onPressFn(address, lat, lon) {
    this.setState({placeQuery : address, places : []})
  }

  componentDidMount() {}

  async findPlace(query, lat, lon, autocomplete, maxResults) {
    let apiUrl =
      'https://api.tomtom.com/search/2/search/' +
      encodeURIComponent(query) +
      '.JSON?key=' +
      TOMTOM_API_KEY +
      '&typeahead=' +
      autocomplete +
      '&limit=' +
      maxResults;
    if (lat && lon) {
      apiUrl += '&lat=' + lat + '&lon=' + lon;
    }
    let placeResults = await fetch(apiUrl)
      .then(resp => resp.json())
      .then(resp => {
        try {
          let results = resp.results;
          let places = [];
          for (let val of results) {
            if ('poi' in val) {
              places.push({
                name: val.poi.name,
                address: val.address.freeformAddress,
                lat: val.position.lat,
                lon: val.position.lon,
              });
            } else {
              places.push({
                name: val.address.freeformAddress,
                address: val.address.freeformAddress,
                lat: val.position.lat,
                lon: val.position.lon,
              });
            }
          }
          return places;
        } catch (error) {
          return [];
        }
      });
    this.setState({ places: placeResults });
  }

  render() {
    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          data={this.state.places}
          defaultValue={this.state.placeQuery}
          onChangeText={text =>
            this.findPlace(
              text,
              this.state.currentLat,
              this.state.currentLon,
              true,
              5
            )
          }
          placeholder={this.props.placeholder}
          renderItem={({ name, address, lat, lon }) => (
            <TouchableOpacity onPress={() => this.onPressFn(address, lat, lon)}>
              <Text style={styles.itemText}>
                <Text style={{ fontWeight: 'bold' }}>{name}</Text>
                {name !== address && '\n' + address}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    borderWidth:0,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
});
