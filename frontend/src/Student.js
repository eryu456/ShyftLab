import React, { useCallback, useEffect, useState } from "react";
import StringFormat from "./StringFormat";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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

dayjs.extend(isSameOrBefore);

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

  const handleDate = useCallback((event) => {                     //Unique date handler required due to DatePicker returning dayjs() object
    const formatDate = event ? dayjs(event).format("YYYY-MM-DD") : "";
    setInput((prevInput) => ({
      ...prevInput,
      dob: formatDate,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();                                     //Data Validation
      const dataValid = dataValidate(input);
      const newInput = dataValid[1];
      setErrors(dataValid[0]);

      const hasErrors = Object.values(errors).some(
        (error) => error !== "",
      );

      if (!hasErrors) {
        axios
          .post("http://localhost:8000/student_data/upload", newInput) //Sends validated data to endpoint api 
          .then((res) => {
            setOutput(res.data);
            alert(`${newInput.fname} ${newInput.lname} ${newInput.dob} has been added!`);
            setInput({ fname: "", lname: "", dob: "" });
          })
          .catch((err) => console.log(err));
      }
    },
    [input, errors],
  );

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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField
            label="First Name"
            variant="outlined"
            value={input.fname}
            onChange={handleInput}
            name="fname"
            placeholder="Enter First Name"
            error={Boolean(errors.fname)}
            helperText={errors.fname}
            fullwidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={input.lname}
            onChange={handleInput}
            name="lname"
            placeholder="Enter Last Name"
            error={Boolean(errors.lname)}
            helperText={errors.lname}
            fullwidth
            margin="normal"
          />
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
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </LocalizationProvider>
      </Stack>
      <Tables data={output} />
    </Stack>
  );
}

const Tables = React.memo(({ data }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ overflow: "auto", maxWidth: "100%" }}
    >
      <Table size="small" sx={{ minWidth: 650 }} stickyHeader label="Results">
        <TableHead>
          <TableRow>
            <TableCell align="left"> First Name</TableCell>
            <TableCell align="left"> Last Name</TableCell>
            <TableCell align="left"> Date of Birth</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((val, key) => {
            return (
              <TableRow key={key}>
                <TableCell align="left">{val.fname}</TableCell>
                <TableCell align="left">{val.lname}</TableCell>
                <TableCell align="left">{val.dob.slice(0,10)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

function dataValidate(input) {
  const error = {};
  const namePattern = /^[A-Za-z]+$/;
  const today = dayjs();
  const ageVerify = today.subtract(10, "year");

  const cleanInput = {
    fname: StringFormat(input.fname),
    lname: StringFormat(input.lname),
    dob: input.dob
  }
  

  if (input.fname === "") {
    error.fname = "Please enter your first name";
  } else if (!namePattern.test(cleanInput.fname)) {
    error.fname = "Please enter a valid name";
  } else {
    error.fname = "";
  }

  if (cleanInput.lname === "") {
    error.lname = "Please enter your last name";
  } else if (!namePattern.test(cleanInput.lname)) {
    error.lname = "Please enter a valid name";
  } else {
    error.lname = "";
  }
  if (cleanInput.dob === "") {
    error.dob = "Please enter your date of birth";
  } else if (!dayjs(cleanInput.dob).isSameOrBefore(ageVerify)) {
    error.dob = "Student must be above the age of 10";
  } else {
    error.dob = "";
  }
  return [error, cleanInput];
}

export default Student;
