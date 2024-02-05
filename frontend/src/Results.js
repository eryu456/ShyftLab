import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import axios from "axios";
import "./App.css";

function Result() {
  const [input, setInput] = useState({
    sname: "",
    cname: "",
    score: "",
  });
  const [output, setOutput] = useState([]);         //Declare variables to be used for dropdown menu + tables
  const [course, setCourses] = useState([]);
  const [student, setStudent] = useState([]);
  const [errors, setErrors] = useState({
    cname: "",
    sname: "",
    score: "",
  });
  const scores = useMemo(() => ["A", "B", "C", "D", "E", "F"], []);

  const handleInput = useCallback((event) => {
    setInput((input) => ({
      ...input,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const currentError = dataValidate(input);
      setErrors(currentError);

      const hasErrors = Object.values(currentError).some(
        (error) => error !== "",
      );
      if (!hasErrors) {
        axios
          .post("http://localhost:8000/results_data/upload", input)
          .then((res) => {
            setOutput(res.data);
            alert(
              `${input.cname} Name: ${input.sname} Score: ${input.score} has been added!`,
            );
            setInput({ sname: "", cname: "", score: "" });
          })
          .catch((err) => console.log(err));
      }
    },
    [input],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, studentRes, coursesRes] =                //Bundled Api calls on first load for simplicity
          await Promise.all([
            axios.get("http://localhost:8000/results_data"),
            axios.get("http://localhost:8000/student_data"),
            axios.get("http://localhost:8000/courses_data"),
          ]);
        setOutput(resultsRes.data);
        setStudent(studentRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("There was an error fetching the data");
      }
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
        <FormControl fullWidth margin="normal" error={Boolean(errors.cname)}>
          <InputLabel id="course-label">Course Name</InputLabel>
          <Select
            labelId="course-label"
            value={input.cname}
            onChange={handleInput}
            name="cname"
            label="Course Name"
          >
            <MenuItem value="">                                 
              <em>Select a course</em>
            </MenuItem>
            {course.map((val, key) => (
              <MenuItem key={key} value={val.cname}>
                {val.cname}
              </MenuItem>
            ))}
          </Select>
          {errors.cname && <FormHelperText>{errors.cname}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={Boolean(errors.sname)}>
          <InputLabel id="student-label">Student Name</InputLabel>
          <Select
            labelId="student-label"
            value={input.sname}
            onChange={handleInput}
            name="sname"
            label="Student Name"
          >
            <MenuItem value="">
              <em>Select a Student</em>
            </MenuItem>
            {student.map((val, key) => {
              const fullName = `${val.fname} ${val.lname}`;
              return (
                <MenuItem key={key} value={fullName}>
                  {fullName}
                </MenuItem>
              );
            })}
          </Select>
          {errors.sname && <FormHelperText>{errors.sname}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={Boolean(errors.score)}>
          <InputLabel id="score-label">Score</InputLabel>
          <Select
            labelId="score-label"
            value={input.score}
            onChange={handleInput}
            name="score"
            label="Score"
          >
            <MenuItem value="">
              <em>Select a Score</em>
            </MenuItem>
            {scores.map((val, key) => (
              <MenuItem key={key} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
          {errors.score && <FormHelperText>{errors.score}</FormHelperText>}
        </FormControl>

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
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
            <TableCell align="left">Course Name</TableCell>
            <TableCell align="left">Student Name</TableCell>
            <TableCell align="left">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((val, key) => {
            return (
              <TableRow key={key}>
                <TableCell align="left">{val.cname}</TableCell>
                <TableCell align="left">{val.sname}</TableCell>
                <TableCell align="left">{val.score}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

function dataValidate(input) {
  let error = {};

  if (input.cname === "") {
    error.cname = "Please select the course";
  } else {
    error.cname = "";
  }

  if (input.sname === "") {
    error.sname = "Please select the student name";
  } else {
    error.sname = "";
  }

  if (input.score === "") {
    error.score = "Please select the score name";
  } else {
    error.score = "";
  }
  return error;
}

export default Result;
