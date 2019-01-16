import React from 'react';
import { Icon } from 'expo';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '../constants/Colors';
import Dialog, { SlideAnimation, DialogContent, DialogTitle, DialogButton } from 'react-native-popup-dialog';
import { Ionicons } from '@expo/vector-icons';
import { Constants } from 'expo';
import { TextField } from 'react-native-material-textfield';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import TomTomAutocomplete from './TomTomAutocomplete';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class KramDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      recipients: [{ name: '', contact: '' }],
      showPaymentTitle: true
    }
    this.recipientsCount = 1;
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));
    } else {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
  }

  componentWillUnmount() {
      if (Platform.OS === 'ios') {
          this.keyboardWillShowListener.remove();
          this.keyboardWillHideListener.remove();
      } else {
          this.keyboardDidShowListener.remove();
          this.keyboardDidHideListener.remove();
      }
  }


  _keyboardWillShow(event) {

  }

  _keyboardWillHide(event) {
      this.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }

  _keyboardDidShow(event) {

  }

  _keyboardDidHide(event) {
      this.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }

  onChangeText = (field, value) => {
    this.setState({ [field]: value });
  }

  onChangeRecipants = (index, field, value) => {
    let newRecipients = [...this.state.recipients];
    newRecipients[index][field] = value;
    if (index+1 === this.state.recipients.length)
      newRecipients.push({ name: '', contact: '' });
    this.setState({ recipients: newRecipients });
  }

  onFocus = (value) => {
      this.scrollView.scrollTo({x: 0, y: value, animated: true})
  }

  renderKramView = () => {
    return (
      !this.props.isItemView && this.props.isKramView && !this.props.isPaymentSuccessView && !this.props.isLoading &&
      <ScrollView style={styles.kramView} ref={(ref) => this.scrollView = ref }>
        <KeyboardAvoidingView behavior="padding">
        <Text style={[styles.sectionText, { alignSelf: 'center', marginBottom: 20 }]}>Split evenly among the group</Text>
        <Text style={styles.sectionText}>Your group</Text>
        <View style={styles.textFieldRow}>
          <TextField
            label='Your Name'
            inputContainerStyle={styles.textField}
            labelTextStyle={styles.labelText}
            value={this.state.name}
            onFocus={ () => this.onFocus(80)}
            containerStyle={{ flex: 1, marginRight: 12 }}
            onChangeText={ (name) => this.onChangeText('name', name) }
          />
          <TextField
            label='Your Email'
            inputContainerStyle={styles.textField}
            labelTextStyle={styles.labelText}
            value={this.state.email}
            onFocus={ () => this.onFocus(80)}
            containerStyle={{ flex: 1 }}
            onChangeText={ (email) => this.onChangeText('email', email) }
          />
        </View>
        <TomTomAutocomplete
          placeholder = "Your Address"
        />
        <Text style={styles.sectionText}>Invitees</Text>
        { this.renderRecipants() }
        <Text style={styles.sectionText}>Payment</Text>
        <Text style={styles.greysubtext}>{'You\'ll only pay for your share'}</Text>
        <View style={styles.creditCard}>
          <CreditCardInput
            labelStyle={{ fontFamily: 'Avenir' }}
            inputStyle={{ fontFamily: 'Avenir' }}
            allowScroll={true}
            onChange={this._onChange}
          />
        </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  renderPaymentSuccessView = () => {
    return (
      !this.props.isItemView && !this.props.isKramView && this.props.isPaymentSuccessView && !this.props.isLoading &&
      <Animatable.View style={styles.paymentSuccessView} animation="slideInUp" delay={2000}>
        <View style={styles.bigIcon}>
          <Ionicons name="md-checkmark-circle" size={148} color="green" />
        </View>
        {
          this.props.showPaymentTitle &&
          <Animatable.View animation="fadeOut" delay={2000} onAnimationEnd={this.runAllMethods}>
            <Text style={styles.paymentSuccessTitle}>Payment Success</Text>
            <Text style={styles.paymentSuccessSubtitle}>Your invitees has been notified to make payment for their shares.</Text>
          </Animatable.View>
        }
        {
          !this.props.showPaymentTitle &&
          <View>
            <Animatable.View animation="fadeIn" delay={600}>
              <Text style={styles.paymentSuccessTitle}>Your invitees</Text>
            </Animatable.View>
            <Animatable.View animation="fadeIn" delay={1100} style={styles.paymentSuccessInviteeRow}>
              <View>
                <Text style={styles.paymentSuccessName}>Mark</Text>
              </View>
              <View style={styles.paymentSuccessSmallIcon}>
                <Ionicons name="md-checkmark-circle" size={48} color="green" />
              </View>
            </Animatable.View>
            <Animatable.View animation="fadeIn" delay={1600} style={styles.paymentSuccessInviteeRow}>
              <View>
                <Text style={styles.paymentSuccessName}>Clement</Text>
              </View>
              <View style={styles.paymentSuccessSmallIcon}>
                <Ionicons name="md-close-circle" size={48} color="red" />
              </View>
            </Animatable.View>
            <Animatable.View animation="fadeIn" delay={2100} style={styles.paymentSuccessInviteeRow}>
              <View>
                <Text style={styles.paymentSuccessName}>Htet</Text>
              </View>
              <View style={styles.paymentSuccessSmallIcon}>
                <Ionicons name="md-close-circle" size={48} color="red" />
              </View>
            </Animatable.View>
            <Animatable.View animation="fadeIn" delay={2600} style={styles.paymentSuccessInviteeRow}>
              <View>
                <Text style={styles.paymentSuccessName}>Wei Kang</Text>
              </View>
              <View style={styles.paymentSuccessSmallIcon}>
                <Ionicons name="md-close-circle" size={48} color="red" />
              </View>
            </Animatable.View>
          </View>
        }
      </Animatable.View>
    )
  }

  renderRecipants = () => {
    return this.state.recipients.map((item, i) => (
      <React.Fragment>
        <View style={styles.textFieldRow} key={i}>
          <TextField
            label='Name'
            inputContainerStyle={styles.textField}
            labelTextStyle={styles.labelText}
            value={item.name}
            containerStyle={{ flex: 1, marginRight: 12 }}
            onChangeText={ (name) => this.onChangeRecipants(i, 'name', name) }
          />
          <TextField
            label='Contact'
            inputContainerStyle={styles.textField}
            labelTextStyle={styles.labelText}
            value={item.contact}
            containerStyle={{ flex: 1 }}
            onChangeText={ (contact) => this.onChangeRecipants(i, 'contact', contact) }
          />
        </View>
        <TomTomAutocomplete
          placeholder = "Address"
        />
      </React.Fragment>
    ))
  }

  renderLoader = () => {
    return (
      this.props.isLoading &&
      <View style={styles.loaderContainer}>
        <ActivityIndicator style={{ marginBottom: 20 }} size="large" color='rgba(63, 63, 191, 1)' />
        <Text style={styles.subtext}>Powered by KRAM</Text>
      </View>
    )
  }

  chatSend = (message) => {
    var request = new XMLHttpRequest();
    var username = 'Your Username here';
    var key = 'Your PubNub Key here';
    var number = 'Your phone number here';
    request.open('POST', 'https://api-mapper.clicksend.com/http/v2/send.php');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        console.log('Status:', this.status);
      }
    };
    var body = "username="+username+"&key="+key+"&to="+number+"&message=" + message;
    request.send(body);
  }

  runAllMethods = () => {
    this.chatSend("Kram: Mark has placed a group order for you. Please make payment for your share here: https://tinyurl.com/MarkWallet");
    this.props.togglePaymentTitle();
  }

  render() {
    return (
      <Dialog
        key={Object.keys(this.props)}
        visible={this.props.isOpenDialog}
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom'
        })}
        actions={
          !this.props.isLoading && !this.props.isPaymentSuccessView ?
          [
            <DialogButton
              key={0}
              text={this.props.isItemView ? "Checkout" : "Cancel" }
              onPress={this.props.toggleDialog}
            />,
            <DialogButton
              key={1}
              text={this.props.isItemView ? "KRAM" : "Pay"}
              onPress={() => { this.props.handleAction() }}
            />
          ]
          :
          !this.props.isLoading && this.props.isPaymentSuccessView ?
          [
            this.props.isPaymentSuccessView &&
            <DialogButton
              key={1}
              text={"Dismiss"}
              onPress={() => { this.props.handleAction() }}
            />
          ] : []}
        width={WINDOW_WIDTH}
        height={WINDOW_HEIGHT}
        containerStyle={[{ flex: 1 }, Platform.OS === 'android' && { marginTop: Constants.statusBarHeight }]}
        onTouchOutside={this.props.toggleDialog}
      >
      <DialogTitle textStyle={styles.plaintext} style={styles.title} title={this.props.title} />
      {
        this.props.isItemView && !this.props.isKramView && !this.props.isPaymentSuccessView && !this.props.isLoading &&
        <ScrollView style={styles.content}>
            <View style={styles.image}>
              <Image
                   style={{ height: WINDOW_WIDTH/2 + 40, width: WINDOW_WIDTH }}
                   source={this.props.imageUrl}
                   resizeMode="cover"
              />
            </View>
              <View style={[styles.infoRow, { marginTop: 16 }]}>
                <View style={styles.icon}>
                  <Ionicons name="md-time" size={24.5} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.time}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-pricetag" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{`$${this.props.price}`}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-heart" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{`${this.props.likes} Likes`}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-cube" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.condition}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-grid" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.type}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-information-circle" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.description}</Text>
                </View>
              </View>
          </ScrollView>
      }
      { this.renderKramView() }
      { this.renderPaymentSuccessView() }
      { this.renderLoader() }
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 25,
  },
  container: {
    flex: 1,
    marginBottom: 50
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  plaintext: {
    fontFamily: 'Avenir',
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '500'
  },
  sectionText: {
    fontFamily: 'Avenir',
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 12,
    paddingTop: 25,
  },
  subtext: {
    fontFamily: 'Avenir',
    fontSize: 16,
    lineHeight: 25,
  },
  greysubtext: {
    fontFamily: 'Avenir',
    color: 'grey',
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 8
  },
  link: {
    fontFamily: 'Avenir',
    color: '#0099CC',
    fontSize: 16,
    lineHeight: 25,
    paddingLeft: 5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 30,
    height: 30
  },
  bigIcon: {
    width: 148,
    height: 148,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textFieldRow: {
    flexDirection: 'row',
    marginBottom: 24
  },
  textField: {
    marginTop: -24,
    marginBottom: -16
  },
  labelText: {
    fontFamily: 'Avenir',
    color: 'rgba(63, 63, 191, 1)'
  },
  creditCard: {
    marginBottom: 96,
  },
  kramView: {
    flex: 1,
    padding: 24
  },
  paymentSuccessView: {
    flex: 1,
    padding: 24,
  },
  paymentSuccessTitle: {
    fontFamily: 'Avenir',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  paymentSuccessSubtitle: {
    fontFamily: 'Avenir',
    fontSize: 16,
    color: 'grey',
    alignSelf: 'center',
    textAlign: 'center',
  },
  paymentSuccessInviteeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  paymentSuccessName: {
    fontFamily: 'Avenir',
    fontSize: 20,
    color: 'grey'
  },
  paymentSuccessSmallIcon: {
    width: 44,
    height: 44
  }
});
