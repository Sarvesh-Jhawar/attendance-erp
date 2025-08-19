package com.tech.ProjectBunk.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tech.ProjectBunk.Model.SubjectAttendance;
import com.tech.ProjectBunk.Model.TodayTimetableEntry;
import com.tech.ProjectBunk.Model.DatewiseAttendanceEntry;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class AttendanceService {

    private static final double REQUIRED_PERCENTAGE = 75.0;

    // ✅ Existing method with enhanced null safety
   public void calculateAllThresholds(List<SubjectAttendance> subjects) {
    if (subjects == null) {
        System.out.println("[WARNING] calculateAllThresholds called with null subjects list");
        return;
    }
    
    for (SubjectAttendance subject : subjects) {
        if (subject == null) {
            System.out.println("[WARNING] Skipping null subject in calculateAllThresholds");
            continue;
        }
        
        int held = subject.getHeld();
        int attended = subject.getAttended();

        double currentPercentage = (held == 0) ? 100.0 : (attended * 100.0) / held;
        subject.setPercentage(String.format("%.2f", currentPercentage));

        for (int threshold : new int[]{90, 85, 80, 75, 70, 65}) {
            // Calculate bunkable classes
            int bunk = 0;
            while (true) {
                int total = held + bunk;
                double perc = (total == 0) ? 100.0 : (attended * 100.0) / total;
                if (perc < threshold) break;
                bunk++;
            }

            // Calculate classes to attend to reach threshold
            int toAttend = 0;
            while (true) {
                int total = held + toAttend;
                double perc = ((attended + toAttend) * 100.0) / total;
                if (perc >= threshold || toAttend > 1000) break;
                toAttend++;
            }

            // Store values in the model
            switch (threshold) {
                case 90:
                    subject.setBunk90(Math.max(0, bunk - 1));
                    subject.setAttend90(toAttend);
                    break;
                case 85:
                    subject.setBunk85(Math.max(0, bunk - 1));
                    subject.setAttend85(toAttend);
                    break;
                case 80:
                    subject.setBunk80(Math.max(0, bunk - 1));
                    subject.setAttend80(toAttend);
                    break;
                case 75:
                    subject.setBunk75(Math.max(0, bunk - 1));
                    subject.setAttend75(toAttend);
                    break;
                case 70:
                    subject.setBunk70(Math.max(0, bunk - 1));
                    subject.setAttend70(toAttend);
                    break;
                case 65:
                    subject.setBunk65(Math.max(0, bunk - 1));
                    subject.setAttend65(toAttend);
                    break;
            }
        }
    }
}


    // ✅ Enhanced method to parse JSON and calculate max bunks with null safety
    public List<SubjectAttendance> parseAndCalculate(String json) throws IOException {
        if (json == null || json.trim().isEmpty()) {
            System.out.println("[ERROR] parseAndCalculate called with null or empty JSON");
            throw new IllegalArgumentException("JSON input cannot be null or empty");
        }
        
        ObjectMapper mapper = new ObjectMapper();
        List<SubjectAttendance> subjects = mapper.readValue(json, new TypeReference<List<SubjectAttendance>>() {});
        
        if (subjects == null) {
            System.out.println("[WARNING] Parsed subjects list is null, creating empty list");
            subjects = new ArrayList<>();
        }
        
        calculateAllThresholds(subjects);
        return subjects;
    }

    // Enhanced DTO for combined response with null safety
    public static class AttendanceAndTimetableDTO {
        private List<SubjectAttendance> attendance;
        private List<TodayTimetableEntry> todayTimetable;
        private List<DatewiseAttendanceEntry> datewiseAttendance;

        public AttendanceAndTimetableDTO() {
            // Initialize with safe defaults
            this.attendance = new ArrayList<>();
            this.todayTimetable = new ArrayList<>();
            this.datewiseAttendance = new ArrayList<>();
        }
        
        public AttendanceAndTimetableDTO(List<SubjectAttendance> attendance, List<TodayTimetableEntry> todayTimetable, List<DatewiseAttendanceEntry> datewiseAttendance) {
            this.attendance = (attendance != null) ? attendance : new ArrayList<>();
            this.todayTimetable = (todayTimetable != null) ? todayTimetable : new ArrayList<>();
            this.datewiseAttendance = (datewiseAttendance != null) ? datewiseAttendance : new ArrayList<>();
        }
        
        public List<SubjectAttendance> getAttendance() { 
            return (attendance != null) ? attendance : new ArrayList<>(); 
        }
        
        public void setAttendance(List<SubjectAttendance> attendance) { 
            this.attendance = (attendance != null) ? attendance : new ArrayList<>(); 
        }
        
        public List<TodayTimetableEntry> getTodayTimetable() { 
            return (todayTimetable != null) ? todayTimetable : new ArrayList<>(); 
        }
        
        public void setTodayTimetable(List<TodayTimetableEntry> todayTimetable) { 
            this.todayTimetable = (todayTimetable != null) ? todayTimetable : new ArrayList<>(); 
        }
        
        public List<DatewiseAttendanceEntry> getDatewiseAttendance() { 
            return (datewiseAttendance != null) ? datewiseAttendance : new ArrayList<>(); 
        }
        
        public void setDatewiseAttendance(List<DatewiseAttendanceEntry> datewiseAttendance) { 
            this.datewiseAttendance = (datewiseAttendance != null) ? datewiseAttendance : new ArrayList<>(); 
        }
    }

    // Enhanced method to parse new extractor output with comprehensive null safety
    public AttendanceAndTimetableDTO parseAttendanceAndTimetable(String json) throws IOException {
        if (json == null || json.trim().isEmpty()) {
            System.out.println("[ERROR] parseAttendanceAndTimetable called with null or empty JSON");
            throw new IllegalArgumentException("JSON input cannot be null or empty");
        }
        
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map;
        
        try {
            map = mapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            System.out.println("[ERROR] Failed to parse JSON: " + e.getMessage());
            throw new IOException("Invalid JSON format: " + e.getMessage());
        }
        
        if (map == null) {
            System.out.println("[ERROR] Parsed map is null");
            throw new IOException("Failed to parse JSON into map");
        }
        
        // Handle attendance data safely
        List<SubjectAttendance> attendance = new ArrayList<>();
        Object attendanceData = map.get("attendance");
        
        System.out.println("[DEBUG] Raw attendance data: " + attendanceData);
        
        if (attendanceData != null && attendanceData instanceof List) {
            try {
                attendance = mapper.convertValue(attendanceData, new TypeReference<List<SubjectAttendance>>() {});
                if (attendance == null) {
                    attendance = new ArrayList<>();
                }
                System.out.println("[DEBUG] Successfully parsed attendance with " + attendance.size() + " entries");
            } catch (Exception e) {
                System.out.println("[DEBUG] Failed to parse attendance: " + e.getMessage());
                attendance = new ArrayList<>();
            }
        } else {
            System.out.println("[DEBUG] Attendance data is null or not a list");
        }
        
        // Handle timetable data safely - it might be empty, null, or contain an error
        List<TodayTimetableEntry> todayTimetable = new ArrayList<>();
        Object timetableData = map.get("today_timetable");
        
        System.out.println("[DEBUG] Raw timetable data: " + timetableData);
        
        if (timetableData != null) {
            // Check if it's an error object
            if (timetableData instanceof Map) {
                Map<String, Object> timetableMap = (Map<String, Object>) timetableData;
                if (timetableMap.containsKey("error")) {
                    // It's an error object, return empty list
                    System.out.println("[DEBUG] Timetable error: " + timetableMap.get("error"));
                } else {
                    // It's a valid timetable array
                    try {
                        todayTimetable = mapper.convertValue(timetableData, new TypeReference<List<TodayTimetableEntry>>() {});
                        if (todayTimetable == null) {
                            todayTimetable = new ArrayList<>();
                        }
                        System.out.println("[DEBUG] Successfully parsed timetable with " + todayTimetable.size() + " entries");
                    } catch (Exception e) {
                        System.out.println("[DEBUG] Failed to parse timetable: " + e.getMessage());
                        // Return empty list on parsing error
                        todayTimetable = new ArrayList<>();
                    }
                }
            } else if (timetableData instanceof List) {
                // It's already a list
                try {
                    todayTimetable = mapper.convertValue(timetableData, new TypeReference<List<TodayTimetableEntry>>() {});
                    if (todayTimetable == null) {
                        todayTimetable = new ArrayList<>();
                    }
                    System.out.println("[DEBUG] Successfully parsed timetable list with " + todayTimetable.size() + " entries");
                } catch (Exception e) {
                    System.out.println("[DEBUG] Failed to parse timetable list: " + e.getMessage());
                    // Return empty list on parsing error
                    todayTimetable = new ArrayList<>();
                }
            }
        } else {
            System.out.println("[DEBUG] Timetable data is null - this is normal for holidays/weekends");
        }
        
        // Handle datewise attendance data safely with enhanced null checking
        List<DatewiseAttendanceEntry> datewiseAttendance = new ArrayList<>();
        Object datewiseData = map.get("datewise_attendance");
        
        System.out.println("[DEBUG] Raw datewise attendance data: " + datewiseData);
        
        if (datewiseData != null && datewiseData instanceof List) {
            try {
                datewiseAttendance = mapper.convertValue(datewiseData, new TypeReference<List<DatewiseAttendanceEntry>>() {});
                if (datewiseAttendance == null) {
                    datewiseAttendance = new ArrayList<>();
                } else {
                    // Additional null safety for individual entries
                    for (DatewiseAttendanceEntry entry : datewiseAttendance) {
                        if (entry != null) {
                            // Ensure the entry has safe values
                            if (entry.getDate() == null) {
                                entry.setDate("");
                            }
                            if (entry.getPeriods() == null) {
                                entry.setPeriods(new ArrayList<>());
                            }
                        }
                    }
                }
                System.out.println("[DEBUG] Successfully parsed datewise attendance with " + datewiseAttendance.size() + " entries");
            } catch (Exception e) {
                System.out.println("[DEBUG] Failed to parse datewise attendance: " + e.getMessage());
                // Return empty list on parsing error
                datewiseAttendance = new ArrayList<>();
            }
        } else {
            System.out.println("[DEBUG] Datewise attendance data is null or not a list");
        }
        
        // Calculate thresholds only if we have valid attendance data
        if (!attendance.isEmpty()) {
            calculateAllThresholds(attendance);
        } else {
            System.out.println("[WARNING] No attendance data available for threshold calculation");
        }
        
        return new AttendanceAndTimetableDTO(attendance, todayTimetable, datewiseAttendance);
    }

}
