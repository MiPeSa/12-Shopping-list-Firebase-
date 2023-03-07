import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { useEffect, useState } from 'react';

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

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.textinput1}
        placeholder='Product' 
        onChangeText={(productName) => setProductName(productName)}
        value={productName}
      />  
      <TextInput 
        style={styles.textinput2}
        placeholder='Amount' 
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />      
      <Button onPress={saveProduct} title="Save" /> 
      <Text style={styles.shoppinglistheader}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.key} 
        renderItem={({item}) => 
          <View style={styles.listcontainer}>
            <Text 
              style={{fontSize: 18}}>{item.product}, {item.amount}
            </Text>
            <Text style={{fontSize: 18, color: 'red'}} onPress={() => deleteProduct(item.key)}> Delete</Text>
          </View>
        } 
        data={products} 
        ItemSeparatorComponent={listSeparator} 
      />       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput1: {
    marginTop: 50, 
    fontSize: 18, 
    width: 200, 
    borderColor: 'gray', 
    borderWidth: 1, 
    height: 30,
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
