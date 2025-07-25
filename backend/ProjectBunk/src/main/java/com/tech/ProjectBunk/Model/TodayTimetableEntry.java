package com.tech.ProjectBunk.Model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TodayTimetableEntry {
    @JsonProperty("period")
    private String period;

    @JsonProperty("subject")
    private String subject;

    public TodayTimetableEntry() {}

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
} 