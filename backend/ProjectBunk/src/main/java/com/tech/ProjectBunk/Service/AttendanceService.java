package com.tech.ProjectBunk.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tech.ProjectBunk.Model.SubjectAttendance;
import com.tech.ProjectBunk.Model.TodayTimetableEntry;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class AttendanceService {

    private static final double REQUIRED_PERCENTAGE = 75.0;

    // ✅ Existing method
   public void calculateAllThresholds(List<SubjectAttendance> subjects) {
    for (SubjectAttendance subject : subjects) {
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


    // ✅ New method to parse JSON and calculate max bunks
    public List<SubjectAttendance> parseAndCalculate(String json) throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    List<SubjectAttendance> subjects = mapper.readValue(json, new TypeReference<List<SubjectAttendance>>() {});
    calculateAllThresholds(subjects);
    return subjects;
}

    // New DTO for combined response
    public static class AttendanceAndTimetableDTO {
        private List<SubjectAttendance> attendance;
        private List<TodayTimetableEntry> todayTimetable;

        public AttendanceAndTimetableDTO() {}
        public AttendanceAndTimetableDTO(List<SubjectAttendance> attendance, List<TodayTimetableEntry> todayTimetable) {
            this.attendance = attendance;
            this.todayTimetable = todayTimetable;
        }
        public List<SubjectAttendance> getAttendance() { return attendance; }
        public void setAttendance(List<SubjectAttendance> attendance) { this.attendance = attendance; }
        public List<TodayTimetableEntry> getTodayTimetable() { return todayTimetable; }
        public void setTodayTimetable(List<TodayTimetableEntry> todayTimetable) { this.todayTimetable = todayTimetable; }
    }

    // New method to parse new extractor output
    public AttendanceAndTimetableDTO parseAttendanceAndTimetable(String json) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map = mapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        List<SubjectAttendance> attendance = mapper.convertValue(map.get("attendance"), new TypeReference<List<SubjectAttendance>>() {});
        
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
                        System.out.println("[DEBUG] Successfully parsed timetable with " + todayTimetable.size() + " entries");
                    } catch (Exception e) {
                        System.out.println("[DEBUG] Failed to parse timetable: " + e.getMessage());
                        // Return empty list on parsing error
                    }
                }
            } else if (timetableData instanceof List) {
                // It's already a list
                try {
                    todayTimetable = mapper.convertValue(timetableData, new TypeReference<List<TodayTimetableEntry>>() {});
                    System.out.println("[DEBUG] Successfully parsed timetable list with " + todayTimetable.size() + " entries");
                } catch (Exception e) {
                    System.out.println("[DEBUG] Failed to parse timetable list: " + e.getMessage());
                    // Return empty list on parsing error
                }
            }
        } else {
            System.out.println("[DEBUG] Timetable data is null - this is normal for holidays/weekends");
        }
        
        calculateAllThresholds(attendance);
        return new AttendanceAndTimetableDTO(attendance, todayTimetable);
    }

}
