import { StyleSheet, Text, View, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Header, Input, Button, ListItem, Icon } from '@rneui/themed';

  const firebaseConfig = {
    apiKey: "AIzaSyB4obANQ_0-efURDcblHGGGYQpjzjDO9wQ",
    authDomain: "shoppinglist-firebase-17a2b.firebaseapp.com",
    databaseURL: "https://shoppinglist-firebase-17a2b-default-rtdb.firebaseio.com/",
    projectId: "shoppinglist-firebase-17a2b",
    storageBucket: "shoppinglist-firebase-17a2b.appspot.com",
    messagingSenderId: "612192629721",
    appId: "1:612192629721:web:215a12bf49adc6a7195fc8",
    measurementId: "G-J4KZV794WZ"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

export default function App() {

  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'products/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.keys(data).map(key => ({key, ...data[key]})) : [];
      setProducts(items);
    })
  }, []);

  const saveProduct = () => {
    console.log('saveProduct', { productName, amount })
    push(
      ref(database, 'products/'),
      { 'product': productName, 'amount': amount }
    );
  }

  const deleteProduct = (key) => {
    console.log('deleteProduct', key);
    remove(ref(database, '/products/' + key))
  };

  const renderItem = ({item}) => (
    <View style={styles.textinput}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.product}</ListItem.Title>
          <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        </ListItem.Content>
        <Icon type="material" name="delete" onPress={() => deleteProduct(item.key)}></Icon>
      </ListItem>
    </View>
  ) 
  

  return (
    <View>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff'} }}
      />
      <Input 
        placeholder='Enter product here' label='PRODUCT'
        onChangeText={(productName) => setProductName(productName)}
        value={productName}
      />  
      <Input 
        placeholder='Enter amount here' label='AMOUNT' 
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />   
      <View style={styles.saveButton}>
        <Button raised icon={{name: 'save'}} onPress={saveProduct} title="Save" /> 
      </View>   
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.key} 
        renderItem={renderItem} 
        data={products} 
      />       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    height: '10%',
  },
  textinput: {
    width: 300,
    marginLeft: '5%',
  },

  textinput2: { 
    marginTop: 5, 
    marginBottom: 5,  
    fontSize:18, 
    width: 200, 
    borderColor: 'gray', 
    borderWidth: 1, 
    height: 30,
  },

  shoppinglistheader: {
    marginTop: 20,
    marginBottom:15, 
    fontSize: 20
  },

  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
