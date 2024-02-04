import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css'



function Course() {
    const [input, setInput] = useState({
        cname: ''
    });
    
    const [output, setOutput] = useState([]);
    const [errors, setErrors] = useState({
        cname: '',
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
            axios.post("http://localhost:8000/courses/upload", input)
            .then(res => {
                console.log(res)
                alert(`${input.cname} has been added!`)
                setInput({cname: ''})
            })
            .catch(err => console.log(err));
        }
    }

    useEffect(() =>{
        axios.get('http://localhost:8000/courses').then((res) => {
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
                    <label htmlFor="cname">Course Name</label>
                    <input type="text" value={input.cname} onChange = {handleInput} name = "cname" placeholder= 'Enter Course Name'/>
                    {errors.cname && <span className="textError">{errors.cname}</span>}
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
            <th>Course Name</th>
        </tr>
        {data.map((val, key) =>{
            return (
                <tr key = {key}>
                    <td>{val.cname}</td>
                </tr>
            )
        })}
    </table>
    )
})

function dataValidate(input) {
    let error = {};
    const namePattern = /^[A-Za-z]+$/

    if (input.cname === "") {
        error.cname = "Please enter the course name"
    }
    else if (!namePattern.test(input.fname)){
        error.cname = "Please enter a valid name"
    }
    else {
        error.cname =''
    } 
    return error;
}


export default Course;