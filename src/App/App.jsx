import Header from "../Components/Header/Header"
import Guitar from "../Components/Guitar/Guitar"

import { useState, useEffect } from "react"

import { db } from "../data/db"

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart")

    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  //cuando realizamos una consulta a una API podemos inicializar el estado con un array vacio y usar un useEffect para traer los datos, pero en este ejemplo seteamos el estado con el archibo db ya que lo tenemos local
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MIN_ITEMS = 1
  const MAX_ITEMS = 5;

  //Podemos usar un useEffect para traer los datos de la base de datos si es desde una api seria de la mejor forma
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])
  
  function addToCart(item) {
    
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id)

    if (itemExists >= 0) {
      if(cart[itemExists].quantity >= MAX_ITEMS) return
      console.log("Ya esta en el carrito");
      const updateCart = [...cart]
      updateCart[itemExists].quantity++
      setCart(updateCart)

    } else {
      console.log("No esta en el carrito");
      item.quantity = 1
      setCart([...cart, item])
     }
    
  }

  // function removeFromCart(id) {
  //   const updateCart = cart.filter((item) => item.id !== id)
  //   setCart(updateCart)
  // }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function incrementQuantity(id) {
    const updateCart = cart.map(item => {
      if(item.id === id && item.quantity < MAX_ITEMS) {
        return {...item, quantity: item.quantity + 1}
      }
      return item
    })

    setCart(updateCart)
    // setCart(prevCart => prevCart.map(guitar => guitar.id === id ? {...guitar, quantity: guitar.quantity + 1} : guitar))
  }

  function decrementQuantity(id) {
    const downgradedCart = cart.map(item => {
      if(item.id === id && item.quantity > MIN_ITEMS) {
        return {...item, quantity: item.quantity - 1}
      }
      return item
    })
    setCart(downgradedCart)
    
    // setCart(prevCart => prevCart.map(guitar => guitar.id === id ? {...guitar, quantity: guitar.quantity - 1} : guitar))
  }


  function clearCart() {
    setCart([])
  }

  // function saveLocalStorage() {
  //   localStorage.setItem("cart", JSON.stringify(cart))
  // }


  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        clearCart={clearCart}
      />

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">

          {data.map((guitar) =>(
            <Guitar
              key={guitar.id}
              guitar={guitar}
              addToCart={addToCart}
              setCart={setCart}
            />
          ))}
            
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
