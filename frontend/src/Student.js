import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css'



function Student() {
    const [input, setInput] = useState({
        fname: '',
        lname: '',
        dob: ''
    });
    
    const [output, setOutput] = useState([]);
    const [errors, setErrors] = useState({
        fname: '',
        lname: '',
        dob: ''
    });

    function dataValidate(input) {
        let error = {};
        const namePattern = /^[A-Za-z]+$/
        let today = new Date();
        let ageVerify = new Date(today.setFullYear(today.getFullYear() - 10))

        if (input.fname === "") {
            error.fname = "Please enter your first name"
        }
        else if (!namePattern.test(input.fname)){
            error.fname = "Please enter a valid name"
        }
        else {

            error.fname =''
        } 

        if (input.lnamename === "") {
            error.lname = "Please enter your last name"
        }
        else if (!namePattern.test(input.lname)){
            error.lname = "Please enter a valid name"
        }
        else {
            error.lnamename =''
        } 
        if (input.dob === ""){
            error.dob = "Please enter your date of birth";
        }
        else if (new Date(input.dob) >= ageVerify){
            error.dob = 'Student must be above the age of 10'
        }
        else {
            error.dob = ''
        }
        return error;
        
    }

    const handleInput = (event) =>{
        event.persist();
        setInput(({...input, [event.target.name]: event.target.value}))
        console.log(input)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(dataValidate(input))
        if (errors.fname === "" && errors.lname === "" && errors.dob === ""){
            axios.post("http://localhost:8000/student/upload", input)
            .then(res => {
                console.log(res)
                alert(`${input.fname} ${input.lname} ${input.dob} has been added!`)
                input.fname = "";
                input.lname = "";
                input.dob = "";
            })
            .catch(err => console.log(err));
     
        }
    }

    useEffect(() =>{
        axios.get('http://localhost:8000/student').then((res) => {
            setOutput(res.data);
        })
        .catch((error) => {
            console.error("There was an error fetching the data" );
        })
    },[handleSubmit]);

    return (
        <div className="FormPage">
            <form action ='' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fname">First Name</label>
                    <input type="text" value={input.fname} onChange = {handleInput} name = "fname" placeholder= 'Enter First Name'/>
                    {errors.fname && <span className="textError">{errors.fname}</span>}
                </div>
                <div>
                    <label htmlFor="lname">Last Name</label>
                    <input type="text" value={input.lname} onChange = {handleInput} name = "lname" placeholder= 'Enter Last Name' required/>
                    {errors.lname && <span className="textError">{errors.lname}</span>}
                </div>
                <div>
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" value={input.dob} onChange = {handleInput} name = "dob"/>
                    {errors.dob && <span className="textError">{errors.dob}</span>}
                </div>
                <button type = "submit">Submit</button>
            </form>
            <table>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Date of Birth</th>
                </tr>
                {output.map((val, key) =>{
                    return (
                        <tr key = {key}>
                            <td>{val.fname}</td>
                            <td>{val.lname}</td>
                            <td>{val.dob}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}

export default Student;