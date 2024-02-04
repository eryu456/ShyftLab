import React, { useCallback, useEffect, useState } from "react";
import {Paper, Box, Stack} from '@mui/material/'
import axios from "axios";
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


function Course() {
  const [input, setInput] = useState({
    cname: "",
  });

  const [output, setOutput] = useState([]);
  const [errors, setErrors] = useState({
    cname: "",
  });
  const handleInput = useCallback((event) => {
    setInput((input) => ({
      ...input,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const currentError = dataValidate(input);
    setErrors(currentError);

    const hasErrors = Object.values(currentError).some((error) => error !== "");

    if (!hasErrors) {
      axios
        .post("http://localhost:8000/courses_data/upload", input)
        .then((res) => {
          setOutput(res.data)
          alert(`${input.cname} has been added!`);
          setInput({ cname: "" });
        })
        .catch((err) => console.log(err));
    }
  },[input]);

  useEffect(() => {
    const fetchData = async () => {
        axios
        .get("http://localhost:8000/courses_data")
        .then((res) => {
          setOutput(res.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the data");
        });
    }
    fetchData();
  }, []);

  return (
    <Stack
        sx = {{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
        }}
        direction = 'column'
    >

        <Box 
            onSubmit={handleSubmit} 
            component = 'form'
            sx={{
                width: '100%',
                maxWidth: 360,
                margin: 'auto',
              }}
        >
            <div>
                <TextField
                label="Course Name"
                variant="outlined"
                value={input.cname}
                onChange={handleInput}
                name="cname"
                placeholder="Enter Course Name"
                error={Boolean(errors.cname)}
                helperText={errors.cname}
                fullWidth
                margin="normal"
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
        <Tables data={output} />
    </Stack>
  );
}

const Tables = React.memo(({ data }) => {
    return (
      <TableContainer component = {Paper} sx = {{ overflow: 'auto', maxWidth: '100%'}} >
          <Table size = 'small' sx ={{minWidth: 650}} stickyHeader label = "Results">
              <TableHead>
                  <TableRow>
                      <TableCell align="left">Course Name</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {data.map((val, key) =>{
                      return (<TableRow key ={key}>
                          <TableCell align="left" >{val.cname}</TableCell>
                      </TableRow>)
                  })}
              </TableBody>
          </Table>
      </TableContainer>
    );
  });

function dataValidate(input) {
  let error = {};
  const namePattern = /^[A-Za-z ]+$/;

  if (input.cname === "") {
    error.cname = "Please enter the course name";
  } else if (!namePattern.test(input.cname)) {
    error.cname = "Please enter a valid name";
  } else {
    error.cname = "";
  }
  return error;
}

export default Course;
