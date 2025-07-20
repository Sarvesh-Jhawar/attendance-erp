package com.tech.ProjectBunk.Controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.tech.ProjectBunk.Model.SubjectAttendance;
import com.tech.ProjectBunk.Service.AttendanceService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // <-- Add this line
public class LoginController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/login")
    public RedirectView loginUser(@RequestParam String username, HttpSession session) {
        session.setAttribute("username", username); // Store in session
        return new RedirectView("/dashboard.html");
    }

    @PostMapping("/submit")
    public ResponseEntity<?> handleLogin(
            @RequestParam("rollno") String rollNo,
            @RequestParam("password") String password) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python", "src/main/python/extractor.py", rollNo, password);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder jsonBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Python script error, exited with code: " + exitCode);
            }

            String jsonOutput = jsonBuilder.toString();
            if (jsonOutput.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No output from Python script.");
            }

            // Try parsing JSON, catch parsing errors
            List<SubjectAttendance> attendanceList;
            try {
                attendanceList = attendanceService.parseAndCalculate(jsonOutput);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid data format from Python script.");
            }

            return ResponseEntity.ok(attendanceList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Login error: " + e.getMessage());
        }
    }
}
