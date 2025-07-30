import React, { useEffect, useState } from "react";
import '../pages/index.css';
import CartButton from "./cartButton";
// import cartData from '../utils/cartItem.json';
import { Link } from "react-router-dom";

function SideCartItems(){

    // const [items,setItems] = useState([]);
    const [totalPrice,setTotalPrice] = useState(1);
    const [cartData,setCartData] = useState([]);
    const [totalValues,setTotalValues] = useState([]);
    const [localQuantity,setLocalQuantity] = useState(0);
    
    
    useEffect(()=>{
                const quantityData = localStorage.getItem("localQuantityValue")
                if(quantityData){
                    setLocalQuantity(quantityData)
                }
                else{
                    setLocalQuantity(0)
                }
    },[localQuantity])
    


    useEffect(()=>{
            const fetchData= async()=>{
                await fetch("http://127.0.0.1:8000/api/cart",
                    {method :'GET'}
                )
                .then(response => response.json())
                .then(data => setCartData(data))
                // console.log(cartData)
                
            }
            fetchData()            
    },[localQuantity])


    useEffect(()=>{
        const fechingCart= async()=>{
                        const datas = await fetch("http://127.0.0.1:8000/api/cart-total",
                            {method:'GET'}
                        )  
                    .then(response => response.json())
                    .then(data => setTotalValues(data)) 
                    
                }
        fechingCart()

        totalValues.map((item)=>(
                setTotalPrice(item.total_price)
                // console.log(item.total_price)
            )) 
            
    },[localQuantity])

    
    
    return(
        <div>
            <div className="cart-divion">
                <div>
                    <h1 className="cart-divition-heading">Subtotal</h1>
                    {/* {console.log(totalValues.total_price)} */}
                    <span><h2 className="total-price">${totalPrice}</h2></span>
                    <Link to={'/cart'}><button type="button" className="cart-btn">Go to Cart</button></Link>
                </div>
                
                <hr></hr>
                <div className="mini-cart-items">
                    
                    {cartData.map((items,index)=>{
                    // {console.log(item)}
                    const item = items.cookerItem
                    return(
                        <div className="cart-img" key={index}>
                            <img src={item.src} ></img>
                            <div>
                                <p>${item.price}</p>
                            </div>
                            <div>
                                <CartButton quantityValue={items.itemqQuantity} index={index} id={item.id}/>
                            </div>
                            
                        </div>
                    )
                
                
                }
                )}
                </div>
                
            </div>
            
            
        </div>
    );
}

export default SideCartItems;
