import React ,{ useEffect, useState} from "react";
import NavigationBar from "../components/navbar";
import arrow from '../assets/arrow-down.png';
import star from '../assets/star4.jpg';
// import cookerData from '../utils/cookerData.json';
import SignInSection from "../components/signInSection";
import SmallFooterSection from "../components/smallFooter";
import BigFooterContents from "../components/bigFooter";

import SideCartItems from "../components/sidecartItems";
import CookerItemsContainer from "../components/cookerItem";

function CookerItems(){
    const [user,SetUser] = useState('');
    const [isShow,setIsShow] =useState(false);
    const [cookerData,setCookerData] =  useState([]);
    const [cartItemData,setCartItemData] = useState([]);
    const [localQuantity,setLocalQuantity] = useState(0);

    const [localTotalQuantity,setLocalTotalQuantity] = useState(0);
    


    useEffect(()=>{
            const localQuan = localStorage.getItem("itemTotalQuantity");
            if(localQuan){
                setLocalTotalQuantity(localQuan)
            }
            else{
                setLocalTotalQuantity(0)
            }
            console.log(localTotalQuantity)
        },[localTotalQuantity]);
    


        useEffect(()=>{
            const quantityData = localStorage.getItem("localQuantityValue")
            if(quantityData){
                setLocalQuantity(quantityData)
            }
            else{
                setLocalQuantity(0)
            }
        },[localQuantity])

//api for ooker items
    useEffect(()=>{
        const fetchData =  async () =>{
            const data= await fetch("http://127.0.0.1:8000/api/cooker-items" , {method :'GET'});
            const items= await data.json();
            setCookerData(items);
        }
        fetchData()
    },[])


    useEffect(()=>{
            const fetchData= async()=>{
                await fetch("http://127.0.0.1:8000/api/cart",
                    {method :'GET'}
                )
                .then(response => response.json())
                .then(data => setCartItemData(data))
                // console.log(cartItemData)
                 // console.log(cartItemData.length)
                // if (cartItemData.length >0){
                //     setIsShow(true)
                // }
                // else{
                //         setIsShow(false)
                // }
            }

            fetchData()
            const intervel = setInterval(fetchData,5000)
    
            return ()=>{
                clearInterval(intervel)
            };
           
        },[])

    // useEffect(()=>{
    //     if (cartItemData.length >0){
    //          setIsShow(true)
    //     }
    //     else{
    //                 setIsShow(false)
    //         }
    // },[localQuantity])


    useEffect(()=>{
            const lenData=JSON.parse(localStorage.getItem("length"));
            if(lenData){
                if(lenData > 0)
                {
                    setIsShow(true)
                }
                else{
                    setIsShow(false)
                }
            }  
    },[])
    

    
    // setButtonVisible(false)

    
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
            <div className={isShow ? "cart-container" : ""}>
                <div>
                    <NavigationBar 
                    visible={isShow} 
                    totalquantityValue={localTotalQuantity}/>
                    <div>
            
             <div className={ isShow ? "bottom-container-cart" : "bottom-container"}>
                <div className="right-column">
                    <span>1-48 of over 60,000 results for </span><span className="right-column-text">"Cooker"</span>
                </div>
                <div className="left-column">
                    <div className="left-divition">
                        <span>Sort by:</span>
                        <span>Featured</span>
                        <img className="arrow-down" src={arrow}/>
                    </div>
                </div>
            </div>
            <hr/>
            <div className={isShow ? "product-items-cart" : "product-items"}>
                <div className= {isShow ? "size-info-cart" : "size-info"}>
                    <span className="gender-text">Popular Shopping Ideas</span>
                    <div className="list-items">
                        <ul>
                        <li>Portable</li>
                        <li>Stainless Steel</li>
                        <li>Cast Iron</li>
                        <li>Travel</li>
                    </ul>
                    </div>
                    <div className="see-more">
                        <img src={arrow}/>
                        <a>See more</a>
                    </div>
                    <hr></hr><br/>
                    <div>
                        <span className="gender-text">Customer Reviews</span>
                        <div className="star">
                            <div><img src={star}></img></div>
                            <div><span>&Up</span></div>
                        </div>
                    </div>
                    
                </div>
                <div className="cooker-products">
                    <h2>Results</h2>
                    <span className="product-title">Check each product page for other buying options.</span>
                    <div className="cooker-items">

                        {
                            cookerData.map((item,index) => {
                                // console.log(item)
                            
                                return(
                                    <CookerItemsContainer items={item} isVisible={isShow}  
                                    index={index}/>
                                    
                                );
                            })
                        }

                    </div>
                </div>
                
            </div>
        </div>
        {user.length !== 0 ? 
            null : <SignInSection/>     
        }
    
        <SmallFooterSection/>
        <BigFooterContents/>
        </div>

        {isShow ? <SideCartItems/> : null}
        </div>
        
        
        </>
        
        
    );
}

export default CookerItems;
