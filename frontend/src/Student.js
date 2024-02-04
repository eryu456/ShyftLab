import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css'
import dataValidate from "./DataValid";



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
    const handleInput = (event) =>{
        event.persist();
        setInput(({...input, [event.target.name]: event.target.value}))
        console.log(input)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const currentError = dataValidate(input);
        setErrors(currentError);

        const hasErrors = Object.values(currentError).some(error => error !== "");

        if (!hasErrors){
            axios.post("http://localhost:8000/student/upload", input)
            .then(res => {
                console.log(res)
                alert(`${input.fname} ${input.lname} ${input.dob} has been added!`)
                setInput({fname: '', lname: '', dob: ''})
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
    },[input]);

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
                    <input type="text" value={input.lname} onChange = {handleInput} name = "lname" placeholder= 'Enter Last Name'/>
                    {errors.lname && <span className="textError">{errors.lname}</span>}
                </div>
                <div>
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" value={input.dob} onChange = {handleInput} name = "dob"/>
                    {errors.dob && <span className="textError">{errors.dob}</span>}
                </div>
                <button type = "submit">Submit</button>
            </form>
            <Table
                data = {output}
            />
        </div>
    )
}

const Table = React.memo(({data})=>{
    return (
        <table>
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
        </tr>
        {data.map((val, key) =>{
            return (
                <tr key = {key}>
                    <td>{val.fname}</td>
                    <td>{val.lname}</td>
                    <td>{val.dob}</td>
                </tr>
            )
        })}
    </table>
    )
})


export default Student;