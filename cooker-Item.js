import React ,{useEffect, useState} from "react";
import '../pages/index.css';
import arrow from '../assets/arrow-down.png';
import star from '../assets/star4.jpg';
import trash from '../assets/trash.png';
import { data } from "react-router-dom";
import SideCartItems from "./sidecartItems";

function CookerItemsContainer(datas){


    // console.log(datas);
    
    let items=datas.items;
    let isVisible=datas.isVisible;
    let index = datas.index;

    const [buttonVisible,setButtonVisible] = useState({});
    const [quantity,setQuantity] =  useState(1);
    // const [cartItems,setCartItems] = useState(0);
    const [cartData,setCartData] = useState([]);
    const [cartId,setCartId] = useState(null);
    const [totalValues,setTotalValues] = useState([]);
    const [totalId,setTotalId] = useState(null);
    const [totalQuantity,setTotalQuantity] = useState(0);
    const [totalPrice,setTotalPrice] = useState(0);

    const [localQuantity,setLocalQuantity] = useState(0);
    const [localTotalQuantity,setLocalTotalQuantity] = useState(0);
    const [localTotalPrice,setLocalTotalPrice] =  useState(0);


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
        
        const fechingData = async ()=>{
                const datas = await fetch("http://127.0.0.1:8000/api/cart-total",
                    {method:'GET'}
                );
                const content = await datas.json();
                setTotalValues(content)
                // console.log(totalValues)
            }
            fechingData()
        
    },[])

   
    const getCartData = ()=>{
        const fetchData= async()=>{
            await fetch("http://127.0.0.1:8000/api/cart",
                {method :'GET'}
            )
            .then(response => response.json())
            .then(data => setCartData(data))
            // console.log(cartData)
            
        }
        fetchData()


        //delete data from totalvalues table
        if(cartData.length === 0){
            
        totalValues.map((item)=>{
            setTotalId(item.id) 
        })
        const deleteTotalValues = async()=>{
            const datas = await fetch(`http://127.0.0.1:8000/api/cart-total/${totalId}`,
                {method:'DELETE'}
            )
        }
            deleteTotalValues()
            
        }
    }
    

    //patch method for add total quantity and price t the table
    const patchDatas = ()=>{
        const patchTotal = async()=>{
            const datas = await fetch(`http://127.0.0.1:8000/api/cart-total/${totalId}`,
                {method:'PATCH',
                    headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ total_quantity: totalQuantity, total_price : totalPrice}),

                }

            )

      }
      patchTotal()

    }

    const totalValuesofItems = ()=>{
        //set total quantity and price to toalcart table
    
        let totalQuantityValue = 0
        let totalPriceValue = 0.0
        cartData.map((item)=>(
            
            totalQuantityValue += (item.itemqQuantity + 1)
            // console.log(totalQuantityValue)
            
        ))
        cartData.map((items)=>{
            totalPriceValue += ((items.itemqQuantity +1) * items.cookerItem.price)
            // console.log(totalPriceValue)
        })

        setTotalPrice(totalPriceValue);
        setTotalQuantity(totalQuantityValue);
        localStorage.setItem("itemTotalQuantity",totalQuantity);
        localStorage.setItem("itemTotalPrice",totalPrice);
    }
    

    const reducedTotalValuesofItems = ()=>{
        //set total quantity and price to toalcart table
    
        let totalQuantityValue = 0
        let totalPriceValue = 0.0
        cartData.map((item)=>(
            
            totalQuantityValue += (item.itemqQuantity - 1)
            // console.log(totalQuantityValue)
            
        ))
        cartData.map((items)=>{
            totalPriceValue += ((items.itemqQuantity - 1) * items.cookerItem.price)
            // console.log(totalPriceValue)
        })

        setTotalPrice(totalPriceValue);
        setTotalQuantity(totalQuantityValue);
        localStorage.setItem("itemTotalQuantity",totalQuantity);
        localStorage.setItem("itemTotalPrice",totalPrice);
    }


    //add to art button onclick function
    function changecontainer(id){

        //set button visible agter clicking add to cart button
        isVisible=!datas.isVisible
        // setCartItems(1);
        // console.log(isVisible);
        setButtonVisible((preValue) => ({
            ...preValue,
            [id]:!preValue[id]
        }));
        
        
        // console.log(buttonVisible)
        //post cart items in cart table
        const postData = async() =>{
            const data = await fetch("http://127.0.0.1:8000/api/cart",
                {method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemqQuantity: quantity, cookerItem_id : id }),
                }
            )
            

            // getCartData()
            localStorage.setItem("localQuantityValue",quantity);
        }
        
        postData()
        

        
        //update quantity even after refresh
        cartData.map((item)=>{
            if(id === item.cookerItem.id){
                setQuantity(item.itemqQuantity)
            } 
            
        })
        
        
        //function for post total quantity and price
        const postPriceQuantity = async()=>{
            fetch("http://127.0.0.1:8000/api/cart-total",
                {method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ total_quantity : totalQuantity,total_price: totalPrice}),
                }
            )
        }
        
        postPriceQuantity()

        
        
    }


    //add items to cart table 
    const addItems = (id) => {
        setQuantity(quantity+1);
        cartData.map((data)=>{
        if(data.cookerItem.id === id){
                setCartId(data.id)
                // console.log(cartId)
            }
        })
        const patchData = async()=>{

            const patching= await fetch(`http://127.0.0.1:8000/api/cart/${cartId}`,
                {method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemqQuantity: quantity + 1 }),
                }
            )
            
            // getCartData()
            localStorage.setItem("localQuantityValue",quantity);

        }
        patchData()


         
        // console.log(totalValues)
        totalValues.map((item)=>{
            setTotalId(item.id) 
        })

        totalValuesofItems()
        
    //patch quantity and price datas
      patchDatas()


    }
    
    //delete items from cart table
    function deleteItems(id){
         setButtonVisible((preValue) => ({
            ...preValue,
            [id]:!preValue[id]
        }));
        

        cartData.map((data)=>{
        if(data.cookerItem.id === id){
                setCartId(data.id)
                // console.log(cartId)
            }
        })

        //delete items from the art table
        const deleteData = async()=>{
            const deleted = await fetch(`http://127.0.0.1:8000/api/cart/${cartId}`,
                {method :'DELETE'}
            )
            localStorage.setItem("localQuantityValue",quantity);
        }
        deleteData()
        

        

    
    }


    //reduce quantity 
    function reduceItems(id){
        if(quantity > 0)
            setQuantity(quantity-1)
        cartData.map((data)=>{
        if(data.cookerItem.id === id){
                setCartId(data.id)
                // console.log(cartId)
            }
        })
        const patchData = async()=>{

            const patching= await fetch(`http://127.0.0.1:8000/api/cart/${cartId}`,
                {method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemqQuantity: quantity -1  }),
                }
            )

            getCartData()
            localStorage.setItem("localQuantityValue",quantity);
        }
        patchData()

        
        
        // console.log(totalValues)
        totalValues.map((item)=>{
            setTotalId(item.id) 
        })

        reducedTotalValuesofItems()

        //patch quantity and price datas
        patchDatas()
        
    }


    // console.log(datas)

    return(
        <div>
            <div className={isVisible ? "cooker-cart":"cooker"} key={index}>
                <div className="cooker-images">
                    <img src={items.src} alt="cooker"/>
                </div>
                <div className={isVisible ? "cooker-content-cart" : "cooker-content"}>
                    <div className="heading">
                        <h2><span>{items.description}</span></h2>
                    </div>
                    
                    <div className="ratings">
                        <div className="cooker-text">{items.ratingCount}</div>
                        <div className="stars"><img src={star} alt="star" /></div>
                            <img src={arrow}/>
                            <div className="cooker-text"><a href="##">{items.baughtCount}</a></div>
                        </div>
                        <span className="baught-text">{items.baughtText}</span>
                        <div className="pricing">
                            <span className="acual-price">${items.price}</span>
                            <div className="price-detail">
                                <span className="symbol">$</span>
                                <span className="whole-price">{items.whole}</span>
                                <span className="fraction">{items.fraction}</span>
                            </div>
                        </div>
                        <div className="delivery">
                            Delivery<span>&nbsp;{items.deliveryShort}</span>
                        </div>
                        <div className="shipping">
                            <span className="ship-location">Ships to India</span>
                        </div>
                        <div className="cart-btn-section">
                            <button type="button" className="cart-button" onClick={() =>changecontainer(items.id)} style={{opacity:buttonVisible[items.id] ? "0" :"1"}} key={items.id}>Add To Cart</button>
                                {/* {console.log(clicked)} */}
                                {buttonVisible[items.id] ? 
                                <div>
                                    <div className="quantity-button" key={index}>
                                        {quantity >= 2 ?  
                                            <button className="reduce-btn" onClick={()=>reduceItems(items.id)}><span>-</span></button> :
                                            <button className="trash-btn" onClick={()=> deleteItems(items.id)}><img src={trash} alt="delete"/></button> }
                                                    
                                            {quantity}
                                            {/* {console.log(item.unit)} */}
                                            <button className="add-btn" onClick={()=>addItems(items.id)}><span>+</span></button>
                                    </div>
                                </div>
                                    : ""}
                        </div>
                                            

                </div>

                                        
            </div>
            
        </div>
    );
}


export default CookerItemsContainer;
