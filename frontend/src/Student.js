import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import "./App.css";
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(isSameOrBefore)

function Student() {
  const [input, setInput] = useState({
    fname: "",
    lname: "",
    dob: "",
  });

  const [output, setOutput] = useState([]);
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    dob: "",
  });

  const handleInput = useCallback((event) => {
    setInput((input) => ({
      ...input,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleDate = useCallback((event) => {
    const formatDate = event ? dayjs(event).format('YYYY/MM/DD') : '';
    setInput(prevInput => ({
        ...prevInput,
        dob: formatDate,
      }));
  },[])

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const currentError = dataValidate(input);
    setErrors(currentError);

    const hasErrors = Object.values(currentError).some((error) => error !== "");

    if (!hasErrors) {
      axios
        .post("http://localhost:8000/student_data/upload", input)
        .then((res) => {
          setOutput(res.data)
          alert(`${input.fname} ${input.lname} ${input.dob} has been added!`);
          setInput({ fname: "", lname: "", dob: "" });
        })
        .catch((err) => console.log(err));
    }
  }, [input]);

  useEffect(() => {
    const fetchData = async () => {
        axios
        .get("http://localhost:8000/student_data")
        .then((res) => {
            setOutput(res.data);
        })
        .catch((error) => {
            console.error("There was an error fetching the data");
        });
    };
    fetchData();
  }, []);

  return (
    <div className="FormPage">
      <form action="" onSubmit={handleSubmit}>
        <div>
          <TextField
                label = "First Name"
                variant = "outlined"
                value = {input.fname}
                onChange = {handleInput}
                name = "fname"
                placeholder = "Enter First Name"
                error = {Boolean(errors.fname)}
                helperText = {errors.fname}
                fullwidth
                margin = "normal"
          />
        </div>
        <div>
            <TextField
                label = "Last Name"
                variant = "outlined"
                value = {input.lname}
                onChange = {handleInput}
                name = "lname"
                placeholder = "Enter Last Name"
                error = {Boolean(errors.lname)}
                helperText = {errors.lname}
                fullwidth
                margin = "normal"
            />
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date of Birth"
                    value={input.dob ? dayjs(input.dob) : null}
                    onChange={handleDate}
                    slotProps={{
                        textField: {
                            error: Boolean(errors.dob),
                            helperText: errors.dob,
                        },
                      }}
                    disableFuture
                />
            </LocalizationProvider>
        </div>
        <Button type="submit" variant="contained" color="primary">
                Submit
        </Button>
      </form>
      <Table data={output} />
    </div>
  );
}

const Table = React.memo(({ data }) => {
  return (
    <table>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Date of Birth</th>
      </tr>
      {data.map((val, key) => {
        return (
          <tr key={key}>
            <td>{val.fname}</td>
            <td>{val.lname}</td>
            <td>{val.dob}</td>
          </tr>
        );
      })}
    </table>
  );
});

function dataValidate(input) {
    let error = {};
    const namePattern = /^[A-Za-z]+$/;
    let today = dayjs();
    let ageVerify = today.subtract(10, 'year');
  
    if (input.fname === "") {
      error.fname = "Please enter your first name";
    } else if (!namePattern.test(input.fname)) {
      error.fname = "Please enter a valid name";
    } else {
      error.fname = "";
    }
  
    if (input.lname === "") {
      error.lname = "Please enter your last name";
    } else if (!namePattern.test(input.lname)) {
      error.lname = "Please enter a valid name";
    } else {
      error.lnamename = "";
    }
    if (input.dob === "") {
      error.dob = "Please enter your date of birth";
    } else if (!dayjs(input.dob).isSameOrBefore(ageVerify)) {
      error.dob = "Student must be above the age of 10";
    } else {
      error.dob = "";
    }
    return error;
  }
  

export default Student;
