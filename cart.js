import React, { useEffect, useState } from "react";
import NavigationBar from "../components/navbar";
import SmallFooterSection from "../components/smallFooter";
import BigFooterContents from "../components/bigFooter";
import CartButton from "../components/cartButton";
import { Await, Link } from "react-router-dom";
// import cartDatas from '../utils/cartItem.json';


function Cart(){

    const [cartData,setCartData] =  useState([])
    const [quantity,setQuantity] = useState(1);
    const [totalValues,setTotalValues] = useState([]);
    
    const [localTotalQuantity,setLocalTotalQuantity] = useState(0);
    const [localTotalPrice,setLocalTotalPrice] =  useState(0);



    useEffect(()=>{
            const localQuan = localStorage.getItem("itemTotalQuantity");
            if(localQuan){
                setLocalTotalQuantity(localQuan)
            }
            else{
                setLocalTotalQuantity(0)
            }
    
            const localPrice = localStorage.getItem("itemTotalPrice");
            if(localPrice){
                setLocalTotalPrice(localPrice)
            }
            else{
                setLocalTotalPrice(0)
            }
        },[localTotalQuantity,localTotalPrice])



    //  useEffect(()=>{
    //         const fechingData = async ()=>{
    //             const datas = await fetch("http://127.0.0.1:8000/api/cart-total",
    //                 {method:'GET'}
    //             );
    //             const items = await datas.json();
    //             setTotalValues(items)
    //             // console.log(totalValues)
    //         }
    //         fechingData()

    //         totalValues.map((item)=>{
    //             setTotalPrice(item.total_price)
    //             setTotalQuantity(item.total_quantity)
    //         })
    // },[])



    useEffect(()=> {
        const fetchData= async()=>{
            const data= await fetch("http://127.0.0.1:8000/api/cart" , {method:'GET'});
            const item = await data.json();
            setCartData(item);
            // console.log(items)
        }

        fetchData()

        
    },[])


    const [user,SetUser] = useState('');
    
        useEffect(()=>{
            const existUser=JSON.parse(localStorage.getItem("name"));
            if(existUser){
                SetUser(existUser);
            }
            else{
                SetUser('');
            }
            
        },[]);

    return(
        <>
        <NavigationBar/>
        <div>
            <div className="nav-cart-section">
                <div className="cart-div">
                    <div className="left-div">
                        {
                        cartData.length === 0 ?
                            <div className="cart-items">
                            <div className="a-cart-items">
                                <img src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg" alt="kettle"/>
                                <div className="a-cart-text">
                                    <h3>Your Amazon Cart is empty</h3>
                                    <a href="##">Shop today's deals</a>
                                    {user.length !== 0 ? 
                                                    null :    
                                    <div className="signin-buttons">
                                        <Link to={'/signin-page'}><button type="button" className="button1"><span>Sign in to your account</span></button></Link>
                                        <Link to={'/signin-page'}><button type="button" className="button2"><span>Sign up now</span></button></Link>
                                    </div> 
                                    }
                                    
                                </div>
                            
                            </div>
                        </div>
                        :
                        <div className="cart-items-table">
                            <div className="a-cart-items-table">
                                <div className="a-cart-items-top">
                                    <h1>Shopping Cart</h1>
                                    <div className="a-cart-items-text">
                                        <span>Price</span>
                                    </div>
                                </div>
                                
                                <hr/>
                                {cartData.map((items,index)=>{
                                    const item=items.cookerItem
                                    return(
                                        
                                        <div className="cart-added-items">
                                            <div style={{width:"50px"}}>
                                            </div>
                                            <div className="added-items-image">
                                                <img src={item.src}></img>
                                            </div>
                                            <div className="added-items-text">
                                                <div className="added-items-text-grid">
                                                    <div className="grid-text"><span>{item.description}</span></div>
                                                    <div className="price-detail-cart">
                                                        <span className="symbol-cart">$</span>
                                                        <span className="whole-price-cart">{item.whole}</span>
                                                        <span className="fraction-cart">{item.fraction}</span>
                                                    </div>
                                                    <div className="size-section-cart">
                                                        <span className="cart-stock">In Stock</span>
                                                        <span className="size-section" ><span className="cart-size">Size:</span>{item.size}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <CartButton quantityValue={items.itemqQuantity} index={index} id={item.id}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    
                                })}
                                
                            </div>
                            
                        </div>
                        
                        }
                        
                        
                        <div className="empty-cart">
                            
                        </div>
                        <div className="cart-text-div">
                            <p>The price and availability of items at Amazon.com are subject to change. The Cart is a temporary place to store a list of your items and reflects each item's most recent price. Shopping Cart <a href="##">Learn more</a></p><a href="##"></a>
                            <p>Do you have a gift card or promotional code? We'll ask you to enter your claim code when it's time to pay.</p>
                        </div>
                        
                    </div>
                    {
                        cartData.length !== 0 ?
                            <div className="right-div">
                                <div className="cart-total-section">
                                    <div className="price-tag">
                                        <span className="subtotal-text">Subtotal&nbsp;({localTotalQuantity}&nbsp;items):</span>&nbsp;
                                        <span className="price-section">${localTotalPrice}</span>
                                    </div>
                                <div>
                                <button className="check-out-btn">Proceed to checkout</button>
                                </div>
                            </div>

                        </div>
                        :
                        null
                    }
                    
                </div>
            </div>
        </div>
        <SmallFooterSection/>
        <BigFooterContents/>
        </>
    );
}

export default Cart;
