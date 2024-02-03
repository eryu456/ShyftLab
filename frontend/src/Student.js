import React, {useEffect, useState} from "react";
import './App.css'



function Student() {
    const [input, setInput] = useState({
        fname: '',
        lname: '',
        dob: ''
    });

    return (
        <div className="FormPage">
            <form action =''>
                <div>
                    <label htmlFor="fname">First Name</label>
                    <input type="text" placeholder= 'Enter First Name'/>
                </div>
                <div>
                    <label htmlFor="lname">Last Name</label>
                    <input type="text" placeholder= 'Enter Last Name'/>
                </div>
                <div>
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date"/>
                </div>
                <button type = "submit">Submit</button>
            </form>
        </div>
    )
}

export default Student;