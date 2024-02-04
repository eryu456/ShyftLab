import React, {useEffect, useState, useCallback, useMemo} from "react";
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
    const [errors, setErrors] = useState({
        cname: '',
        sname: '',
        score: ''
    })
    const scores = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'F'], []);


    // const scores =['A', 'B', 'D', 'C', 'E', 'F'];

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const currentError = dataValidate(input);
    //     setErrors(currentError);

    //     const hasErrors = Object.values(currentError).some(error => error !== "");
    //     if (!hasErrors){
    //         axios.post("http://localhost:8000/results/upload", input)
    //         .then(res => {
    //             console.log(res)
    //             alert(`${input.cname} Name: ${input.sname} Score: ${input.score} has been added!`)
    //             setInput({sname: '', cname: '', score: ''})
    //         })
    //         .catch(err => console.log(err));
    //     }
    // }

    const handleInput = useCallback((event) => {
        setInput(input => ({ ...input, [event.target.name]: event.target.value }));
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        const currentError = dataValidate(input);
        setErrors(currentError);

        const hasErrors = Object.values(currentError).some(error => error !== "");
        if (!hasErrors) {
            axios.post("http://localhost:8000/results/upload", input)
                .then(res => {
                    setOutput(res.data);
                    alert(`${input.cname} Name: ${input.sname} Score: ${input.score} has been added!`);
                    setInput({ sname: '', cname: '', score: '' });
                })
                .catch(err => console.log(err));
        }
    }, [input]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsResponse, studentResponse, coursesResponse] = await Promise.all([
                    axios.get('http://localhost:8000/results'),
                    axios.get('http://localhost:8000/student'),
                    axios.get('http://localhost:8000/courses'),
                ]);
                setOutput(resultsResponse.data);
                setStudent(studentResponse.data);
                setCourses(coursesResponse.data);
            } catch (error) {
                console.error("There was an error fetching the data");
            }
        };
        fetchData();
    }, []);

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
                    {errors.cname && <span className="textError">{errors.cname}</span>}
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
                    {errors.sname && <span className="textError">{errors.sname}</span>}
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
                    {errors.score && <span className="textError">{errors.score}</span>}
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

function dataValidate(input) {
    let error = {};

    if (input.cname === "") {
        error.cname = "Please select the course"
    }
    else {
        error.cname =''
    } 
    
    if (input.sname === "") {
        error.sname = "Please select the student name"
    }
    else {
        error.sname =''
    } 
    
    if (input.score === "") {
        error.score = "Please select the score name"
    }
    else {
        error.score =''
    } 
    return error;

}



export default Result;