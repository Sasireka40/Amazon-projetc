import React, { useEffect, useState } from "react";
import '../pages/index.css';
import trash from '../assets/trash.png';

export default function CartButton(props){
    // console.log(props)
    const [quantity,setQuantity] =  useState(props.quantityValue);
    const [cartData,setCartData] = useState([]);
    const [cartId,setCartId] = useState(null);
    const [totalValues,setTotalValues] = useState([]);
    const [totalId,setTotalId] = useState(null);
    const [totalQuantity,setTotalQuantity] = useState(0);
    const [totalPrice,setTotalPrice] = useState(0);
    
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
    

 


    useEffect(()=>{
                const fechingData = async ()=>{
                    const datas = await fetch("http://127.0.0.1:8000/api/cart-total",
                        {method:'GET'}
                    );
                    const items = await datas.json();
                    setTotalValues(items)
                    // console.log(totalValues)
                }
                fechingData()
    },[])



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


                cartData.map((items)=>{
                    if(props.id === items.cookerItem.id){
                        setQuantity(items.itemqQuantity)
                    }
                    
                })
    },[])



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
    


    //add quantity value in the cart table 
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
                body: JSON.stringify({ itemqQuantity: quantity+1 }),
                }
            )
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
    
    //delete cart items from the cart table
    function deleteItems(id){
         cartData.map((data)=>{
        if(data.cookerItem.id === id){
                setCartId(data.id)
                // console.log(cartId)
            }
        })

        const deleteData = async()=>{
            const deleted = await fetch(`http://127.0.0.1:8000/api/cart/${cartId}`,
                {method :'DELETE'}
            )
        }
        deleteData()
    }

    //reduce quantity items
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
                body: JSON.stringify({ itemqQuantity: quantity -1 }),
                }
            )
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


    return(
        <div>
            <div>
                <div className="quantity-cart-button" key={props.index}>
                {quantity >= 2 ?  
                    <button className="reduce-btn" onClick={()=>reduceItems(props.id)}><span>-</span></button> :
                    <button className="trash-btn" onClick={()=> deleteItems(props.id)}><img src={trash} alt="delete"/></button> }
                                                    
                    {quantity}
                    <button className="add-btn" onClick={()=>addItems(props.id)}><span>+</span></button>
            </div>
        </div>
        </div>
    );
}

