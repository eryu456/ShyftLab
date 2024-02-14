import React, { useCallback, useEffect, useState } from "react";
import StringFormat from "./StringFormat";
import axios from "axios";
import {
    Button,
    Stack,
    Paper,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";

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

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const dataValid = dataValidate(input);
      const newInput = dataValid[1];
      setErrors(dataValid[0]);

      const hasErrors = Object.values(errors).some(   //Determines if there are errors returned from validataion function
        (error) => error !== "",
      );

      if (!hasErrors) {
        axios                                               //Sends validated data to endpoint api
          .post("http://localhost:8000/courses_data/upload", newInput)
          .then((res) => {
            setOutput(res.data);                            //Retrives and sets new table data from api response
            alert(`${newInput.cname} has been added!`);        //Notify of new addition
            setInput({ cname: "" });                        //Reset Inputs
          })
          .catch((err) => console.log(err));
      }
    },
    [input, errors],
  );

  useEffect(() => {                                         //Fetching data
    const fetchData = async () => {
      axios
        .get("http://localhost:8000/courses_data")
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
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
      direction="column"
    >
      <Stack
        onSubmit={handleSubmit}
        component="form"
        sx={{
          width: "100%",
          maxWidth: 360,
          margin: "auto",
        }}
        spacing={4}
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
      </Stack>
      <Tables data={output} />
    </Stack>
  );
}

const Tables = React.memo(({ data }) => { //Memoized Table function to minimize unnessecary rerenders
  return (
    <TableContainer
      component={Paper}
      sx={{ overflow: "auto", maxWidth: "100%" }}
    >
      <Table size="small" sx={{ minWidth: 650 }} stickyHeader label="Results">
        <TableHead>
          <TableRow>
            <TableCell align="left">Course Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((val, key) => {
            return (
              <TableRow key={key}>
                <TableCell align="left">{val.cname}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

function dataValidate(input) { //Validation of data inputs and format
  let error = {};
  const namePattern = /^[A-Za-z ]+$/;
  const cleanInput = {
    cname: StringFormat(input.cname)
  }

  if (cleanInput.cname === "") {
    error.cname = "Please enter the course name";
  } else if (!namePattern.test(cleanInput.cname)) {
    error.cname = "Please enter a valid name";
  } else {
    error.cname = "";
  }
  return [error, cleanInput];
}

export default Course;
