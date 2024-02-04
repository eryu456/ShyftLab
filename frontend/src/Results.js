import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css'



function Result() {
    const [input, setInput] = useState({
        sname: '',
        cname: '',
        score: ''
    });
    const [output, setOutput] = useState([]);
    const [course, setCourses] = useState([]);
    const [student, setStudent] = useState([]);
    const [submitCount, setSubmitCount] = useState([]);

    const scores =['A', 'B', 'D', 'C', 'E', 'F'];

    const handleInput = (event) =>{
        event.persist();
        setInput(({...input, [event.target.name]: event.target.value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:8000/results/upload", input)
        .then(res => {
            console.log(res)
            alert(`${input.cname} Name: ${input.sname} Score: ${input.score} has been added!`)
            setInput({sname: '', cname: '', score: ''})
        })
        .catch(err => console.log(err));
        setSubmitCount(prevCount => prevCount + 1);
        
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const resultsResponse = await axios.get('http://localhost:8000/results');
    //         setOutput(resultsResponse.data);
    
    //         const studentResponse = await axios.get('http://localhost:8000/student');
    //         setStudent(studentResponse.data);
    
    //         const coursesResponse = await axios.get('http://localhost:8000/courses');
    //         setCourses(coursesResponse.data);
    //       } catch (error) {
    //         console.error("There was an error fetching the data");
    //       }
    //     };
    
    //     fetchData();
    //   }, [submitCount]);


    useEffect(() =>{
        axios.get('http://localhost:8000/results').then((res) => {
            setOutput(res.data);
        })
        .catch((error) => {
            console.error("There was an error fetching the data" );
        })
        axios.get('http://localhost:8000/student').then((res) => {
            setStudent(res.data);
        })
        .catch((error) => {
            console.error("There was an error fetching the data" );
        })
        axios.get('http://localhost:8000/courses').then((res) => {
            setCourses(res.data);
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
                    <select type="text" value={input.cname} onChange = {handleInput} name = "cname">
                        <option value = "">Select a course</option>
                        {course.map((val, key)=> (
                            <option key={key} value={val.cname}>
                                {val.cname}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="sname">Student Name</label>
                    <select type="text" value={input.sname} onChange = {handleInput} name = "sname">
                        <option value = "">Select a Student</option>
                        {student.map((val, key)=> {
                            const fullName = `${val.fname} ${val.lname}`;
                            return(
                                <option key={key} value={fullName}>
                                    {fullName}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="score">Score</label>
                    <select type="text" value={input.score} onChange = {handleInput} name = "score">
                    <option value = "">Select a Score</option>
                    {scores.map((val, key)=>{
                        return (
                            <option key = {key} value={val}>
                            {val}
                            </option>
                        )
                    })}
                    </select>
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
            <th>Student Name</th>
            <th>Score</th>
        </tr>
        {data.map((val, key) =>{
            return (
                <tr key = {key}>
                    <td>{val.cname}</td>
                    <td>{val.sname}</td>
                    <td>{val.score}</td>
                </tr>
            )
        })}
    </table>
    )
})

// function dataValidate(input) {
//     let error = {};
//     const namePattern = /^[A-Za-z]+$/

//     if (input.cname === "") {
//         error.cname = "Please enter the course name"
//     }
//     else if (!namePattern.test(input.fname)){
//         error.fname = "Please enter a valid name"
//     }
//     else {
//         error.fname =''
//     } 
    
//     if (input.sname === "") {
//         error.sname = "Please enter the course name"
//     }
//     else if (!namePattern.test(input.fname)){
//         error.fname = "Please enter a valid name"
//     }
//     else {
//         error.sname =''
//     } 
    
//     if (input.cname === "") {
//         error.cname = "Please enter the course name"
//     }
//     else if (!namePattern.test(input.fname)){
//         error.fname = "Please enter a valid name"
//     }
//     else {
//         error.fname =''
//     } 
//     return error;

//}



export default Result;