import React from 'react';
import { Icon } from 'expo';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class Card extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.toggleModal}>
        <View style={styles.card}>
            <View style={styles.image}>
            	<Image
            	     style={{ height: WINDOW_WIDTH/2 - 40, width: WINDOW_WIDTH/2 - 20 }}
                   source={this.props.imageUrl}
                   resizeMode="cover"
            	/>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginVertical: 8 }}>
                <Text style={styles.subtext}>{this.props.title}</Text>
                <View style={{width: 30, height: 30}}>
                  <Ionicons name="md-cash" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.price}>{`$${this.props.price}`}</Text>
                </View>
            </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'column',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
        height: 1,
        width: 0
    },
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 16,
    lineHeight: 24,
  },
  price: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 16,
    lineHeight: 24,
    width: '100%',
  },
  image: {
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  subtext: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    bottom: 4
  }
});
