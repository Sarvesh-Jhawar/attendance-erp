package com.tech.ProjectBunk.Model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TodayTimetableEntry {
    @JsonProperty("period")
    private String period;

    @JsonProperty("subject")
    private String subject;

    public TodayTimetableEntry() {
        // Initialize with safe defaults to prevent null pointer exceptions
        this.period = "";
        this.subject = "";
    }

    public String getPeriod() {
        return (period != null) ? period : "";
    }

    public void setPeriod(String period) {
        this.period = (period != null) ? period : "";
    }

    public String getSubject() {
        return (subject != null) ? subject : "";
    }

    public void setSubject(String subject) {
        this.subject = (subject != null) ? subject : "";
    }
} 