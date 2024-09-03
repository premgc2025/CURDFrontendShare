
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TheContext } from './TheContext'
import { useContext } from 'react'
import { baseurl } from '../helper'




function CURDreport() {
    const allMessage = useContext(TheContext)

    const {message, setMessage} = allMessage
    console.log("newMessage",message.Message)


    const navigate = useNavigate()

    const [data, setData] = useState([])

    const [query, setQuery] = useState('')
    let filterItem = data.filter((item) => {
        return item.name.toLowerCase().includes(query)
    })
    console.log("filetrItem", filterItem)

    const [currentPage, setCurrentPage] = useState(1)
    // let currentPage = 1;

    // Search

    function search(event) {
        setQuery(event.target.value.toLowerCase())

    }

    // Pagination



    const nOfPage = Math.ceil(data.length / 5)

    const endIndex = currentPage * 5;
    const startIndex = (endIndex - 5)
    const pagination = filterItem.slice(startIndex, endIndex)

    const numbers = [...Array(nOfPage + 1).keys()].slice(1);

    let sn = startIndex;

    function paginationPrev() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    function paginationNext() {
        if (currentPage < nOfPage) {
            setCurrentPage(currentPage + 1)
        }
    }

    function paginationSelect(id) {
        setCurrentPage(id)

    }




    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    })

    //For Errors set

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    })

    function customerHandle(event) {

        setCustomer((preValue) => {

            return ({ ...preValue, [event.target.name]: event.target.value }

            )
        })
    }

    //   useEffect

    useEffect(() => {

        getData()


    }, [message])


    // Get Function

    function getData(){
        fetch(`${baseurl}/customer`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((data) => data.json())
            .then((finalData) => {
                setData(finalData)

            })
            .catch((err) =>{
                console.log(err)
            })

    }

  

    //   Create Customer Details
    function customerSubmit(event) {
        event.preventDefault()

        if (validateForm()) {



            // alert('Form submitted successfully!');
            // You can handle form submission here (e.g., send data to an API)

            fetch(`${baseurl}/customer`, {
                method: "POST",
                body: JSON.stringify(customer),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((data) => {
                    if(data.status===201){
                        setCustomer(
                            {
                                name: "",
                                email: "",
                                phone: "",
                                address: ""
                            })}

                    console.log("get",data)
                   return data.json()
                  
                })
                .then((fdata)=>{
                    setMessage(fdata)

                    setTimeout(()=>{
                        setMessage({})                     

                    },5000)                  
                })

                .catch((err) => console.log("error",err))
        }

    }



    //   Delete Handle

    function deleteHandle(event, index) {
        event.preventDefault()

        fetch(`${baseurl}/customer/${index}`, {
            method: "DELETE",
            Headers: {
                "Content-Type": "application/json"
            }
        })
            .then((info) => {
                console.log("Deleted item Successfully", info)
                return info.json()          
               

            })
            .then((fData)=>{
                setMessage(fData)

                setTimeout(()=>{
                    setMessage({})
                },5000)              

            })
            .catch((err) => console.log({ Message: "Failed to delete item" }))

    }

    //   Edit Handle

    const [editId, setEditId] = useState()


    function editIdHandle(id) {
        setEditId(id)
    }

    //   Edit Function

    function Edit({ client, data, setData, i }) {

        const [editData, setEditeData] = useState({
            name: `${client.name}`,
            email: `${client.email}`,
            phone: `${client.phone}`,
            address: `${client.address}`,
            date: `${client.date}`
        })

        const eId = client._id

        function updateInput(event) {

            setEditeData((preVal) => {
                return ({ ...preVal, [event.target.name]: event.target.value })

            })
        }

        function updateSubmit(event) {
            event.preventDefault()

            fetch(`${baseurl}/customer/${eId}`, {
                method: "PUT",
                body: JSON.stringify(editData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((info) => {
                    console.log("Updateitem Successfully")
                    return info.json()
                })
                .then((fdata)=>{
                    setMessage(fdata)

                    setTimeout(()=>{
                        setMessage({})                     

                    },5000)

                    setEditId()

                })
                .catch((err) => console.log({ Message: "Failed to Update item" }))

        }

        //  Note:- use defaultValue={item.name} to edit and update value and apply new onChange={} function
        return (
            <>
                <tr className='tr-update'>
                    <td></td>
                    <td> <input className='inp-update' type="text" name="name" placeholder='Enter Customer Name' required onChange={updateInput} defaultValue={client.name} /></td>
                    <td> <input className='inp-update' type="text" name="email" placeholder='Enter Email' required onChange={updateInput} defaultValue={client.email} /> </td>
                    <td> <input className='inp-update' type="number" name="phone" placeholder='Enter Phone Number' required onChange={updateInput} defaultValue={client.phone} /> </td>
                    <td> <input className='inp-update' type="text" name="address" placeholder='Enter Address' required onChange={updateInput} defaultValue={client.address} /></td>
                    <td> <input className='inp-update' type="date" name="date" placeholder='Enter Date' required onChange={updateInput} defaultValue={client.date} /></td>
                    <td> <button className='update-btn' onClick={updateSubmit}>UPDATE</button></td>

                </tr>
            </>
        )
    }

    // Validation Form

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!customer.name) {
            errors.name = 'Name is required';
            isValid = false;
        }

        if (!customer.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }
        if (!customer.phone) {
            errors.phone = 'Phone is required';
            isValid = false;
        } else if (customer.phone.length != 10) {
            errors.phone = 'Phone is invalid';
            isValid = false;
        }
        if (!customer.address) {
            errors.address = 'Address is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    return (
        <div className="curdreport-container">
            <div className="curdreport">
                <h1 className='report-title'>Customer Record</h1>
                {/* Form section */}
                <div className="form">
                    <div className="form-inp">
                        <input className='inp' type="text" name="name" placeholder='Enter Customer Name' onChange={customerHandle} value={customer.name} />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div className="form-inp">
                        <input className='inp' type="text" name="email" placeholder='Enter Email' onChange={customerHandle} value={customer.email} />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>
                    <div className="form-inp">
                        <input className='inp' type="number" name="phone" placeholder='Enter Phone Number' onChange={customerHandle} value={customer.phone} />
                        {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
                    </div>
                    <div className="form-inp">
                        <input className='inp' type="text" name="address" placeholder='Enter Address' onChange={customerHandle} value={customer.address} />
                        {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
                    </div>
                    <button className='form-btn' onClick={customerSubmit}>Add</button>
                </div>


                <div className="search-parent">
                    <h3>Customer Information</h3>
                    <input type="search" className='search-inp' placeholder='Search by Name' onChange={search} />
                   
                </div>

                <div className="message">
                    <p className='message-box'>{message.Message}</p>
                </div>

                <div className="pagination">
                    <button className='pagination-btn' onClick={paginationPrev} >&#10094;</button>
                    {
                        numbers.map((num, i) => {
                            return <button key={i + 1}  className={`pagination-btn ${currentPage === num ? 'active' : ""}`} onClick={() => {
                                paginationSelect(num)
                            }}>{num}</button>
                        })
                    }
                    <button className='pagination-btn' onClick={paginationNext} >&#10095;</button>
                  
                </div>
                {/* Table Section */}
                <div className="table-parent">
                    <div className="table-customer">
                        <table className='table'>


                            <thead>
                                <tr>
                                    <th>SN.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    pagination.map((client, i) => {
                                        sn++;

                                        return (editId === client._id ? <Edit client={client} data={data} setData={setData} i={i} /> :
                                            <tr key={i + 1}>
                                                <td>{i+startIndex + 1}</td>
                                                <td>{client.name}</td>
                                                <td>{client.email}</td>
                                                <td>{client.phone}</td>
                                                <td>{client.address}</td>
                                                <td>{client.date}</td>
                                                <td><button className='edit-btn' onClick={() => {
                                                    editIdHandle(client._id)
                                                }} >Edit</button>
                                                    <button className='delete-btn' onClick={(event) => {
                                                        deleteHandle(event, client._id)
                                                    }}>DEL</button>

                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                      

                    </div>
                    <p className='pagenumber'>{sn} of {data.length}</p>
                </div>
            </div>
           
        </div>
    )
}

export default CURDreport